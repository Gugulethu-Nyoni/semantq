"use strict";


import escodegen from 'escodegen';
import { parse } from 'acorn';
import customHtmlParser from '../customHtmlParser.js';
import fs from 'fs-extra';
//import fs from 'fs';
import path from 'path';

import prettier from 'prettier';
import * as estraverse from "estraverse";
import Walker from './deeperWalker.js';
import GetNodePositions from '../utils/GetNodePositions.js';
import Transpiler from './transpiler.js'; 
import ProcessEventHandlers from './processEventHandlers.js';





 class NodeVisitor {
  buildDependencyGraph(reactiveVariable, customSyntaxAST, jsAST) {
    throw new Error('Class must be implemented by a subclass');
  }

  transformAttributeNode(node) {
    throw new Error('Node Transformer must be implemented by a subclass');
  }

  transformTextNode(textNode, parent,customSyntaxAST, jsAST) {
    throw new Error('Class must be implemented by a subclass');
  }

  removeNode(ast, parentNode, key) {
    throw new Error('Class must be implemented by a subclass');
  }

  createJsNode(jsCode) {
    throw new Error('Class must be implemented by a subclass');
  }

  createCssNode(cssCode) {
    throw new Error('Class must be implemented by a subclass');
  }

  createCustomSyntaxNode(customHTML) {
    throw new Error('Class must be implemented by a subclass');
  }
}




class AnyVisitor extends NodeVisitor {

  mustacheIdentifiersObject(customSyntaxAST) {
    const node = customSyntaxAST;
    let identifiersObject = [];

    const targetNode = 'MustacheIdentifier';
    const walk = new Walker();
    const results = walk.traverse(customSyntaxAST, targetNode);
    if (results) {
      results.forEach(result => {
        const identifier = result.targetNode.expression.name.name;
        if (identifier) {
          identifiersObject.push(identifier);
        }
      });
    }



    //const identifierTargetNode = 'MustacheAttribute';
    //const identifierResults = walk.traverse(customSyntaxAST, identifierTargetNode);
    const nodeType='MustacheAttribute';
    const nodeName='value';
    const nodeNameChecker = (node, nodeName) => node.name === nodeName;
    const identifierResults = walk.traverseForTypeAndName(node, nodeType, nodeName, nodeNameChecker); 
      //console.log("HHHHHHHHH", identifierResults);
    if (identifierResults) {
      identifierResults.forEach(result => {
        const mustacheIdentifier = result.targetNode.value.name.name;
        if (mustacheIdentifier) {
          identifiersObject.push(mustacheIdentifier);
        }
      });
    }

    return identifiersObject;
  }



  htmlFunctionCallEventHandlers(customSyntaxAST) {
    let handlersObject = [];
    const targetNode = 'Attribute';//'MustacheAttribute';
    const walk = new Walker();
    const eventHandlers = true;
    const results = walk.traverse(customSyntaxAST, targetNode, eventHandlers);
    if (results) {
      results.forEach(result => {

        //console.log("HERE",result.targetNode.value[0].raw);

       // console.log("HERE", result); return;
        const handler = result.targetNode.value[0].name.name.replace('()','');
        if (handler) {
          handlersObject.push(handler);
        }
      });
    }
    return handlersObject;
  }



  getIdentifiersInFunctions(mustacheIdentifiersObject, handlers, customSyntaxAST, jsAST) {
    let identifiersInFunctions = [];
    const cleanedHandlers = handlers.map(handler => handler.replace('()', ''));
  
    //console.log("Test", JSON.stringify(jsAST,null,2));

    mustacheIdentifiersObject.forEach(identifier => {
      cleanedHandlers.forEach(handler => {
        const walk = new Walker();
        const funcNodeType = 'FunctionDeclaration';
        const funcNodeName = handler; /// incrementer

        const nodeNameChecker = (node, funcNodeName) => node.id.name === funcNodeName;
        const functionExists = walk.traverseForTypeAndName(jsAST, funcNodeType, funcNodeName, nodeNameChecker);

           //console.log("ALL Funcs",functionExists[0].body.body[0]);


        if (functionExists.length > 0) {
          const functionNode = functionExists[0];


          const findIdentifierInBody = (node, identifierName) => {
          if (!node || typeof node !== 'object') return false;

          if (Array.isArray(node)) {
            return node.some(childNode => findIdentifierInBody(childNode, identifierName));
          }

          if (node.type === 'Identifier' && node.name === identifierName) {
            return true;
          }

          const nodeKeys = Object.keys(node);

          return nodeKeys.some(key => {
            if (key === 'id' && node.type === 'FunctionDeclaration') {
              return false; // Skip the 'id' of the function declaration
            }
            return findIdentifierInBody(node[key], identifierName);
          });
        };

        const exists = findIdentifierInBody(functionExists[0].body, identifier); // true
        const nodeName = identifier;

          if (exists) {
            
            //console.log("Found identifier:", nodeName);

            const existingEntry = identifiersInFunctions.find(entry => entry.hasOwnProperty(nodeName));

            if (existingEntry) {
              //console.log("here?1");
              if (!existingEntry[nodeName].includes(handler)) {
                existingEntry[nodeName].push(handler);
              }
            } else {
              //console.log("here? 2");
              identifiersInFunctions.push({
                [nodeName]: [handler],
              });
            }
          }
        }
      });
    });

    //console.log("getIdentifiersInFunctions result:", identifiersInFunctions);
    return identifiersInFunctions;
  }
}



class TransformMustacheIdentifierNodes extends NodeVisitor {
 transformMustacheIdentifierNodes(subRootNodeChildren, ast) {

    for (let i =0; i < subRootNodeChildren.children[0].length; i++) {

  const node=subRootNodeChildren.children[0][i];
  const newLines = '\n\n\n\n';
  const whiteSpaces = ' ';


  if (node.type === 'MustacheIdentifier') {
    // console.log(node);
    //console.log(i); return;

  const originalNodeNameValue = node.expression.name.name;
  const newIdentifierNode =  {
        "start": 0,
        "end": 20,
        "type": "Element",
        "name": "span",
        "attributes": [],
        "children": [
          {
            "start": 6,
            "end": 7,
            "type": "Text",
            "raw": " ",
            "data": " "
          },
          {
            "start": 7,
            "end": 12,
            "type": "MustacheIdentifier",
            "expression": {
              "type": "Identifier",
              "start": 8,
              "end": 11,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 8
                },
                "end": {
                  "line": 1,
                  "column": 11
                }
              },
              "name": originalNodeNameValue
            }
          },
          {
            "start": 12,
            "end": 13,
            "type": "Text",
            "raw": " ",
            "data": " "
          }
        ]
      };



          // Update node
          subRootNodeChildren.children[0][i] = newIdentifierNode;
          //console.log("UPDATED NODE", JSON.stringify(ast,null,2));

  // transform node

    }

  }
  
   

  }


 
}
















function visitMustacheIdentifierNodes(ast) {

  // Function to find the customSyntax node
  const findCustomSyntaxNode = (node) => {
    if (!node) return null;

    if (node.type === 'Element' && node.name === 'customSyntax') {
      return node;
    }

    if (node.children && Array.isArray(node.children)) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const result = findCustomSyntaxNode(child);
        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  // Find the customSyntax node within the AST
  //console.log("HERE",ast.html);
  const customSyntaxNode = findCustomSyntaxNode(ast.html);
  
  //console.log(customSyntaxNode);
  if (!customSyntaxNode) return;

  // Transform text nodes
  const mustacheIdentifierNodesInstance = new TransformMustacheIdentifierNodes();
  //textNodesInstance.transformTextNodes(customSyntaxNode, ast);

  if (typeof mustacheIdentifierNodesInstance.transformMustacheIdentifierNodes === 'function') {
    mustacheIdentifierNodesInstance.transformMustacheIdentifierNodes(customSyntaxNode, ast);
  } else {
    console.error("transformMustacheIdentifierNodes method is not defined in TransformMustacheIdentifierNodes.");
  }


}


function visitEventHandlerNodes(ast,jsAST) {

  // Function to find the customSyntax node
  const findCustomSyntaxNode = (node) => {
    if (!node) return null;

    if (node.type === 'Element' && node.name === 'customSyntax') {
      return node;
    }

    if (node.children && Array.isArray(node.children)) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const result = findCustomSyntaxNode(child);
        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  // Find the customSyntax node within the AST
  const customSyntaxNode = findCustomSyntaxNode(ast.html);
  
  //console.log(customSyntaxNode);
  if (!customSyntaxNode) return;

  // Transform text nodes
  //const eventHandlerNodesInstance = new TransformEventHandlerNodes();
  if (customSyntaxNode && jsAST) {

  const eventHandlerNodesInstance = new ProcessEventHandlers(customSyntaxNode, jsAST);
  
  }
  

}



/*
function visitTextNodes(ast) {

  // Function to find the customSyntax node
  const findCustomSyntaxNode = (node) => {
    if (!node) return null;

    if (node.type === 'Element' && node.name === 'customSyntax') {
      return node;
    }

    if (node.children && Array.isArray(node.children)) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const result = findCustomSyntaxNode(child);
        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  // Find the customSyntax node within the AST
  const customSyntaxNode = findCustomSyntaxNode(ast.html);
  
  //console.log(customSyntaxNode);
  if (!customSyntaxNode) return;

  // Transform text nodes
  const textNodesInstance = new TransformTextNodes();
  //textNodesInstance.transformTextNodes(customSyntaxNode, ast);

  if (typeof textNodesInstance.transformTextNodes === 'function') {
    textNodesInstance.transformTextNodes(customSyntaxNode, ast);
  } else {
    console.error("transformTextNodes method is not defined in TransformTextNodes.");
  }


}

*/




function getActiveNodes(customSyntaxAST, customSyntaxObject, jsAST, nodeStatus, stackCount=null) {
 
  const walk = new Walker();
  let nodeType = 'MustacheIdentifier';
  let returnType = { path: 'expression.name.name' };
  let matchLogic = walk.createMatchLogic(nodeType);
  let identifiers = walk.deepWalker(customSyntaxAST, nodeType, matchLogic, returnType);


  let activeStack = [];

  for (let i = 0; i < identifiers.length; ++i) {
    const targetNode = identifiers[i].node;
    const getNodeLocations = new GetNodePositions(customSyntaxAST, targetNode);
    const nodeLocations = getNodeLocations.init();

    const parentNode = nodeLocations[0].parentNode;
    const parentNodeIndex = nodeLocations[0].nodeIndex;

    const getParentLocation = new GetNodePositions(customSyntaxAST, parentNode);
    const grandParentLocation = getParentLocation.init();
    const grandParentNode = grandParentLocation[0].parentNode;
    const targetNodeIndex = grandParentLocation[0].nodeIndex;

    activeStack.push({
      identifier: identifiers[i].value,
      activeNode: targetNode,
      parentNode: parentNode,
      parentNodeIndex: parentNodeIndex,
    });
  }


   // console.log(activeStack);


  let attributeIdentifiers = [];
  const anodeType = 'Element';
  const areturnType = { path: 'value[0].name.name' };
  const amatchLogic = walk.createMatchLogic(anodeType);
  const elements = walk.deepWalker(customSyntaxAST, anodeType, amatchLogic, areturnType);

  elements.forEach(element => {
    if (element.node.attributes?.length > 0) {
      for (let i = 0; i < element.node.attributes.length; i += 1) {
        const attribute = element.node.attributes[i];
        if (attribute.value?.length > 0 && attribute.value[0].type === 'MustacheAttribute' && attribute.name.type !== 'EventHandler') {
          const matchedIdentifier = attribute.value[0].name.name;
          attributeIdentifiers.push({ value: matchedIdentifier, node: element.node });
        }
      }
    }
  });

  for (let i = 0; i < attributeIdentifiers.length; ++i) {
    const targetNode = attributeIdentifiers[i].node;
    const getNodeLocations = new GetNodePositions(customSyntaxAST, targetNode);
    const nodeLocations = getNodeLocations.init();

    const parentNode = nodeLocations[0].parentNode;
    const parentNodeIndex = nodeLocations[0].nodeIndex;

    const getParentLocation = new GetNodePositions(customSyntaxAST, parentNode);
    const grandParentLocation = getParentLocation.init();
    const grandParentNode = grandParentLocation[0].parentNode;
    const targetNodeIndex = grandParentLocation[0].nodeIndex;

    activeStack.push({
      identifier: attributeIdentifiers[i].value,
      activeNode: targetNode,
      parentNode: parentNode,
      parentNodeIndex: parentNodeIndex,
    });
  }

  const identifiersOnly = identifiers.map(item => item.value);
  const attrIdentifiersOnly = attributeIdentifiers.map(item => item.value);

  attrIdentifiersOnly.forEach(identifier => {
    identifiersOnly.push(identifier);
  });

  
  const visitor = new AnyVisitor();
  const handlers = visitor.htmlFunctionCallEventHandlers(customSyntaxObject);

  let identifiersInFunctions;

  if (identifiers && handlers) {
    identifiersInFunctions = visitor.getIdentifiersInFunctions(identifiersOnly, handlers, customSyntaxAST[0], jsAST);
    // console.log("Funcs", identifiersInFunctions);

  }

  let reactiveIdentifiersOnly = [];

  for (const item of identifiersInFunctions) {
    const keys = Object.keys(item);
    reactiveIdentifiersOnly.push(keys[0]);
  }

  const reactiveStack = [];
  let transpiledObjects;

  if (reactiveIdentifiersOnly.length > 0) {
    for (let n = 0; n < reactiveIdentifiersOnly.length; ++n) {
      activeStack.forEach(block => {
        if (block.identifier === reactiveIdentifiersOnly[n]) {
          reactiveStack.push(block);
        }
      });
    }
  }



  if (stackCount && stackCount === 2) {

    return reactiveStack.length; 
  }

//console.log("ALL",reactiveIdentifiersOnly);

const staticIdentifiers = identifiersOnly.filter(identifier => !reactiveIdentifiersOnly.includes(identifier));

//console.log("SI",staticIdentifiers);


  





  if (nodeStatus === 1 && activeStack.length > 0) {
    return ({

            identifiersInFunctions: identifiersInFunctions,
            reactiveStack: reactiveStack[0], 

            });
  }



  const staticStack = activeStack.filter(activeItem => {
    return !reactiveStack.some(reactiveItem => walk.deepEqual(activeItem, reactiveItem));
  });

  
if (stackCount && stackCount === 1) {
    //console.log("HERE 1",staticStack);
    return staticStack.length; 
  }


  if (nodeStatus === 0 && staticStack.length > 0) {
    return ({
            identifiersInFunctions: identifiersInFunctions,
            staticStack: staticStack[0],


    });
  }




  
}




//console.log("BEFORE",JSON.stringify(customSyntaxObject,null,2));
/**@visitTextNodes() -- we wrap free radicals (loose hanging) text nodes in span tags
 * e.g. Hello world becomes <span> Hello World </span>
 * @visitMustacheIdentifierNodes we wrap loose hanging mustache tags into spans
 * e.g. {counter} becomes <span> {counter} </span>
 * 
 * we do this because in semantq all html must be part of html Element (tag) node for  * more efficient handling.  
 * 
 * free radicals are text nodes or mustache identifiers that are not wrapped in html tags and belong to the parent tag <customSyntax> </customSyntax>
 * 
 * @visitEventHandlerNodes transforms event handlers e.g. from @click={incrementer} becomes @click={incrementer()} - other transformations are done later on  
 */

/**
 * Main function to transform ASTs and write output to a file.
 * @param {Object} jsAST - The JavaScript AST.
 * @param {Object} cssAST - The CSS AST.
 * @param {Object} customSyntaxAST - The custom HTML AST.
 * @param {String} filePath - The path to the output file.
 */
export default async function transformASTs(jsAST, cssAST, customSyntaxAST, filePath) {
  const customSyntaxObject = customSyntaxAST[0];



  // Process mustache and event handler nodes
  if (customSyntaxObject) visitMustacheIdentifierNodes(customSyntaxObject);
  if (customSyntaxObject) visitEventHandlerNodes(customSyntaxObject,jsAST);

  // Initialize tracking variables
  let nodeStatus;
  let identifiersInFunctions;
  let activeBlock;
  let stackCount;
  const processedBlocks = new Set(); // Tracks processed blocks to avoid redundancy

  let transformedASTs;
  let reRendersObject = "";
  const uniqueCalls = new Set();

  // --------------------
  // Transform Reactive Nodes
  // --------------------
  nodeStatus = 1;
  if (customSyntaxObject && jsAST ) {
  stackCount = getActiveNodes(customSyntaxAST, customSyntaxObject, jsAST, nodeStatus, 2);


  for (let n = 0; n < stackCount; n++) {
    const reactiveNode = getActiveNodes(customSyntaxAST, customSyntaxObject, jsAST, nodeStatus);
    identifiersInFunctions = reactiveNode.identifiersInFunctions;
    activeBlock = reactiveNode.reactiveStack;
    
    const blockKey = JSON.stringify(activeBlock);
    if (!processedBlocks.has(blockKey)) {
      const transpilerReactive = new Transpiler(identifiersInFunctions, customSyntaxObject, jsAST, activeBlock, nodeStatus);
      transformedASTs = transpilerReactive.getTransformedASTs();
      processedBlocks.add(blockKey);
    }

    // Prepare reRender function calls
    identifiersInFunctions.forEach(obj => {
      Object.keys(obj).forEach(key => {
        const reRenderCall = `reRender${key.charAt(0).toUpperCase()}${key.slice(1)}();`;
        if (!uniqueCalls.has(reRenderCall)) {
          uniqueCalls.add(reRenderCall);
          reRendersObject += reRenderCall;
        }
      });
    });
  }

  // --------------------
  // Transform Static Nodes
  // --------------------
  nodeStatus = 0;
  stackCount = getActiveNodes(customSyntaxAST, customSyntaxObject, jsAST, nodeStatus, 1);

  for (let n = 0; n < stackCount; n++) {
    const staticNode = getActiveNodes(customSyntaxAST, customSyntaxObject, jsAST, nodeStatus);
    if (!staticNode) continue;

    identifiersInFunctions = Array.isArray(staticNode.identifiersInFunctions) ? staticNode.identifiersInFunctions : [];
    activeBlock = staticNode.staticStack;
    
    const blockKey = JSON.stringify(activeBlock);
    if (!processedBlocks.has(blockKey)) {
      const transpilerStatic = new Transpiler(identifiersInFunctions, customSyntaxObject, jsAST, activeBlock, nodeStatus);
      transformedASTs = transpilerStatic.getTransformedASTs();
      processedBlocks.add(blockKey);
    }
  }


}



  // --------------------
  // Generate final ASTs
  // --------------------
  let newJsAST = transformedASTs ? transformedASTs.transformedJsAST : jsAST;
  let newHTMLAST = transformedASTs ? transformedASTs.transformedCustomSyntaxAST : customSyntaxAST;

      //console.log("NJST",JSON.stringify(newHTMLAST,null,2));


//  console.log("NJST",newJsAST);

  // --------------------
  // Extract Function Names for Global Scope
  // --------------------
  /*
  if (jsAST) {
  const walk = new Walker();
  const nodeType = "FunctionDeclaration";
  const returnType = { path: "id.name" };
  const matchLogic = walk.createMatchLogic(nodeType);
  const functions = walk.deepWalker(newJsAST, nodeType, matchLogic, returnType);
}
*/

  //let appendtoJsScriptTag = `\n${reRendersObject}\n`;



  async function processLayoutFile(filePath) {
  // Extract the target directory from the filePath
  const targetDir = path.dirname(filePath); // This will give the directory containing the file
  const routeDirName = path.basename(targetDir); // This will give the last directory name (e.g., "admin")

  //console.log(`Processing layout file in route directory: ${routeDirName}`);

  // Define the layout file paths
  const layoutResolvedPath = path.join(targetDir, '+layout.resolved.ast');
  const layoutSmqPath = path.join(targetDir, '+layout.smq.ast');

  let layoutFilePath;

  // Check if +layout.resolved.ast exists
  if (fs.existsSync(layoutResolvedPath)) {
    layoutFilePath = layoutResolvedPath;
  }
  // If not, check if +layout.smq.ast exists
  else if (fs.existsSync(layoutSmqPath)) {
    layoutFilePath = layoutSmqPath;
  } else {
    // No layout file found
   // console.log('No layout file found.');
    return;
  }

  //console.log(layoutFilePath);

  // Read the layout file content
  const layoutContent = fs.readFileSync(layoutFilePath, 'utf-8');
  const layoutAST = JSON.parse(layoutContent);

// Extract header, main, and footer blocks from the layout AST
let layoutAstBlocks = {
  header: null,
  main: null,
  footer: null,
};

// Helper function to traverse the AST and extract blocks
function traverse(node) {
 // console.log("Current Node:", node);

  // If the node is an array, traverse each item in the array
  if (Array.isArray(node)) {
    node.forEach(child => traverse(child));
    return;
  }

  // If the node is an object, check its type and name
  if (node.type === 'Element') {
    if (node.name === 'header') {
      layoutAstBlocks.header = node;
    } else if (node.name === 'main') {
      layoutAstBlocks.main = node;
    } else if (node.name === 'footer') {
      layoutAstBlocks.footer = node;
    }
  }

  // Traverse nested children
  if (node.children) {
    node.children.forEach(child => traverse(child));
  }
}

// Start traversal from the root of the layout AST
const rootNode = layoutAST.customAST.content[0].html.children[0].children[0];
traverse(rootNode);

//console.log("Extracted Blocks:", layoutAstBlocks);

  // Parse each block using customHtmlParser
  const layoutHtml = {
    header: layoutAstBlocks.header ? customHtmlParser(layoutAstBlocks.header) : '',
    main: layoutAstBlocks.main ? customHtmlParser(layoutAstBlocks.main) : '',
    footer: layoutAstBlocks.footer ? customHtmlParser(layoutAstBlocks.footer) : '',
  };

  // Append the layoutHtml object to the jsCode object
  /*
  const updatedJsCode = {
    ...jsCode,
    layoutHtml,
  };
  */

  return layoutHtml;
}




  // --------------------
  // Wrap JavaScript Code in init() Only Once
  // --------------------
  function wrapCodeInInit(ast) {
    let imports = [];
    let otherCode = [];

    ast.body.forEach(node => {
      if (node.type === "ImportDeclaration") {
        imports.push(node);
      } else {
        otherCode.push(node);
      }
    });

    const initFunction = {
      type: "FunctionDeclaration",
      id: { type: "Identifier", name: "init" },
      params: [],
      body: { type: "BlockStatement", body: otherCode },
    };

    const exportInit = {
      type: "ExportNamedDeclaration",
      declaration: initFunction,
      specifiers: [],
      source: null,
    };

    ast.body = [...imports, exportInit];
    return ast;
  }





  if (!newJsAST.__wrapped) { // Ensure wrapCodeInInit is applied only once
  let reRendersAST;

  if (reRendersObject) {
    reRendersAST = parse(reRendersObject, { ecmaVersion: 2022, sourceType: "module" });

    // Append body of reRendersAST to newJsAST
    newJsAST.body.push(...reRendersAST.body);
  }



      /// so here check if layout file exists | either +layout.smq.ast or +layout.resolved.ast
    /// check for +layout.resolved.ast first - if not there get +layout.smq.ast if there
    /// read content of the file - in the file we want to get header and main and footer elements ast and keep these in an object e.g const layoutAstBlocks = {header: body: footer}, note that a layout file may have any of those blocks as each is optional - so we only get what's there 
    // then parse each block using: customHtmlParser(headerAST); customHtmlParser(bodyAST); customHtmlParser(footerAST); - if those ast blocks exist

    // final html outputs must be stored in a layoutHtml object and appended to to the top of jsCode object above  (jsCode = escodegen.generate(newJsAST); so we should add the layoutHtml object (with header, body, footer) sub blocks in such a way that they can extracted easily.  


  //const layoutHTML = processLayoutFile(filePath); 
  const layoutHTML = await processLayoutFile(filePath);
  //console.log("LAYOUT HTML",layoutHTML);

  let layoutAST; 
  
  if (layoutHTML) {
  const layoutAST = `const layoutBlocks = {
  header: \`${layoutHTML.header}\`,
  body: \`${layoutHTML.main}\`,
  footer: \`${layoutHTML.footer}\`
  };`;
}

  //console.log("const layoutHTML",layoutHTML);
  //console.log("const layoutAST",layoutAST);

/*
  // Parse the layoutAST string into an AST
    const parsedLayoutAST = parse(layoutAST, {
      ecmaVersion: 'latest',
      sourceType: 'module'
    });

  // get ast object of const 

  newJsAST.body.push(...parsedLayoutAST.body);

  */

//console.log("Updated",JSON.stringify(newJsAST,null,2));



  if (layoutHTML) {

const layoutRenderer = `

export function layoutInit() {

const layoutBlocks = {
  header: \`${layoutHTML.header}\`,
  body: \`${layoutHTML.main}\`,
  footer: \`${layoutHTML.footer}\`
  };


  if (layoutBlocks) {

    // Step 1: Update <head> if header exists
    if (layoutBlocks.header) {
      updateHead(layoutBlocks.header);
    }

    // Step 2: Update <body> if body exists
    if (layoutBlocks.body) {
      updateBody(layoutBlocks.body);
    }

    // Step 3: Append <footer> to <body> if footer exists
    if (layoutBlocks.footer) {
      appendFooter(layoutBlocks.footer);
    }

  
function updateHead(headerHTML) {
  const head = document.head;

  // Create a template for the header content
  const template = document.createElement('template');
  template.innerHTML = headerHTML;

  // Remove existing elements except those with semantq

  Array.from(head.children).forEach(child => {
    if (!child.hasAttribute('semantq')) {
      head.removeChild(child);
    }
  });

  // Clone and append the template content
  const newElements = template.content.cloneNode(true);
  head.appendChild(newElements);
}

function updateBody(bodyHTML) {
  const body = document.body;

  // Create a template for the body content
  const template = document.createElement('template');
  template.innerHTML = bodyHTML;

  // Replace the body content with the cloned template
  body.innerHTML = ''; // Clear existing content
  body.appendChild(template.content.cloneNode(true));
}

function appendFooter(footerHTML) {
  const body = document.body;

  // Create a template for the footer content
  const template = document.createElement('template');
  template.innerHTML = footerHTML;

  // Append the cloned template content to the body
  body.appendChild(template.content.cloneNode(true));
}

}

}`; 


/*

    // Parse the layoutAST string into an AST
    const layoutRendererAST = parse(layoutRenderer, {
      ecmaVersion: 'latest',
      sourceType: 'module'
    });

  // get ast object of const 

  newJsAST.body.push(...layoutRendererAST.body);
*/

  const targetDir = path.dirname(filePath); // This will give the directory containing the file
  const routeDirName = path.basename(targetDir); // This will give the last directory name (e.g., "admin")


  const newFileName = path.join(targetDir, '+layout.js'); // Saves in the same directory as the page.js file

// Write the layoutRenderer content into the new file
fs.writeFile(newFileName, layoutRenderer, (err) => {
  if (err) {
    console.error('Error writing layout file:', err);
  } else {
   // console.log(`Layout JS file written successfully to ${newFileName}`);
  }
});

  


};



  newJsAST = wrapCodeInInit(newJsAST);
  newJsAST.__wrapped = true; // Mark as wrapped
}


  //const jsCode = escodegen.generate(newJsAST);
//const jsCode = prettier.format(newJsAST, {  parser: "babel", });

let jsCode;

if (newJsAST && newJsAST.body && newJsAST.body.length > 0) {
jsCode = escodegen.generate(newJsAST);

}

//console.log(JSON.stringify(jsCode,null,2));
//console.log(JSON.stringify(newJsAST,null,2));



//const jsCode = generate.default(newJsAST).code;
//console.log(jsCode);



  const parsedHTML = customHtmlParser(newHTMLAST);

  if (jsCode && parsedHTML) {
    await writeCodeToFile(jsCode, parsedHTML);
  }

  // --------------------
  // Write Transformed Code to File
  // --------------------
  async function writeCodeToFile(jsCode, parsedHTML) {
    const formattedJsCode = await prettier.format(jsCode, { parser: "babel" });
    const formattedHTML = await prettier.format(parsedHTML, { parser: "html" });

   
    
    const routeName = filePath.split("/").slice(-2, -1)[0];
    const jsFileName = `${routeName}.js`;
    const jsFilePath = filePath.replace(/\+page\.(resolved|smq)\.ast$/, jsFileName);
    const jsContent = `${formattedJsCode}\n`;

    try {
      await fs.promises.writeFile(jsFilePath, jsContent);
    } catch (err) {
      console.error(err);
    }

    const newFilePath = filePath.replace(/\+page\.(resolved|smq)\.ast$/, "\+page.html");
    try {
      await fs.promises.unlink(newFilePath);
    } catch (err) {
      if (err.code !== "ENOENT") console.error(err);
    }

    try {
      await fs.promises.writeFile(newFilePath, `<style>\n${cssAST}\n</style>\n${formattedHTML}`);
    } catch (err) {
      console.error(err);
    }





  }

}
