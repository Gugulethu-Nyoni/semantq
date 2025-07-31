// src/code-generators/js-statement-handlers.js

/**
 * Handlers for converting JavaScript Statement AST nodes into code strings.
 * Each handler function receives:
 * - node: The current AST statement node being processed.
 * - context: An object containing current compilation context (e.g., reactiveScope, getIdentifierValue).
 * - generateExpression: A function to recursively generate code for nested expressions.
 * - generateStatement: A function to recursively generate code for nested statements (e.g., in blocks).
 */
export const jsStatementHandlers = {
    VariableDeclaration: (statement, context, generateExpression, generateStatement) => {
        const kind = statement.kind; // 'const', 'let', 'var'
        const declarationsCode = statement.declarations.map(decl => {
            // For the identifier being DECLARED (decl.id),
            // we need to pass a context that tells `getIdentifierValue` it's a declaration.
            const idContext = {
                ...context,
                isDeclaration: true // Crucial flag: this identifier is part of a declaration
            };
            // `generateExpression` for the ID will call `context.getIdentifierValue` with `isDeclaration: true`
            const varName = generateExpression(decl.id, idContext);

            let initializerCode = '';
            if (decl.init) {
                // For the initializer (decl.init), use the regular context.
                // This means if the initializer itself contains reactive variables (e.g., `someOtherState.value`),
                // they will be correctly resolved with `.value`.
                initializerCode = generateExpression(decl.init, context);
            }
            return `${varName}${initializerCode ? ` = ${initializerCode}` : ''}`;
        }).join(', ');

        return `${kind} ${declarationsCode};`;
    },

    ExpressionStatement: (node, context, generateExpression, generateStatement) => {
        // Simply generate the expression and add a semicolon.
        return `${generateExpression(node.expression, context)};`;
    },

    ReturnStatement: (node, context, generateExpression, generateStatement) => {
        // Generate the argument expression if it exists.
        const argumentCode = node.argument ? generateExpression(node.argument, context) : '';
        return `return ${argumentCode};`;
    },

    IfStatement: (node, context, generateExpression, generateStatement) => {
        // Generate the test condition, consequent block, and alternate block (if any).
        const test = generateExpression(node.test, context);
        const consequent = generateStatement(node.consequent, context);
        let code = `if (${test}) ${consequent}`;

        if (node.alternate) {
            code += ` else ${generateStatement(node.alternate, context)}`;
        }
        return code;
    },

    BlockStatement: (node, context, generateExpression, generateStatement) => {
        // Generate code for each statement in the block, indented.
        const bodyCode = node.body.map(s => `    ${generateStatement(s, context)}`).join('\n');
        return `{\n${bodyCode}\n}`;
    },

    FunctionDeclaration: (node, context, generateExpression, generateStatement) => {
        // Create a special context for function parameters: they should always be raw names.
        const paramContext = {
            ...context,
            getIdentifierValue: (name) => name // Parameters are always raw names, not reactive values
        };
        const params = node.params.map(p => generateExpression(p, paramContext)).join(', ');
        const body = generateStatement(node.body, context); // Function body uses the regular context
        return `function ${node.id.name}(${params}) ${body}`;
    },

    ClassDeclaration: (node, context, generateExpression, generateStatement) => {
        let classCode = `class ${node.id.name}`;

        if (node.superClass) {
            classCode += ` extends ${generateExpression(node.superClass, context)}`;
        }

        classCode += ' {\n';

        // Collect reactive private fields within this class for method body contexts
        const classReactiveFields = new Map();
        node.body.body.forEach(member => {
            if (member.type === 'PropertyDefinition' && member.key.type === 'PrivateIdentifier') {
                if (member.value && member.value.type === 'CallExpression' &&
                    member.value.callee.type === 'Identifier' && member.value.callee.name === '$state') {
                    classReactiveFields.set(`#${member.key.name}`, 'state');
                }
            }
        });

        node.body.body.forEach(member => {
            if (member.type === 'MethodDefinition') {
                const isStatic = member.static ? 'static ' : '';
                const kind = member.kind === 'method' ? '' : `${member.kind} `;
                const methodName = generateExpression(member.key, context);

                // Create a context for the method body, including class-level reactive fields
                const methodBodyContext = {
                    ...context,
                    // Combine the global reactive scope with class-specific reactive fields
                    reactiveScope: new Map([...context.reactiveScope, ...classReactiveFields])
                };

                // Parameters within methods also need to be raw names
                const paramContext = {
                    ...methodBodyContext, // Inherit methodBodyContext
                    getIdentifierValue: (name) => name // Parameters are always raw names
                };

                let params = '';

                if (member.kind === 'get') {
                    // For getters, especially for reactive private fields, we need to ensure `.value` is appended.
                    // The MemberExpression handler should handle this when given the correct context.
                    // The `propertyAccessCode` will correctly resolve to `this.#c.value` if `#c` is reactive.
                    const propertyAccessCode = generateExpression(
                        {
                            type: 'MemberExpression',
                            object: { type: 'ThisExpression' },
                            property: member.key, // Use the original PrivateIdentifier node
                            computed: false
                        },
                        methodBodyContext // Pass the method's context
                    );
                    classCode += `    ${isStatic}get ${methodName}() {\n        return ${propertyAccessCode};\n    }\n`;
                } else if (member.kind === 'set') {
                    if (member.value.params && member.value.params.length === 1) {
                        params = generateExpression(member.value.params[0], paramContext); // Use paramContext for setter parameter
                    } else {
                        console.warn(`[ClassDeclaration Handler] Setter '${methodName}' has unexpected parameter count in AST. Expected 1, got ${member.value.params ? member.value.params.length : 0}.`, member);
                        params = 'value'; // Default to 'value'
                    }

                    // Generate the setter body, ensuring it uses the methodBodyContext
                    const innerBodyStatements = member.value.body.body.map(s =>
                        generateStatement(s, methodBodyContext)
                    ).join('\n');

                    // Apply the parseFloat and isNaN check wrapper
                    const setterParamName = params;
                    const wrappedSetterBody = `
    const numeric${setterParamName.charAt(0).toUpperCase() + setterParamName.slice(1)} = parseFloat(${setterParamName});
    if (!isNaN(numeric${setterParamName.charAt(0).toUpperCase() + setterParamName.slice(1)})) {
${innerBodyStatements.split('\n').map(line => `        ${line}`).join('\n')}
    }`;
                    classCode += `    ${isStatic}${kind}${methodName}(${params}) {\n${wrappedSetterBody}\n    }\n`;

                } else { // Regular method
                    params = (member.value.params || []).map(p => generateExpression(p, paramContext)).join(', ');
                    const methodBody = generateStatement(member.value.body, methodBodyContext);
                    classCode += `    ${isStatic}${kind}${methodName}(${params}) ${methodBody}\n`;
                }
            } else if (member.type === 'PropertyDefinition') {
                const isStatic = member.static ? 'static ' : '';
                const propertyName = generateExpression(member.key, context); // Key generation uses regular context
                // Initializer also uses context, which includes reactiveScope
                const initializer = member.value ? ` = ${generateExpression(member.value, context)}` : '';
                classCode += `    ${isStatic}${propertyName}${initializer};\n`;
            } else if (member.type === 'StaticBlock') {
                const blockBody = generateStatement(member.body, context);
                classCode += `    static ${blockBody}\n`;
            } else {
                console.warn(`[ClassDeclaration Handler] Unhandled ClassBody member type: ${member.type}`, member);
                classCode += `    /* UNHANDLED_CLASS_MEMBER_${member.type} */\n`;
            }
        });

        classCode += '}\n';
        return classCode;
    },

    ImportDeclaration: (node, context, generateExpression, generateStatement) => {
        const specifiers = node.specifiers.map(spec => {
            if (spec.type === 'ImportSpecifier') {
                return `${spec.imported.name}${spec.local.name !== spec.imported.name ? ` as ${spec.local.name}` : ''}`;
            } else if (spec.type === 'ImportDefaultSpecifier') {
                return spec.local.name;
            } else if (spec.type === 'ImportNamespaceSpecifier') {
                return `* as ${spec.local.name}`;
            }
            return '';
        }).filter(Boolean).join(', ');

        const source = generateExpression(node.source, context);
        let importString = `import `;
        if (specifiers) {
            importString += `{ ${specifiers} }`;
        }
        if (specifiers && node.source) {
            importString += ` from ${source};`;
        } else if (node.source) {
            importString += `${source};`;
        }
        return importString;
    },

    ExportNamedDeclaration: (node, context, generateExpression, generateStatement) => {
        if (node.declaration) {
            const innerCode = generateStatement(node.declaration, context);
            return `export ${innerCode}`;
        } else if (node.specifiers && node.specifiers.length > 0) {
            const specifiers = node.specifiers.map(spec => {
                const exportedName = generateExpression(spec.exported, context);
                const localName = generateExpression(spec.local, context);
                return localName === exportedName ? localName : `${localName} as ${exportedName}`;
            }).join(', ');
            const source = node.source ? ` from ${generateExpression(node.source, context)}` : '';
            return `export { ${specifiers} }${source};`;
        }
        console.warn(`[jsStatementHandlers] Unhandled ExportNamedDeclaration type:`, node);
        return `/* UNHANDLED_EXPORT_NAMED_DECLARATION */`;
    },

    ExportDefaultDeclaration: (node, context, generateExpression, generateStatement) => {
        const declarationCode = generateExpression(node.declaration, context) || generateStatement(node.declaration, context);
        return `export default ${declarationCode}`;
    },
};