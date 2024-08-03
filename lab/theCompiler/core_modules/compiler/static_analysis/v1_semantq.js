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
      "end": 335,
      "type": "Fragment",
      "children": [
        {
          "start": 0,
          "end": 335,
          "type": "Element",
          "name": "customSyntax",
          "attributes": null,
          "children": [
            [
              {
                "start": 18,
                "end": 90,
                "type": "Element",
                "name": "button",
                "attributes": [
                  {
                    "start": 26,
                    "end": 47,
                    "type": "Attribute",
                    "name": {
                      "start": 26,
                      "end": 32,
                      "type": "EventHandler",
                      "name": "click",
                      "modifiers": [],
                      "expression": {
                        "type": "CallExpression",
                        "start": 26,
                        "end": 32
                      }
                    },
                    "value": [
                      {
                        "start": 34,
                        "end": 45,
                        "type": "MustacheAttribute",
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 34,
                            "line": 5,
                            "column": 17
                          },
                          "end": {
                            "offset": 45,
                            "line": 5,
                            "column": 28
                          },
                          "name": "incrementer"
                        }
                      }
                    ]
                  },
                  {
                    "start": 47,
                    "end": 58,
                    "type": "Attribute",
                    "name": "id",
                    "value": [
                      {
                        "start": 51,
                        "end": 56,
                        "type": "Text",
                        "raw": "btnId",
                        "data": "btnId"
                      }
                    ]
                  },
                  {
                    "start": 58,
                    "end": 69,
                    "type": "Attribute",
                    "name": "class",
                    "value": [
                      {
                        "start": 65,
                        "end": 68,
                        "type": "Text",
                        "raw": "btn",
                        "data": "btn"
                      }
                    ]
                  }
                ],
                "children": [
                  [
                    {
                      "start": 71,
                      "end": 81,
                      "type": "Text",
                      "raw": "Increment ",
                      "data": "Increment "
                    }
                  ]
                ]
              },
              {
                "start": 91,
                "end": 98,
                "type": "Element",
                "name": "br",
                "attributes": null,
                "children": []
              },
              {
                "start": 98,
                "end": 170,
                "type": "Element",
                "name": "button",
                "attributes": [
                  {
                    "start": 106,
                    "end": 127,
                    "type": "Attribute",
                    "name": {
                      "start": 106,
                      "end": 112,
                      "type": "EventHandler",
                      "name": "click",
                      "modifiers": [],
                      "expression": {
                        "type": "CallExpression",
                        "start": 106,
                        "end": 112
                      }
                    },
                    "value": [
                      {
                        "start": 114,
                        "end": 125,
                        "type": "MustacheAttribute",
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 114,
                            "line": 7,
                            "column": 17
                          },
                          "end": {
                            "offset": 125,
                            "line": 7,
                            "column": 28
                          },
                          "name": "decrementer"
                        }
                      }
                    ]
                  },
                  {
                    "start": 127,
                    "end": 138,
                    "type": "Attribute",
                    "name": "id",
                    "value": [
                      {
                        "start": 131,
                        "end": 136,
                        "type": "Text",
                        "raw": "btnId",
                        "data": "btnId"
                      }
                    ]
                  },
                  {
                    "start": 138,
                    "end": 149,
                    "type": "Attribute",
                    "name": "class",
                    "value": [
                      {
                        "start": 145,
                        "end": 148,
                        "type": "Text",
                        "raw": "btn",
                        "data": "btn"
                      }
                    ]
                  }
                ],
                "children": [
                  [
                    {
                      "start": 151,
                      "end": 161,
                      "type": "Text",
                      "raw": "Decrement ",
                      "data": "Decrement "
                    }
                  ]
                ]
              },
              {
                "start": 171,
                "end": 178,
                "type": "Element",
                "name": "br",
                "attributes": null,
                "children": []
              },
              {
                "start": 178,
                "end": 227,
                "type": "Element",
                "name": "p",
                "attributes": [
                  {
                    "start": 181,
                    "end": 193,
                    "type": "Attribute",
                    "name": "class",
                    "value": [
                      {
                        "start": 188,
                        "end": 192,
                        "type": "Text",
                        "raw": "main",
                        "data": "main"
                      }
                    ]
                  }
                ],
                "children": [
                  [
                    {
                      "start": 195,
                      "end": 213,
                      "type": "Text",
                      "raw": "Counter value is: ",
                      "data": "Counter value is: "
                    },
                    {
                      "type": "MustacheIdentifier",
                      "start": {
                        "offset": 213,
                        "line": 9,
                        "column": 36
                      },
                      "end": {
                        "offset": 222,
                        "line": 9,
                        "column": 45
                      },
                      "expression": {
                        "type": "Identifier",
                        "start": {
                          "offset": 213,
                          "line": 9,
                          "column": 36
                        },
                        "end": {
                          "offset": 222,
                          "line": 9,
                          "column": 45
                        },
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 214,
                            "line": 9,
                            "column": 37
                          },
                          "end": {
                            "offset": 221,
                            "line": 9,
                            "column": 44
                          },
                          "name": "counter"
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
                    },
                    {
                      "start": 222,
                      "end": 223,
                      "type": "Text",
                      "raw": " ",
                      "data": " "
                    }
                  ]
                ]
              },
              {
                "start": 230,
                "end": 287,
                "type": "Element",
                "name": "div",
                "attributes": null,
                "children": [
                  [
                    {
                      "start": 236,
                      "end": 264,
                      "type": "Text",
                      "raw": "The button has been clicked ",
                      "data": "The button has been clicked "
                    },
                    {
                      "type": "MustacheIdentifier",
                      "start": {
                        "offset": 264,
                        "line": 12,
                        "column": 35
                      },
                      "end": {
                        "offset": 273,
                        "line": 12,
                        "column": 44
                      },
                      "expression": {
                        "type": "Identifier",
                        "start": {
                          "offset": 264,
                          "line": 12,
                          "column": 35
                        },
                        "end": {
                          "offset": 273,
                          "line": 12,
                          "column": 44
                        },
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 265,
                            "line": 12,
                            "column": 36
                          },
                          "end": {
                            "offset": 272,
                            "line": 12,
                            "column": 43
                          },
                          "name": "counter"
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
                    },
                    {
                      "start": 273,
                      "end": 281,
                      "type": "Text",
                      "raw": " times! ",
                      "data": " times! "
                    }
                  ]
                ]
              },
              {
                "start": 290,
                "end": 318,
                "type": "Element",
                "name": "h3",
                "attributes": null,
                "children": [
                  [
                    {
                      "start": 295,
                      "end": 307,
                      "type": "Text",
                      "raw": "Today is a: ",
                      "data": "Today is a: "
                    },
                    {
                      "type": "MustacheIdentifier",
                      "start": {
                        "offset": 307,
                        "line": 15,
                        "column": 18
                      },
                      "end": {
                        "offset": 312,
                        "line": 15,
                        "column": 23
                      },
                      "expression": {
                        "type": "Identifier",
                        "start": {
                          "offset": 307,
                          "line": 15,
                          "column": 18
                        },
                        "end": {
                          "offset": 312,
                          "line": 15,
                          "column": 23
                        },
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 308,
                            "line": 15,
                            "column": 19
                          },
                          "end": {
                            "offset": 311,
                            "line": 15,
                            "column": 22
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
                    },
                    {
                      "start": 312,
                      "end": 313,
                      "type": "Text",
                      "raw": " ",
                      "data": " "
                    }
                  ]
                ]
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


  transformNode(attribute, parent, key, index) {
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
    //console.log("Before Transformation:", JSON.stringify(this.customSyntaxAST, null, 2));
this.transpile();
//console.log("After Transformation:", JSON.stringify(this.customSyntaxAST, null, 2));

  }

  transpile() {
    const walk = new Walker();
    const targetNode = 'MustacheIdentifier';
    const mustacheIdentifierNodes = walk.traverse(this.customSyntaxAST, targetNode);

    let identifierNamesObject = [];

    mustacheIdentifierNodes.forEach(node => {
      const identifierName = node.targetNode.expression.name.name;
      
      if (!identifierNamesObject.includes(identifierName)) {
        identifierNamesObject.push(identifierName);
      }

      if (this.identifiersinFunctionsObject.some(item => item.hasOwnProperty(identifierName))) {
        
        this.transformReactive(node, identifierName);
      } else {
        this.transformStatic(node, identifierName);
      }
    });

   
  

  }

  transformStatic(node, identifier) {
    //const uniqueId = this.generateUniqueElementId();
    //const placeholderSpan = this._generatePlaceHolderSpanNode(uniqueId);
    //const newNode = placeholderSpan;

    const dataAttribute='smq-' + identifier + '-data';
    const dataSpanNode = this._generateDataSpan(dataAttribute);
    const newNode = dataSpanNode;  
    let parent;
    
  if (Array.isArray(node)) {
    parent = node[0].parent[node[0].index];
    const key = Object.keys(parent).find(key => parent[key] === node[0]);
    parent[key] = newNode;
  } else {
    parent = node.parent; //console.log("Key ", node.key);
    const targetNode = parent.find(node => node.type === 'MustacheIdentifier');
    parent.splice(parent.indexOf(targetNode), 1, newNode);

  }

    //console.log(JSON.stringify(this.customSyntaxAST,null,2));

    //const placeHolderNodeIdConst = this._generatePlaceHolderVariableAST(uniqueId);

/*
    const newJsCode = `
      const locationElement = document.getElementById('${uniqueId}');
      const elem = document.createElement('text'); 
      elem.textContent = ${identifier};
      locationElement.insertBefore(elem, locationElement.firstChild);
    `;

*/

  if (!this.staticHandledIdentifiersJs.includes(identifier)) {
    //console.log(this.staticHandledIdentifiersJs); // Logging for debugging

    const newJsCode = `
        const ${identifier}Displays = document.querySelectorAll('[${dataAttribute}]');
        ${identifier}Displays.forEach(${identifier}Display => {
            ${identifier}Display.textContent = ${identifier};
        });
    `;

    const newJsNode = parse(newJsCode, { ecmaVersion: 2022 });
    this.jsAST.body.push(newJsNode);
    this.staticHandledIdentifiersJs.push(identifier); // Adding identifier to the handled list
}





   
    
  }





  transformReactive(node, identifier) {

    // node is a MustacheIdentifier node
    // transform html 

    const dataAttribute='smq-' + identifier + '-data';
    const dataSpanNode = this._generateDataSpan(dataAttribute);
    const newHtmlNode = dataSpanNode;  
    
    let parent;
    
  if (Array.isArray(node)) {
    parent = node[0].parent[node[0].index];
    const key = Object.keys(parent).find(key => parent[key] === node[0]);
    parent[key] = newHtmlNode;
  } else {
    parent = node.parent; //console.log("Key ", node.key);
    const targetNode = parent.find(node => node.type === 'MustacheIdentifier');
    parent.splice(parent.indexOf(targetNode), 1, newHtmlNode);

  }




    // JS Reactive transformation logic here

    const functions = this.identifiersinFunctionsObject[0][identifier];
    //console.log("Funcs", functions);

const reRenderFunctionName = 'reRender' + identifier.charAt(0).toUpperCase() + identifier.slice(1);
const reRenderFuncCall = `${reRenderFunctionName}();`;
  
  // console.log(reRenderFuncCall);

 const reRenderCallNode = this._jsAstGenerator(reRenderFuncCall);
 const newNode=reRenderCallNode;

// console.log(JSON.stringify(reRenderCallNode,null,2));


 functions.forEach(func => { 

  //console.log(func);  

  const existsWithValue = this.reactiveFunctionsRerenders.some(obj => 
  obj[identifier] && obj[identifier] === func
);

if (!existsWithValue) {

  // FunctionDeclaration
  // incrementer func
 const walk = new Walker();
 const nodeType ='FunctionDeclaration';
 const nodeName=func;
 const nodeNameChecker = (node, nodeName) => node.id.name === nodeName;
 const targetNode = walk.traverseForTypeAndName(this.jsAST, nodeType, nodeName, nodeNameChecker);

//console.log("Node Before",JSON.stringify(targetNode,null,2));

targetNode[0].body.body.push(newNode);

const reRendersLogger = {
[identifier]: func, 

}

this.reactiveFunctionsRerenders.push(reRendersLogger);

//console.log("Node After",JSON.stringify(targetNode,null,2));

// this.reactiveFunctionsRerenders


//return; 

}



// add 


});



// now create the reRender${identifier} function 

 if (!this.reactiveHandledIdentifiersFuncs.includes(identifier)) {
  
const uppercaseIdentifier = identifier.charAt(0).toUpperCase() + identifier.slice(1);
const dataAttribute = 'smq-' + identifier + '-data';

const newJsCode = `
  function reRender${uppercaseIdentifier}() {
    const ${identifier}Displays = document.querySelectorAll('[${dataAttribute}]');
    ${identifier}Displays.forEach(${identifier}Display => {
      ${identifier}Display.textContent = ${identifier};
    });
  }

  // initial rendering 

reRender${uppercaseIdentifier}();

`;


const newJsNode = parse(newJsCode, { ecmaVersion: 2022 });
this.jsAST.body.push(newJsNode);

this.reactiveHandledIdentifiersFuncs.push(identifier); // Adding identifier to the handled list


}

  


    
  }
   

   _jsAstGenerator (jsCode) {


return parse(jsCode, { ecmaVersion: 2023});




   }



  generateUniqueElementId() {
    const timestamp = Date.now().toString(36);
    let randomStr = Math.random().toString(36).substr(2, 6);

    while (randomStr.length < 6) {
      randomStr += Math.random().toString(36).substr(2, 1);
    }

    return `${timestamp}${randomStr}`;
  }

  _generatePlaceHolderSpanNode(uniqueId) {
    return {
      "start": 0,
      "end": 18,
      "type": "SelfClosingElement",
      "name": "sspan",
      "attributes": [
        {
          "start": 6,
          "end": 15,
          "type": "Attribute",
          "name": "id",
          "value": [
            {
              "start": 10,
              "end": 14,
              "type": "Text",
              "raw": uniqueId,
              "data": uniqueId
            }
          ]
        }
      ],
      "children": []
    };
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




getTransformedASTs() {
    return {
      transformedCustomSyntaxAST: this.customSyntaxAST,
      transformedJsAST: this.jsAST
    };
  }


}







/*

class dependencyGraph extends NodeVisitor {




buildDependencyGraph (reactiveVariable, customSyntaxAST, jsAST) {
console.log("phakathi inside");



}


}

*/


function visit(ast, visitorsMap, jsAST) {
  function _visit(node, parent, key, index, jsAST) {

    if (node && node.type && node.type !== "Element") {
      if (node.type in visitorsMap) {
        const handlerInstance = visitorsMap[node.type];
        if (typeof handlerInstance.transformNode === "function") {
          handlerInstance.transformNode(node, parent, key, index, jsAST);
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
              handlerInstance.transformNode(attribute, parent, key, index);
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


/*
const dependencyTracker = new dependencyGraph(); 
const dependencyGraphObject = dependencyTracker.buildDependencyGraph();

console.log(dependencyGraphObject);
*/







// Instantiate the TransformEventHandler
const eventHandlerInstance = new TransformEventHandler();
//const IfStatementInstance = new TransformIfStatement();



// The visitors map with the instance of TransformEventHandler
const visitors = {
  'EventHandler': eventHandlerInstance, // Note the key is a string
  
};

// Example usage with the AST object and visitors map
const transformedObjects = visit(customSyntaxObject, visitors,jsAST);

//console.log(transformedObjects);






// Build Event Driven Dependency Graph / map

// Traverse custom syntax to get all Mustache Identifiers
const visitor = new AnyVisitor();
const mustacheIdentifiersObject = visitor.mustacheIdentifiersObject(customSyntaxAST[0]);
console.log("Identifiers", mustacheIdentifiersObject);

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

//if (identifiersInFunctions.length > 0) {
  //console.log("inndddd");
/*
const transpiler = new Transpiler(identifiersInFunctions,transformedObjects.transformedCustomAST, transformedObjects.transformedjsAST);
transpiledObjects = transpiler.transpile();
*/

//const transpiler = new Transpiler(identifiersInFunctions, customSyntaxAST, jsAST);

const transpiler = new Transpiler(identifiersInFunctions, customSyntaxAST, jsAST);
const transformedASTs = transpiler.getTransformedASTs();
//console.log("Transformed Custom Syntax AST:", JSON.stringify(transformedASTs.transformedCustomSyntaxAST, null, 2));
//console.log("Transformed JS AST:", JSON.stringify(transformedASTs.transformedJsAST, null, 2));




//console.log("TT",transpiler);

//} 


//console.log(transpiledObjects);



//console.log(JSON.stringify(transpiledObjects.t_jsAST,null,2));

//console.log(escodegen.generate(transpiledObjects.t_jsAST));

/// here on we work transpiledObjects


//console.log(JSON.stringify(transformedObjects.transformedjsAST, null,2)); // access specifc objects by keys e.g. transformedObjects[transformedjsAST]

const jsCode = escodegen.generate(transformedASTs.transformedJsAST);

//console.log(JSON.stringify(transformedObjects.t_customedAST.section0[0],null,2));

//console.log(JSON.stringify(transformedObjects.t_customAST,null,2));

console.log("js code: ", jsCode);

const parsedHTML = customHtmlParser(transformedASTs.transformedCustomSyntaxAST[0]);
console.log(parsedHTML);


