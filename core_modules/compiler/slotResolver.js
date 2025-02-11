"use strict";
import fs from 'fs';
import path from 'path';

import { walk } from 'estree-walker';
import { traverse } from 'estraverse';

class SlotResolver {
  constructor(ast, filePath) {
    this.filePath = filePath;
    this.ast = ast; // The merged AST from either +page.merged.ast or Component.merged.ast
    this.componentName='';
    // Extract component name dynamically (e.g., "Card" from "Card.merged.ast")
    const fileName = path.basename(filePath, '.merged.ast');
    const isPage = fileName.startsWith('+page');
    if (!isPage) {
      this.componentName=fileName; 
    }

    // Determine the appropriate AST keys
    this.jsASTKey = isPage ? 'jsAST' : `jsAST_${fileName}`;
    this.cssASTKey = isPage ? 'cssAST' : `cssAST_${fileName}`;

    // Safely retrieve JS and CSS AST
    this.jsAST = ast[this.jsASTKey] || { type: 'JavaScript', content: { body: [] } };
    this.cssAST = ast[this.cssASTKey] || { type: 'CSS', content: {} };

    // Pages also have customAST
    this.customAST = isPage ? (ast.customAST || { type: 'Custom', content: [] }) : null;

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


    const parentComponentFileName = path.basename(filePath); // Extract filename
    let parentComponentKey;

    // Determine if it's a page or a component
    if (parentComponentFileName.startsWith("+page")) {
        parentComponentKey = "customAST"; // Pages use 'customAST'
    } else {
        parentComponentKey = parentComponentFileName.replace('.merged.ast', '').toLowerCase(); // Components use lowercase name
    }


    const parentComponentAST = ast[parentComponentKey].content[0];
    //console.log(parentComponentKey, JSON.stringify(parentComponentAST,null,2));


    //console.log("PARENT",JSON.stringify(parentComponentAST,null,2));
// now push this parent ast to the parent children registry 

// Get the keys of the importedComponents object
const reversedComponentNames = Object.keys(this.importedComponents).reverse();

// Loop through the reversed array
for (const componentName of reversedComponentNames) {
    // Access the componentPath correctly using bracket notation
    const componentPath = this.importedComponents[componentName];
    
    // Log the component name and path (optional)
    //console.log(`Component: ${componentName}, Path: ${componentPath}`);
    
    // Convert component name to lowercase
    const childComponentName = componentName.toLowerCase();
    
    // Access the AST for the child component
    //console.log("SEEEEE",filePath,childComponentName, JSON.stringify(ast,null,2));
    const fileName = path.basename(filePath);
    const resourceName = fileName.split('.')[0];
    let childComponentAST; 

    if (resourceName === '+page') {
    childComponentAST = ast.customAST.content[0].children[0].children[0][0][childComponentName].content[0];
    } else {
      //console.log(fileName, childComponentName, JSON.stringify(ast,null,2));
      console.log(this.importedComponents);
    childComponentAST = ast[childComponentName].content[0];
    }



    //console.log("CHILD",JSON.stringify(childComponentAST,null,2));

    // Example usage
    //console.log(componentName, JSON.stringify(parentComponentAST,null,2));
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


deepWalker(ast, nodeKey, nodeKeyValue) {
  // Helper function to recursively traverse the AST
  function walk(node, callback) {
    // Call the callback on the current node
    callback(node);

    // Recursively traverse all properties of the node
    for (const key in node) {
      if (node.hasOwnProperty(key)) {
        const value = node[key];

        // If the value is an object or array, recursively walk it
        if (typeof value === "object" && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              if (typeof item === "object" && item !== null) {
                walk(item, callback);
              }
            });
          } else {
            walk(value, callback);
          }
        }
      }
    }
  }

  // Variable to store the found node
  let foundNode = null;

  // Start walking the AST
  walk(ast, (node) => {
    // Check if the current node has the specified key-value pair
    if (node[nodeKey] === nodeKeyValue) {
      foundNode = node;
    }
  });

  // Return the found node (or null if not found)
  return foundNode;
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



removeDefaultImport(importedComponentName) {
  // Determine the jsAST key based on the componentName
  let jsASTKey;
  if (this.componentName === '') {
    jsASTKey = "jsAST";
  } else {
    jsASTKey = "jsAST_" + this.componentName;
  }


  // Retrieve the js AST object for the given key
  const ast = this.ast[jsASTKey];
  //console.log("CHECK", ast);

  // Check if the provided AST is valid
  if (!ast || !ast.content || !ast.content.body) {
    throw new Error('Invalid AST provided');
  }

  // Define a recursive function to traverse the AST
  function traverse(node,importedComponentName) {
    //console.log("THERE --", importedComponentName);
    // Check if the current node is an import declaration statement
    if (node.type === 'ImportDeclaration') {
      // Check if the import declaration statement is for the specified component
      if (node.specifiers.some(specifier => specifier.local.name === importedComponentName)) {
        // Remove the import declaration statement
        return null;
      }
    }

    // Recursively traverse child nodes
    if (node.body) {
      node.body = node.body.filter(child => traverse(child,importedComponentName));
    }

    // Return the traversed node
    return node;
  }

  // Traverse the AST and remove import declaration statements for the specified component
  ast.content.body = ast.content.body.filter(node => traverse(node, importedComponentName));

  // Return the modified AST
  //console.log(JSON.stringify(ast,null,2));
  return ast;
}




  // Main method to resolve default slots
  resolveDefaultSlots(parentAst, childAst, componentName) {
    // Step 1: Dynamically find componentName in the parent AST
    //console.log("LAPHA",componentName);
    let parentSlotNode = this.findTargetNode(parentAst, componentName);
    //console.log("HERE",componentName, JSON.stringify(parentAst,null,2));
    console.log("parentSlotNode",JSON.stringify(parentSlotNode,null,2));

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
     
      // remove the import statement form the imported component that has been resolved from the parent component js ast
      this.removeDefaultImport(componentName)

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





