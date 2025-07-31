import { $effect, $derived } from '../../dist/state/index.js';
import { text, attr } from '../runtime/dom-helpers.js';

/**
 * Handlers for converting HTML Attribute AST nodes into code strings.
 * Each handler function receives:
 * - attrNode: The current AST attribute node being processed.
 * - elVar: The JavaScript variable name for the DOM element this attribute belongs to (e.g., 'el_0').
 * - context: An object containing current compilation context (e.g., reactiveScope, getIdentifierValue, cleanupQueue, getUniqueVar).
 * - generateExpression: A function to recursively generate code for nested JavaScript expressions.
 * - imports: A Set to collect necessary imports for the generated code.
 * - originalHtmlNode: The original HTML element AST node (e.g., for <input> to infer 'type' for bind:value).
 */
export const htmlAttributeHandlers = {
    EventHandler: (attrNode, elVar, context, generateExpression, imports, originalHtmlNode) => {
        imports.add('$effect'); // Effects might be used for reactivity within handlers, or for cleanup

        const eventName = attrNode.name.slice(2).toLowerCase(); // e.g., 'onclick' -> 'click'
        const handlerBody = generateExpression(attrNode.value, { ...context, isAssignmentTarget: false }); // Event handler value is an expression

        // Add event listener and a cleanup function
        let code = `  const ${context.getUniqueVar('eventHandler')} = ${handlerBody};\n`;
        code += `  ${elVar}.addEventListener('${eventName}', ${context.getUniqueVar('eventHandler')});\n`;
        code += `  ${context.cleanupQueue}.push(() => ${elVar}.removeEventListener('${eventName}', ${context.getUniqueVar('eventHandler')}));\n`;
        return code;
    },

    TwoWayBindingAttribute: (attrNode, elVar, context, generateExpression, imports, originalHtmlNode) => {
        // Example: <input bind:value={myState}>
        // attrNode.name: 'value' (the bound DOM property, e.g., 'value', 'checked')
        // attrNode.expression: The AST for 'myState' (the reactive variable)
        imports.add('$effect');
        imports.add('$state'); // Ensure $state is imported for setting values

        const propName = attrNode.name; // e.g., 'value', 'checked'
        const expressionNode = attrNode.expression; // e.g., Identifier 'myState'

        // Generate JS for the expression that holds the reactive state.
        // It's crucial that this resolves to the reactive *object* (e.g., `myState`), not `myState.value`.
        // We pass `isAssignmentTarget: true` because this is the target of an assignment (e.g., `myState.value = ...`).
        const reactiveVarJs = generateExpression(expressionNode, { ...context, isAssignmentTarget: true });

        let code = '';

        // 1. Set initial DOM value and update DOM when state changes
        code += `  ${context.cleanupQueue}.push($effect(() => { ${elVar}.${propName} = ${reactiveVarJs}.value; }));\n`;

        // 2. Update state when DOM changes (input, change events)
        let eventType = 'input'; // Default event type for inputs

        // Try to infer the correct event type based on the original HTML element node
        if (originalHtmlNode) {
            if (originalHtmlNode.name === 'select') {
                eventType = 'change';
            } else if (originalHtmlNode.name === 'input' && attrNode.name === 'checked') {
                // For checkboxes and radios, use 'change' event
                const typeAttr = originalHtmlNode.attributes.find(a => a.name === 'type');
                if (typeAttr && typeAttr.value && (typeAttr.value.raw === 'checkbox' || typeAttr.value.raw === 'radio')) {
                    eventType = 'change';
                }
            }
        } else {
            // This warning means `originalHtmlNode` wasn't passed, which it *should* be
            // from the `Element` handler in `html-node-handlers.js`.
            console.warn(`[TwoWayBindingAttribute] Missing originalHtmlNode for bind:${propName}. Cannot infer specific event type.`);
        }

        const handlerFnVar = context.getUniqueVar('bindHandler');
        code += `  const ${handlerFnVar} = (e) => { ${reactiveVarJs}.value = e.target.${propName}; };\n`;
        code += `  ${elVar}.addEventListener('${eventType}', ${handlerFnVar});\n`;
        code += `  ${context.cleanupQueue}.push(() => ${elVar}.removeEventListener('${eventType}', ${handlerFnVar}));\n`;

        return code;
    },

    MustacheAttribute: (attrNode, elVar, context, generateExpression, imports, originalHtmlNode) => {
        // This handles attributes like `class={myClass}` or `id={someId}` where the *entire* value
        // is a single JavaScript expression.
        imports.add('$effect');
        imports.add('$derived');
        imports.add('attr'); // Helper for reactive attribute updates

        const expressionJs = generateExpression(attrNode.expression, context);
        const attributeName = attrNode.name;

        // Use the 'attr' helper to set dynamic attributes reactively
        return `  ${context.cleanupQueue}.push(attr(${elVar}, '${attributeName}', $derived(() => ${expressionJs})));\n`;
    },

    // *** THIS IS THE HANDLER FOR KeyValueAttribute ***
    KeyValueAttribute: (attrNode, elVar, context, generateExpression, imports, originalHtmlNode) => {
        let code = '';
        const attributeName = attrNode.name;

        // The 'value' of a KeyValueAttribute is an array of parts.
        // These parts can be Text nodes or MustacheAttribute nodes.
        const parts = attrNode.value;

        if (!Array.isArray(parts)) {
            // This case should ideally not happen if the parser is consistent.
            console.warn(`[KeyValueAttribute] Expected attrNode.value to be an array for attribute "${attributeName}", got non-array:`, parts);
            // Fallback: Treat as a static string.
            return `  ${elVar}.setAttribute('${attributeName}', ${JSON.stringify(String(parts))});\n`;
        }

        // Determine if the attribute value contains any dynamic parts (MustacheAttribute)
        const hasDynamicPart = parts.some(part => part && part.type === 'MustacheAttribute');

        if (!hasDynamicPart) {
            // If only static Text nodes, combine them and set attribute once
            const staticValue = parts.map(part => {
                if (part && part.type === 'Text') {
                    return part.data || part.raw || '';
                }
                console.warn(`[KeyValueAttribute] Unexpected non-Text part in static attribute "${attributeName}":`, part);
                return String(part); // Attempt to stringify for robustness
            }).join('');
            code += `  ${elVar}.setAttribute('${attributeName}', ${JSON.stringify(staticValue)});\n`;
        } else {
            // If dynamic parts are present, build a derived expression for the full string
            // e.g., `class="my-class {someVar} other"` => `'my-class ' + (someVar) + ' other'`
            imports.add('$effect');
            imports.add('$derived');
            imports.add('attr'); // Need the 'attr' helper for dynamic updates

            const derivedParts = parts.map(part => {
                if (part && part.type === 'Text') {
                    return JSON.stringify(part.data || part.raw || '');
                } else if (part && part.type === 'MustacheAttribute') {
                    // Generate JS for the expression within the MustacheAttribute.
                    // `generateExpression` is responsible for handling the AST structure of `part.expression`.
                    return `(${generateExpression(part.expression, context)})`; // Wrap in parens for safety
                } else {
                    console.warn(`[KeyValueAttribute] Unhandled dynamic part type in attribute "${attributeName}": ${part && part.type}`, part);
                    return `''`; // Fallback for unhandled part types
                }
            }).filter(Boolean).join(' + '); // Filter out empty strings from join to avoid "a + + b"

            // Wrap the whole thing in a derived signal and use the 'attr' helper
            code += `  ${context.cleanupQueue}.push(attr(${elVar}, '${attributeName}', $derived(() => ${derivedParts})));\n`;
        }
        return code;
    },

    // Handles attributes like `<input disabled>` or `<input id="foo">`
    // where the value is either implicitly true (boolean) or a simple literal.
    LiteralAttribute: (attrNode, elVar, context, generateExpression, imports, originalHtmlNode) => {
        const attributeName = attrNode.name;
        if (typeof attrNode.value === 'boolean' && attrNode.value === true) {
            // For boolean attributes like `disabled`
            return `  ${elVar}.setAttribute('${attributeName}', '');\n`;
        } else {
            // For simple static string literal values
            return `  ${elVar}.setAttribute('${attributeName}', ${JSON.stringify(String(attrNode.value))});\n`;
        }
    },

    // If your parser has a distinct type for Boolean attributes like `required`
    BooleanAttribute: (attrNode, elVar, context, generateExpression, imports, originalHtmlNode) => {
        return `  ${elVar}.setAttribute('${attrNode.name}', '');\n`;
    },

    // Generic fallback for any other attribute types. Should ideally be hit rarely.
    Attribute: (attrNode, elVar, context, generateExpression, imports, originalHtmlNode) => {
        console.warn(`[htmlAttributeHandlers.Attribute] Generic attribute handler invoked for ${attrNode.name}. Consider more specific handler.`, attrNode);
        if (attrNode.value === true) {
            return `  ${elVar}.setAttribute('${attrNode.name}', '');\n`;
        } else if (attrNode.value && attrNode.value.type === 'Text') {
            return `  ${elVar}.setAttribute('${attrNode.name}', ${JSON.stringify(attrNode.value.data || attrNode.value.raw)});\n`;
        } else if (attrNode.value) {
            // Last resort: stringify whatever the value is
            return `  ${elVar}.setAttribute('${attrNode.name}', ${JSON.stringify(String(attrNode.value))});\n`;
        }
        return '';
    }
};