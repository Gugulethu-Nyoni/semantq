"use strict";
import fs from "fs";
import path from "path";
import config from '../../semantq.config.js';


import { walk } from "estree-walker";
import { traverse } from "estraverse";

import GetNodePositions from "./utils/getNodePositions.js";
import elementWalker from "./utils/elementWalker.js";
import Walker from "./static_analysis/deeperWalker.js";

class SlotResolver {
  constructor(ast, filePath) {
    this.filePath = filePath;
    this.ast = ast;
    this.componentName = "";

    // Initialize component paths from config
    const { components, globalComponents } = config;
    this.actualComponentsPath = components['$components'];
    this.actualGlobalComponentsPath = globalComponents['$global'];

    const fileName = path.basename(filePath, ".merged.ast");
    this.isPage = fileName.startsWith("@page");
    this.isComponent = !this.isPage;
    
    if (!this.isPage) this.componentName = fileName;
    
    // Corrected AST key access
    if (this.isPage) {
      this.mainJsASTKey = "jsAST";
      this.mainCssASTKey = "cssAST";
      this.mainHtmlASTKey = "customAST";
    } else {
      const lowerCaseComponentName = this.componentName.toLowerCase();
      this.mainJsASTKey = `${lowerCaseComponentName}_jsAST`;
      this.mainCssASTKey = `${lowerCaseComponentName}_cssAST`;
      this.mainHtmlASTKey = `${lowerCaseComponentName}_customAST`;
    }
    
    this.jsAST = ast[this.mainJsASTKey] || { type: "JavaScript", content: { body: [] } };
    this.cssAST = ast[this.mainCssASTKey] || { type: "CSS", content: {} };
    this.customAST = this.ast[this.mainHtmlASTKey] || { type: "Custom", content: [] };
    
    this.componentsRegistry = {};
    this.childrenSlotsRegistry = {};
    this.nameSlotBlocks = {};
    this.mergedBlocks = {};
    this.finalAst = '';
    
    this.buildComponentRegistry();
    this.resolvedAst = this.resolveNamedSlots(this.filePath);
    this.finalResolvedAst = this.resolveDefaultSlots(this.filePath);

    

    this.removeComponentImports();
    this.writeResolvedAstFile();
}



  getJSContent() {
    return this.jsAST.content.body || [];
  }

  buildComponentRegistry() {
    const jsContent = this.getJSContent();

    walk(jsContent, {
      enter: ({ type, source, specifiers }) => {
        if (type === "ImportDeclaration" && source.value.includes("$")) {
          const componentName = specifiers[0].local.name;
          let componentPath = source.value;

          if (componentPath.includes("$global")) {
            componentPath = componentPath.replace("$global", this.actualGlobalComponentsPath);
          }

          if (componentPath.includes("$components")) {
            componentPath = componentPath.replace("$components", this.actualComponentsPath);
          }

          if (elementWalker(this.customAST, "name", componentName)) {
            this.componentsRegistry[componentName] = componentPath;
          }
        }
      },
    });
  }



// 


// Function to resolve named slots in component AST
resolveNamedSlots(filePath) {
  const parentComponentFileName = path.basename(filePath);
  const parentComponentKey = this.isPage
    ? "customAST"
    : parentComponentFileName.replace(".merged.ast", "").toLowerCase();

  const parentComponentAST = this.ast[parentComponentKey];

  const walk = new Walker();
  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  // Initialize data structures
  this.nameSlotBlocks = {};
  this.mergedBlocks = {};
  const processedChildAstBlocks = [];
  const componentInstanceKeys = [];

  // Process each component in reverse order
  for (const componentName of Object.keys(this.componentsRegistry).reverse()) {
    const childComponentKey = componentName.toLowerCase();
    const childComponentAstBlock = this.ast[`${childComponentKey}_customAST`] ||
                                   this.ast[childComponentKey];

    if (!childComponentAstBlock) {
      console.warn(`Child component AST not found for ${componentName}`);
      continue;
    }

/* STOP THE FLOW IF THE SLOT IS NOT NAME */

// check if the imported (child) slot is named - skip if not
    const isNamed = walk.deepWalker(
      childComponentAstBlock,
      "Element",
      walk.createMatchLogic("Element", "slot"),
      { path: "attributes" }
    );

   // console.log("isNamed",isNamed[0].value);

if (isNamed[0].value === null || isNamed[0].value.length === 0 ) continue;

/* END OF NAMED SLOT CHECK */



    // Find all instances of this component in parent
    const parentInstances = walk.deepWalker(
      parentComponentAST,
      "Element",
      walk.createMatchLogic("Element", componentName),
      { path: "name" }
    );

    //console.log("Here",parentInstances);

    // Process each component instance
    parentInstances.forEach((instance) => {
      const parentNode = instance.node;

      // Add unique ID to parent node
      const { attributes, id: parentNodeId } = walk.ensureIdAttribute(parentNode.attributes);
      parentNode.attributes = attributes;
      const parentNodeKey = `${componentName}_${parentNodeId}`;

      // Find all named slots in child component (e.g., <slot name="header">)
      const slotNodes = walk.deepWalker(
        childComponentAstBlock, // This is the AST of the ProCard component
        "Element",
        walk.createMatchLogic("Element", "slot"),
        { path: "attributes[0].value[0].raw" }
      );

      // Initialize slot blocks for this component instance
      this.nameSlotBlocks[parentNodeKey] = {};

      // Process each slot
      for (const slotNode of slotNodes) {
        const slotName = slotNode.value; // e.g., "header", "mypara", "footer"
        if (!slotName) continue; // Skip default slots for now (handled separately or through other logic)

        // Find matching content in the *parent* component (where ProCard is used)
        const slotContentNodesInParent = walk.deepWalker(
          parentNode, // This is the <ProCard> instance in the main AST
          "Element",
          walk.createMatchLogic("Element"),
          { path: "attributes[0].value[0].raw" },
          slotName
        );

        let contentToUse = [];

        // Check if the parent provided content for this named slot
        if (slotContentNodesInParent.length > 0) {
          const parentProvidedNode = slotContentNodesInParent[0].node; // Get the parent node (e.g., <h1>)

          // Check if the parent-provided node has any non-empty children
          const hasMeaningfulContent = parentProvidedNode.children &&
                                       parentProvidedNode.children.some(child => {
                                         if (child.type === "TextNode") {
                                           return child.value.trim().length > 0; // Has non-whitespace text
                                         }
                                         // Any non-text node (like another element) counts as meaningful content
                                         return true;
                                       });

          if (hasMeaningfulContent) {
            // Parent provided meaningful content, use it
            contentToUse = parentProvidedNode.children;
          } else {
            // Parent provided an empty slot, use the default content from the slotNode itself
            contentToUse = slotNode.node.children || []; // Default children from the <slot> tag in ProCard's template
          }
        } else {
          // Parent didn't provide this named slot at all, use default from slotNode
          contentToUse = slotNode.node.children || [];
        }

        // Store the determined content for this slot
        this.nameSlotBlocks[parentNodeKey][slotName] = contentToUse;
      }
    });

    // Merge slot content for this component (this part seems to be an intermediate step
    // and copies nameSlotBlocks to mergedBlocks, which then gets used. It's fine to keep as is).
    for (const slotKey in this.nameSlotBlocks) {
      if (this.nameSlotBlocks.hasOwnProperty(slotKey)) {
        this.mergedBlocks[slotKey] = {};

        for (const slotName in this.nameSlotBlocks[slotKey]) {
          if (this.nameSlotBlocks[slotKey].hasOwnProperty(slotName)) {
            this.mergedBlocks[slotKey][slotName] = this.nameSlotBlocks[slotKey][slotName];
          }
        }
      }
    }

    // Process and store resolved child ASTs
    for (const componentInstanceKey in this.mergedBlocks) {
      const slotContent = this.mergedBlocks[componentInstanceKey];
      const childASTClone = deepClone(childComponentAstBlock);
      const processedAST = this.processNamedSlots(slotContent, childASTClone); // Assuming this method correctly places the content
      processedChildAstBlocks.push({ [componentInstanceKey]: processedAST });
      componentInstanceKeys.push(componentInstanceKey);
    }
  }

  // Replace component instances with resolved content
  componentInstanceKeys.forEach(key => {
    const [componentName, instanceId] = key.split('_');
    const resolvedAST = processedChildAstBlocks.find(obj => obj[key])?.[key];

    if (!resolvedAST) return;

    // Find the component instance in parent AST
    const componentInstance = walk.deepWalker(
      parentComponentAST,
      "Element",
      walk.createMatchLogic("Element", componentName),
      { path: "attributes[0].value[0].raw" },
      instanceId
    )?.[0]?.node;

    if (!componentInstance) return;

    // Get location of the component instance to replace
    const nodeLocations = new GetNodePositions(parentComponentAST, componentInstance).init();

    const parentNode = nodeLocations[0]?.parentNode;
    const nodeIndex = nodeLocations[0]?.nodeIndex;

    // console.log("Parent Node", JSON.stringify(parentNode, null, 2));
    // console.log("nodeIndex", nodeIndex);

    // This is the correct replacement logic as previously discussed
    if (parentNode?.children?.[nodeIndex]) {
      // If resolvedAST is a single node, assign it. If it's an array of nodes (e.g., from a fragment),
      // you might need to use splice for proper insertion. Given your `processNamedSlots` returns a single AST,
      // direct assignment should be fine if it's replacing the *entire* component's AST.
      // If it should replace *children* of the component, the logic within `processNamedSlots` is key.
      parentNode.children[nodeIndex] = resolvedAST;
    }
  });

//delete this.ast[childComponentKey+'_customAST'];

}


// You might not need a Walker utility for just deep cloning, structuredClone is usually sufficient
// if your environment supports it (Node.js 17+ or modern browsers).
// If not, you'd need a custom deep clone function or a library like 'lodash.clonedeep'.
// For this example, we'll stick with structuredClone.

/**
 * Recursively processes the child component's AST, replacing <slot> elements
 * with content provided by the parent component based on slot names.
 *
 * @param {Object.<string, Array<Object>>} projectedSlots - An object where keys are slot names
 * and values are arrays of AST nodes (the content projected into that slot from the parent).
 * Example: { "header": [ { type: 'Element', name: 'h1', ... } ], "mypara": [...], ... }
 * @param {Object} childAST - The AST of the child component that contains <slot> elements.
 * @returns {Object} A new AST representing the child component with slots filled.
 */

processNamedSlots(projectedSlots, childAST) {
    // Deep clone the child AST to avoid mutating the original component definition.
    // structuredClone is efficient but ensure your environment supports it.
    // For older environments, you might need a custom deepClone function.
    const deepClone = (obj) => JSON.parse(JSON.stringify(obj)); // Simpler, but has limitations (e.g., skips functions, undefined)
    // const deepClone = (obj) => structuredClone(obj); // Preferred for modern Node/browser environments
    const childAstClone = deepClone(childAST); // The AST of the component instance

    /**
     * Recursive function to traverse the AST, identify <slot> nodes,
     * and replace them with the corresponding projected content.
     *
     * @param {Object|Array} node - The current node or array of nodes being traversed.
     * @param {Object} parent - The parent of the current node (used for replacement).
     * @param {string|number} key - The key/index in the parent that points to the current node.
     */
    const traverseAndReplaceSlots = (node, parent, key) => {
        if (!node || typeof node !== 'object') {
            return; // Skip invalid or primitive nodes
        }

        // --- Core logic: Identify and replace <slot> elements ---
        if (
            node.type === 'Element' &&
            node.name === 'slot'
        ) {
            let slotName = 'default'; // Assume default slot if no 'name' attribute found

            // Find the 'name' attribute if it exists
            const nameAttribute = node.attributes?.find((attr) => attr.name === 'name');
            if (nameAttribute) {
                // Ensure the value is a text node and extract its data
                if (Array.isArray(nameAttribute.value) && nameAttribute.value.length > 0 && nameAttribute.value[0]?.type === 'Text') {
                    slotName = nameAttribute.value[0].data;
                }
            }

            // Check if content for this slot name was projected by the parent
            if (projectedSlots[slotName] !== undefined) {
                // Get the projected content for this slot
                const contentToProject = projectedSlots[slotName];

                // Process the projected content:
                // 1. Deep clone each projected node to ensure unique instances.
                // 2. Remove the `slot` attribute from the top-level projected nodes,
                //    as it's only a directive for projection, not part of the rendered HTML.
                const processedContent = contentToProject.map(projNode => {
                    const clonedProjNode = deepClone(projNode); // Deep clone each projected node

                    // If the projected node is an element and has attributes, filter out the 'slot' attribute
                    if (clonedProjNode.type === 'Element' && Array.isArray(clonedProjNode.attributes)) {
                        clonedProjNode.attributes = clonedProjNode.attributes.filter(attr => attr.name !== 'slot');
                    }
                    return clonedProjNode;
                });

                // Replace the <slot> node in the child's AST with the processed projected content.
                // If `parent` is an array (like `node.children`), `parent[key]` is how we replace.
                // If `parent` is an object, `parent[key]` points to the node.
                // If the slot is the only child, we might need to handle this to ensure the array structure is correct.
                if (Array.isArray(parent)) {
                    // Replace the single slot node with an array of projected nodes.
                    // This is crucial: we are replacing ONE slot node with potentially MANY projected nodes.
                    // We need to use `splice` to correctly insert the new nodes and remove the old one.
                    parent.splice(key, 1, ...processedContent);
                } else if (parent && key !== null) {
                    // If the parent isn't an array (e.g., a direct property of an object),
                    // replace the property. This scenario is less common for children arrays.
                    parent[key] = processedContent; // This might make it an array within a property if contentToProject is an array.
                                                   // For HTML, usually children are in arrays.
                }
                return; // Stop processing this branch as the slot has been replaced.
            } else {
                // If no content was projected for this slot, use its default content (if any).
                // The `node.children` of the <slot> element itself IS the default content.
                if (Array.isArray(node.children) && node.children.length > 0) {
                     if (Array.isArray(parent)) {
                        parent.splice(key, 1, ...deepClone(node.children));
                     } else if (parent && key !== null) {
                        parent[key] = deepClone(node.children);
                     }
                } else {
                    // If no projected content and no default content, remove the slot entirely.
                    if (Array.isArray(parent)) {
                        parent.splice(key, 1); // Remove the slot node from the parent's children array
                    } else if (parent && key !== null) {
                        delete parent[key]; // Or set to null/undefined if it's a direct property
                    }
                }
                return; // Slot handled, stop processing this branch.
            }
        }

        // --- Recursive traversal for children and object properties ---
        // Ensure proper handling of `node.children` (for elements) and other object properties.

        // If the current node has children (e.g., an HTML element)
        if (Array.isArray(node.children)) {
            // Iterate in reverse if using splice to avoid index shifting issues.
            // However, since we return after processing a slot, forward iteration is usually fine.
            // If you find issues, switch to `for (let i = node.children.length - 1; i >= 0; i--)`
            // and adjust `index` to `i`.
            for (let i = 0; i < node.children.length; i++) {
                traverseAndReplaceSlots(node.children[i], node.children, i);
            }
        }
        // General object traversal for properties that might hold nodes (e.g., 'content' in a 'HTML' node)
        else if (typeof node === 'object') {
            for (const propKey in node) {
                // Ensure it's an own property to avoid prototype chain issues
                if (Object.hasOwnProperty.call(node, propKey)) {
                    const propValue = node[propKey];
                    // Recurse if the property value is an object or array (and not 'parent' or other circular refs)
                    if (propValue && typeof propValue === 'object' && propKey !== 'parent' && propKey !== 'children') {
                        // Skip `children` as it's handled by the `Array.isArray(node.children)` block
                        traverseAndReplaceSlots(propValue, node, propKey);
                    }
                }
            }
        }
    };

    // Start traversal from the root of the cloned child AST.
    // We pass `childAstClone` as the node, `null` as parent, and `null` as key for the initial call.
    traverseAndReplaceSlots(childAstClone, null, null);

    return childAstClone; // Return the fully resolved AST for the child component
}



/*

    // Step 1: Find the target node in the parent AST (the component instance)
    const targetNode = walk.deepWalker(
      parentComponentAST,
      walk.createMatchLogic("Element", key),
      "Element"
    )[0]?.node;

    if (!targetNode) continue; // Skip if the component instance is not found

    // Step 2: Find all named slots in the child component
    const slotNodes = walk.deepWalker(
      childComponentAstBlock,
      walk.createMatchLogic("Element", "slot"),
      "Element"
    );

    // Process each named slot in the child component
    for (const slotNode of slotNodes) {
      const slotName = slotNode.node.attributes?.find(attr => attr.name === "name")?.value;

      if (!slotName) continue; // Skip if the slot doesn't have a name (default slot)

      // Step 3: Find all parent elements with a matching slot attribute
      const parentSlotElements = walk.deepWalker(
        targetNode,
        walk.createMatchLogic("Element", null, { slot: slotName }),
        "Element"
      );

      // Step 3a: Get fallback content from the child slot
      const slotFallBackChildren = walk.findChildren(slotNode.node);

      // Resolve the content for the named slot
      const contentToSet = parentSlotElements.length > 0
        ? parentSlotElements.map(element => element.node) // Use all matching parent elements
        : slotFallBackChildren?.[0]; // Use fallback content if no parent content is found

      // Step 3c: Replace the child slot with the resolved content
      const slotNodeLocations = new GetNodePositions(childComponentAstBlock, slotNode.node).init();
      const parentNode = slotNodeLocations[0]?.parentNode;
      const targetNodeIndex = slotNodeLocations[0]?.nodeIndex;

      if (parentNode?.children?.[0]?.[targetNodeIndex]) {
        parentNode.children[0][targetNodeIndex] = contentToSet;
      }

      // Step 3b: Remove the `slot` attribute from the parent elements
      parentSlotElements.forEach(element => {
        if (element.node && typeof element.node === "object" && !Array.isArray(element.node)) {
          if (!element.node.attributes) {
            element.node.attributes = [];
          }
          element.node.attributes = element.node.attributes.filter(attr => attr.name !== "slot");
        } else {
          //console.warn("Unexpected node type:", element.node);
        }
      });
    }

    // Step 3d: Replace the component instance in the parent AST with the resolved child AST
    const parentNodeLocations = new GetNodePositions(parentComponentAST, targetNode).init();
    const actualParentNode = parentNodeLocations[0]?.parentNode;
    const actualTargetNodeIndex = parentNodeLocations[0]?.nodeIndex;

    if (actualParentNode?.children?.[0]?.[actualTargetNodeIndex]) {
      actualParentNode.children[0][actualTargetNodeIndex] = childComponentAstBlock;
    }

    // Clean up the resolved child component from the AST registry
    delete this.ast[childComponentKey];
  }

  // Final cleanup and file writing
  this.removeComponentImports();
  this.writeResolvedAstFile();
}

*/




 // Assuming 'path' module is imported for path.basename
// Assuming 'Walker' and 'GetNodePositions' classes are defined and imported





resolveDefaultSlots(filePath) {
    const parentComponentFileName = path.basename(filePath);
    const parentComponentKey = this.isPage
        ? "customAST" // Key for the main page's AST
        : parentComponentFileName.replace(".merged.ast", "").toLowerCase();

    const parentComponentAST = this.ast[parentComponentKey];
    if (!parentComponentAST) {
        console.error(`Parent component AST not found for key: ${parentComponentKey}. Skipping slot resolution.`);
        return;
    }

    const walk = new Walker();

    // Iterate through registered components in reverse (useful for nested components)
    for (const key of Object.keys(this.componentsRegistry).reverse()) {
        const childComponentKey = key.toLowerCase();
        // Get the AST of the component definition (e.g., the template for <Button>)
        const childComponentAstBlock = this.ast[`${childComponentKey}_customAST`] || this.ast[childComponentKey];

        if (!childComponentAstBlock) {
            console.warn(`Child component AST not found for ${key}. Skipping.`);
            continue;
        }

        // --- Find instances of the child component in the parent AST ---
        // This finds all <ComponentName> tags in the parentComponentAST
        let nodeType = "Element";
        let nodeName = key; // The component's tag name (e.g., "Button", "Card")
        let matchLogic = walk.createMatchLogic(nodeType, nodeName);
        let returnType = { path: "name" }; // To get the node itself from deepWalker result

        const componentUsageNodesInParent = walk.deepWalker(
            parentComponentAST,
            nodeType,
            matchLogic,
            returnType
        );

        if (componentUsageNodesInParent.length === 0) {
            //console.log(`No instances of <${key}> found in ${parentComponentFileName}. Skipping slot resolution for this component.`);
            continue; // No component usage found, move to the next component type
        }

        // Process each instance of the component found in the parent AST
        componentUsageNodesInParent.forEach(({ node: targetNode }) => {
            // `targetNode` is the <Button> or <Card> tag in the parent's AST that needs replacement.

            // Safely clone the child AST for modification (localChildAst)
            // Each instance of the component gets its own fresh copy of the template AST.
            let localChildAst;
            try {
                localChildAst = JSON.parse(JSON.stringify(childComponentAstBlock));
            } catch (e) {
                console.error(`Failed to clone AST for ${key}. Skipping this instance:`, e);
                return; // Skip this specific component instance if cloning fails
            }

            // Get the children of the component usage in the parent (this is the content passed to the slot)
            // Example: <Button>Click Me from Parent</Button> -> parentProvidedSlotContent will be [{type: 'TextNode', value: 'Click Me from Parent'}]
            const parentProvidedSlotContent = walk.findChildren(targetNode);
            // console.log(`Parent provided content for <${key}>:`, JSON.stringify(parentProvidedSlotContent, null, 2));


            // --- Find the <slot> node within the cloned localChildAst ---
            // We search for a <slot> tag inside the component's own template (localChildAst)
            const getSlotNodeResult = walk.deepWalker(
                localChildAst, // Search within the CLONED AST to find the slot
                "Element", // nodeType
                walk.createMatchLogic("Element", "slot"), // matchLogic
                { path: "name" } // returnType
            );

            let slotNodeInChildAst = null; // The actual <slot> node found in localChildAst
            let slotFallBackChildren = []; // The default content defined inside the <slot> tag

            if (getSlotNodeResult.length > 0) {
                // Assuming only one slot per component or we only care about the first one
                slotNodeInChildAst = getSlotNodeResult[0].node;
                slotFallBackChildren = walk.findChildren(slotNodeInChildAst);
                // console.log("Slot node found with fallback children:", JSON.stringify(slotFallBackChildren, null, 2));
            } else {
                console.log(`No <slot> node found in component template <${key}>. Parent content will be ignored for this instance.`);
                // If no slot, there's nothing to resolve within localChildAst for this component instance.
                // We proceed directly to replacing the component in the parent AST with the unmodified localChildAst.
            }

            // --- Determine the final content for the slot and replace it in localChildAst ---
            let resolvedSlotContent;
            if (parentProvidedSlotContent && parentProvidedSlotContent.length > 0) {
                resolvedSlotContent = parentProvidedSlotContent; // Use content from parent
                //console.log("WHY",resolvedSlotContent);

            } else if (slotFallBackChildren && slotFallBackChildren.length > 0) {
                resolvedSlotContent = slotFallBackChildren; // Use fallback content
            } else {
                resolvedSlotContent = []; // Slot resolves to empty if no content or fallback
            }

            //console.log("WHY 2",resolvedSlotContent);


            // Only attempt to replace the slot if a slotNode was actually found
            if (slotNodeInChildAst) {
                // Get the parent and index of the slotNodeInChildAst within the localChildAst
                const slotNodeLocations = new GetNodePositions(localChildAst, slotNodeInChildAst).init();

                if (slotNodeLocations.length > 0) {
                    const slotParentNode = slotNodeLocations[0].parentNode;
                    const slotTargetNodeIndex = slotNodeLocations[0].nodeIndex;

                    // Use the helper to replace the <slot> node with the determined content
                    const replacedSlot = this.replaceNodeInFlatChildren(
                        slotParentNode,
                        slotTargetNodeIndex,
                        resolvedSlotContent // This can be a single node or an array of nodes
                    );

                    if (!replacedSlot) {
                         console.error(`Failed to replace slot in localChildAst for component <${key}>. Skipping this instance's slot resolution.`);
                         return; // Skip this instance if slot replacement failed
                    }
                    //console.log(`Slot in <${key}> component template resolved. localChildAst now:`, JSON.stringify(localChildAst, null, 2));
                } else {
                    console.warn(`Could not find the slotNodeInChildAst in localChildAst for replacement (despite deepWalker initially finding it). Skipping slot resolution for this instance of <${key}>.`);
                }
            }


            // --- Replace the component call (targetNode) in parentComponentAST ---
            // At this point, `localChildAst` contains the component's template with its slot resolved.
            // We need to replace the original <ComponentName> tag in the parent with the content of `localChildAst`.

            const parentNodeLocations = new GetNodePositions(parentComponentAST, targetNode).init();

            if (parentNodeLocations.length > 0) {
                const actualParentNode = parentNodeLocations[0].parentNode; // The parent of the <ComponentName> tag in parentComponentAST
                const actualTargetNodeIndex = parentNodeLocations[0].nodeIndex; // The index of the <ComponentName> tag

                // What node(s) should replace the component tag?
                // This depends on the top-level structure of your `localChildAst` after slot resolution.
                let componentContentToInsert;

                // IMPORTANT: This logic needs to align with how your AST represents
                // the root of a component's template.
                // Based on your latest example of `parentNode.children` being a flat array
                // and the assumption that `localChildAst` will ultimately represent
                // the component's actual rendered content (which might be wrapped).

                // If `localChildAst` itself IS the single root element of the component (e.g., the `<h1>` or `<div>` node)
                // then we just insert `localChildAst` directly.
                // OR
                // If `localChildAst` is a root object of the entire file (like 'customSyntax' in your example),
                // and its actual component content is typically found under its `children` property.
                // We need to be careful with `localChildAst.children[0]` vs `localChildAst.children`.

                // Let's assume `localChildAst` can contain its content directly in a `children` array,
                // and if it's a "wrapper" like `customSyntax`, we want to extract its direct children.
                if (localChildAst.children && Array.isArray(localChildAst.children) && localChildAst.children.length > 0) {
                    // If localChildAst itself has children, it's likely a container node (like 'customSyntax' or a fragment).
                    // We want to insert its children into the parent AST.
                    componentContentToInsert = localChildAst.children;
                } else {
                    // If localChildAst has no 'children' property, then `localChildAst` itself is the node to insert.
                    // This covers cases where `localChildAst` is already the direct element (e.g., the resolved <button> node)
                    componentContentToInsert = localChildAst;
                }


                // Use the helper to replace the component call node with the resolved component's content
                const replacedComponent = this.replaceNodeInFlatChildren(
                    actualParentNode,
                    actualTargetNodeIndex,
                    componentContentToInsert // This can be a single node or an array of nodes
                );

                if (!replacedComponent) {
                    console.error(`Failed to replace component <${key}> in parentComponentAST.`);
                } else {
                    //console.log(`Component <${key}> replaced in parentComponentAST. Parent AST now:`, JSON.stringify(parentComponentAST, null, 2));
                }
            } else {
                console.warn(`Could not find targetNode <${key}> in parentComponentAST for replacement (despite deepWalker finding it).`);
            }
        });

        // After processing all instances of a component type, you can delete its AST
        // from `this.ast` if it's no longer needed to save memory.
        // Ensure no other part of your system relies on this AST anymore.
        //console.log("childComponentKey",childComponentKey);
        //delete this.ast[childComponentKey+'_customAST'];
    }
    // The parentComponentAST has now been modified in place.
    // If you need to return it, you might add a return statement here.
}










// --- Helper Function: Define this at the top of your file, outside any class ---
replaceNodeInFlatChildren(parent, indexToReplace, newNodes) {
    if (!parent || !parent.children || !Array.isArray(parent.children)) {
        console.warn("Cannot replace node: parent or parent.children is not a valid array.", parent);
        return false;
    }

    // Ensure indexToReplace is valid for the current children array
    if (typeof indexToReplace !== 'number' || indexToReplace < 0 || indexToReplace >= parent.children.length) {
        console.warn(`Invalid indexToReplace (${indexToReplace}) for replacement in parent.children. Length: ${parent.children.length}`, parent);
        return false;
    }

    // Ensure newNodes is always an array for splice, even if it's a single node or null/undefined
    const nodesToInsert = Array.isArray(newNodes) ? newNodes : (newNodes ? [newNodes] : []);

    // Use splice to remove the old node and insert the new ones
    // splice(startIndex, deleteCount, item1, item2, ...)
    parent.children.splice(indexToReplace, 1, ...nodesToInsert);
    return true;
}


  writeResolvedAstFile(parentComponentKey) {
    if (!this.ast || !this.filePath) throw new Error("AST data or filePath is missing");
    const resolvedFilePath = this.filePath.replace(/merged/, "resolved");
    const resolvedDir = path.dirname(resolvedFilePath);
    if (!fs.existsSync(resolvedDir)) fs.mkdirSync(resolvedDir, { recursive: true });

    //console.log("HERE JS",JSON.stringify(this.ast['jsAST'],null,2));

    fs.writeFileSync(resolvedFilePath, JSON.stringify(this.ast, null, 2), "utf8");
  }

/*
  removeComponentImports() {
    for (const componentName in this.componentsRegistry) {
      walk(this.ast["jsAST"], {
        enter: (node, parent) => {
          if (node.type === "ImportDeclaration") {
            node.specifiers.forEach((specifier) => {
              if (
                specifier.type === "ImportDefaultSpecifier" &&
                specifier.local.name === componentName
              ) {
                if (parent && Array.isArray(parent.body)) {
                  parent.body = parent.body.filter((n) => n !== node);
                }
                return false;
              }
            });
          }
        },
      });
    }
  }

*/

removeComponentImports() {
    for (const componentName in this.componentsRegistry) {
      walk(this.ast["jsAST"], {
        enter: (node, parent) => {
          if (node.type === "ImportDeclaration") {
            node.specifiers.forEach((specifier) => {
              if (
                specifier.type === "ImportDefaultSpecifier" &&
                specifier.local.name === componentName
              ) {


                if (parent && Array.isArray(parent.body)) {
                  parent.body = parent.body.filter((n) => n !== node);

                }


                return false;
              }
            });
          }
        },
      });
    }


  }


}

// Helper function: Recursively find all `.merged.ast` files
function findMergedAstFiles(dir) {
    const targetFileName = '@page.merged.ast';
    let files = [];
    
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            files = files.concat(findMergedAstFiles(fullPath)); // Recursive call for subdirectories
        } else if (file ===  targetFileName) {
            files.push(fullPath);
        }
    });
    
    return files;
}

// Loop through given directory - get all `.merged.ast` files and process them with SlotResolver
export async function processMergedFiles(destDir) {
    const files = findMergedAstFiles(destDir);

    for (const filePath of files) {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');

            // Add this check
            if (!fileContent || fileContent.trim() === '') {
                console.warn(`Warning: File ${filePath} is empty or contains only whitespace. Skipping.`);
                continue; // Skip to the next file
            }

            const ast = JSON.parse(fileContent);

            // Resolve AST
            const resolvedAst = new SlotResolver(ast, filePath);

        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
        }
    }
}
