// src/code-generators/js-expression-handlers.js
/**
 * Handlers for converting JavaScript Expression AST nodes into code strings.
 * Each handler function receives:
 * - node: The current AST expression node being processed.
 * - context: An object containing current compilation context (e.g., reactiveScope, eachItemVar).
 * - generateExpression: A function to recursively generate code for nested expressions.
 * - generateStatement (optional): A function to recursively generate code for nested statements.
 */
/**
 * Handlers for converting JavaScript Expression AST nodes into code strings.
 * Enhanced to properly handle numeric method calls and mathematical operations.
 * Focused on correct reactive value access (.value) based on AST structure.
 */
export const jsExpressionHandlers = {
    /**
     * Handles Identifier nodes (e.g., `tempC`, `displayF`, `e`).
     * It relies on `context.getIdentifierValue` when generating code for HTML expressions
     * to automatically append `.value` for reactive variables.
     */
    Identifier: (node, context, generateExpression) => {
        // If `getIdentifierValue` is present in the context (which it will be
        // when called from `CodeGenerator.js::generateExpressionAsJS` for HTML expressions),
        // use its logic to determine if `.value` should be appended.
        if (context.getIdentifierValue) {
            return context.getIdentifierValue(node.name);
        }
        
        // For Identifiers within the `@script` block's own JS code,
        // we generally return the identifier name directly.
        // Reactive `.value` access in script code is typically handled by:
        // 1. Explicit `MemberExpression` AST nodes (e.g., `tempC.value`).
        // 2. `AssignmentExpression` or `UpdateExpression` handlers for state variables.
        return node.name;
    },

    /**
     * Handles MemberExpression nodes (e.g., `obj.prop`, `arr[idx]`, `tempC.value`).
     * This is crucial for correctly accessing `.value` on reactive objects
     * when the AST explicitly specifies it.
     */
    MemberExpression: (node, context, generateExpression) => {
        let objectCode = generateExpression(node.object, context);
        
        // Ensure numeric literals are wrapped in parentheses for method calls (e.g., (10).toFixed(2))
        if (node.object.type === 'Literal' && typeof node.object.value === 'number') {
            objectCode = `(${objectCode})`;
        }

        const propertyCode = node.computed
            ? `[${generateExpression(node.property, context)}]` // Computed property: `obj[property_expression]`
            : `.${node.property.name}`; // Non-computed property: `obj.property_name`
        
        // CRITICAL LOGIC: If the object of the MemberExpression is a reactive state/derived variable
        // and the property being accessed is *explicitly* 'value', we directly generate `objectName.value`.
        // This ensures expressions like `isNaN(tempC.value)` are rendered correctly.
        if (node.object.type === 'Identifier' &&
            context.reactiveScope &&
            (context.reactiveScope.get(node.object.name) === 'state' || 
             context.reactiveScope.get(node.object.name) === 'derived') &&
            !node.computed && // Only applies to non-computed properties (e.g., not `obj['value']`)
            node.property.type === 'Identifier' && 
            node.property.name === 'value') {
            return `${node.object.name}.value`;
        }
        
        return `${objectCode}${propertyCode}`;
    },

    /**
     * Handles BinaryExpression nodes (e.g., `a + b`, `x === y`).
     */
    BinaryExpression: (node, context, generateExpression) => {
        const left = generateExpression(node.left, context);
        const right = generateExpression(node.right, context);
        
        // Always wrap binary expressions in parentheses to ensure correct operator precedence.
        return `(${left} ${node.operator} ${right})`;
    },

    /**
     * Handles CallExpression nodes (e.g., `func()`, `obj.method()`, `$derived(() => ...)`)
     */
    CallExpression: (node, context, generateExpression) => {
        const callee = generateExpression(node.callee, context);
        const args = node.arguments.map(arg => generateExpression(arg, context)).join(', ');
        
        // Special handling for method calls on numeric literals (e.g., `(123).toFixed(2)`)
        if (node.callee.type === 'MemberExpression' && 
            node.callee.object.type === 'Literal' && 
            typeof node.callee.object.value === 'number') {
            return `(${callee})(${args})`;
        }
        
        // Handle `$derived` calls: ensure the argument is wrapped in an arrow function if it's not already.
        // This also passes the context to the inner expression, allowing reactive variables to be
        // correctly accessed (e.g., `$derived(() => tempC.value * 2)`)
        if (node.callee.type === 'Identifier' && node.callee.name === '$derived') {
            const derivedArg = node.arguments[0];
            let derivedBodyCode;
            if (derivedArg.type === 'ArrowFunctionExpression') {
                // If the argument is already an arrow function, just generate its code directly.
                derivedBodyCode = generateExpression(derivedArg, context); 
            } else {
                // Otherwise, wrap the expression in a new arrow function.
                // The `generateExpression` call here ensures the correct context for inner expressions.
                derivedBodyCode = `() => ${generateExpression(derivedArg, context)}`;
            }
            return `${node.callee.name}(${derivedBodyCode})`;
        }
        
        return `${callee}(${args})`;
    },

    /**
     * Handles ArrowFunctionExpression nodes (e.g., `() => {}`, `(arg) => arg + 1`).
     */
    ArrowFunctionExpression: (node, context, generateExpression, generateStatement) => {
        const params = node.params.map(param => generateExpression(param, context)).join(', ');
        // Determine if the body is a block statement or a single expression.
        const body = node.body.type === 'BlockStatement'
            ? generateStatement(node.body, context)
            : generateExpression(node.body, context); // Recursive call for expression bodies
        return `(${params}) => ${body}`;
    },
    
    /**
     * Handles Literal nodes (e.g., `123`, `"string"`, `true`, `null`).
     */
    Literal: (node) => {
        return JSON.stringify(node.value);
    },

    /**
     * Handles UnaryExpression nodes (e.g., `!value`, `-number`, `typeof var`).
     */
    UnaryExpression: (node, context, generateExpression) => {
        const argument = generateExpression(node.argument, context);
        // If the argument is an Identifier representing a state variable, ensure `.value` is targeted.
        // This handles cases like `!myState` becoming `!myState.value`.
        if (node.argument.type === 'Identifier' && context.reactiveScope?.get(node.argument.name) === 'state') {
            const reactiveTarget = `${node.argument.name}.value`;
            return node.prefix ? `${node.operator}${reactiveTarget}` : `${reactiveTarget}${node.operator}`;
        }
        return `${node.operator}${argument}`;
    },

    /**
     * Handles UpdateExpression nodes (e.g., `x++`, `++y`).
     */
    UpdateExpression: (node, context, generateExpression) => {
        // Ensure that `++stateVar` or `stateVar--` targets the `.value` property.
        if (node.argument.type === 'Identifier' && context.reactiveScope?.get(node.argument.name) === 'state') {
            const reactiveTarget = `${node.argument.name}.value`;
            return node.prefix ? `${node.operator}${reactiveTarget}` : `${reactiveTarget}${node.operator}`;
        }
        const argumentCode = generateExpression(node.argument, context);
        return node.prefix ? `${node.operator}${argumentCode}` : `${argumentCode}${node.operator}`;
    },

    /**
     * Handles ConditionalExpression nodes (ternary operator: `test ? consequent : alternate`).
     */
    ConditionalExpression: (node, context, generateExpression) => {
        const test = generateExpression(node.test, context);
        const consequent = generateExpression(node.consequent, context);
        const alternate = generateExpression(node.alternate, context);
        // Wrap in parentheses for safety and correct precedence, especially when nested.
        return `(${test} ? ${consequent} : ${alternate})`;
    },

    /**
     * Handles AssignmentExpression nodes (e.g., `x = y`, `a += b`).
     */
    AssignmentExpression: (node, context, generateExpression) => {
        let leftCode = generateExpression(node.left, context);
        const rightCode = generateExpression(node.right, context);

        // CRITICAL LOGIC: If the left-hand side is an Identifier that is a state variable,
        // the assignment must target its `.value` property (e.g., `tempC.value = value`).
        if (node.left.type === 'Identifier' && context.reactiveScope?.get(node.left.name) === 'state') {
            leftCode = `${node.left.name}.value`;
        }
        // If the left-hand side is already a MemberExpression (e.g., `myObject.prop = value`),
        // the `generateExpression(node.left, context)` call would have already handled it
        // based on the `MemberExpression` handler.
        
        return `(${leftCode} ${node.operator} ${rightCode})`;
    },

    /**
     * Handles ArrayExpression nodes (e.g., `[1, 2, 'hello']`).
     */
    ArrayExpression: (node, context, generateExpression) => {
        const elements = node.elements.map(el => generateExpression(el, context)).join(', ');
        return `[${elements}]`;
    },

    /**
     * Handles ObjectExpression nodes (e.g., `{ key: value, 'prop': anotherVar }`).
     */
    ObjectExpression: (node, context, generateExpression) => {
        const properties = node.properties.map(prop => {
            const key = prop.computed 
                ? `[${generateExpression(prop.key, context)}]` // Computed property key: `[someVar]`
                : (prop.key.type === 'Identifier' ? prop.key.name : JSON.stringify(prop.key.value)); // Non-computed key
            const value = generateExpression(prop.value, context);
            return `${key}: ${value}`;
        }).join(', ');
        return `{ ${properties} }`;
    },

    /**
     * Handles TemplateLiteral nodes (template strings: ` `Hello ${name}!`).
     */
    TemplateLiteral: (node, context, generateExpression) => {
        const quasis = node.quasis.map(q => q.value.raw); // Static parts of the template string
        const expressions = node.expressions.map(exp => generateExpression(exp, context)); // Dynamic expressions
        let result = '`';
        for (let i = 0; i < quasis.length; i++) {
            result += quasis[i];
            if (expressions[i]) result += `\${${expressions[i]}}`; // Interpolate dynamic parts
        }
        return result + '`';
    },

    // --- Basic handlers for common JS Statement types (used when generating function bodies) ---

    /**
     * Handles BlockStatement nodes (code blocks: `{ ... }`).
     */
    BlockStatement: (node, context, generateExpression, generateStatement) => {
        const bodyCode = node.body.map(stmt => generateStatement(stmt, context)).join('\n');
        return `{\n${bodyCode}\n}`;
    },

    /**
     * Handles ExpressionStatement nodes (a JS expression as a statement: `console.log('hi');`).
     */
    ExpressionStatement: (node, context, generateExpression) => {
        return `${generateExpression(node.expression, context)};`;
    },

    /**
     * Handles VariableDeclaration nodes (`const`, `let`, `var`).
     */
    VariableDeclaration: (node, context, generateExpression, generateStatement) => {
        const declarations = node.declarations.map(decl => {
            let initCode = '';
            if (decl.init) {
                initCode = ` = ${generateExpression(decl.init, context)}`; // Generate initializer code
            }
            return `${decl.id.name}${initCode}`;
        }).join(', ');
        return `${node.kind} ${declarations};`;
    },

    /**
     * Handles ReturnStatement nodes (`return value;`).
     */
    ReturnStatement: (node, context, generateExpression) => {
        const argumentCode = node.argument ? generateExpression(node.argument, context) : '';
        return `return ${argumentCode};`;
    },

    // Add more handlers as needed for other AST node types you might encounter.
};