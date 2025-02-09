"use strict";
import fs from 'fs';
import path from 'path';

import { walk } from 'estree-walker';

class SlotResolver {
  constructor(ast, filePath) {
    this.filePath = filePath;
    this.ast = ast; // The merged AST from +page.merged.ast
    this.jsAST = ast.jsAST || { type: 'JavaScript', content: { body: [] } }; // Initialize JS AST
    this.cssAST = ast.cssAST || { type: 'CSS', content: {} }; // Initialize CSS AST
    this.customAST = ast.customAST || { type: 'Custom', content: [] }; // Initialize custom AST
    this.importedComponents = {}; // Registry for imported components
    this.childrenSlotsRegistry = {};
    this.buildComponentRegistry(); // Build the component registry
    this.resolvedAst = this.resolveSlots(ast, filePath);
  }

  // Helper function to safely get JS content
  getJSContent() {
    return this.jsAST.content.body || [];
  }

  // Build the component registry by extracting imports from the jsAST
  buildComponentRegistry() {
    const jsContent = this.getJSContent();

    // Use estree-walker to traverse the jsAST
    walk(jsContent, {
      enter: (node) => {
        if (node.type === 'ImportDeclaration' && node.source.value.includes('$components')) {
          // Extract the component name and source path
          const componentName = node.specifiers[0].local.name; // e.g., "Header"
          const componentPath = node.source.value; // e.g., "$components/Header.smq"

          // Add the component to the registry
          this.importedComponents[componentName] = componentPath;
        }
      },
    });

    //console.log('Component Registry:', this.importedComponents);
  }


  resolveSlots(ast, filePath) {


    const parentComponentFileName = path.basename(filePath);
    const parentComponentKey = parentComponentFileName.replace('.merged.ast','').toLowerCase();
    const parentComponentAST = ast[parentComponentKey].content[0];
    //console.log("PARENT",JSON.stringify(parentComponentAST,null,2));
// now push this parent ast to the parent children registry 


// now get all children asts  
  for (const componentName in this.importedComponents) {
    // Access the componentPath correctly using bracket notation
    const componentPath = this.importedComponents[componentName];
    //console.log(`Component: ${componentName}, Path: ${componentPath}`);
    const childComponentName=componentName.toLowerCase();
    const childComponentAST = ast[childComponentName].content[0];


    //console.log("CHILD",JSON.stringify(childComponentAST,null,2));

    // Example usage
const mergedAst = this.resolveDefaultSlots(parentComponentAST, childComponentAST, componentName);
 //console.log("SEE",JSON.stringify(ast.card.content[0],null,2));
//return this.resolvedAst;

//console.log("kunjani", JSON.stringify(ast, null,2));
const resolvedFilePath = filePath.replace('.merged.', '.resolved.');
fs.writeFileSync(resolvedFilePath, JSON.stringify(ast, null, 2), 'utf-8');




//const finalHTML = this.astToHtml(mergedAst);
//console.log(finalHTML);
//console.log("resolved slots",JSON.stringify(mergedHTML,null,2));
   
  }
}


  // Method to recursively find elements in any AST structure by element name
 findTargetNode(ast, targetElementName) {
  let foundTargetElements = [];

  function traverse(node) {
    if (!node) return;

    if (node.type === "Element" && node.name === targetElementName) {
      foundTargetElements.push(node);
    }

    if (node.children) {
      if (Array.isArray(node.children)) {
        node.children.forEach(child => {
          if (Array.isArray(child)) {
            child.forEach(subChild => traverse(subChild));
          } else {
            traverse(child);
          }
        });
      } else {
        traverse(node.children);
      }
    }
  }

  traverse(ast.html);

  return foundTargetElements;
}



// Method to recursively replace nodes in any AST structure
replaceNode(ast, targetNodeName, replacementNode) {
  function traverse(node) {
    if (!node) return;

    // Check if the current node matches the target node
    if (node.type === "Element" && node.name === targetNodeName) {
      // Replace the entire target node with the replacement node
      Object.assign(node, replacementNode);
      return; // Stop further traversal for this branch
    }

    // Traverse the children of the current node
    if (node.children) {
      if (Array.isArray(node.children)) {
        node.children.forEach((child, index) => {
          if (Array.isArray(child)) {
            // Handle nested arrays (e.g., [[child1, child2], [child3]])
            child.forEach((subChild, subIndex) => {
              if (subChild.type === "Element" && subChild.name === targetNodeName) {
                // Replace the target node with the replacement node
                child[subIndex] = replacementNode;
              } else {
                traverse(subChild);
              }
            });
          } else {
            // Handle non-nested children
            if (child.type === "Element" && child.name === targetNodeName) {
              // Replace the target node with the replacement node
              node.children[index] = replacementNode;
            } else {
              traverse(child);
            }
          }
        });
      } else {
        // Handle non-array children
        traverse(node.children);
      }
    }
  }

  // Start traversal from the root of the AST
  traverse(ast.html);
  return ast;
}




  // Main method to resolve default slots
  resolveDefaultSlots(parentAst, childAst, componentName) {
    // Step 1: Dynamically find componentName in the parent AST
    let parentSlotNode = this.findTargetNode(parentAst, componentName);
    parentSlotNode = parentSlotNode[0].children[0][0]; 
    //console.log("PARENT NODE",JSON.stringify(parentSlotNode[0].children[0][0],null,2));

    const childSlotNode = this.findTargetNode(childAst, "slot");
    //console.log(JSON.stringify(childSlotNode,null,2));
    //console.log("CHILD",JSON.stringify(childAst,null,2));

    // so let's replace the slot node in the child ast with the 
    const targetNodeName = "slot";
    const updateChildAst=this.replaceNode(childAst, targetNodeName, parentSlotNode);

        //console.log("UPDATE CHILD",JSON.stringify(childAst,null,2));


    const resolvedChildNode = childAst.html.children.find(child => child.name === 'customSyntax').children[0][0];

    //console.log("target node child",JSON.stringify(resolvedChildNode,null,2));
        const updatedParentAst=this.replaceNode(parentAst, componentName, resolvedChildNode);      
       const componentAstKey = componentName.toLowerCase();
      delete this.ast[componentAstKey];

   //console.log("resolved parent",JSON.stringify(updatedParentAst,null,2));
   return updatedParentAst; 
    
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
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(findMergedAstFiles(fullPath)); // Recursive call for subdirectories
    } else if (file.endsWith('.merged.ast')) {
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





