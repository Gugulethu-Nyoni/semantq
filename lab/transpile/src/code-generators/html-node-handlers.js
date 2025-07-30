// src/code-generators/html-node-handlers.js

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

    Element: (node, context, generateChildrenCode, generateExpression, imports, attributeHandlers) => {
        const elVar = context.getUniqueVar(node.name);
        let code = `  const ${elVar} = document.createElement('${node.name}');\n`;

        node.attributes && node.attributes.forEach(attr => {
            const handler = attributeHandlers[attr.type];
            if (handler) {
                // IMPORTANT FIX: Reordered arguments to match the expected signature
                // of attribute handlers in html-attribute-handlers.js:
                // (attr, elVar, context, generateExpression, imports)
                code += handler(
                    attr,               // 1st argument: the attribute AST node
                    elVar,              // 2nd argument: the element's variable name (e.g., 'input_2')
                    context,            // 3rd argument: the context object (contains reactiveScope)
                    generateExpression, // 4th argument: the JS expression generator
                    imports             // 5th argument: the imports set
                );
            } else {
                console.warn(`[CodeGenerator] No handler for attribute type: ${attr.type}. Attribute:`, attr);
                // Fallback logic for unhandled attribute types
                const attributeName = typeof attr.name === 'object' ? attr.name.name : attr.name;
                if (attr.value === true) {
                    code += `  ${elVar}.setAttribute('${attributeName}', '');\n`;
                } else if (attr.type === 'KeyValueAttribute' && attr.value && Array.isArray(attr.value) && attr.value[0]?.type === 'Text') {
                    const staticValue = attr.value[0].data || attr.value[0].raw;
                    code += `  ${elVar}.setAttribute('${attributeName}', ${JSON.stringify(staticValue)});\n`;
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
