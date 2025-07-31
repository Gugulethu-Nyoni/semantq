import { jsStatementHandlers } from './code-generators/js-statement-handlers.js';
import { jsExpressionHandlers } from './code-generators/js-expression-handlers.js';
import { htmlNodeHandlers } from './code-generators/html-node-handlers.js';
import { htmlAttributeHandlers } from './code-generators/html-attribute-handlers.js'; // Ensure this is imported

// Global Helper for unique variable names
let globalUniqueIdCounter = 0;
function getUniqueVar(prefix = 'el') {
    return `${prefix}_${globalUniqueIdCounter++}`;
}

export class CodeGenerator {
    constructor() {
        this.imports = new Set();
        this.reactiveScope = new Map(); // Stores reactive variables: Map<name, 'state' | 'derived' | 'class'>
        this.jsCodeFromScriptBlock = '';
        this.cssCodeFromStyleBlock = '';
        this._rootElementVarName = '';

        // Bind dispatch methods and the identifier value resolver to the instance
        this.generateNodeCode = this.generateNodeCode.bind(this);
        this.generateChildrenCode = this.generateChildrenCode.bind(this);
        this.generateExpressionAsJS = this.generateExpressionAsJS.bind(this); // This is the public facing one for HTML/template expressions
        this._generateJsStatement = this._generateJsStatement.bind(this); // Internal for @script statements
        this._generateExpressionForJsAST = this._generateExpressionForJsAST.bind(this); // Internal for @script expressions
        this.getIdentifierValue = this.getIdentifierValue.bind(this); // Bind this crucial method
    }

    reset() {
        this.imports.clear();
        globalUniqueIdCounter = 0;
        this.reactiveScope.clear();
        this.jsCodeFromScriptBlock = '';
        this.cssCodeFromStyleBlock = '';
        this._rootElementVarName = '';
    }

    /**
     * Centralized logic for resolving identifier names, considering reactivity.
     * @param {string} name - The identifier name (e.g., 'count', '#myPrivateField').
     * @param {object} context - The current compilation context, *must* include `reactiveScope`.
     * @param {boolean} [isAssignmentTarget=false] - True if this identifier is on the left-hand side of an assignment.
     * @param {boolean} [isDeclaration=false] - True if this identifier is being declared (e.g., in `const x = ...`).
     * @returns {string} The transpiled identifier string (e.g., 'count.value', 'this.#myPrivateField.value', 'rawName').
     */
    getIdentifierValue(name, context, isAssignmentTarget = false, isDeclaration = false) {
        // If it's a variable declaration (e.g., `const x = ...`), we always want the raw name.
        if (isDeclaration) {
            return name;
        }

        // Ensure reactiveScope is present in context. If not, it's a bug in context propagation.
        if (!context || !context.reactiveScope) {
            console.error('getIdentifierValue called without reactiveScope in context for name:', name, 'Context:', context);
            // Fallback for missing context, though this indicates a bug
            return name;
        }

        const scopeType = context.reactiveScope.get(name);

        // Handle private fields (starting with #)
        if (name.startsWith('#')) {
            // For private fields like `#myField`, if they are reactive state,
            // we typically want `this.#myField.value`.
            // The `MemberExpression` handler (for `this.#myField`) will then add `.value`
            // if `getIdentifierValue` returns `#myField`.
            // But if the private field itself is a reactive state, we need to append .value here.
            // Note: The `MemberExpression` handler for private fields should be adapted to handle this.
            if (scopeType === 'state') { // Only $state private fields get .value
                if (isAssignmentTarget) {
                    return name; // When assigning to it, we need `this.#privateField = val` (MemberExpression will append .value)
                }
                return `${name}.value`; // When reading, we need `this.#privateField.value`
            }
            return name; // Non-reactive private fields are just their name
        }

        // Handle regular reactive identifiers ($state, $derived)
        // Also consider `eachItemVar` to be reactive if it's the current loop item.
        if (scopeType === 'state' || scopeType === 'derived' || context.eachItemVar === name) {
            // If it's an assignment target (LHS of an assignment, e.g., `x = y`),
            // we should return the raw name `x` so that `x.value = y` is formed.
            if (isAssignmentTarget) {
                return name;
            }
            // For reads (RHS of assignments, or expressions), we append .value.
            return `${name}.value`;
        }

        // For non-reactive variables, return the raw name.
        return name;
    }

    transpile(unifiedAST) {
        this.reset();
        this._rootElementVarName = getUniqueVar('rootEl');

        if (unifiedAST.jsAST && unifiedAST.jsAST.content) {
            this.processScriptBlock(unifiedAST.jsAST.content);
        }
        if (unifiedAST.cssAST && unifiedAST.cssAST.content) {
            this.processStyleBlock(unifiedAST.cssAST.content);
        }

        let htmlBodyCode = '';
        if (unifiedAST.customAST && unifiedAST.customAST.content && unifiedAST.customAST.content.html) {
            const htmlRootNode = unifiedAST.customAST.content.html;
            // The rootContext is where all the necessary dispatchers and state live.
            const rootContext = {
                currentParentVar: this._rootElementVarName,
                reactiveScope: this.reactiveScope,
                eachItemVar: null, // No each loop active at root level
                cleanupQueue: 'cleanupFunctions',
                getUniqueVar: getUniqueVar, // Global helper
                // Pass bound methods for recursive calls
                generateExpression: this.generateExpressionAsJS, // For HTML template expressions
                generateStatement: this._generateJsStatement, // If HTML templates can contain JS statements (e.g. in event handlers)
                // Pass context-specific attributes/flags
                isAssignmentTarget: false,
                isDeclaration: false,
                // Global imports set
                imports: this.imports,
                // Centralized identifier value resolver
                getIdentifierValue: this.getIdentifierValue
            };
            htmlBodyCode = this.generateNodeCode(htmlRootNode, rootContext);
        }

        return this.generateFinalModule(htmlBodyCode);
    }

    processScriptBlock(jsProgramAST) {
        // Step 1: Analyze to populate reactiveScope
        jsProgramAST.body.forEach(node => {
            if (node.type === 'VariableDeclaration') {
                node.declarations.forEach(decl => {
                    if (decl.id.type === 'Identifier') {
                        if (decl.init && decl.init.type === 'CallExpression' && decl.init.callee.type === 'Identifier') {
                            if (decl.init.callee.name === '$state') {
                                this.reactiveScope.set(decl.id.name, 'state');
                                this.imports.add('$state');
                            } else if (decl.init.callee.name === '$derived') {
                                this.reactiveScope.set(decl.id.name, 'derived');
                                this.imports.add('$derived');
                            }
                        }
                    }
                });
            } else if (node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression' && node.expression.callee.type === 'Identifier' && node.expression.callee.name === '$effect') {
                this.imports.add('$effect');
            } else if (node.type === 'ClassDeclaration') {
                // For class properties defined with $state
                node.body.body.forEach(classMember => {
                    if (classMember.type === 'PropertyDefinition') {
                        if (classMember.value && classMember.value.type === 'CallExpression' &&
                            classMember.value.callee.type === 'Identifier' &&
                            classMember.value.callee.name === '$state') {
                            if (classMember.key.type === 'PrivateIdentifier') {
                                this.reactiveScope.set(`#${classMember.key.name}`, 'state');
                            } else {
                                this.reactiveScope.set(classMember.key.name, 'state');
                            }
                            this.imports.add('$state');
                        }
                    }
                });
                this.reactiveScope.set(node.id.name, 'class'); // Register the class name itself if needed for component instantiation
            }
        });

        // Step 2: Generate JS code using the dispatcher
        this.jsCodeFromScriptBlock = this.generateJsFromAST(jsProgramAST);
    }

    generateJsFromAST(jsASTNode) {
        let code = '';
        jsASTNode.body.forEach(stmt => {
            // Pass the current context which includes `reactiveScope` and `getIdentifierValue`
            const contextForStatement = {
                reactiveScope: this.reactiveScope,
                getIdentifierValue: this.getIdentifierValue // Ensure the bound method is passed
            };
            code += this._generateJsStatement(stmt, contextForStatement) + '\n';
        });
        return code;
    }

    // DISPATCHER: For JS AST statements within @script block
    _generateJsStatement(statementNode, context) {
        // Ensure statementNode is valid before attempting to access its type
        if (!statementNode || !statementNode.type) {
            console.warn(`[CodeGenerator] _generateJsStatement: Received null/undefined statementNode or node without type:`, statementNode);
            return '/* INVALID_STATEMENT_NODE */';
        }

        const handler = jsStatementHandlers[statementNode.type];
        if (handler) {
            // Pass all necessary context and nested dispatchers
            return handler(statementNode, context, this._generateExpressionForJsAST, this._generateJsStatement);
        }
        console.warn(`[CodeGenerator] Unhandled JS AST statement type in @script: ${statementNode.type}`, statementNode);
        return `/* UNHANDLED_JS_STATEMENT_IN_SCRIPT_${statementNode.type} */`;
    }

    // DISPATCHER: For JS AST expressions within @script block
    _generateExpressionForJsAST(expressionNode, context) {
        // This dispatcher is for expressions *within* the @script block.
        // It should handle all valid JS expression AST nodes.
        // It does NOT need to handle array-strings; those should only come from HTML attributes.

        // Ensure expressionNode is valid before attempting to access its type
        if (!expressionNode || !expressionNode.type) {
            console.warn(`[CodeGenerator] _generateExpressionForJsAST: Received null/undefined expressionNode or node without type:`, expressionNode);
            return 'null'; // Or appropriate default
        }

        const handler = jsExpressionHandlers[expressionNode.type];
        if (handler) {
            // `context` already contains `reactiveScope` and `getIdentifierValue` from `_generateJsStatement`.
            // We just need to ensure `generateExpression` and `generateStatement` are correctly bound and passed.
            return handler(expressionNode, context, this._generateExpressionForJsAST, this._generateJsStatement);
        }
        console.warn(`[CodeGenerator] Unhandled JS AST expression type in @script: ${expressionNode.type}`, expressionNode);
        return `/* UNHANDLED_JS_EXPRESSION_IN_SCRIPT_${expressionNode.type} */`;
    }

    // DISPATCHER: For HTML/Template nodes
    generateNodeCode(node, context) {
        // Handle potential null/undefined nodes if they somehow appear in the AST children
        if (!node) {
            console.warn(`[CodeGenerator] generateNodeCode: Received null/undefined node. Skipping.`);
            return '';
        }

        // Special handling for the root 'customSyntax' wrapper node from your parser, if it exists
        if (node.type === 'Element' && node.name === 'customSyntax') {
            return this.generateChildrenCode(node.children, context);
        }
        // Handle Fragment nodes (often implicitly created by parser for root content or if/each blocks)
        if (node.type === 'Fragment') {
            return this.generateChildrenCode(node.children, context);
        }

        const handler = htmlNodeHandlers[node.type];
        if (handler) {
            // Pass all necessary context and dispatchers to the HTML node handlers.
            // The htmlAttributeHandlers are passed directly as they are a module-level import.
            return handler(node, context, this.generateChildrenCode, this.generateExpressionAsJS, this.imports);
            // ^ Removed `htmlAttributeHandlers` from the parameters as it's imported within `html-node-handlers.js`
            // and should be accessed directly by handlers there.
        }
        console.warn(`[CodeGenerator] Unhandled AST node type: ${node.type}`, node);
        return `/* Unhandled node type: ${node.type} */`;
    }

    // This method can remain in CodeGenerator, as it just iterates and dispatches
    generateChildrenCode(children, context) {
        if (!children || children.length === 0) {
            return '';
        }
        return children.map(childNode => this.generateNodeCode(childNode, context)).join('\n');
    }

    // This method handles expressions that appear *within HTML attributes or text nodes*.
    // It's the public facing `generateExpression` for HTML template generation.
    generateExpressionAsJS(expressionNode, context) {
        // --- CRITICAL FIX: Handle non-standard array-based string literals here ---
        // This is where `['"', 'invalid', "'"]` and `TypeError: Cannot read properties of null (reading 'type')` originate.
        // This check must happen *before* attempting to read `expressionNode.type`.
        if (Array.isArray(expressionNode)) {
            // This structure indicates a string literal that needs to be properly quoted.
            if (expressionNode.length === 3 && (expressionNode[0] === "'" || expressionNode[0] === '"') && expressionNode[0] === expressionNode[2]) {
                return JSON.stringify(expressionNode[1]); // Reconstruct the string literal correctly
            }
            // For other unexpected array formats, log a warning and return a safe fallback.
            console.warn(`[CodeGenerator] generateExpressionAsJS: Unhandled array-based expression format (likely string):`, expressionNode);
            return JSON.stringify(expressionNode.join('')); // Attempt to join as a fallback for unexpected arrays
        }

        // --- Handle null/undefined or non-object expression nodes gracefully ---
        if (expressionNode === null || expressionNode === undefined) {
            console.warn(`[CodeGenerator] generateExpressionAsJS: Received null/undefined expression node. Returning 'null'.`);
            return 'null'; // Or 'undefined', depending on desired JS output
        }
        if (typeof expressionNode !== 'object' || !expressionNode.type) {
            // This catches primitives (numbers, booleans, actual strings if not in AST form)
            // or objects missing a 'type' property that are not array-strings.
            console.warn(`[CodeGenerator] generateExpressionAsJS: Received non-AST-node expression or node without type. Node:`, expressionNode);
            return JSON.stringify(expressionNode); // Safely stringify whatever primitive or unexpected object it is
        }


        const handler = jsExpressionHandlers[expressionNode.type];
        if (handler) {
            // HTML expression context needs to carry getIdentifierValue, reactiveScope etc.
            // The `context` passed here already contains `reactiveScope` and `getIdentifierValue` from `rootContext`.
            return handler(expressionNode, context, this.generateExpressionAsJS, this._generateJsStatement);
        }
        console.warn(`[CodeGenerator] Unhandled expression node type for HTML: ${expressionNode.type}. Node:`, expressionNode);
        return `/* UNHANDLED_HTML_EXPRESSION_TYPE_${expressionNode.type} */`;
    }

    processStyleBlock(cssRootAST) {
        this.cssCodeFromStyleBlock = cssRootAST.nodes.map(node => {
            if (node.type === 'rule') {
                const declarations = node.nodes.map(decl => `${decl.prop}: ${decl.value};`).join(' ');
                return `${node.selector} { ${declarations} }`;
            }
            return '';
        }).join('\n');
    }

    generateFinalModule(htmlBodyCode) {
        let importStatements = '';

        const semantqImports = Array.from(this.imports).filter(imp =>
            ['$state', '$effect', '$derived'].includes(imp)
        );
        if (semantqImports.length > 0) {
            importStatements += `import { ${semantqImports.join(', ')} } from './state/index.js';\n`;
        }

        const domHelpersUsed = Array.from(this.imports).filter(helper =>
            ['insertAfter', 'removeNode', 'reconcileChildren', 'clearNodesBetween', 'text', 'attr'].includes(helper)
            // Added 'text' and 'attr' helpers if they are imported by mustache/attribute handlers
        );
        if (domHelpersUsed.length > 0) {
            importStatements += `import { ${domHelpersUsed.join(', ')} } from './runtime/dom-helpers.js';\n`;
        }

        let cssInjectionCode = '';
        if (this.cssCodeFromStyleBlock) {
            cssInjectionCode = `
const __style_el = document.createElement('style');
__style_el.textContent = \`${this.cssCodeFromStyleBlock}\`;
document.head.appendChild(__style_el);
cleanupFunctions.push(() => __style_el.remove()); // Cleanup style tag on component destroy
`;
        }

        const finalRootElVarName = this._rootElementVarName;

        const finalJs = `
${importStatements}

export default function renderComponent() {
    // Component-level reactive state and functions from @script block
${this.jsCodeFromScriptBlock}

    // Root fragment for the component's DOM
    const ${finalRootElVarName} = document.createDocumentFragment();
    const cleanupFunctions = [];

    // Inject CSS if applicable
${cssInjectionCode}

    // The HTML/template body is already generated using the correct parent variable name
${htmlBodyCode}

    // Return the root DOM fragment and a destroy method
    return {
        root: ${finalRootElVarName},
        destroy: () => {
            cleanupFunctions.forEach(fn => fn());
            // Any other component-specific teardown
        }
    };
}
`;
        return finalJs;
    }
}