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
    this.ast = ast; // The merged AST from either @layout.merged.ast or Component.merged.ast
    //console.log(filePath, JSON.stringify(this.ast.customAST,null,2));
    this.componentName='';
    // Extract component name dynamically (e.g., "Card" from "Card.merged.ast")
    const fileName = path.basename(filePath, '.merged.ast');
    this.isLayout = false; 
    this.isComponent = false; 

    if (fileName.startsWith('@layout')) {
      this.isLayout=true; 

    }

    if (!this.isLayout) {
      this.componentName=fileName; 

    }


    // Determine the appropriate AST keys
    this.jsASTKey = "jsAST";//
    this.cssASTKey = "cssAST"; 
    this.htmlKey = this.isLayout ? 'customAST' : `${this.componentName.toLowerCase()}`;

    // Safely retrieve JS and CSS AST
    this.jsAST = ast[this.jsASTKey] || { type: 'JavaScript', content: { body: [] } };
    this.cssAST = ast[this.cssASTKey] || { type: 'CSS', content: {} };
    // Pages also have customAST
    this.customAST = this.ast[this.htmlKey] || { type: 'Custom', content: [] };
        //console.log("customAST",this.customAST);

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
            if (type === 'ImportDeclaration' && source.value.includes('$')) {

              //console.log(source);
                const componentName = specifiers[0].local.name; // e.g., "Header"
                let componentPath = source.value; // e.g., "$components/Header.smq"
                if(componentPath.includes('$global')) {
                  componentPath = componentPath.replace('$global', '$components/global')
                }

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
    // Extract filename (e.g., Card.merged.ast or @layout.merged.ast)
    const parentComponentFileName = path.basename(filePath);
    const parentComponentKey = this.isLayout
        ? "customAST" // Pages use 'customAST'
        : parentComponentFileName.replace('.merged.ast', '').toLowerCase(); // Components use lowercase name (e.g., 'card')

    const parentComponentAST = this.ast[parentComponentKey];
    const walk = new Walker();

    // Loop through components in reverse for proper slot resolution in nested components
    for (const key of Object.keys(this.componentsRegistry).reverse()) {
        const childComponentName = key;
        const childComponentKey = key.toLowerCase();

        if (this.isLayout) {
            // PAGE SCOPE
          //console.log("HERE",this.isLayout);
            const childComponentAstBlock = this.ast[childComponentKey];

            // Locate the target node (child component in parent AST)
            const targetNode = walk.deepWalker(
                parentComponentAST,
                walk.createMatchLogic('Element', childComponentName),
                'Element'
            )[0].node;

            const targetNodeChildren = walk.findChildren(targetNode);

            // Locate the slot node inside the child component AST
            let slotNode;
            const getSlotNode = walk.deepWalker(
                childComponentAstBlock,
                walk.createMatchLogic('Element', 'slot'),
                'Element'
            )[0];

            if (getSlotNode) {
                slotNode = getSlotNode.node;
                const slotFallBackChildren = walk.findChildren(slotNode);

                // Determine content to set: use targetNodeChildren if available, otherwise fallback
                let contentToSet;
                if (targetNodeChildren && targetNodeChildren[0].length > 0) {
                    contentToSet = targetNodeChildren[0][0];
                } else {
                  //console.log("HERE",slotFallBackChildren);

                  if (slotFallBackChildren) {
                    contentToSet = slotFallBackChildren[0][0];
                  }
                }

                //console.log("HERE",contentToSet);


                // Find slot node positions in child component AST
                const slotNodeLocations = new GetNodePositions(childComponentAstBlock, slotNode).init();
                const parentNode = slotNodeLocations[0].parentNode;
                const targetNodeIndex = slotNodeLocations[0].nodeIndex;

                // Replace slot node in child AST with content
                if (parentNode?.children?.[0]?.[targetNodeIndex]) {
                    parentNode.children[0][targetNodeIndex] = contentToSet;
                }
            }

            // Update parent AST with modified child component AST
            const parentNodeLocations = new GetNodePositions(parentComponentAST, targetNode).init();
            const actualParentNode = parentNodeLocations[0].parentNode;
            const actualTargetNodeIndex = parentNodeLocations[0].nodeIndex;

            if (actualParentNode?.children?.[0]?.[actualTargetNodeIndex]) {
                actualParentNode.children[0][actualTargetNodeIndex] = childComponentAstBlock;
            }

            //console.log("resolved ast",JSON.stringify(this.ast,null,2));
        } else {
            // COMPONENT SCOPE
         // console.log("Component SCope");
            const childComponentAstBlock = this.ast[childComponentKey];

            // Locate the target node (child component in parent AST)
            const targetNode = walk.deepWalker(
                parentComponentAST,
                walk.createMatchLogic('Element', childComponentName),
                'Element'
            )[0].node;

            const targetNodeChildren = walk.findChildren(targetNode);

            // Locate the slot node inside the child component AST
            let slotNode;
            const getSlotNode = walk.deepWalker(
                childComponentAstBlock,
                walk.createMatchLogic('Element', 'slot'),
                'Element'
            )[0];

            if (getSlotNode) {
                slotNode = getSlotNode.node;
                const slotFallBackChildren = walk.findChildren(slotNode);

                // Determine content to set: use targetNodeChildren if available, otherwise fallback
                const contentToSet = (targetNodeChildren?.[0]?.length > 0)
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
            }

            // Update parent AST with modified child component AST
            const parentNodeLocations = new GetNodePositions(parentComponentAST, targetNode).init();
            const cparentNode = parentNodeLocations[0].parentNode;
            //console.log("NODE NOT BEING DELETED",cparentNode);
            const ctargetNodeIndex = parentNodeLocations[0].nodeIndex;

            if (cparentNode?.children?.[0]?.[ctargetNodeIndex]) {
                cparentNode.children[0][ctargetNodeIndex] = childComponentAstBlock;
            }

/* HERE WE NEED TO REMOVE the imported component element node in the parent ast */



        }

        // Clean up
        //console.log("deleteKey",childComponentKey);
        delete this.ast[childComponentKey];
    }

    // Write the resolved AST to a file
    this.removedComponentImports();
    this.writeResolvedAstFile();
}









writeResolvedAstFile() {

    if (!this.ast || !this.filePath) throw new Error("AST data or filePath is missing");
    const resolvedFilePath = this.filePath.replace(/merged/, "resolved"), resolvedDir = path.dirname(resolvedFilePath);
    if (!fs.existsSync(resolvedDir)) fs.mkdirSync(resolvedDir, { recursive: true });
    fs.writeFileSync(resolvedFilePath, JSON.stringify(this.ast, null, 2), "utf8");
    //console.log(`Resolved AST file saved at: ${resolvedFilePath}`);
}



removedComponentImports () {
for (const componentName in this.componentsRegistry) {
  //console.log("RE",componentName);

  /// run deep walk to get the node 

  walk(this.ast['jsAST'], {
  enter: (node, parent) => {
    if (node.type === 'ImportDeclaration') {
      node.specifiers.forEach(specifier => {
        if (
          specifier.type === 'ImportDefaultSpecifier' &&
          specifier.local.name === componentName
        ) {
          // Remove the import by filtering it out from the parent's body array
          if (parent && Array.isArray(parent.body)) {
            parent.body = parent.body.filter(n => n !== node);
          }
          // Stop traversing this node
          return false; // This prevents further traversal into this node
        }
      });
    }
  },
});

//console.log("The Node",importNode);
// can we get node positions 



}


}




/*
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
*/

/// class wrapper

}






// Helper function: Recursively find all `.merged.ast` files
function findMergedAstFiles(dir) {
  let targetFileName;
  const directoryScope = dir.split('/').pop(); 
  //console.log("DRRRRRRRRRR", directoryScope);
  if (directoryScope === 'components') {
    targetFileName = '@layout.merged.ast'; //
   } else {
   targetFileName = '@layout.merged.ast';

   }

  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(findMergedAstFiles(fullPath)); // Recursive call for subdirectories
    } else if (file === targetFileName) {
      //console.log("LA", file);
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





