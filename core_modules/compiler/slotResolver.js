"use strict";
import fs from 'fs';
import path from 'path';

import { walk } from 'estree-walker';
import { traverse } from 'estraverse';

import GetNodePositions from './utils/getNodePositions.js';
import elementWalker from './utils/elementWalker.js';
import Walker from './utils/deepWalker.js'; 


class SlotResolver {
  constructor(ast, filePath) {
    this.filePath = filePath;
    this.ast = ast; // The merged AST from either +page.merged.ast or Component.merged.ast
    this.componentName='';
    // Extract component name dynamically (e.g., "Card" from "Card.merged.ast")
    const fileName = path.basename(filePath, '.merged.ast');
    this.isPage = false; 
    this.isComponent = false; 

    if (fileName.startsWith('+page')) {
      this.isPage=true; 

    }

    if (!this.isPage) {
      this.componentName=fileName; 
    }

    // Determine the appropriate AST keys
    this.jsASTKey = this.isPage ? 'jsAST' : `jsAST_${fileName}`;
    this.cssASTKey = this.isPage ? 'cssAST' : `cssAST_${fileName}`;
    this.htmlKey = this.isPage ? 'customAST' : `${this.componentName.toLowerCase()}`;

    // Safely retrieve JS and CSS AST
    this.jsAST = ast[this.jsASTKey] || { type: 'JavaScript', content: { body: [] } };
    this.cssAST = ast[this.cssASTKey] || { type: 'CSS', content: {} };

    // Pages also have customAST
    this.customAST = this.ast[this.htmlKey] || { type: 'Custom', content: [] };

    this.componentsRegistry = {}; // Registry for imported components
    this.childrenSlotsRegistry = {};

    this.buildComponentRegistry(); // Build the component registry
    this.resolvedAst = this.resolveDefaultSlots(this.filePath);
  }


  // Helper function to safely get JS content
  getJSContent() {
    return this.jsAST.content.body || [];
  }

  // Build the component registry by extracting imports from the jsAST
buildComponentRegistry() {
    const jsContent = this.getJSContent();

    walk(jsContent, {
        enter: ({ type, source, specifiers }) => {
            if (type === 'ImportDeclaration' && source.value.includes('$components')) {
                const componentName = specifiers[0].local.name; // e.g., "Header"
                const componentPath = source.value; // e.g., "$components/Header.smq"

                // Ensure the component is used in the HTML AST before adding it
                if (elementWalker(this.customAST, 'name', componentName)) {
                    this.componentsRegistry[componentName] = componentPath;
                }
            }
        },
    });

    //console.log(this.componentsRegistry);
}




 resolveDefaultSlots(filePath) {
    // Extract filename (e.g., Card.merged.ast or +page.merged.ast)
    const parentComponentFileName = path.basename(filePath);
    const parentComponentKey = this.isPage
        ? "customAST" // Pages use 'customAST'
        : parentComponentFileName.replace('.merged.ast', '').toLowerCase(); // Components use lowercase name (e.g., 'card')

    const parentComponentAST = this.ast[parentComponentKey];
    const walk = new Walker();

    // Loop through components in reverse for proper slot resolution in nested components
    for (const key of Object.keys(this.componentsRegistry).reverse()) {
        const childComponentName = key;
        const childComponentKey = key.toLowerCase();

        if (this.isPage) {
            // PAGE SCOPE
            const childComponentAstBlock = this.ast[childComponentKey];

            // Locate the target node (child component in parent AST)
            const targetNode = walk.deepWalker(
                parentComponentAST,
                walk.createMatchLogic('Element', childComponentName),
                'Element'
            )[0].node;

            const targetNodeChildren = walk.findChildren(targetNode);

            // Locate the slot node inside the child component AST
            const slotNode = this.ast[childComponentKey];
            const slotFallBackChildren = walk.findChildren(slotNode);

            // Determine content to set: use targetNodeChildren if available, otherwise fallback
            const contentToSet = (targetNodeChildren?.[0]?.length > 1)
                ? targetNodeChildren[0][0]
                : slotFallBackChildren?.[0]?.[0];

            // Update parent AST with modified child component AST
            const parentNodeLocations = new GetNodePositions(parentComponentAST, targetNode).init();
            const cparentNode = parentNodeLocations[0].parentNode;
            const ctargetNodeIndex = parentNodeLocations[0].nodeIndex;

            if (cparentNode?.children?.[0]?.[ctargetNodeIndex]) {
                cparentNode.children[0][ctargetNodeIndex] = childComponentAstBlock;
            }
        } else {
            // COMPONENT SCOPE
            const childComponentAstBlock = this.ast[childComponentKey];

            // Locate the target node (child component in parent AST)
            const targetNode = walk.deepWalker(
                parentComponentAST,
                walk.createMatchLogic('Element', childComponentName),
                'Element'
            )[0].node;

            const targetNodeChildren = walk.findChildren(targetNode);

            // Locate the slot node inside the child component AST
            const slotNode = walk.deepWalker(
                childComponentAstBlock,
                walk.createMatchLogic('Element', 'slot'),
                'Element'
            )[0].node;

            const slotFallBackChildren = walk.findChildren(slotNode);

            // Determine content to set: use targetNodeChildren if available, otherwise fallback
            const contentToSet = (targetNodeChildren?.[0]?.length > 1)
                ? targetNodeChildren[0][0]
                : slotFallBackChildren?.[0]?.[0];

            // Find slot node positions in child component AST
            const slotNodeLocations = new GetNodePositions(childComponentAstBlock, slotNode).init();
            const parentNode = slotNodeLocations[0].parentNode;
            const targetNodeIndex = slotNodeLocations[0].nodeIndex;

            // Replace slot node in child AST with content
            if (parentNode?.children?.[0]?.[targetNodeIndex]) {
                parentNode.children[0][targetNodeIndex] = contentToSet;
            }

            // Update parent AST with modified child component AST
            const parentNodeLocations = new GetNodePositions(parentComponentAST, targetNode).init();
            const cparentNode = parentNodeLocations[0].parentNode;
            const ctargetNodeIndex = parentNodeLocations[0].nodeIndex;

            if (cparentNode?.children?.[0]?.[ctargetNodeIndex]) {
                cparentNode.children[0][ctargetNodeIndex] = childComponentAstBlock;
            }
        }

        // Clean up
        delete this.ast[childComponentKey];
    }

    // Write the resolved AST to a file
    this.writeResolvedAstFile();
}


writeResolvedAstFile() {
    if (!this.ast || !this.filePath) throw new Error("AST data or filePath is missing");
    const resolvedFilePath = this.filePath.replace(/merged/, "resolved"), resolvedDir = path.dirname(resolvedFilePath);
    if (!fs.existsSync(resolvedDir)) fs.mkdirSync(resolvedDir, { recursive: true });
    fs.writeFileSync(resolvedFilePath, JSON.stringify(this.ast, null, 2), "utf8");
    console.log(`Resolved AST file saved at: ${resolvedFilePath}`);
}






 astToHtml(ast) {
  // Helper function to recursively traverse nodes
  function traverse(node) {
    if (!node) return '';

    let html = '';

    if (node.type === 'Element') {
      // Open the element
      html += `<${node.name}`;

      // Handle attributes, if any
      if (node.attributes) {
        node.attributes.forEach(attribute => {
          const attributeValue = Array.isArray(attribute.value) ? attribute.value[0].data : attribute.value;
          html += ` ${attribute.name}="${attributeValue}"`;
        });
      }

      html += '>';

      // Handle children
      if (node.children) {
        if (Array.isArray(node.children)) {
          // Traverse each child node; children can be nested arrays
          node.children.forEach(child => {
            if (Array.isArray(child)) {
              // If the child is an array, recursively traverse each element
              child.forEach(subChild => {
                html += traverse(subChild);
              });
            } else {
              html += traverse(child);
            }
          });
        } else {
          // If the children are not an array, handle them as a single child
          html += traverse(node.children);
        }
      }

      // Close the element
      html += `</${node.name}>`;
    } else if (node.type === 'Text') {
      // Handle text nodes
      html += node.raw;
    }

    return html;
  }

  // Start traversing from the root of the AST (HTML root node)
  return traverse(ast.html.children[0]);
}


/// class wrapper

}






// Helper function: Recursively find all `.merged.ast` files
function findMergedAstFiles(dir) {
  let targetFileExtension;
  const directoryScope = dir.split('/').pop(); 
  //console.log("DRRRRRRRRRR", directoryScope);
  if (directoryScope === 'components') {
    targetFileExtension = '.merged.ast'; //
   } else {
   targetFileExtension = '.merged.ast';

   }

  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(findMergedAstFiles(fullPath)); // Recursive call for subdirectories
    } else if (file.endsWith(targetFileExtension)) {
      files.push(fullPath);
    }
  });
  return files;
}

// Loop through given directory - get all `.merged.ast` files and process them with SlotResolver
export async function processMergedFiles(destDir) {
  const files = findMergedAstFiles(destDir);
  //console.log("Filessssssssssss", files);

  for (const filePath of files) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const ast = JSON.parse(fileContent);
      //console.log("Unresolved AST", JSON.stringify(ast, null, 2));

      // Only store the resolved AST, not the entire class instance
      const resolvedAst = new SlotResolver(ast, filePath);
      //const resolvedAst = resolver.getResolvedAst(); 

      //console.log(`Resolved AST: ${JSON.stringify(resolvedAst, null, 2)}`);

      //const resolvedFilePath = filePath.replace('.merged.', '.resolved.');
      //fs.writeFileSync(resolvedFilePath, JSON.stringify(resolvedAst, null, 2), 'utf-8');

    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
    }
  }
}





