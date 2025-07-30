// src/code-generators/js-statement-handlers.js

/**
 * Handlers for converting JavaScript Statement AST nodes into code strings.
 * Each handler function receives:
 * - node: The current AST statement node being processed.
 * - context: An object containing current compilation context (e.g., reactiveScope).
 * - generateExpression: A function to recursively generate code for nested expressions.
 * - generateStatement: A function to recursively generate code for nested statements (e.g., in blocks).
 */
export const jsStatementHandlers = {
    VariableDeclaration: (statement, context, generateExpression, generateStatement) => {
        const kind = statement.kind; // 'const', 'let', 'var'
        const declarationsCode = statement.declarations.map(decl => {
            // decl.id is the AST node for the variable identifier (e.g., { type: 'Identifier', name: 'tempC' })
            // We need to generate the name, but WITHOUT applying the .value transformation,
            // as this is the declaration of the variable itself.
            // Temporarily override getIdentifierValue in context to return raw name for declaration ID
            const idContext = {
                ...context,
                getIdentifierValue: (name) => name // Always return the raw name for the declaration ID
            };
            const varName = generateExpression(decl.id, idContext);

            let initializerCode = '';
            if (decl.init) {
                // For the initializer, use the original context so that reactive variables
                // within the initializer expression (e.g., in `count + 1`) get `.value` appended.
                initializerCode = generateExpression(decl.init, context);
            }
            return `${varName}${initializerCode ? ` = ${initializerCode}` : ''}`;
        }).join(', ');

        return `${kind} ${declarationsCode};`;
    },

    // NEW: Handler for ExpressionStatement
    ExpressionStatement: (node, context, generateExpression, generateStatement) => {
        // An ExpressionStatement simply wraps an expression.
        // We generate the expression and add a semicolon.
        return `  ${generateExpression(node.expression, context)};`;
    },

    ReturnStatement: (node, context, generateExpression, generateStatement) => {
        // node.argument can be null for `return;`
        const argumentCode = node.argument ? generateExpression(node.argument, context) : '';
        return `  return ${argumentCode};`;
    },

    IfStatement: (node, context, generateExpression, generateStatement) => {
        const test = generateExpression(node.test, context);
        // Consequent and alternate bodies are typically BlockStatements or single statements
        const consequent = generateStatement(node.consequent, context); // Pass the BlockStatement node
        let code = `if (${test}) ${consequent}`; // BlockStatement handler will add its own braces

        if (node.alternate) {
            code += ` else ${generateStatement(node.alternate, context)}`;
        }
        return code;
    },

    // NEW: Handler for BlockStatement (needed for function bodies, if/else blocks etc.)
    BlockStatement: (node, context, generateExpression, generateStatement) => {
        // Map over the body of the block to generate code for each statement
        const bodyCode = node.body.map(s => generateStatement(s, context)).join('\n');
        return `{\n${bodyCode}\n}`;
    },

    // Handler for FunctionDeclaration
    FunctionDeclaration: (node, context, generateExpression, generateStatement) => {
        const params = node.params.map(p => p.name).join(', ');
        // Recursively generate the function body (which is typically a BlockStatement)
        const body = generateStatement(node.body, context);
        return `function ${node.id.name}(${params}) ${body}`;
    },

    // Add more statement types here as you encounter them in your AST,
    // e.g., ForStatement, WhileStatement, TryStatement, ClassDeclaration, ImportDeclaration etc.
};
