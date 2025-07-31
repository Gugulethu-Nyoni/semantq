import { htmlAttributeHandlers } from './html-attribute-handlers.js'; // <-- THIS IMPORT IS CRUCIAL

export const htmlNodeHandlers = {
    IfStatement: (node, context, generateChildrenCode, generateExpression, imports) => {
        imports.add('$effect');
        imports.add('$derived');
        imports.add('insertAfter');
        imports.add('removeNode');
        imports.add('clearNodesBetween'); // Import the helper for clearing nodes

        const conditionJs = generateExpression(node.test, context);
        const ifBlockStartAnchor = context.getUniqueVar('if_start_anchor'); // Anchor before the content
        const ifBlockEndAnchor = context.getUniqueVar('if_end_anchor');    // Anchor after the content
        const derivedConditionVar = context.getUniqueVar('if_condition_derived');

        let code = `  const ${derivedConditionVar} = $derived(() => ${conditionJs});\n`;
        // Create two anchors to define the boundaries of the conditional block's content
        code += `  const ${ifBlockStartAnchor} = document.createTextNode('');\n`;
        code += `  const ${ifBlockEndAnchor} = document.createTextNode('');\n`; // This acts as the stable end reference

        code += `  ${context.currentParentVar}.appendChild(${ifBlockStartAnchor});\n`;
        code += `  ${context.currentParentVar}.appendChild(${ifBlockEndAnchor});\n\n`; // Append the end anchor immediately after the start

        code += `  ${context.cleanupQueue}.push($effect(() => {\n`;
        // NEW LOGIC: Always clear content between the two anchors before inserting new content
        code += `    clearNodesBetween(${ifBlockStartAnchor}, ${ifBlockEndAnchor});\n`;

        code += `    const fragment = document.createDocumentFragment();\n`;

        code += `    if (${derivedConditionVar}.value) {\n`;
        const consequentContext = { ...context, currentParentVar: 'fragment' };
        code += generateChildrenCode(node.consequent.body, consequentContext);
        // Insert the fragment's children after the start anchor (and before the end anchor)
        code += `      insertAfter(fragment, ${ifBlockStartAnchor});\n`;
        code += `    } `;

        if (node.alternate) {
            code += `else {\n`;
            const alternateContext = { ...context, currentParentVar: 'fragment' };
            code += generateChildrenCode(node.alternate.body, alternateContext);
            // Insert the fragment's children after the start anchor (and before the end anchor)
            code += `      insertAfter(fragment, ${ifBlockStartAnchor});\n`;
            code += `    }\n`;
        } else {
            code += `\n`;
        }
        code += `  }));\n\n`;

        return code;
    },

    EachStatement: (node, context, generateChildrenCode, generateExpression, imports) => {
        imports.add('$effect');
        imports.add('$state');
        imports.add('insertAfter');
        imports.add('removeNode');
        imports.add('reconcileChildren');

        const sourceJs = generateExpression(node.source, context);
        const itemVar = node.item.name;
        // Ensure key function uses the non-reactive item for key calculation (if reactiveScope logic needs adjustment)
        const keyFnJs = node.key ?
            `(item, index) => ${generateExpression(node.key, { ...context, eachItemVar: itemVar, reactiveScope: new Map([...context.reactiveScope, [itemVar, false]]) })}` :
            `(item, index) => index`;

        const anchorVar = context.getUniqueVar('each_anchor');
        const domMapVar = context.getUniqueVar('each_dom_map');

        let code = `  const ${anchorVar} = document.createTextNode('');\n`;
        code += `  ${context.currentParentVar}.appendChild(${anchorVar});\n`;
        code += `  let ${domMapVar} = new Map(); // Map: key -> { node, cleanup }\n\n`;

        code += `  ${context.cleanupQueue}.push($effect(() => {\n`;
        code += `    const currentItems = ${sourceJs};\n`;

        const createItemContentFn = context.getUniqueVar('create_item_content');
        const rawItemVar = context.getUniqueVar('raw_item_data');
        code += `    const ${createItemContentFn} = (${rawItemVar}, index) => {\n`;
        code += `      const ${itemVar} = $state(${rawItemVar}); // The loop variable now refers to the $state object\n`;
        code += `      const itemFragment = document.createDocumentFragment();\n`;
        const itemCleanup = context.getUniqueVar('itemCleanup'); // Unique var for nested cleanup array
        code += `      const ${itemCleanup} = [];\n`;
        const itemContext = {
            ...context,
            currentParentVar: 'itemFragment',
            reactiveScope: new Map([...context.reactiveScope, [itemVar, true]]), // Add item to reactive scope
            eachItemVar: itemVar, // Set current item variable for nested expressions
            cleanupQueue: itemCleanup // Collect inner item cleanups here
        };
        code += generateChildrenCode(node.body.body, itemContext);
        code += `      return { node: itemFragment, cleanup: () => ${itemCleanup}.forEach(fn => fn()) };\n`;
        code += `    };\n\n`;

        code += `    ${domMapVar} = reconcileChildren(${anchorVar}.parentNode, currentItems, ${domMapVar}, ${createItemContentFn}, ${keyFnJs});\n`;
        code += `  }));\n\n`;

        return code;
    },

    Element: (node, context, generateChildrenCode, generateExpression, imports) => {
        const elVar = context.getUniqueVar(node.name);
        let code = `  const ${elVar} = document.createElement('${node.name}');\n`;

        const attributes = node.attributes || []; // Ensure attributes is always an array

        attributes.forEach(attr => {
            let handlerFn = null;

            // Use direct lookup for handler functions from htmlAttributeHandlers
            // The order matters: more specific handlers first.
            if (attr.type === 'EventHandler' && htmlAttributeHandlers.EventHandler) {
                handlerFn = htmlAttributeHandlers.EventHandler;
            } else if (attr.smqtype === 'TwoWayBindingAttribute' && htmlAttributeHandlers.TwoWayBindingAttribute) {
                handlerFn = htmlAttributeHandlers.TwoWayBindingAttribute;
            } else if (attr.type === 'MustacheAttribute' && htmlAttributeHandlers.MustacheAttribute) {
                handlerFn = htmlAttributeHandlers.MustacheAttribute;
            } else if (attr.type === 'KeyValueAttribute' && htmlAttributeHandlers.KeyValueAttribute) {
                handlerFn = htmlAttributeHandlers.KeyValueAttribute;
            }
            // `BooleanAttribute` usually maps to a generic `Attribute` handler or specific logic
            else if ((attr.type === 'BooleanAttribute' || attr.smqtype === 'BooleanAttribute') && htmlAttributeHandlers.Attribute) {
                handlerFn = htmlAttributeHandlers.Attribute; // Assuming generic Attribute handler manages boolean attributes
            } else if (attr.type === 'LiteralAttribute' && htmlAttributeHandlers.LiteralAttribute) {
                handlerFn = htmlAttributeHandlers.LiteralAttribute;
            }
            // Add other attribute types if your parser generates them (e.g., SpreadAttribute)

            if (handlerFn) {
                code += handlerFn(
                    attr,
                    elVar,
                    context,
                    generateExpression,
                    imports
                );
            } else {
                console.warn(`[htmlNodeHandlers] No handler for attribute type: ${attr.type}. Attribute:`, attr);
                // Fallback logic for unhandled attribute types
                const attributeName = typeof attr.name === 'object' ? attr.name.name : attr.name;
                if (attr.value === true) { // For boolean attributes written as `disabled`
                    code += `  ${elVar}.setAttribute('${attributeName}', '');\n`;
                } else if (attr.value && (attr.value.type === 'Text' || typeof attr.value === 'string')) {
                    // Handle simple static text values
                    const staticValue = attr.value.type === 'Text' ? (attr.value.data || attr.value.raw) : String(attr.value);
                    code += `  ${elVar}.setAttribute('${attributeName}', ${JSON.stringify(staticValue)});\n`;
                } else if (Array.isArray(attr.value) && attr.value.every(v => v.type === 'Text' || typeof v === 'string')) {
                    // Handle array of text nodes as a static value
                    const staticValue = attr.value.map(v => v.data || v.raw || String(v)).join('');
                    code += `  ${elVar}.setAttribute('${attributeName}', ${JSON.stringify(staticValue)});\n`;
                }
                // If it's a MustacheAttribute that somehow didn't get picked up by its own handler,
                // and it contains an expression, we might try a dynamic fallback if not already handled by KeyValueAttribute.
                // This specific fallback should ideally not be hit if the primary handlers are correct.
                else if (attr.type === 'MustacheAttribute' && attr.expression) {
                    // This scenario should be rare if MustacheAttribute handler is working, but as a last resort:
                    console.warn(`[htmlNodeHandlers] Falling back for MustacheAttribute within Element loop: ${attributeName}`);
                    imports.add('$effect');
                    imports.add('$derived');
                    imports.add('state'); // Assuming state.attr is available
                    const dynamicValueJs = generateExpression(attr.expression, context);
                    code += `  ${context.cleanupQueue}.push(state.attr(${elVar}, '${attributeName}', $derived(() => ${dynamicValueJs})));\n`;
                }
            }
        });

        const childContext = { ...context, currentParentVar: elVar };
        code += generateChildrenCode(node.children, childContext);
        code += `  ${context.currentParentVar}.appendChild(${elVar});\n`;
        return code;
    },
    TextNode: (node, context) => {
        const textVar = context.getUniqueVar('text');
        let code = `  const ${textVar} = document.createTextNode(${JSON.stringify(node.value)});\n`;
        code += `  ${context.currentParentVar}.appendChild(${textVar});\n`;
        return code;
    },

    MustacheTag: (node, context, generateChildrenCode, generateExpression, imports) => { // Consistent parameter list
        imports.add('state');
        imports.add('$derived');

        const expressionJs = generateExpression(node.expression, context);
        const textNodeVar = context.getUniqueVar('text_interp');
        let code = `  const ${textNodeVar} = document.createTextNode('');\n`;
        code += `  ${context.currentParentVar}.appendChild(${textNodeVar});\n`;
        code += `  ${context.cleanupQueue}.push(state.text(${textNodeVar}, $derived(() => ${expressionJs})));\n`;
        return code;
    }
};