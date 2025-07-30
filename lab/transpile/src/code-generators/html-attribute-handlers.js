// src/code-generators/html-attribute-handlers.js

export const htmlAttributeHandlers = {
    MustacheAttribute: (attr, elVar, context, generateExpression, imports) => {
        if (attr.value && attr.value.length > 0) {
            imports.add('state');
            imports.add('$derived');
            // Assuming attr.value[0] is the AST node for the expression (e.g., an Identifier node)
            const expressionNode = attr.value[0];
            const expressionJs = generateExpression(expressionNode, context);

            return `  ${context.cleanupQueue}.push(state.attr(${elVar}, '${attr.name}', $derived(() => ${expressionJs})));\n`;
        }
        return '';
    },
    EventHandler: (attr, elVar, context, generateExpression, imports) => {
        const eventName = attr.name;
        const handlerExpressionNode = attr.value && attr.value.name ? attr.value.name : null;

        if (!eventName) {
            console.warn(`[CodeGenerator] EventHandler: 'name' property is missing for node:`, attr);
            return '';
        }

        if (!handlerExpressionNode) {
            console.warn(`[CodeGenerator] EventHandler for '${eventName}': 'value' property or its 'name' (expression) is missing for node:`, attr);
            return '';
        }

        const handlerJsCode = generateExpression(handlerExpressionNode, context);

        if (!handlerJsCode) {
            console.warn(`[CodeGenerator] EventHandler for '${eventName}': Failed to generate JavaScript code for handler expression. Node:`, attr);
            return '';
        }

        imports.add('$effect');

        return `  ${context.cleanupQueue}.push($effect(() => {
            ${elVar}.addEventListener('${eventName}', ${handlerJsCode});
            return () => ${elVar}.removeEventListener('${eventName}', ${handlerJsCode}); // Cleanup
        }));\n`;
    },

    BooleanIdentifierAttribute: (attr, elVar, context, generateExpression, imports) => {
        imports.add('state');
        imports.add('$derived');
        // attr.name is expected to be the string name (e.g., 'disabled')
        const expressionJs = generateExpression({ type: 'Identifier', name: attr.name }, context);
        return `  ${context.cleanupQueue}.push(state.attr(${elVar}, '${attr.name}', $derived(() => ${expressionJs})));\n`;
    },
    KeyValueAttribute: (attr, elVar, context, generateExpression, imports) => {
        // Determine the attribute name correctly: if attr.name is an object, use attr.name.name, else use attr.name
        const attributeName = typeof attr.name === 'object' ? attr.name.name : attr.name;

        if (attr.value && Array.isArray(attr.value) && attr.value[0]?.type === 'Text') {
            const staticValue = attr.value[0].data || attr.value[0].raw;
            return `  ${elVar}.setAttribute('${attributeName}', ${JSON.stringify(staticValue)});\n`;
        } else if (attr.value === true) {
            return `  ${elVar}.setAttribute('${attributeName}', '');\n`;
        }
        // If it's still unhandled here, and it has mustache attributes within its value (e.g., class="foo {{bar}}")
        if (attr.value && Array.isArray(attr.value)) {
            const dynamicParts = attr.value.map(valNode => {
                if (valNode.type === 'MustacheAttribute' && valNode.name) {
                    imports.add('$derived');
                    imports.add('state');
                    // FIX: Assuming valNode.name is already the AST node for the identifier.
                    // If valNode.name is a string like 'myVar', you need:
                    // return `\${${generateExpression({ type: 'Identifier', name: valNode.name }, context)}}`;
                    // But based on the `[object Object]` error, it's more likely `valNode.name` IS the AST node.
                    return `\${${generateExpression(valNode.name, context)}}`;
                } else if (valNode.type === 'Text') {
                    return valNode.data;
                }
                return `/*UNHANDLED_ATTR_VAL_NODE_TYPE_${valNode.type}* /`;
            }).join('');

            if (dynamicParts.includes('${')) {
                imports.add('$effect');
                return `  ${context.cleanupQueue}.push($effect(() => {
    ${elVar}.setAttribute('${attributeName}', \`${dynamicParts}\`);
  }));\n`;
            } else if (dynamicParts) {
                return `  ${elVar}.setAttribute('${attributeName}', \`${dynamicParts}\`);\n`;
            }
        }

        console.warn(`[CodeGenerator] Complex KeyValueAttribute not handled by specific handlers:`, attr);
        return '';
    },

    LiteralAttribute: (attr, elVar, context, generateExpression, imports) => {
        // attr.name is expected to be the string (e.g., 'type', 'class')
        // attr.value is expected to be the string value (e.g., 'number', 'my-class')
        return `${elVar}.setAttribute('${attr.name}', \`${attr.value}\`);\n`;
    },

    // For dynamic attributes like value={displayC}
    MustacheTag: (attr, elVar, context, generateExpression, imports) => {
        imports.add('$effect'); // Ensure $effect is imported

        // This call to generateExpression will use generateExpressionAsJS from CodeGenerator.js,
        // which now correctly returns 'displayC.value' for 'displayC' (after the reactiveScope fix).
        const expressionCode = generateExpression(attr.expression, context);

        // Special handling for 'value' attribute on input elements (preferred way)
        if (attr.name === 'value') {
            // DIRECT PROPERTY ASSIGNMENT: No template literal needed for a property.
            return `${context.cleanupQueue}.push($effect(() => { ${elVar}.value = ${expressionCode}; }));\n`;
        } else {
            // For other dynamic attributes, use setAttribute, usually with a template literal
            // to allow for string coercion/interpolation if the expression isn't already a string.
            return `${context.cleanupQueue}.push($effect(() => { ${elVar}.setAttribute('${attr.name}', \`${expressionCode}\`); }));\n`;
        }
    },

    
};
