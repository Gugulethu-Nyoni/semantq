/**
 * Handlers for converting JavaScript Expression AST nodes into code strings.
 * Each handler function receives:
 * - node: The current AST expression node being processed.
 * - context: An object containing current compilation context (e.g., reactiveScope, getIdentifierValue, isAssignmentTarget, isDeclaration, eachItemVar).
 * - generateExpression: A function to recursively generate code for nested expressions.
 * - generateStatement: A function to recursively generate code for nested statements (useful for block-like structures like arrow function bodies).
 */

// Helper to handle non-standard string literal representations if your parser outputs them.
// This function attempts to convert various forms of string nodes/arrays into a proper JS string literal.
function resolveStringLiteral(node, generateExpression, context) {
    if (!node) {
        return '""'; // Default to empty string for null/undefined nodes
    }

    // Case 1: Standard AST Literal node
    if (node.type === 'Literal' && typeof node.value === 'string') {
        return JSON.stringify(node.value);
    }
    // Case 2: Array format like ["'", "content", "'"] (seen in previous errors)
    else if (Array.isArray(node)) {
        // Basic check for a common pattern: ['"', 'content', '"'] or ["'", "content", "'"]
        if (node.length === 3 && (node[0] === "'" || node[0] === '"') && node[0] === node[2]) {
            // Reconstruct the string literal
            return JSON.stringify(node[1]);
        }
        // If it's an array but not the expected string format, it might be a sequence of parts
        // This is where template literals might be needed or a more complex parsing.
        // For now, let's warn and return a basic string representation.
        console.warn(`[resolveStringLiteral] Unhandled array-based string literal format:`, node);
        return JSON.stringify(node.join('')); // Attempt to join as a fallback
    }
    // Case 3: Other AST nodes that evaluate to a string (e.g., Identifier, MemberExpression)
    // In this case, we delegate back to generateExpression, but ensure it's handled safely.
    else if (node.type) { // If it has a 'type', it's likely a regular AST node
        return generateExpression(node, context);
    }

    console.warn(`[resolveStringLiteral] Unknown string literal format for node:`, node);
    return JSON.stringify(String(node)); // Fallback to stringifying whatever it is
}


export const jsExpressionHandlers = {
    // --- Primitives & Identifiers ---
    Identifier: (node, context, generateExpression, generateStatement) => {
        // Crucial: Call the centralized getIdentifierValue provided in the context.
        // It's responsible for deciding whether to append .value or not.
        if (context.getIdentifierValue) {
            // Pass the full context, and the flags that determine resolution behavior.
            return context.getIdentifierValue(node.name, context, context.isAssignmentTarget || false, context.isDeclaration || false);
        }
        // Fallback, though getIdentifierValue should always be present.
        console.warn(`[jsExpressionHandlers] Identifier handler: context.getIdentifierValue is missing. Defaulting to raw name for: ${node.name}`);
        return node.name;
    },

    Literal: (node, context, generateExpression, generateStatement) => {
        // Use JSON.stringify for robust handling of strings (escapes, quotes)
        // and other primitive types (numbers, booleans, null).
        return JSON.stringify(node.value);
    },

    ThisExpression: (node, context, generateExpression, generateStatement) => {
        return 'this';
    },

    // --- Function & Class Related Expressions ---
    NewExpression: (node, context, generateExpression, generateStatement) => {
        const calleeCode = generateExpression(node.callee, context);
        const argsCode = node.arguments.map(arg => generateExpression(arg, context)).join(', ');
        return `new ${calleeCode}(${argsCode})`;
    },

    CallExpression: (node, context, generateExpression, generateStatement) => {
        // The callee itself might be a reactive variable, or a member expression involving one.
        const callee = generateExpression(node.callee, context);
        // Arguments also need their expressions generated, potentially resolving reactive vars.
        const args = node.arguments.map(arg => generateExpression(arg, context)).join(', ');
        return `${callee}(${args})`;
    },

    ArrowFunctionExpression: (node, context, generateExpression, generateStatement) => {
        // For parameters, create a new context where getIdentifierValue *always* returns the raw name.
        // This prevents `(count.value) => ...` when you mean `(count) => ...`
        const paramContext = {
            ...context,
            getIdentifierValue: (name) => name // Parameters are never reactive variables requiring `.value`
        };
        const params = node.params.map(p => generateExpression(p, paramContext)).join(', ');

        const body = node.body.type === 'BlockStatement'
            ? generateStatement(node.body, context) // Block statements (like `{ ... }`) need `generateStatement`
            : generateExpression(node.body, context); // Single expressions (like `(a) => a + 1`) need `generateExpression`
        return `(${params}) => ${body}`;
    },

    FunctionExpression: (node, context, generateExpression, generateStatement) => {
        const funcName = node.id ? node.id.name : '';
        // Same logic for parameters as ArrowFunctionExpression
        const paramContext = {
            ...context,
            getIdentifierValue: (name) => name
        };
        const params = node.params.map(p => generateExpression(p, paramContext)).join(', ');
        const body = generateStatement(node.body, context); // Function bodies are always block statements
        return `function ${funcName}(${params}) ${body}`;
    },

    // --- Operators ---
    BinaryExpression: (node, context, generateExpression, generateStatement) => {
        const getOperatorPrecedence = (op) => {
            switch (op) {
                case '**': return 4; // Exponentiation (right-associative)
                case '*':
                case '/':
                case '%': return 3; // Multiplication, Division, Remainder
                case '+':
                case '-': return 2; // Addition, Subtraction
                case '<<':
                case '>>':
                case '>>>': return 1.5; // Bitwise Shift Operators
                case '<':
                case '<=':
                case '>':
                case '>=':
                case 'instanceof':
                case 'in': return 1; // Relational Operators
                case '==':
                case '!=':
                case '===':
                case '!==': return 0; // Equality Operators
                case '&': return -1; // Bitwise AND
                case '^': return -2; // Bitwise XOR
                case '|': return -3; // Bitwise OR
                case '&&': return -4; // Logical AND
                case '||': return -5; // Logical OR
                case '??': return -6; // Nullish Coalescing
                default: return -100; // Unknown or lowest precedence
            }
        };

        const currentOpPrecedence = getOperatorPrecedence(node.operator);

        let leftCode = generateExpression(node.left, context);
        let rightCode = generateExpression(node.right, context);

        // Add parentheses if a child expression has lower or equal precedence
        // taking into account associativity for same-precedence operators.
        if (node.left.type === 'BinaryExpression') {
            const leftPrecedence = getOperatorPrecedence(node.left.operator);
            if (leftPrecedence < currentOpPrecedence ||
                (leftPrecedence === currentOpPrecedence && !['**'].includes(node.operator))) { // Associativity for exponentiation
                leftCode = `(${leftCode})`;
            }
        }

        if (node.right.type === 'BinaryExpression') {
            const rightPrecedence = getOperatorPrecedence(node.right.operator);
            if (rightPrecedence < currentOpPrecedence ||
                (rightPrecedence === currentOpPrecedence && node.operator === '**')) { // Exponentiation is right-associative
                rightCode = `(${rightCode})`;
            }
        }

        return `${leftCode} ${node.operator} ${rightCode}`;
    },

    UnaryExpression: (node, context, generateExpression, generateStatement) => {
        const argument = generateExpression(node.argument, context);
        // `node.prefix` indicates if the operator comes before the argument (`!x`, `++x`)
        // `node.operator` is the operator itself
        return node.prefix ? `${node.operator}${argument}` : `${argument}${node.operator}`;
    },

    AssignmentExpression: (node, context, generateExpression, generateStatement) => {
        // Create a new context for the left-hand side (LHS) of the assignment.
        // Set `isAssignmentTarget: true` so `getIdentifierValue` knows NOT to append `.value`.
        // This is crucial for `reactiveVar.value = newValue;`
        const leftContext = { ...context, isAssignmentTarget: true };
        const leftCode = generateExpression(node.left, leftContext);

        // The right-hand side (RHS) uses the regular context,
        // so reactive variables here will have `.value` appended for reads.
        const rightCode = generateExpression(node.right, context);
        return `${leftCode} ${node.operator} ${rightCode}`;
    },

    LogicalExpression: (node, context, generateExpression, generateStatement) => {
        const left = generateExpression(node.left, context);
        const right = generateExpression(node.right, context);
        return `${left} ${node.operator} ${right}`;
    },

    ConditionalExpression: (node, context, generateExpression, generateStatement) => {
        const test = generateExpression(node.test, context);
        // Use the new helper for consequent and alternate to handle diverse string representations
        const consequent = resolveStringLiteral(node.consequent, generateExpression, context);
        const alternate = resolveStringLiteral(node.alternate, generateExpression, context);
        return `${test} ? ${consequent} : ${alternate}`;
    },

    // --- Object & Array Literals / Member Access ---
    ArrayExpression: (node, context, generateExpression, generateStatement) => {
        const elements = node.elements.map(el => {
            if (el === null) return ''; // For sparse arrays like `[a,,c]`
            return generateExpression(el, context);
        }).join(', ');
        return `[${elements}]`;
    },

    ObjectExpression: (node, context, generateExpression, generateStatement) => {
        const properties = node.properties.map(prop => {
            let key;
            if (prop.computed) {
                // For computed property names like `{ [myKey]: value }`
                key = `[${generateExpression(prop.key, context)}]`;
            } else if (prop.key.type === 'Identifier') {
                // For non-computed identifier keys like `{ prop: value }`
                key = prop.key.name;
            } else {
                // For literal keys like `{ 'string-key': value }` or `{ 123: value }`
                key = generateExpression(prop.key, context);
            }

            // Handle shorthand properties `{ prop }`
            if (prop.shorthand) {
                return key;
            }

            const value = generateExpression(prop.value, context);
            return `${key}: ${value}`;
        }).join(', ');
        return `{ ${properties} }`;
    },

    MemberExpression: (node, context, generateExpression, generateStatement) => {
        // First, generate the object part (e.g., 'this', 'myObject', 'anotherState.value')
        // Ensure the object is correctly resolved, including its .value if it's reactive.
        const objectCode = generateExpression(node.object, context);
        let propertyCode;

        if (node.computed) {
            // For computed properties (e.g., obj[prop])
            propertyCode = generateExpression(node.property, context);
            return `${objectCode}[${propertyCode}]`;
        } else if (node.property.type === 'PrivateIdentifier') {
            // For private identifiers (e.g., this.#c)
            // The `getIdentifierValue` needs to resolve the *base* object and then handle the private field access.
            // For private identifiers, we usually just want the raw name. The reactivity is on the class instance.
            propertyCode = node.property.name; // Get raw private identifier name without '#'
            // The `objectCode` would be 'this'. The resulting code needs to be 'this.#propertyName'.
            // If the private field itself is reactive state, the `getIdentifierValue` for `this.#propertyName`
            // should apply `.value` (which is typically done in the parent context, not here directly for the private name).
            // Let's ensure this generates `this.#propertyName` correctly for now.
            return `${objectCode}.#${propertyCode}`; // Re-add '#' for output
        } else {
            // For regular non-computed public properties (e.g., obj.prop)
            propertyCode = node.property.name;
            return `${objectCode}.${propertyCode}`;
        }
    },

    // --- Patterns (for destructuring assignments/declarations) ---
    ArrayPattern: (node, context, generateExpression, generateStatement) => {
        // For patterns (e.g., in `const [a, b] = ...`), the identifiers within are raw names,
        // not reactive variables. So, create a context that ensures raw names.
        const patternContext = {
            ...context,
            getIdentifierValue: (name) => name
        };
        const elements = node.elements.map(el => {
            if (el === null) return ''; // For sparse arrays `[,b]`
            return generateExpression(el, patternContext);
        }).join(', ');
        return `[${elements}]`;
    },

    ObjectPattern: (node, context, generateExpression, generateStatement) => {
        // Similar to ArrayPattern, identifiers in object patterns are raw names.
        const patternContext = {
            ...context,
            getIdentifierValue: (name) => name
        };
        const properties = node.properties.map(prop => {
            let key = prop.computed
                ? `[${generateExpression(prop.key, context)}]` // Key can be computed expression (uses original context for evaluation)
                : (prop.key.type === 'Identifier' ? prop.key.name : generateExpression(prop.key, context));

            // The value side of the pattern uses the patternContext
            let value = generateExpression(prop.value, patternContext);

            if (prop.shorthand) {
                return key; // For `{ prop }` shorthand
            } else if (prop.value.type === 'AssignmentPattern') {
                // For `{ prop = defaultValue }`
                const left = generateExpression(prop.value.left, patternContext); // LHS is the pattern identifier
                const right = generateExpression(prop.value.right, context); // Default value can be reactive (uses original context for evaluation)
                return `${key}: ${left} = ${right}`;
            }
            return `${key}: ${value}`;
        }).join(', ');
        return `{ ${properties} }`;
    },

    // --- Spread Elements ---
    SpreadElement: (node, context, generateExpression, generateStatement) => {
        return `...${generateExpression(node.argument, context)}`;
    },

    // --- Template Literals (for backticks with interpolation) ---
    TemplateLiteral: (node, context, generateExpression, generateStatement) => {
        let code = '`';
        node.quasis.forEach((quasi, i) => {
            code += quasi.value.raw; // The raw string content of the quasi
            if (node.expressions[i]) {
                code += `\${${generateExpression(node.expressions[i], context)}}`;
            }
        });
        code += '`';
        return code;
    },

    TaggedTemplateExpression: (node, context, generateExpression, generateStatement) => {
        const tag = generateExpression(node.tag, context);
        // The quasi (template literal part) needs to be generated by its own handler
        // Pass a dummy generateStatement as it's not used in TemplateLiteral expression generation.
        const quasiCode = jsExpressionHandlers.TemplateLiteral(node.quasi, context, generateExpression, generateStatement);
        return `${tag}${quasiCode}`;
    },

    // --- Other Expressions ---
    SequenceExpression: (node, context, generateExpression, generateStatement) => {
        const expressions = node.expressions.map(exp => generateExpression(exp, context)).join(', ');
        return `(${expressions})`;
    },

    // PrivateIdentifier itself should generally only appear as part of a MemberExpression key,
    // so this handler might not be called directly for top-level PrivateIdentifier nodes.
    PrivateIdentifier: (node, context, generateExpression, generateStatement) => {
        // This handler should typically only be called from within MemberExpression.
        // It should just return the raw private identifier name for further processing.
        return `#${node.name}`;
    },

    // Added to handle `void 0` or similar expressions where the argument doesn't need
    // special handling for reactivity beyond regular expression generation.
    // Also covers `delete`, `typeof`, `+` (unary plus), `-` (unary minus), `~`, `!`
    // `new.target` etc.
    // Ensure this does not conflict with `UnaryExpression` which also handles some of these.
    // If you have distinct AST nodes for some of these, separate handlers are better.
    // For now, let's ensure UnaryExpression is comprehensive.
    // If your AST has "VoidExpression", "TypeOfExpression", etc., create specific handlers.
    // Placeholder for other potential Expression types:
    // This is a catch-all for expression types not explicitly handled above.
    // It's good practice to log a warning for unhandled types.
    // For a robust transpiler, you'd add specific handlers as needed.
    // Example: UpdateExpression (for `++`, `--`):
    // UpdateExpression: (node, context, generateExpression, generateStatement) => {
    //     const argument = generateExpression(node.argument, context);
    //     return node.prefix ? `${node.operator}${argument}` : `${argument}${node.operator}`;
    // },
    // AwaitExpression: (node, context, generateExpression, generateStatement) => {
    //     return `await ${generateExpression(node.argument, context)}`;
    // },
    // YieldExpression: (node, context, generateExpression, generateStatement) => {
    //     return node.delegate ? `yield* ${generateExpression(node.argument, context)}` : `yield ${generateExpression(node.argument, context)}`;
    // },
};