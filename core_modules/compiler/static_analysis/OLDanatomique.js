"use strict";


import escodegen from 'escodegen';
import { parse } from 'acorn';
import customHtmlParser from '../customHtmlParser.js';
import fs from 'fs-extra';
import prettier from 'prettier';
import * as estraverse from "estraverse";


//console.log(typeof traverse.default); // Should print "function"


class GetNodePositions {
  constructor (ast, targetNode) {
    this.ast=ast;
    this.targetNode=targetNode;
    //console.log("inside",JSON.stringify(ast,null,2));
  }

findIndexInChildren(parent) {  

const isObject = (value) => value && typeof value === 'object';
  
  if (parent.children) {
    if (Array.isArray(parent.children)) {
      // Iterate over the array of arrays
      for (let i = 0; i < parent.children.length; i++) {
        const childArray = parent.children[i];
        if (Array.isArray(childArray)) {
          for (let j = 0; j < childArray.length; j++) {
            const child = childArray[j];

            //console.log("TYPE",parent.name, child.type);

      const startMatch = isObject(child.start) ? this.deepEqual(child.start, this.targetNode.start) : child.start === this.targetNode.start;
      const endMatch = isObject(child.end) ? this.deepEqual(child.end, this.targetNode.end) : child.end === this.targetNode.end;      
            
            if (
              startMatch
              && endMatch
              && child.type === this.targetNode.type 
              && child.name === this.targetNode.name 
              && this.deepEqual(child.attributes, this.targetNode.attributes) 
              && this.deepEqual(child.children, this.targetNode.children)
            ) {
             
             //console.log("matchFound", "child",child, "target",this.targetNode);

              //return [i, j]; // Return the indices of the child node
              return j; // return index only
            }


          }
        }
      }
    } else {
      // Iterate over the object
      for (const key in parent.children) {
        if (Object.hasOwnProperty.call(parent.children, key)) {
          const childArray = parent.children[key];
          if (Array.isArray(childArray)) {
            for (let j = 0; j < childArray.length; j++) {
              const child = childArray[j];
              if (
                child.start === this.targetNode.start &&
                child.end === this.targetNode.end &&
                child.type === this.targetNode.type &&
                child.name === this.targetNode.name &&
                this.deepEqual(child.attributes, this.targetNode.attributes) &&
                this.deepEqual(child.children, this.targetNode.children)
              ) {
                //return [key, j]; // Return the key and index of the child node
                return j; // return index only
              }
            }
          }
        }
      }
    }
  }

    
  return -1; // Return -1 if the targetNode is not found
}



 deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!this.deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key) || !this.deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
}


walk() {
    let matchFound = false;
    let nodeStack = [];
    let visitedNodes = new Set();

    const processNode = (node) => {
      if (node && (node.type === 'Element' || node.type === 'Text' || node.type === 'MustacheIdentifier')) {
        const nodeKey = `${node.type}-${node.start}-${node.end}`;
        if (!visitedNodes.has(nodeKey)) {
          visitedNodes.add(nodeKey);
          nodeStack.push({
            node: node,
            nodeName: node.name || node.type,
            nodeType: node.type,
            nodeText: node.type === 'Text' ? node.text : null,
          });
        }
      }

      if (
        node.start === this.targetNode.start &&
        node.end === this.targetNode.end &&
        node.type === this.targetNode.type &&
        node.name === this.targetNode.name &&
        this.deepEqual(node.attributes, this.targetNode.attributes) &&
        this.deepEqual(node.children, this.targetNode.children)
      ) {
        matchFound = true;
      }

      if (!matchFound) {
        if (Array.isArray(node.children)) {
          node.children.forEach((child) => nestedWalker(child));
        } else if (typeof node === 'object' && node !== null) {
          Object.values(node).forEach((value) => nestedWalker(value));
        }
      }
    };

    const nestedWalker = (node) => {
      if (!matchFound) {
        if (Array.isArray(node)) {
          node.forEach((item) => nestedWalker(item));
        } else if (typeof node === 'object' && node !== null) {
          processNode(node);
          if (node.children) {
            node.children.forEach((child) => nestedWalker(child));
          }
        }
      }
    };

    nestedWalker(this.ast);
    return nodeStack;
  }


 findChildren(node) {
  const _findChildren = (node) => {
    if (node && typeof node === 'object') {
      if (node.type === 'Element' && node.children && typeof node.children === 'object' && Object.keys(node.children).length > 0) {
        // node has a children object which is not empty
        return node.children;
      } else if (node.children && typeof node.children === 'object' && Object.keys(node.children).length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          _findChildren(node.children[i]);
        }
      }

      if (node.type === 'Element' && Array.isArray(node.children) && node.children.length > 0) {
        // node has a children array which is not empty
        return node.children;
      } else if (Array.isArray(node.children) && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          _findChildren(node.children[i]);
        }
      }

      // Recursively search through the properties of the node
      for (const key in node) {
        if (node.hasOwnProperty(key)) {
          const result = _findChildren(node[key]);
          if (result) {
            return result;
          }
        }
      }
    }
    return false;
  };

  return _findChildren(node);
}
 


/** @childrenChecker(nodeToCheck)
 * use for drilling down until there is no array or object passed
 * it drills down to the very elements objects/arrays
 * it won't pass an object
 * useful for traversing objects/arrays for element/units
 * WON'T WORK FOR PASSING NODES (OBJECTS OR ARRAYS) 
 */

/*
function childrenChecker(nodeToCheck) {
    // Helper function to drill down into arrays and objects
    function deepCheck(node) {
        if (Array.isArray(node)) {
            for (let i = 0; i < node.length; ++i) {
                if (deepCheck(node[i])) {
                    return true;
                }
            }
        } else if (typeof node === 'object' && node !== null) {
            for (let key in node) {
                if (deepCheck(node[key])) {
                    return true;
                }
            }
        } else {
            // Base case: when node is neither an array nor an object
            console.log("event got here",node);
            return findChildren(node);
        }
        return false;
    }

    return deepCheck(nodeToCheck);
}

*/

 childrenChecker(nodeToCheck) {
    if (Array.isArray(nodeToCheck)) {
        for (let i = 0; i < nodeToCheck.length; ++i) {
            if (this.findChildren(nodeToCheck[i])) {
              //console.log("here",nodeToCheck[i]);
                 return nodeToCheck[i]; //return true;
            }
        }
    } else if (typeof nodeToCheck === 'object' && nodeToCheck !== null) {
        for (let key in nodeToCheck) {
            if (this.findChildren(nodeToCheck[key])) {
              //console.log("here",nodeToCheck[key]);
                return nodeToCheck[key]; //return true;
            }
        }
    } else {
      //console.log("here",nodeToCheck);
        return this.findChildren(nodeToCheck);
    }

    return false; // If no children are found in the array or object
}


/**@nodeStack - careful that parent could be sibling 
 * - because parent is simply the previous node encountered in the traversal
 * - to find the parent we need to get the first node in the stack 
 * with the targetNode in it's children
 * - a button element in a table td - will exist in that td and in the tr of that td 
 * - we must get the immediate parent so that catch that as the active node to be replaced 
 * in the grandParent node
 */


/** @for Lopp
 * 1. iterate through the nodeStack - this nodeStack has all nodes in the ast 
 * in their respective order
 * all nodes at this stage are 'Element' types - no loose hanging text or mustache tags 
 * at this point - if such existed they have been transformed already and wrapped in 
 * spans - so every node at this stage is an html tag === node.type 'Element'
 * nodeStack is a result of a deep exhaustive traversal 
 * - same logic used by the Semantq html parser - so there is no node left out 
 * 2. @childrenChecker checks if node has children 
 * - if it doesn't we don't have to bother  looking for the targetNode in it 
 * 3. if nodeToCheck has children then we proceed to findIndexInChildren()
 * if index is -1 then targetNode is ƒNOT found in the node
 * if existsIndex > -1 then we have found the tagetNode in the node and 
 * hev the index as 
 * 4. with the parentNode and nodeIndex plus newNode - we can replace the node
 */

init() {

//console.log("HERE now",this.ast);
const nodeStack = this.walk(this.ast);
let nodeLocations = [];
//console.log("NODE STACK",nodeStack); 
//console.log(JSON.stringify(nodeStack,null,2));


for (let i = 0; i < nodeStack.length; i++) {
  const nodeToCheck = nodeStack[i];
  const result = this.childrenChecker(nodeToCheck);

  if (result && result.children) {
    const existsIndex = this.findIndexInChildren(result);


    if (existsIndex > -1) {
        nodeLocations.push({
        parentNode: nodeToCheck.node,
        nodeIndex: existsIndex,
      });

      return nodeLocations;
    }
  }



}

//console.log("HERE now",nodeLocations);

return nodeLocations; 

}



}





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



class TransformEventHandlerNodes extends NodeVisitor {
  transformEventHandlerNodes(subRootNodeChildren,ast) {
  
    const node=subRootNodeChildren.children[0];
    function _walk(node) {
      //console.warn(node.type);
    if (!node) return; // Return if the node is null or undefined

    // Process node if it matches the criteria
    if (node.type && node.type === 'Attribute') {
        if (typeof node.name === 'object' && node.name.type === 'EventHandler') {

          //console.log("THIS",node.value[0].name.name);
          //return;

        const functionIdentifier= node.value[0].name.name.replace(/{|}/g, '');
        const tranformedfunctionIdentifier = functionIdentifier + "()";
        //console.log("ANY",tranformedfunctionIdentifier);
        node.value[0].name.name = tranformedfunctionIdentifier; 
        const transformOnEvent= 'on'+node.name.name;
        node.name.name = transformOnEvent;

        }
    }

    // If node is an array, process each item
    if (Array.isArray(node)) {
        node.forEach(child => _walk(child));
    } 
    // If node is an object and has children or other properties, process each child
    else if (typeof node === 'object' && node !== null) {
        // Process the children array if it exists
        if (node.children) {
            node.children.forEach(child => _walk(child));
        }
        // Process other object properties if necessary
        // Only process non-children properties to avoid duplication
        for (const key in node) {
            if (node.hasOwnProperty(key) && key !== 'children') {
                _walk(node[key]);
            }
        }
    }
}


    ///


 _walk(node);



  }
}




class TransformTextNodes extends NodeVisitor {
  transformTextNodes(subRootNodeChildren, ast) {


    //console.log("inn",JSON.stringify(subRootNodeChildren.children[0],null,2));

    for (let i =0; i < subRootNodeChildren.children[0].length; i++) {


  const node=subRootNodeChildren.children[0][i];
  const newLines = '\n\n\n\n';
  const whiteSpaces = ' ';


  if (node.type === 'Text' && node.raw !== newLines && node.raw !== whiteSpaces) {
 // console.log(node);
  //console.log(i);


  const newTextNode = {
            start: node.start,
            end: node.end,
            type: "Element",
            name: "span",
            attributes: [],
            children: [
              {
                start: node.start,
                end: node.end,
                type: "Text",
                raw: node.raw,
                data: node.data
              }
            ]
          };

          // Update node
          subRootNodeChildren.children[0][i] = newTextNode;
          //console.log("UPDATED NODE", JSON.stringify(ast,null,2));

  // transform node

    }

  }
  
   

  }
}



class Walker extends NodeVisitor {

traverse(ast, targetNode, eventHandlers=null) {
    const results = [];

    //console.log("E Handlers", eventHandlers); return;

    function _traverse(node, parent, key, index, eventHandlers=null ) {
        if (node === null || node === undefined) {
            return; // Stop traversal for non-existent nodes
        }

        if (node.type === targetNode && node.name.type=== 'EventHandler') {

         // console.log("LAPAHA",JSON.stringify(node,null,2)); return;

            results.push({
                targetNode: node,
                parent: parent,
                key: targetNode,
                index: index
            });
        }

        if (Array.isArray(node)) {
            for (let i = 0; i < node.length; i++) {
                _traverse(node[i], node, i, i);
            }
        } else if (typeof node === 'object') {
            for (let key in node) {
                if (node.hasOwnProperty(key)) {
                    _traverse(node[key], node, targetNode, key);
                }
            }
        }
    }



    _traverse(ast, null, targetNode, null,eventHandlers); // Start traversal from the root node
    return results; // Return all found target nodes
}



walk(ast, targetNodeType) {
  //console.log("Problem",JSON.stringify(ast,null,2));
    const results = [];

    function _walk(node, parent, grandParent) {
      //console.log("LPAHA",JSON.stringify(node.html.children,null,2));
        if (node === null || node === undefined) return; 
        //const index = 23; 



        if (node.type === targetNodeType) {

          // console.log("FLAG",node.type);

        const walk = new Walker();

        //console.log("FormatTT",parent);
        const index =walk.findIndexInChildren(grandParent, parent);

            results.push({
                targetNode: node,
                parent: parent,
                grandParent: grandParent,
                parentIndex: index
            }); 
        }

        // Traverse children if they exist
        if (node.children) {
            node.children.forEach((childArray, childKey) => {
                if (Array.isArray(childArray)) {
                    childArray.forEach((child, childIndex) => {
                      _walk(child, node, parent);
                    });
                } else {
                   _walk(childArray, node, parent);
                }
            });
        }
    }

     // Ensure ast is properly structured
  if (ast && ast.html) {
    _walk(ast.html, null, null);
  } else {
    console.error("AST or AST.html is not defined");
  }
    //console.log("All Blocks",results);
    return results;
}





// Helper function for deep equality check
/*
deepEqual(a, b) {
  const walk = new Walker();

  if (a === b) return true;
  if (a == null || b == null) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!walk.deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key) || !walk.deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return false;
}
*/

deepWalker(ast, nodeType = null, matchLogic, returnType = null) {
    if (!ast) {
        console.log("No AST object provided e.g. deepWalker(ast, nodeType,etc);");
        return;
    }

    if (!matchLogic) {
        console.log("You need to define matchLogic e.g. deepWalker(ast, nodeType,matchLogic);");
        return;
    }

    if (!nodeType || !returnType) {
        console.log('There is no target or return type in your deepWalker request!. Please specify target e.g. deepWalker(ast, nodeType, returnType)');
        return;
    }

    let results = [];
    const visited = new Set();

    function _deepWalk(node) {
        if (!node || visited.has(node)) return; // Stop infinite loops
        visited.add(node);

        if (matchLogic(node)) {
            if (returnType.path) {
                //results.push(getValueByPath(node, returnType.path));
            results.push({value: getValueByPath(node, returnType.path), node: node});

            }
        }

        // Traverse arrays
        if (Array.isArray(node)) {
            for (let child of node) {
                _deepWalk(child);
            }
        }

        // Traverse objects
        if (typeof node === 'object') {
            for (let key in node) {
                if (node.hasOwnProperty(key)) {
                    _deepWalk(node[key]);
                }
            }
        }
    }

    function getValueByPath(obj, path) {
        const keys = path.split('.');
        let value = obj;
        for (const key of keys) {
            if (Array.isArray(value) && !isNaN(key)) {
                value = value[parseInt(key)];
            } else {
                value = value[key];
            }
            if (value === undefined || value === null) {
                return undefined;
            }
        }
        return value;
    }

    _deepWalk(ast);
    return results;
}



// 

/**@createMatchLogic important function for creating fucntions that check for specified
 * parameters in the node
 * function takes only three params - nodeType, nodeName and NodeValue - all are optional
 * if no parameters is set function will return: (node) => true;
 * e.g. to check if a node type exists you can create the matchLogic this way
 * 
 * const nodeType='Element';
 * const matchLogic = createMatchLogic(nodeType);
 * // (node) => node.type === nodeType;
 * 
 * if you want to check for node type and node name
 * 
 * const nodeType='Element';
 * const nodeName='span';
 * const matchLogic = createMatchLogic(nodeType,nodeName);
 * // (node) => node.type === nodeType && node.name === nodeName;
 * 
 * you also have to set the path of the item to returned
 * 
 * e.g.const returnType = {path: 'expression.name.name'}; 
 * when a match is found based on your matchLogic the function
 *  use that path to exract the target value from the matched node
 * 
 */

createMatchLogic(nodeType = null, nodeName = null, nodeValue = null) {
    if (nodeType && !nodeName && !nodeValue) {
        return (node) => node.type === nodeType;
    }

    if (nodeType && nodeName && !nodeValue) {
        return (node) => node.type === nodeType && node.name === nodeName;
    }

    if (nodeType && nodeName && nodeValue) {
        return (node) => node.type === nodeType && node.name === nodeName && node.value === nodeValue;
    }

    // Optional: handle cases where no parameters or some combination is provided
    return (node) => true;
}




deepEqual(a, b) {
  const walk = new Walker();

  if (a === b) return true;
  if (a == null || b == null) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!walk.deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key) || !walk.deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
}



findIndexInChildren(grandParent, targetNode) {
  const walk = new Walker();

  const isObject = (value) => value && typeof value === 'object';


  if (grandParent.children) {
    if (Array.isArray(grandParent.children)) {
      // Iterate over the array of arrays
      for (let i = 0; i < grandParent.children.length; i++) {
        const childArray = grandParent.children[i];
        if (Array.isArray(childArray)) {
          for (let j = 0; j < childArray.length; j++) {
            const child = childArray[j];

      const startMatch = isObject(child.start) ? walk.deepEqual(child.start, walk.targetNode.start) : child.start === targetNode.start;
      const endMatch = isObject(child.end) ? walk.deepEqual(child.end, walk.targetNode.end) : child.end === targetNode.end;      

            if (
              startMatch
              && endMatch
              && child.type === targetNode.type
              && child.name === targetNode.name
              && walk.deepEqual(child.attributes, targetNode.attributes)
              && walk.deepEqual(child.children, targetNode.children)
            ) {
              //return [i, j]; // Return the indices of the child node
              return j; // return index only
            }
          }
        }
      }
    } else {
      // Iterate over the object
      for (const key in grandParent.children) {
        if (Object.hasOwnProperty.call(grandParent.children, key)) {
          const childArray = grandParent.children[key];
          if (Array.isArray(childArray)) {
            for (let j = 0; j < childArray.length; j++) {
              const child = childArray[j];
              if (
                child.start === targetNode.start &&
                child.end === targetNode.end &&
                child.type === targetNode.type &&
                child.name === targetNode.name &&
                walk.deepEqual(child.attributes, targetNode.attributes) &&
                walk.deepEqual(child.children, targetNode.children)
              ) {
                //return [key, j]; // Return the key and index of the child node
                return j; // return index only
              }
            }
          }
        }
      }
    }
  }
  return -1; // Return -1 if the targetNode is not found
}


traverseForTypeAndName(node, nodeType, nodeName, nodeNameChecker) {
    const results = [];

    const walkRecursive = (currentNode) => {
      if (Array.isArray(currentNode)) {
        currentNode.forEach(item => walkRecursive(item));
      } else if (typeof currentNode === 'object' && currentNode !== null) {
        if (currentNode.type === nodeType && nodeNameChecker(currentNode, nodeName)) {
          results.push(currentNode);
        }
        for (const key in currentNode) {
          if (Object.prototype.hasOwnProperty.call(currentNode, key)) {
            walkRecursive(currentNode[key]);
          }
        }
      }
    };

    walkRecursive(node);
    return results;
  }

}



class Transpiler extends NodeVisitor {
  constructor(identifiersInFunctions,customSyntaxAST, jsAST, activeBlock,nodeStatus) {
    super();
    this.identifiersinFunctionsObject = identifiersInFunctions;
    this.customSyntaxAST = customSyntaxAST;
    this.jsAST = jsAST;
    this.activeBlock = activeBlock;
    this.staticHandledIdentifiersJs = [];
    this.reactiveFunctionsRerenders = [];
    this.reactiveHandledIdentifiersFuncs = [];
    this.nodeStatus = nodeStatus;
    this.transpile();

    



  }

  transpile() {
    if (this.nodeStatus === 1) {
      //console.log("NV",this.activeBlock); return;
      this.transformReactive(this.activeBlock);
    } else {
      this.transformStatic(this.activeBlock);
    }
  
}






   transformStatic(block) {
    const identifier=block.identifier; 

    //console.log("STATIC");

    const targetNode=block.activeNode;
    const parentNode = block.parentNode;
    const parentNodeIndex = block.parentNodeIndex; 
    //const grandParentNode = block.grandParentNode;
    //const targetNodeIndex = block.targetNodeIndex;

    //console.log(nodeLocations);

    // Generate unique ID and placeholder span node
    const uniqueId = this.generateUniqueElementId();
    const placeholderSpan = this._generatePlaceHolderSpanNode(uniqueId);
    const newHTMLNode = placeholderSpan;

    // Replace node in grandParent
    parentNode.children[0][parentNodeIndex]=newHTMLNode; 


// Generate names for HTML and JS fragments
    const randomStr = this._generateRandomText();
    const randomNumber = () => Math.floor(Math.random() * (999 - 1 + 1)) + 1;

    const targetConstName = (`target_${targetNode.type}_${randomStr}`).toLowerCase();
    const fragmentHTMLName = (`fragment_${randomStr}`).toLowerCase();

    const tagNameConst = `${targetNode.name}_${randomStr}`;
    //const targetNodeHtml = customHtmlParser(targetNode);
    let newNodeCounter = 0;
    let NodeTypeRef;

        if (targetNode.type === 'Element') {
      NodeTypeRef=targetNode.name.charAt(0);
      } 
      else {
        NodeTypeRef=targetNode.type.charAt(0);
      }

    const rootElementName = NodeTypeRef + "_" +randomStr+"_"+randomNumber()+"_rootElement";
    const htmlToJs = this.walkHtmlAstToJS(targetNode,rootElementName);


    // Generate JavaScript code
    const newJsCode = `
        ${htmlToJs}
        const ${targetConstName} = document.getElementById('${uniqueId}');
        ${targetConstName}.innerHTML='';
        ${targetConstName}.insertBefore(${rootElementName}, ${targetConstName}.firstChild);
    `;

    // Parse and add new JS node to the AST
    const newJsNode = parse(newJsCode, { ecmaVersion: 2022 });
    this.jsAST.body.push(newJsNode);
    this.staticHandledIdentifiersJs.push(identifier); // Add identifier to the handled list
}



/**
 * @block is the active node
 * @identifier is the is the reactive mustacheIdentifier (tag)
 * in this node - which is what makes the node reactive  
 */

  transformReactive(block) {

    const identifier=block.identifier; 
        //console.log("REACTIVE");
     // Generate unique ID and placeholder span node
    const targetNode=block.activeNode;
    const parentNode = block.parentNode;
    const parentNodeIndex = block.parentNodeIndex

    // Generate unique ID and placeholder span node
    const uniqueId = this.generateUniqueElementId();
    const placeholderSpan = this._generatePlaceHolderSpanNode(uniqueId);
    const newHTMLNode = placeholderSpan;


    // Replace node in grandParent
    parentNode.children[0][parentNodeIndex]= newHTMLNode; 


    const functions = this.identifiersinFunctionsObject[0][identifier];
    const reRenderFunctionName = 'reRender' + identifier.charAt(0).toUpperCase() + identifier.slice(1);
    const reRenderFuncCall = `${reRenderFunctionName}();`;
    const reRenderCallNode = this._jsAstGenerator(reRenderFuncCall);
    const callerNode = reRenderCallNode;


    const walk = new Walker();

    functions.forEach(func => {
        
       

        const existsWithValue = this.identifiersinFunctionsObject.some((item) => {
  return Object.values(item).some((value) => value.includes(func));
});


        if (existsWithValue) {
           //console.log("there");
            const nodeType = 'FunctionDeclaration';
            const nodeName = func;
            const nodeNameChecker = (node, nodeName) => node.id.name === nodeName;
            const targetNode = walk.traverseForTypeAndName(this.jsAST, nodeType, nodeName, nodeNameChecker);
           

            const findNode = (ast, type, name) => {
              let result = null;

              const walker = (node) => {
                if (result) return; // If node is found, stop further walking

                if (Array.isArray(node)) {
                  node.forEach(walker);
                } else if (node && typeof node === 'object') {
                  if (node.type === type && node.name === name) {
                    result = node;
                    return;
                  }

                  // Recursively walk through the object properties
                  for (const key in node) {
                    if (node.hasOwnProperty(key)) {
                      walker(node[key]);
                    }
                  }
                }
              };

              walker(ast);
              return result;
            };

            const calleeNodeExists = findNode(targetNode, "Identifier", reRenderFunctionName);
            //console.log("there we go", calleeNodeExists);

            if (!calleeNodeExists) {

               targetNode[0].body.body.push(callerNode);


            }

           
                
            const reRendersLogger = { [identifier]: func };
            this.reactiveFunctionsRerenders.push(reRendersLogger);
              }

            
            });

      // Generate names for HTML and JS fragments
          const randomStr = this._generateRandomText();
          const randomNumber = () => Math.floor(Math.random() * (999 - 1 + 1)) + 1;
          const fragmentHTMLName = (`fragment_${randomStr}`).toLowerCase();

          const tagNameConst = `${targetNode.name}_${randomStr}`;
          //const targetNodeHtml = customHtmlParser(targetNode);
          let newNodeCounter = 0;
          let NodeTypeRef; 
          
          if (targetNode.type === 'Element') {
            NodeTypeRef=targetNode.name.charAt(0);
            } 
            else {
              NodeTypeRef=targetNode.type.charAt(0);
            }

            const targetConstName = (`target_${targetNode.type}_${randomStr}`).toLowerCase();
            const rootElementName = NodeTypeRef + "_" +randomStr+"_"+randomNumber()+"_rootElement";
            //console.log("NAME",rootElementName);
            const htmlToJs = this.walkHtmlAstToJS(targetNode,rootElementName);
            const jsNodeCreatorCode = `
            ${htmlToJs}
            const ${targetConstName} = document.getElementById('${uniqueId}');
            ${targetConstName}.innerHTML = ''; // Optional: clear previous content
            ${targetConstName}.appendChild(${rootElementName});`;

            const uppercaseIdentifier = identifier.charAt(0).toUpperCase() + identifier.slice(1); 
            /*  here we need to determine if this function has been created or not */

          //const walk = new Walker();
          const nodeType = 'FunctionDeclaration';
          const nodeName = `reRender${uppercaseIdentifier}`;
          const nodeNameChecker = (node, nodeName) => node.id.name === nodeName;
          const targetJsNode = walk.traverseForTypeAndName(this.jsAST, nodeType, nodeName, nodeNameChecker);




            // Create function
            if (targetJsNode.length === 0) {
                // Create the reRender${identifier} function
                const newJsCode = `
                    function reRender${uppercaseIdentifier}() {
                  ${jsNodeCreatorCode}
              }
              // ${uppercaseIdentifier} rendering
              

              //${reRenderFunctionName}()`;


          const newJsNode = parse(newJsCode, { ecmaVersion: 2022 });
          this.jsAST.body.push(newJsNode);
          this.reactiveHandledIdentifiersFuncs.push(identifier); // Adding identifier to the handled list
      } else {
          const newJsCode = `
              //Reactive rendering for ${uppercaseIdentifier} nodes
              ${jsNodeCreatorCode}
          `;
          const newJsNode = parse(newJsCode, { ecmaVersion: 2022 });
          targetJsNode[0].body.body.push(newJsNode);
          this.reactiveHandledIdentifiersFuncs.push(identifier); // Adding identifier to the handled list
      }
  
  }







   _jsAstGenerator (jsCode) {
      return parse(jsCode, { ecmaVersion: 2023});
   }





  generateUniqueElementId() {
  const timestamp = Date.now().toString(36).substr(0, 3);
  let randomStr = Math.random().toString(36).substr(2, 5);

  while (randomStr.length < 5) {
    randomStr += Math.random().toString(36).substr(2, 1);
  }

  return `${timestamp}${randomStr}`;
}

  _generatePlaceHolderSpanNode(uniqueId) {
    return {
        "start": 0,
        "end": 22,
        "type": "Element",
        "name": "span",
        "attributes": [
          {
            "start": 6,
            "end": 14,
            "type": "Attribute",
            "name": "id",
            "value": [
              {
                "start": 10,
                "end": 13,
                "type": "Text",
                "raw": uniqueId,
                "data": uniqueId
              }
            ]
          }
        ],
        "children": []
      }

    }

  _generatePlaceHolderVariableAST(uniqueId) {
    return {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 37,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 6,
          "end": 36,
          "id": {
            "type": "Identifier",
            "start": 6,
            "end": 26,
            "name": "placeHolderElementId"
          },
          "init": {
            "type": "Literal",
            "start": 28,
            "end": 36,
            "value": uniqueId,
            "raw": `'${uniqueId}'`
          }
        }
      ],
      "kind": "const"
    };
  }

_generateDataSpan (dataAttribute) {
  return {
        "start": 0,
        "end": 33,
        "type": "Element",
        "name": "span",
        "attributes": [
          {
            "start": 6,
            "end": 24,
            "type": "Attribute",
            "name": dataAttribute,
            "value": true
          }
        ],
        "children": [
          {
            "start": 25,
            "end": 26,
            "type": "Text",
            "raw": " ",
            "data": " "
          }
        ]
      }
}

 _generateRandomText() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let randomText = '';
  for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
    randomText += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomText;
}


/* START PARSE HTML AST TO JS CODE  BLOCK */
attributesToJs(attributes, elemVar) {
  let attributesCode = '';

  function _getValueFromPath(obj, path) {
    return path.split('.').reduce((acc, part) => {
      if (acc === undefined || acc === null) {
        return undefined;
      }
      const match = part.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\[(\d+)\])?$/);
      if (match) {
        const [, key, index] = match;
        acc = acc[key];
        if (index !== undefined) {
          acc = acc[parseInt(index, 10)];
        }
      }
      return acc;
    }, obj);
  }

  const logicMap = [
    {
      typeMaps: ['type', 'value[0].type']
    },
    {
      valueData: ['value', ['value[0].raw', 'value[0].name.name']]
    }
  ];

  attributes.forEach(attribute => {
    let type = null;
    let value = null;

    logicMap.forEach(logic => {
      if (logic.typeMaps) {
        type = _getValueFromPath(attribute, logic.typeMaps[0]);
      }
      if (logic.valueData) {
        if (Array.isArray(attribute.value)) {
          value = _getValueFromPath(attribute, logic.valueData[1][0]) || _getValueFromPath(attribute, logic.valueData[1][1]);
        } else {
          value = attribute.value;
        }
      }
    });

    const attributeName = attribute.name.name || attribute.name;

    if (typeof value === 'boolean') {
      if (attribute.smqtype && attribute.smqtype === 'BooleanIdentifierAttribute') {
        attributesCode += `${elemVar}.setAttribute(${attributeName}, '');\n`;
      } else {
        attributesCode += `${elemVar}.setAttribute(${attributeName}, '');\n`;
      }
    }

    if (Array.isArray(attribute.value) && attribute.value[0].type === 'MustacheAttribute') {

       if (attribute.name.type && attribute.name.type === 'EventHandler') {

        attributesCode += `${elemVar}.setAttribute('${attributeName}', '${attribute.value[0].name.name}');\n`;
       } else {
      attributesCode += `${elemVar}.setAttribute('${attributeName}', ${attribute.value[0].name.name});\n`;

    }
    }

    if (Array.isArray(attribute.value) && attribute.value[0].type !== 'MustacheAttribute') {
      attributesCode += `${elemVar}.setAttribute('${attributeName}', '${attribute.value[0].raw}');\n`;
    }
  });

  return attributesCode;
}




walkHtmlAstToJS(ast, rootElementName) {

  const selfClosingTags = [
    'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
    'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr', 'sspan'
  ];


  let jsCode = '';
  let parentStack = [];
  let rootElement = null;
  //let rootElement = rootElementName;
  let elementCounter = 0;
  let textNodeCounter = 0;
  let mustacheExprCounter = 0;

  const randomText = () => {
  return Math.random().toString(36).slice(2, 5);
}

const randomNumber = () => {
  return Math.floor(Math.random() * 900) + 100;
}


  const processNode = (node) => {
    if (Array.isArray(node)) {
      node.forEach(n => processNode(n));
      return;
    }

    if (node.type === 'Element' ) {
      const elemVar = rootElement ? `${node.name}_${randomNumber()}_${randomText()}` : rootElementName;
      if (!rootElement) {
        rootElement = node;
        jsCode += `const ${elemVar} = document.createElement('${node.name}');\n`;
        parentStack.push(elemVar);
      } 

        else {
        jsCode += `const ${elemVar} = document.createElement('${node.name}');\n`;
        jsCode += `// Append element to parent\n${parentStack[parentStack.length - 1]}.appendChild(${elemVar});\n`;
        parentStack.push(elemVar);
      }

      if (node.attributes && node.attributes.length > 0) {
        const attributesData = this.attributesToJs(node.attributes, elemVar);

        //console.log("DATA",attributesData);

        jsCode += `// Set attributes\n${attributesData}`;

      }

      if (node.children && node.children.length > 0) {
        node.children.forEach(child => processNode(child));
      }

      parentStack.pop();
    } else if (node.type === 'Text') {
      const textVar = `textNode_${randomNumber()}_${randomText()}`;



      // Escape every single quote by adding a backslash before it
      let escapedText = node.raw.replace(/'/g, "\\'");
      let cleanText = escapedText.replace(/(\r\n|\n|\r)/g, ' ');

      if (node.raw === ' ')
      {
       cleanText='';//'\u00A0'
      }

      
      const textNodeCreation = `const ${textVar} = document.createTextNode('${cleanText}');\n`;
      jsCode += textNodeCreation;
      jsCode += `${parentStack[parentStack.length - 1]}.appendChild(${textVar});\n`;
    } 

    else if (node.type === 'MustacheIdentifier') {
  const mustacheVar = `mustacheExpr_${randomNumber()}_${randomText()}`;
  const mustacheTagName = node.expression.name.name || node.expression.name;
  //jsCode += `const ${mustacheVar} = ${mustacheTagName};\n`;
  jsCode +=`const ${rootElementName} = document.createTextNode(${mustacheTagName});`
  //console.log("BUG", parentStack);
/*
  if (parentStack.length > 0) {
    jsCode += `${parentStack[parentStack.length - 1]}.appendChild(document.createTextNode(${mustacheVar}));\n`;
  } else if (rootElementName) {
    // Use rootElementName if parentStack is empty
    jsCode += `${rootElementName}.appendChild(document.createTextNode(${mustacheVar}));\n`;
  } else {
    // Fallback if no rootElementName is available
    jsCode += `document.body.appendChild(document.createTextNode(${mustacheVar}));\n`;
  }
  */


}




    else if (typeof node === 'object') {
      Object.values(node).forEach(value => processNode(value));
    }
  };

  processNode(ast);
  return jsCode;
}



/* END PASER HTML AST TO JS CODE BLOCK */

getTransformedASTs() {
    return {
      transformedCustomSyntaxAST: this.customSyntaxAST,
      transformedJsAST: this.jsAST
    };
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


function visitEventHandlerNodes(ast) {

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
  const eventHandlerNodesInstance = new TransformEventHandlerNodes();
  //textNodesInstance.transformTextNodes(customSyntaxNode, ast);

  if (typeof eventHandlerNodesInstance.transformEventHandlerNodes === 'function') {
    eventHandlerNodesInstance.transformEventHandlerNodes(customSyntaxNode, ast);
  } else {
    console.error("Event Handler Method method is not defined in TransformTextNodes.");
  }


}


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
  visitMustacheIdentifierNodes(customSyntaxObject);
  visitEventHandlerNodes(customSyntaxObject);

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

  // --------------------
  // Generate final ASTs
  // --------------------
  let newJsAST = transformedASTs ? transformedASTs.transformedJsAST : jsAST;
  let newHTMLAST = transformedASTs ? transformedASTs.transformedCustomSyntaxAST : customSyntaxAST;

  // --------------------
  // Extract Function Names for Global Scope
  // --------------------
  const walk = new Walker();
  const nodeType = "FunctionDeclaration";
  const returnType = { path: "id.name" };
  const matchLogic = walk.createMatchLogic(nodeType);
  const functions = walk.deepWalker(newJsAST, nodeType, matchLogic, returnType);

  //let appendtoJsScriptTag = `\n${reRendersObject}\n`;

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

  newJsAST = wrapCodeInInit(newJsAST);
  newJsAST.__wrapped = true; // Mark as wrapped
}


  //const jsCode = escodegen.generate(newJsAST);
//const jsCode = prettier.format(newJsAST, {  parser: "babel", });

let jsCode;

if (newJsAST || newJsAST.body || newJsAST.body.length > 0) {
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

    if (fileName.includes("+layout")) {

 // write LAYOUT FILE INTO DESIRED JS Wrapped html

if () {
  
}

        } 


        else {
    
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

//close else
  }




  }

}
