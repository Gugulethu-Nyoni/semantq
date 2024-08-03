import escodegen from 'escodegen';
import { parse } from 'acorn';
import customHtmlParser from '../customHtmlParser.js';


const jsAST= {
  "type": "Program",
  "start": 0,
  "end": 130,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 2,
      "end": 18,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 6,
          "end": 17,
          "id": {
            "type": "Identifier",
            "start": 6,
            "end": 13,
            "name": "counter"
          },
          "init": {
            "type": "Literal",
            "start": 16,
            "end": 17,
            "value": 0,
            "raw": "0"
          }
        }
      ],
      "kind": "let"
    },
    {
      "type": "FunctionDeclaration",
      "start": 21,
      "end": 61,
      "id": {
        "type": "Identifier",
        "start": 30,
        "end": 41,
        "name": "incrementer"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 45,
        "end": 61,
        "body": [
          {
            "type": "ExpressionStatement",
            "start": 48,
            "end": 58,
            "expression": {
              "type": "UpdateExpression",
              "start": 48,
              "end": 57,
              "operator": "++",
              "prefix": false,
              "argument": {
                "type": "Identifier",
                "start": 48,
                "end": 55,
                "name": "counter"
              }
            }
          }
        ]
      }
    },
    {
      "type": "FunctionDeclaration",
      "start": 65,
      "end": 105,
      "id": {
        "type": "Identifier",
        "start": 74,
        "end": 85,
        "name": "decrementer"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 89,
        "end": 105,
        "body": [
          {
            "type": "ExpressionStatement",
            "start": 93,
            "end": 103,
            "expression": {
              "type": "UpdateExpression",
              "start": 93,
              "end": 102,
              "operator": "--",
              "prefix": false,
              "argument": {
                "type": "Identifier",
                "start": 93,
                "end": 100,
                "name": "counter"
              }
            }
          }
        ]
      }
    },
    {
      "type": "VariableDeclaration",
      "start": 107,
      "end": 126,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 111,
          "end": 125,
          "id": {
            "type": "Identifier",
            "start": 111,
            "end": 114,
            "name": "day"
          },
          "init": {
            "type": "Literal",
            "start": 117,
            "end": 125,
            "value": "Monday",
            "raw": "'Monday'"
          }
        }
      ],
      "kind": "let"
    }
  ],
  "sourceType": "script"
};




const customSyntaxAST=  [
  {
    "html": {
      "start": 0,
      "end": 53,
      "type": "Fragment",
      "children": [
        {
          "start": 0,
          "end": 53,
          "type": "Element",
          "name": "customSyntax",
          "attributes": null,
          "children": [
            [
              {
                "start": 17,
                "end": 30,
                "type": "Text",
                "raw": "Hello World: ",
                "data": "Hello World: "
              },
              {
                "type": "MustacheIdentifier",
                "start": {
                  "offset": 30,
                  "line": 4,
                  "column": 14
                },
                "end": {
                  "offset": 35,
                  "line": 4,
                  "column": 19
                },
                "expression": {
                  "type": "Identifier",
                  "start": {
                    "offset": 30,
                    "line": 4,
                    "column": 14
                  },
                  "end": {
                    "offset": 35,
                    "line": 4,
                    "column": 19
                  },
                  "name": {
                    "type": "Identifier",
                    "start": {
                      "offset": 31,
                      "line": 4,
                      "column": 15
                    },
                    "end": {
                      "offset": 34,
                      "line": 4,
                      "column": 18
                    },
                    "name": "day"
                  },
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 2
                    },
                    "end": {
                      "line": 1,
                      "column": 3
                    }
                  }
                }
              }
            ]
          ]
        }
      ]
    }
  }
];





const customSyntaxObject = customSyntaxAST[0];

// Assuming your structure, you can assign parts of customSyntaxAST to customSyntaxObject
/*
customSyntaxAST.forEach((section, index) => {
  customSyntaxObject[`section${index}`] = section;
});
*/

//console.log(JSON.stringify(customSyntaxObject,null,2));



class NodeVisitor {
  buildDependencyGraph(reactiveVariable, customSyntaxAST, jsAST) {
    throw new Error('Class must be implemented by a subclass');
  }

  transformNode(node) {
    throw new Error('Node Transformer must be implemented by a subclass');
  }

  addNode(ast, parentNode, key, newNode) {
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

    return identifiersObject;
  }

  htmlFunctionCallEventHandlers(customSyntaxAST) {
    let handlersObject = [];
    const targetNode = 'MustacheAttribute';
    const walk = new Walker();
    const results = walk.traverse(customSyntaxAST, targetNode);
    if (results) {
      results.forEach(result => {
        const handler = result.targetNode.name.name;
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
        const funcNodeName = handler;

        const nodeNameChecker = (node, funcNodeName) => node.id.name === funcNodeName;

        const functionExists = walk.traverseForTypeAndName(jsAST, funcNodeType, funcNodeName, nodeNameChecker);

        //console.log("FE",functionExists);

        if (functionExists.length > 0) {
          const functionNode = functionExists[0];

          //console.log(`Function ${handler} node:`, functionNode);

          const nodeType = 'Identifier';
          const nodeName = identifier;
          const identifierChecker = (node, nodeName) => node.name === nodeName;

          const exists = walk.traverseForTypeAndName(functionNode, nodeType, nodeName, identifierChecker);

          //console.log(`Checking identifier: ${identifier} in function: ${handler}`, exists);

          if (exists.length > 0) {
            
            //console.log("Found identifier:", nodeName);

            const existingEntry = identifiersInFunctions.find(entry => entry.hasOwnProperty(nodeName));

            if (existingEntry) {
              if (!existingEntry[nodeName].includes(handler)) {
                existingEntry[nodeName].push(handler);
              }
            } else {
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



class TransformEventHandler extends NodeVisitor {


  transformAttributeNode(attribute, parent, key, index) {
    // Transform code here

    if (attribute.name.type === 'EventHandler')
        {

        const tranformedfunctionIdentifier = attribute.value[0].name.name + "()";
        //console.log(tranformedfunctionIdentifier);

        attribute.value[0].name.name = tranformedfunctionIdentifier; 

        }
      
    //console.log(JSON.stringify(attribute, null, 2));
  }

}


class TransformTextNodes extends NodeVisitor {


transformTextNode (textNode, parent, key, index) {

      console.log('Transforming Text node with no element parent');
      //console.log(parent);

    const walk = new Walker();
    const targetNode ='Text';
    const data = walk.traverse(parent, targetNode);
    console.log("DATA",JSON.stringify(data,null,2));


  }



}






class Walker extends NodeVisitor {

traverse(ast, targetNode) {
    const results = [];

    function _traverse(node, parent, key, index) {
        if (node === null || node === undefined) {
            return; // Stop traversal for non-existent nodes
        }

        if (node.type === targetNode) {
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

    _traverse(ast, null, targetNode, null); // Start traversal from the root node
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
  constructor(identifiersinFunctionsObject, customSyntaxAST, jsAST) {
    super();
    this.identifiersinFunctionsObject = identifiersinFunctionsObject;
    this.customSyntaxAST = customSyntaxAST;
    this.jsAST = jsAST;
    this.staticHandledIdentifiersJs=[];
    this.reactiveFunctionsRerenders=[];
    this.reactiveHandledIdentifiersFuncs=[];
    this.transpile();


  }

  transpile() {
    const walk = new Walker();
    const targetNode = 'MustacheIdentifier';
    const mustacheIdentifierNodes = walk.walk(this.customSyntaxAST, targetNode);
    let identifierNamesObject = [];
    mustacheIdentifierNodes.forEach((block) => {
      //console.log(block.targetNode.expression.name.name); return;
      const identifierName = block.targetNode.expression.name.name;
      if (!identifierNamesObject.includes(identifierName)) {
        identifierNamesObject.push(identifierName);
      }
      //console.log("these",identifierNamesObject); return;
      if (this.identifiersinFunctionsObject.some(item => item.hasOwnProperty(identifierName))) {
        this.transformReactive(block, identifierName);
      } else {
        this.transformStatic(block, identifierName);
      }
    });
   

  }

   transformStatic(block, identifier) {
    // Generate unique ID and placeholder span node
    const uniqueId = this.generateUniqueElementId();
    const placeholderSpan = this._generatePlaceHolderSpanNode(uniqueId);
    const newNode = placeholderSpan;

    // Log the original node and its parent before transformation
    console.log("Original Node:", block.grandParent.children[0][block.parentIndex]);

    // Apply the transformation
    block.grandParent.children[0][block.parentIndex] = newNode;

    // Log the updated node and its parent after transformation
    //console.log("Updated Node:", block.grandParent.children[0][block.parentIndex]);

    // Generate names for HTML and JS fragments
    let targetConstName;
    let fragmentHTMLName;
    const randomStr = this._generateRandomText();

    if (block.parent.type === 'Element') {
        targetConstName = (`target_${block.parent.name}_${randomStr}`).toLowerCase();
        fragmentHTMLName = (`fragment_${randomStr}`).toLowerCase();
    } else {
        targetConstName = (`${this._generateRandomText()}_${uniqueId}`).toLowerCase();
    }

    const tagNameConst = `${block.parent.name}_${randomStr}`;
    console.log("Match", tagNameConst);

    const parentHtml = customHtmlParser(block.parent);
    const htmlToJs = this.parseHtmlElementToJs(parentHtml, randomStr);

    // Generate JavaScript code
    const newJsCode = `
        ${htmlToJs}
        const ${targetConstName} = document.getElementById('${uniqueId}');
        ${targetConstName}.insertBefore(${tagNameConst}, ${targetConstName}.firstChild);
    `;

    // Parse and add new JS node to the AST
    const newJsNode = parse(newJsCode, { ecmaVersion: 2022 });
    this.jsAST.body.push(newJsNode);
    this.staticHandledIdentifiersJs.push(identifier); // Add identifier to the handled list
}

  transformReactive(block, identifier) {
    // Generate unique ID and placeholder span node
    const uniqueId = this.generateUniqueElementId();
    const placeholderSpan = this._generatePlaceHolderSpanNode(uniqueId);
    const newHTMLNode = placeholderSpan;

    // Replace node in grandParent
    block.grandParent.children[0][block.parentIndex] = newHTMLNode;

    // JavaScript Reactive transformation logic
    const functions = this.identifiersinFunctionsObject[0][identifier];
    const reRenderFunctionName = 'reRender' + identifier.charAt(0).toUpperCase() + identifier.slice(1);
    const reRenderFuncCall = `${reRenderFunctionName}();`;
    const reRenderCallNode = this._jsAstGenerator(reRenderFuncCall);
    const newNode = reRenderCallNode;

    functions.forEach(func => {
        const existsWithValue = this.reactiveFunctionsRerenders.some(obj => 
            obj[identifier] && obj[identifier] === func
        );

        if (!existsWithValue) {
            // FunctionDeclaration - Incrementer func
            const walk = new Walker();
            const nodeType = 'FunctionDeclaration';
            const nodeName = func;
            const nodeNameChecker = (node, nodeName) => node.id.name === nodeName;
            const targetNode = walk.traverseForTypeAndName(this.jsAST, nodeType, nodeName, nodeNameChecker);

            targetNode[0].body.body.push(newNode);

            const reRendersLogger = { [identifier]: func };
            this.reactiveFunctionsRerenders.push(reRendersLogger);
        }
    });

    // Generate names for HTML and JS fragments
    let targetConstName;
    let fragmentHTMLName;
    const randomStr = this._generateRandomText();

    if (block.parent.type === 'Element') {
        targetConstName = (`target_${block.parent.name}_${randomStr}`).toLowerCase();
        fragmentHTMLName = (`fragment_${randomStr}`).toLowerCase();
    } else {
        targetConstName = (`${this._generateRandomText()}_${uniqueId}`).toLowerCase();
    }

    const tagNameConst = `${block.parent.name}_${randomStr}`;
    const parentHtml = customHtmlParser(block.parent);
    const htmlToJs = this.parseHtmlElementToJs(parentHtml, randomStr);

    const jsNodeCreatorCode = `
        ${htmlToJs}
        const ${targetConstName} = document.getElementById('${uniqueId}');
        ${targetConstName}.innerHTML = ''; // Optional: clear previous content
        ${targetConstName}.appendChild(${tagNameConst}); // Use appendChild to add new element
    `;
   
        const uppercaseIdentifier = identifier.charAt(0).toUpperCase() + identifier.slice(1); 
        /*  here we need to determine if this function has been created or not */

          const walk = new Walker();
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

 parseHtmlElementToJs(htmlString, randomStr) {
  // Define Node constants for non-browser environments
  const TEXT_NODE = 3;
  const ELEMENT_NODE = 1;

  function escapeString(str) {
    return str.replace(/'/g, "\\'");
  }

  // Parse HTML string to an object representation
  const parseHtmlToObject = (htmlString) => {
    const container = { tagName: '', attributes: [], childNodes: [] };
    const regex = /<(\w+)([^>]*)>(.*?)<\/\1>/s;
    const match = htmlString.match(regex);
    
    if (match) {
      container.tagName = match[1];
      container.attributes = [...match[2].matchAll(/(\w+)="([^"]*)"/g)].map(attr => ({ name: attr[1], value: attr[2] }));
      container.childNodes.push({ nodeType: TEXT_NODE, textContent: match[3] });
    }
    return container;
  };

  // Internal function to handle attributes
  function handleAttributes(attributes) {
    const keyValueAttributes = [];
    const keyOnlyAttributes = [];

    attributes.forEach(attr => {
      if (attr.value) {
        keyValueAttributes.push(`'${attr.name}': '${escapeString(attr.value)}'`);
      } else {
        keyOnlyAttributes.push(`'${attr.name}'`);
      }
    });

    return {
      keyValueAttributes: keyValueAttributes.join(', '),
      keyOnlyAttributes: keyOnlyAttributes.join(', ')
    };
  }

  // Create JavaScript code to reconstruct the element
  function createElementJsCode(element) {
    //const transpiler =new Transpiler();
    const tagName = element.tagName.toLowerCase();
    const { keyValueAttributes, keyOnlyAttributes } = handleAttributes(element.attributes);

    let jsCode = `const ${tagName}_${randomStr} = document.createElement('${tagName}');\n`;

    if (keyValueAttributes) {
      jsCode += `Object.assign(${tagName}_${randomStr}.attributes, { ${keyValueAttributes} });\n`;
    }

    if (keyOnlyAttributes) {
      keyOnlyAttributes.split(', ').forEach(attr => {
        jsCode += `${tagName}_${randomStr}.setAttribute(${attr}, '');\n`;
      });
    }

    if (element.childNodes.length > 0) {
      element.childNodes.forEach(child => {
        if (child.nodeType === TEXT_NODE) {
          jsCode += `${tagName}_${randomStr}.textContent += \`${escapeString(child.textContent)}\`;\n`;
        } else if (child.nodeType === ELEMENT_NODE) {
          const childTagName = child.tagName.toLowerCase();
          jsCode += `const child_${childTagName} = ${createElementJsCode(child)};\n`;
          jsCode += `${tagName}_${randomStr}.appendChild(child_${childTagName});\n`;
        }
      });
    }

    return jsCode;
  }

  const element = parseHtmlToObject(htmlString);
  return createElementJsCode(element);
}


getTransformedASTs() {
    return {
      transformedCustomSyntaxAST: this.customSyntaxAST,
      transformedJsAST: this.jsAST
    };
  }


}



function visit(ast, visitorsMap, jsAST) {

console.log("here Now-",visitorsMap);


  
  function _visit(node, parent, key, index, jsAST) {

    if (node && node.type && node.type !== "Element") {

      console.log("TYPE",node.type);
      
     
      if (node.type in visitorsMap) {
        const handlerInstance = visitorsMap[node.type];
        const transformMethod= 'transform'+node.type+'Node';
        if (typeof handlerInstance.transformNode === "function") {
          handlerInstance[transformMethod](node, parent, key, index);
        }
        } 



    }




    if (node !== null && node.type === "Element") {
      const attributes = node.attributes;
      if (attributes) {
        for (const attribute of attributes) {
          const attributeType = attribute.name.type;
          if (attributeType in visitorsMap) {
            //console.log(`Visiting attribute of type: ${attributeType}`);
            const handlerInstance = visitorsMap[attributeType];
            if (typeof handlerInstance.transformNode === "function") {
              handlerInstance.transformAttributeNode(attribute, parent, key, index);
            }
          }
        }
      }
    }

    if (Array.isArray(node)) {
      node.forEach((childNode, childIndex) => {
        _visit(childNode, node, childIndex, childIndex, jsAST);
      });
    } else if (typeof node === 'object' && node !== null) {
      Object.keys(node).forEach((prop) => {
        _visit(node[prop], node, prop, null, jsAST);
      });
    }
  }

  _visit(ast, null, null, null, jsAST);

  //return ast;

  return {

    t_customAST: ast,
    t_jsAST: jsAST
  }



}





/*

/// so identifiersInFunctions are identifiers like {counter} in the html declrative syntax, involved in event attached functions in the js 

console.log(identifiersInFunctions); /// output below 

[
  { counter: [ 'decrementer', 'incrementer' ] },
  { name: [ 'decrementer' ] }
]

the key is the variable/identifier and event attached functions it is involved in  
*/



// Instantiate the TransformEventHandler
const eventHandlerInstance = new TransformEventHandler();
const textNodesInstance = new TransformTextNodes();

//const IfStatementInstance = new TransformIfStatement();



// The visitors map with the instance of TransformEventHandler
const visitors = {
  'EventHandler': eventHandlerInstance, // Note the key is a string
  'Text': textNodesInstance,
  
};

// Example usage with the AST object and visitors map
const transformedObjects = visit(customSyntaxObject, visitors,jsAST);

//console.log(transformedObjects);




/*


// Build Event Driven Dependency Graph / map

// Traverse custom syntax to get all Mustache Identifiers
const visitor = new AnyVisitor();
const mustacheIdentifiersObject = visitor.mustacheIdentifiersObject(customSyntaxAST[0]);
//console.log("Identifiers", mustacheIdentifiersObject);

// Now get eventHandler function calls, if any
// attributes // "type": "EventHandler", expression -> "name": "incrementer"
const handlers = visitor.htmlFunctionCallEventHandlers(customSyntaxAST[0]);
//console.log("Handlers", handlers);

// Let's get functions in the jsAST that match handlers
let identifiersInFunctions = "";

if (mustacheIdentifiersObject && handlers) {
    identifiersInFunctions = visitor.getIdentifiersInFunctions(mustacheIdentifiersObject, handlers, customSyntaxAST[0], jsAST);
    //console.log("HG", identifiersInFunctions);
}

let transpiledObjects;

const transpiler = new Transpiler(identifiersInFunctions, customSyntaxObject, jsAST);
const transformedASTs = transpiler.getTransformedASTs();
//console.log("Transformed Custom Syntax AST:", JSON.stringify(transformedASTs.transformedCustomSyntaxAST, null, 2));
//console.log("Transformed JS AST:", JSON.stringify(transformedASTs.transformedJsAST, null, 2));



const jsCode = escodegen.generate(transformedASTs.transformedJsAST);
console.log("js code: ", jsCode);
const parsedHTML = customHtmlParser(transformedASTs.transformedCustomSyntaxAST);
console.log(parsedHTML);


*/

