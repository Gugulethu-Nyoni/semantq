import escodegen from 'escodegen';
import { parse } from 'acorn';
import customHtmlParser from '../customHtmlParser.js';
import fs from 'fs';
import prettier from 'prettier';

//let jsAST;
//let cssAST;
//let customSyntaxAST;
//let customSyntaxObject;





class GetNodePositions {

  constructor (ast, targetNode) {
    this.ast=ast;
    this.targetNode=targetNode;
    //console.log(this.targetNode);
  }

findIndexInChildren(parent) {  
  if (parent.children) {
    if (Array.isArray(parent.children)) {
      // Iterate over the array of arrays
      for (let i = 0; i < parent.children.length; i++) {
        const childArray = parent.children[i];
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


walk(ast) {
  let matchFound = false;
  let nodeStack = [];


  const processNode = (node) => {
    if (node && node.type === 'Element') {
      nodeStack.push({
        node: node,
        nodeName: node.name,
        nodeType: node.type,
      });
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

  nestedWalker(ast);
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
 * spans - so very node at this stage is an html tag === node.type 'Element'
 * nodeStack is a result of a deep exhaustive traversal 
 * - same logic used by the Semantq html parser - so there is no node left out 
 * 2. @childrenChecker checks if node has children 
 * - if it doesn't we don't have to bother  looking for the targetNode in it 
 * 3. if nodeToCheck has children then we proceed to findIndexInChildren()
 * if index is -1 then targetNode is NOT found in the node
 * if existsIndex > -1 then we have found the tagetNode in the node and 
 * hev the index as 
 * 4. with the parentNode and nodeIndex plus newNode - we can replace the node
 */

init() {

const nodeStack = this.walk(this.ast);
let nodeLocations = [];

//console.log(nodeStack);


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
    if (!node) return; // Return if the node is null or undefined

    // Process node if it matches the criteria
    if (node.type && node.type === 'Attribute') {
        if (typeof node.name === 'object' && node.name.type === 'EventHandler') {

          //console.log(node.value[0].name.name);
        const tranformedfunctionIdentifier = node.value[0].name.name + "()";
        //console.log(tranformedfunctionIdentifier);
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
 * when a match is found based on your matchLogic the function use that path to exract the target value from the matched node
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

  if (grandParent.children) {
    if (Array.isArray(grandParent.children)) {
      // Iterate over the array of arrays
      for (let i = 0; i < grandParent.children.length; i++) {
        const childArray = grandParent.children[i];
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
  constructor(identifiersinFunctionsObject, customSyntaxAST, jsAST, activeStack,mode) {
    super();
    this.identifiersinFunctionsObject = identifiersinFunctionsObject;
    this.customSyntaxAST = customSyntaxAST;
    this.jsAST = jsAST;
    this.activeStack = activeStack;
    this.staticHandledIdentifiersJs = [];
    this.reactiveFunctionsRerenders = [];
    this.reactiveHandledIdentifiersFuncs = [];
    this.mode = mode;
    this.transpile();


  }



  transpile() {

    this.activeStack.forEach(block => {
        const node = block.activeNode;

        this.identifiersinFunctionsObject.forEach(identifier => {
            const identifierObject = Object.keys(identifier);
            const identifierName = block.identifier; // identifierObject[0];
            const isReactive = this.identifiersinFunctionsObject.some(obj => obj.hasOwnProperty(identifierName));

            /**
             * @isReactive we call the reactiveNode transpiler
             * We have to transpile all reactive nodes first.
             * Node may have both static and reactive (active) nodes.
             * If a node with both reactive and static props/elements is transpiled,
             * static rendering is lost, but if only static nodes are transpiled,
             * reactive rendering will be lost.
             */

            if (isReactive && this.mode === 1) {
              //console.log("this is gota be reactive", block);
              this.transformReactive(block, identifierName);
            }

            if (!isReactive && this.mode === 0) {
              return;
              this.transformStatic(block, identifierName);
            }

        });
    });
}


   transformStatic(block, identifier) {


    const targetNode=block.activeNode;
    const parentNode = block.parentNode;
    const grandParentNode = block.grandParentNode;
    const targetNodeIndex = block.targetNodeIndex;

    //console.log(nodeLocations);

    // Generate unique ID and placeholder span node
    const uniqueId = this.generateUniqueElementId();
    const placeholderSpan = this._generatePlaceHolderSpanNode(uniqueId);
    const newHTMLNode = placeholderSpan;

    // Replace node in grandParent
    grandParentNode.children[0][targetNodeIndex]=newHTMLNode; 


// Generate names for HTML and JS fragments
    const randomStr = this._generateRandomText();
    const randomNumber = () => Math.floor(Math.random() * (999 - 1 + 1)) + 1;

    const targetConstName = (`target_${parentNode.name}_${randomStr}`).toLowerCase();
    const fragmentHTMLName = (`fragment_${randomStr}`).toLowerCase();

    const tagNameConst = `${parentNode.name}_${randomStr}`;
    //const targetNodeHtml = customHtmlParser(targetNode);
    let newNodeCounter = 0;
    const NodeTypeRef=parentNode.name.charAt(0);
    const rootElementName = NodeTypeRef + "_" +randomStr+"_"+randomNumber()+"_rootElement";
    const htmlToJs = this.walkHtmlAstToJS(parentNode,rootElementName);


    // Generate JavaScript code
    const newJsCode = `
        ${htmlToJs}
        const ${targetConstName} = document.getElementById('${uniqueId}');
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

  transformReactive(block, identifier) {
     // Generate unique ID and placeholder span node

    //console.log("TR",block);

    const targetNode=block.activeNode;
    const parentNode = block.parentNode;
    const grandParentNode = block.grandParentNode;
    const targetNodeIndex = block.targetNodeIndex;

    // Generate unique ID and placeholder span node
    const uniqueId = this.generateUniqueElementId();
    const placeholderSpan = this._generatePlaceHolderSpanNode(uniqueId);
    const newHTMLNode = placeholderSpan;

    //console.log("GP",grandParentNode.children[0][3]); return;

    // Replace node in grandParent
    grandParentNode.children[0][targetNodeIndex]= newHTMLNode; 

    //console.log("AFTER",JSON.stringify(customSyntaxAST,null,2));


    // JavaScript Reactive transformation logic
    const functions = this.identifiersinFunctionsObject[0][identifier];
    const reRenderFunctionName = 'reRender' + identifier.charAt(0).toUpperCase() + identifier.slice(1);
    const reRenderFuncCall = `${reRenderFunctionName}();`;
    const reRenderCallNode = this._jsAstGenerator(reRenderFuncCall);
    const callerNode = reRenderCallNode;


    const walk = new Walker();

    functions.forEach(func => {
        const existsWithValue = this.reactiveFunctionsRerenders.some(obj => 
            obj[identifier] && obj[identifier] === func
        );

        if (!existsWithValue) {
            // FunctionDeclaration - Incrementer func
            //const walk = new Walker();
            const nodeType = 'FunctionDeclaration';
            const nodeName = func;
            const nodeNameChecker = (node, nodeName) => node.id.name === nodeName;
            const targetNode = walk.traverseForTypeAndName(this.jsAST, nodeType, nodeName, nodeNameChecker);

            targetNode[0].body.body.push(callerNode);

            const reRendersLogger = { [identifier]: func };
            this.reactiveFunctionsRerenders.push(reRendersLogger);
        }
    });

    // Generate names for HTML and JS fragments
        const randomStr = this._generateRandomText();
        const randomNumber = () => Math.floor(Math.random() * (999 - 1 + 1)) + 1;

        const targetConstName = (`target_${parentNode.name}_${randomStr}`).toLowerCase();
        const fragmentHTMLName = (`fragment_${randomStr}`).toLowerCase();

    const tagNameConst = `${parentNode.name}_${randomStr}`;
    //const targetNodeHtml = customHtmlParser(targetNode);
    let newNodeCounter = 0;
    const NodeTypeRef=parentNode.name.charAt(0);
    const rootElementName = NodeTypeRef + "_" +randomStr+"_"+randomNumber()+"_rootElement";
    console.log("NAME",rootElementName);
    const htmlToJs = this.walkHtmlAstToJS(parentNode,rootElementName);

     //console.log(htmlToJs); return;

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

         // console.log("targetJsNode *******", targetJsNode[0].type); 

      // Create function
      if (targetJsNode.length === 0) {
          // Create the reRender${identifier} function
          const newJsCode = `
              function reRender${uppercaseIdentifier}() {
                  ${jsNodeCreatorCode}
              }
              // ${uppercaseIdentifier} rendering
              reRender${uppercaseIdentifier}();
          `;
          const newJsNode = parse(newJsCode, { ecmaVersion: 2022 });
          this.jsAST.body.push(newJsNode);
          this.reactiveHandledIdentifiersFuncs.push(identifier); // Adding identifier to the handled list
      } else {
          // console.log("UPDATING", JSON.stringify(targetJsNode[0].body, null, 2));
          const newJsCode = `
              // Reactive rendering for ${uppercaseIdentifier} nodes
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

    if (node.type === 'Element') {
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
    } else if (node.type === 'MustacheIdentifier') {
      const mustacheVar = `mustacheExpr_${randomNumber()}_${randomText()}`;
      const mustacheTagName = node.expression.name.name || node.expression.name;
      jsCode += `const ${mustacheVar} = ${mustacheTagName};\n`;
      jsCode += `${parentStack[parentStack.length - 1]}.appendChild(document.createTextNode(${mustacheVar}));\n`;
    } else if (typeof node === 'object') {
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



function findActiveNodes(subRootNodeChildren) {
  const elementsWithMustacheTags = [];

  // Reusable arrow function for processing node attributes
  const processAttributes = (attr, node, nodeActiveStatus) => {
    if (attr.value && attr.value.length > 0) {
      if (attr.value[0].type === 'MustacheAttribute' || attr.smqtype === 'BooleanIdentifierAttribute') {
        // If node is not already active, push it to the array and set nodeActiveStatus to true
        if (!nodeActiveStatus) {
          elementsWithMustacheTags.push(node);
          nodeActiveStatus = true;
        }
      }
    }
    return nodeActiveStatus;
  };

  // Recursive function to traverse nodes
  const traverse = (node) => {
    if (!node) return;

    let nodeActiveStatus = false;

    if (node.attributes && node.attributes.length > 0) {
      node.attributes.forEach(attr => {
        nodeActiveStatus = processAttributes(attr, node, nodeActiveStatus);
      });
    }

    if (!nodeActiveStatus && node.children && node.children.length > 0) {
      node.children.forEach(child => {
        if (child.type === 'MustacheIdentifier') {
          elementsWithMustacheTags.push(node);
          nodeActiveStatus = true;
        }

        if (!nodeActiveStatus && child.type === 'Element') {
          // Recursively process child elements
          traverse(child);
        }

        if (!nodeActiveStatus && Array.isArray(child)) {
          child.forEach(grandChild => {
            traverse(grandChild);
          });
        }
      });
    }
  };

  // Traverse the root node children
  for (let i = 0; i < subRootNodeChildren.length; i++) {
    traverse(subRootNodeChildren[i]);
  }

  return elementsWithMustacheTags;
}



function findIdentifiers(ast) {
  let identifiers = [];

  function processAttributes(attr) {
    if (attr.value && Array.isArray(attr.value) && attr.value.length > 0) {
      if (attr.value[0].type === 'MustacheAttribute') {
       //console.log(`Processing MustacheAttribute: ${attr.value[0].name.name}`);
       const handler = attr.value[0].name.name.replace('()','');
        return handler; //attr.value[0].name.name;
      }
    }

    if (attr.value && typeof attr.value === 'boolean') {
      if (attr.smqtype === 'BooleanIdentifierAttribute') {
       // console.log(`Processing BooleanIdentifierAttribute: ${attr.name}`);
        return attr.name.replace('()','');;
      }
    }
  }

  function traverse(node) {
    if (!node) return;

    if (node.attributes && node.attributes.length > 0) {
      node.attributes.forEach(attr => {
        const result = processAttributes(attr);
        if (result) {
          //console.log(`Found attribute identifier: ${result}`);
          identifiers.push(result);
        }
      });
    }

    if (node.children) {
      if (Array.isArray(node.children[0])) {
        node.children.forEach(childArray => {
          childArray.forEach(child => {
            if (child.type === 'MustacheIdentifier') {
             // console.log(`Found MustacheIdentifier: ${child.expression.name}`);
              const handler =child.expression.name;//.replace('()','');

              //console.log("here",handler);

              identifiers.push(handler);
            } else if (child.type === 'Element') {
              traverse(child);
            }
          });
        });
      } else {
        node.children.forEach(child => {
          if (child.type === 'MustacheIdentifier') {
           // console.log(`Found MustacheIdentifier: ${child.expression.name}`);
            identifiers.push(child.expression.name.replace('()',''));
          } else if (child.type === 'Element') {
            traverse(child);
          }
        });
      }
    }
  }

  traverse(ast.html);

  return identifiers;
}


//console.log("BEFORE",JSON.stringify(customSyntaxObject,null,2));
/**@visitTextNodes() -- we wrap free radicals (loose hanging) text nodes in span tags
 * e.g. Hello world becomes <span> Hello World </span>
 * @visitMustacheIdentifierNodes we wrap loose hanging mustache tags into spans
 * e.g. {counter} becomes <span> {counter} </span>
 * 
 * we do this because in semantiq all html must be part of html Element (tag) node for 
 * more efficient handling.  
 * 
 * free radicals are text nodes or mustache identifiers that are not wrapped in 
 * html tags and belong to the parent tag <customSyntax> </customSyntax>
 * 
 * @visitEventHandlerNodes transforms event handlers e.g. from @click={incrementer} becomes @click={incrementer()} - other transformations are doen later on  
 */

visitTextNodes(customSyntaxObject); // wrap 
visitMustacheIdentifierNodes(customSyntaxObject);

// Build Event Driven Dependency Graph / map

const walk = new Walker();
const nodeType = 'MustacheIdentifier';
const returnType = {path: 'expression.name.name'}; 
const matchLogic = walk.createMatchLogic(nodeType);
const identifiers = walk.deepWalker(customSyntaxAST, nodeType, matchLogic, returnType);
//console.log("NEW IDENTIFIERS",identifiers);

let activeStack = [];

for (let i = 0; i < identifiers.length;  ++i) {

  const targetNode = identifiers[i].node;

  //console.log(identifiers[i].node);

const getNodeLocations = new GetNodePositions(customSyntaxAST, targetNode);
const nodeLocations = getNodeLocations.init();

//console.log("LOCS",nodeLocations);
const parentNode = nodeLocations[0].parentNode;
const parentNodeIndex = nodeLocations[0].nodeIndex; 

 
/**@grandParentNode
 * let's get grandparent node 
 * we want to replace the parent node of a reactive identifier or expression {...}
 * -- reactive elements (identifiers/mustacheTags and expressions)
 * are part of nodes (Elements) 
 * efficient transformation requires handling the whole block which is 
 * reactive elements plus their parent html nodes: e.g. in
 * <div> Counter value: {counter} </div> // {counter} is the reactive element
 * but we handle the whole div block as a reactive node 
 * for this reason - we need to get the grandParentNode of the targetNode ({counter})
 * so that we can replace the parentNode (<div>) in the grandParentNode with the new 
 * placeholder node 
 */ 

const getParentLocation = new GetNodePositions(customSyntaxAST, parentNode);
const grandParentLocation = getParentLocation.init();
const grandParentNode = grandParentLocation[0].parentNode;
const targetNodeIndex = grandParentLocation[0].nodeIndex; 

//console.log("HERE",grandParentLocation);

activeStack.push({
  identifier: identifiers[i].value,
  activeNode: targetNode,
  parentNode: parentNode,
  parentNodeIndex: parentNodeIndex,
  grandParentNode:grandParentNode,
  targetNodeIndex: targetNodeIndex

});

}

//console.log("THE ACTUAL STACK",activeStack);

const identifiersOnly = identifiers.map(item => item.value);
//console.log("identifiersOnly",identifiersOnly);


// Now get eventHandler function calls, if any
// attributes // "type": "EventHandler", expression -> "name": "incrementer"
const visitor = new AnyVisitor();
const handlers = visitor.htmlFunctionCallEventHandlers(customSyntaxAST[0]);
//console.log("Handlers", handlers);

// Let's get functions in the jsAST that match handlers
let identifiersInFunctions = "";

if (identifiers && handlers) {
    identifiersInFunctions = visitor.getIdentifiersInFunctions(identifiersOnly, handlers, customSyntaxAST[0], jsAST);
    //console.log("REACTIVE", identifiersInFunctions);
}

/**@visitEventHandlerNodes
 * now that we are done checking for active objects we can transform event handlers
 */

visitEventHandlerNodes(customSyntaxObject);

/**@transpiling for reactivity 
 * we hve ensure our walker does the efficient and accurate transaformations first
 * then we have to ensure we are getting accurate objects of 
 * identifiers, event handlers and functions attached to event handlers 
 */

let transpiledObjects;
// nodes, reactive , handlers ,reacive identifiers 
let mode = 1;
const transpiler = new Transpiler(identifiersInFunctions, customSyntaxObject, jsAST, activeStack, mode);
const transformedReactive = transpiler.getTransformedASTs();


// now do static
mode = 0;
const transpilerStatic = new Transpiler(identifiersInFunctions, customSyntaxObject, jsAST, activeStack, mode);
const transformedASTs = transpilerStatic.getTransformedASTs();

const newJsAST=transformedASTs.transformedJsAST;
const newHTMLAST=transformedASTs.transformedCustomSyntaxAST;

/**@Active static Node
 * Semantq active nodes, static nodes and reactive nodes
 * Active nodes are nodes with wither static or reactive js derived data
 * Static nodes have js derived data but are not reactive
 * Reactive nodes have js derived data which is reactive
 * we transpile reactive nodes first - 
 * if reactive nodes have static nodes that handles static as well as 
 * reactivity includes initial rendering which renders statics data 
 * whereas the static logic does not have the reactive capabilities 
 */


const jsCode = escodegen.generate(newJsAST);
//console.log("js code: ", jsCode);
const parsedHTML = customHtmlParser(newHTMLAST);
//console.log(parsedHTML);

async function writeCodeToFile(jsCode, parsedHTML) {
  const formattedJsCode = await prettier.format(jsCode, { parser: 'babel' });
  const formattedHTML = await prettier.format(parsedHTML, {
    parser: 'html',
    printWidth: 80,
    proseWrap: 'always',
    htmlWhitespaceSensitivity: 'css',
    indentSize: 2,
  });

  const output = `
<script type="module">
  ${formattedJsCode}
</script>

${formattedHTML}
`;

  fs.unlink('compiled/+page.smq.html', (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error(err);
    } else {
      fs.writeFile('compiled/+page.smq.html', output, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('File written successfully');
        }
      });
    }
  });
}

writeCodeToFile(jsCode, parsedHTML);


  