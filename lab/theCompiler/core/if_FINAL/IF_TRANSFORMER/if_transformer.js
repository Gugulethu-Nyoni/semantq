import escodegen from 'escodegen';
import { parse } from 'acorn';
import * as htmlParser from './semantq_parser.js';


const jsAST={
  "type": "Program",
  "start": 0,
  "end": 94,
  "body": [
    {
      "type": "ExpressionStatement",
      "start": 2,
      "end": 14,
      "expression": {
        "type": "AssignmentExpression",
        "start": 2,
        "end": 13,
        "operator": "=",
        "left": {
          "type": "Identifier",
          "start": 2,
          "end": 9,
          "name": "counter"
        },
        "right": {
          "type": "Literal",
          "start": 12,
          "end": 13,
          "value": 1,
          "raw": "1"
        }
      }
    },
    {
      "type": "FunctionDeclaration",
      "start": 16,
      "end": 57,
      "id": {
        "type": "Identifier",
        "start": 25,
        "end": 36,
        "name": "handleClick"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 40,
        "end": 57,
        "body": [
          {
            "type": "ExpressionStatement",
            "start": 43,
            "end": 55,
            "expression": {
              "type": "AssignmentExpression",
              "start": 43,
              "end": 54,
              "operator": "+=",
              "left": {
                "type": "Identifier",
                "start": 43,
                "end": 50,
                "name": "counter"
              },
              "right": {
                "type": "Literal",
                "start": 53,
                "end": 54,
                "value": 1,
                "raw": "1"
              }
            }
          }
        ]
      }
    }
  ],
  "sourceType": "script"
};







const customSyntaxAST=[
  [
    {
      "html": {
        "start": 0,
        "end": 197,
        "type": "Fragment",
        "children": [
          {
            "start": 0,
            "end": 197,
            "type": "Element",
            "name": "customSyntax",
            "attributes": null,
            "children": [
              [
                {
                  "start": 17,
                  "end": 88,
                  "type": "Element",
                  "name": "button",
                  "attributes": [
                    {
                      "start": 25,
                      "end": 46,
                      "type": "Attribute",
                      "name": {
                        "start": 25,
                        "end": 31,
                        "type": "EventHandler",
                        "name": "click",
                        "modifiers": [],
                        "expression": {
                          "type": "CallExpression",
                          "start": 25,
                          "end": 31
                        }
                      },
                      "value": [
                        {
                          "start": 33,
                          "end": 44,
                          "type": "MustacheAttribute",
                          "name": {
                            "type": "Identifier",
                            "start": 33,
                            "end": 44,
                            "name": "handleClick"
                          }
                        }
                      ]
                    },
                    {
                      "start": 46,
                      "end": 55,
                      "type": "Attribute",
                      "name": "id",
                      "value": [
                        {
                          "start": 50,
                          "end": 53,
                          "type": "Text",
                          "raw": "123",
                          "data": "123"
                        }
                      ]
                    },
                    {
                      "start": 55,
                      "end": 68,
                      "type": "Attribute",
                      "name": "class",
                      "value": [
                        {
                          "start": 62,
                          "end": 66,
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
                        "start": 69,
                        "end": 79,
                        "type": "Text",
                        "raw": " Click Me ",
                        "data": " Click Me "
                      }
                    ]
                  ]
                },
                {
                  "start": 90,
                  "end": 180,
                  "type": "Element",
                  "name": "span",
                  "attributes": null,
                  "children": [
                    [
                      {
                        "start": 96,
                        "end": 105,
                        "type": "Text",
                        "raw": " Clicked:",
                        "data": " Clicked:"
                      },
                      {
                        "type": "IfStatement",
                        "start": 105,
                        "end": 163,
                        "test": {
                          "type": "BinaryExpression",
                          "start": 112,
                          "end": 123,
                          "left": {
                            "type": "Identifier",
                            "start": 112,
                            "end": 123,
                            "name": "counter"
                          },
                          "operator": ">",
                          "right": {
                            "type": "Literal",
                            "start": 112,
                            "end": 123,
                            "value": 1,
                            "raw": "1"
                          }
                        },
                        "consequent": {
                          "type": "BlockStatement",
                          "start": 127,
                          "end": 163,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 127,
                              "end": 163,
                              "expression": {
                                "type": "ConditionalExpression",
                                "start": 127,
                                "end": 163,
                                "test": {
                                  "type": "BinaryExpression",
                                  "start": 129,
                                  "end": 142,
                                  "left": {
                                    "type": "Identifier",
                                    "start": 129,
                                    "end": 142,
                                    "name": "counter"
                                  },
                                  "operator": "===",
                                  "right": {
                                    "type": "Literal",
                                    "start": 129,
                                    "end": 142,
                                    "value": 1,
                                    "raw": "1"
                                  }
                                },
                                "consequent": {
                                  "type": "Literal",
                                  "start": 23,
                                  "end": 34,
                                  "value": "time",
                                  "raw": "'time'"
                                },
                                "alternate": {
                                  "type": "Literal",
                                  "start": 34,
                                  "end": 45,
                                  "value": "times",
                                  "raw": "'times'"
                                }
                              }
                            }
                          ]
                        },
                        "alternate": null
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
  ],
  []
];


const customSyntaxObject = {};

// Assuming your structure, you can assign parts of customSyntaxAST to customSyntaxObject
customSyntaxAST.forEach((section, index) => {
  customSyntaxObject[`section${index}`] = section;
});

class NodeVisitor {

  transformerMethod(node) {
    // Implement your visit logic here
  }
}

class TransformEventHandler extends NodeVisitor {

  transform(attribute, parent, key, index) {
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


class TransformIfStatement extends NodeVisitor {

 generateUniqueElementId() {
  const timestamp = Date.now().toString(36); // Convert current timestamp to base-36 string
  let randomStr = Math.random().toString(36).substr(2, 6); // Generate 6-character random string

  // Ensure randomStr is exactly 6 characters long
  while (randomStr.length < 6) {
    randomStr += Math.random().toString(36).substr(2, 1); // Add characters until length is 6
  }

  const uniqueId = `${timestamp}${randomStr}`; // Combine timestamp and random string
  return uniqueId;
}




    _generatePlaceHolderSpanNode (uniqueId)
    {
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



_generatePlaceHolderVariableAST (uniqueId) {

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
            "type": "Identifier",
            "start": 28,
            "end": 36,
            "name": `'${uniqueId}'`
          }
        }
      ],
      "kind": "const"
    }


}



  _getConsequentNode(ast, parent = null, key = null, index = null) {
  let result = null;

  function _visit(node, parent, key, index) {
    // console.log('Visiting node:', node);

    if (node && typeof node === 'object') {
      if (node.consequent) {
        //console.log('Found consequent node:', JSON.stringify(node, null, 2));
        result = {
          node: node.consequent,
          parent: node,  // The current node is the parent of its consequent
          key: 'consequent',
          index: null,  // Not applicable here as 'consequent' is not an array element
        };
        return; // Exit early if target node is found
      }

      for (let prop in node) {
        if (node.hasOwnProperty(prop)) {
          const child = node[prop];

          if (Array.isArray(child)) {
            child.forEach((subNode, idx) => {
              _visit(subNode, node, prop, idx);
            });
          } else if (typeof child === 'object') {
            _visit(child, node, prop, null);
          }
        }
      }
    } else if (Array.isArray(node)) {
      node.forEach((subNode, idx) => {
        _visit(subNode, parent, key, idx);
      });
    }
  }

  _visit(ast, parent, key, index);
  return result;
}



transform(node, parent, key, index,jsAST) {
    // Transform code here

  //console.log(JSON.stringify(node,null,2));

const uniqueId = this.generateUniqueElementId();
const placeholderSpan=this._generatePlaceHolderSpanNode(uniqueId);
const newNode = placeholderSpan;
   //console.log(node.consequent.body[0].type);
// adding new span node to customAST  object
    parent[key]=newNode; 

const placeHolderNodeConst = this._generatePlaceHolderVariableAST (uniqueId);
//console.log(JSON.stringify(placeHolderNodeConst,null,2));
 //console.log(JSON.stringify(parent,null,2));

// before we push the if statement node to jsAST object we need to get the consequnt node and transform it where needs be 

const consequentAstObject = this._getConsequentNode(node);
//console.log(consequentAstObject.key);

const consequentRawCode = escodegen.generate(consequentAstObject.node);

//console.log(consequentRawCode);

// remove the mustache custom syntax curly braces around the expression
const cleanConsequentRawCode = consequentRawCode.replace(/{|}/g, '');

const consequentExpressionConst = `const expr = ${cleanConsequentRawCode}`
const expressionEmitterBuilder= `const locationElement = document.getElementById(placeHolderElementId);
const newSpan=document.createElement('span');
const textNode=expr;
newSpan.textContent= textNode;
locationElement.appendChild(newSpan);`;

const newIntegratedConsequent= "{" + consequentExpressionConst + expressionEmitterBuilder + "}"; 
//console.log(consequentExpressionConst);

const newConsequentAST= parse(newIntegratedConsequent);
//console.log("Code:",JSON.stringify(newConsequentAST.body,null,2));


// NOW APPEND THE IF STATEMENT TO THE jsAST
jsAST.body.push(placeHolderNodeConst);

// now replace the  consequent node in  the IfStatement node with the new consequent ast
const updatedIfStatement = consequentAstObject.parent[consequentAstObject.key]=newConsequentAST;


//jsAST.body.push(newConsequentAST.body);
jsAST.body.push(node);


/* IF TRANSFORMER HELPER FUNCTITONS */


}

}





// Instantiate the TransformEventHandler
const eventHandlerInstance = new TransformEventHandler();
const IfStatementInstance = new TransformIfStatement();



// The visitors map with the instance of TransformEventHandler
const visitors = {
  'EventHandler': eventHandlerInstance, // Note the key is a string
  'IfStatement' : IfStatementInstance
};



function visit(ast, visitorsMap, jsAST) {
  function _visit(node, parent, key, index, jsAST) {

    if (node && node.type && node.type !== "Element") {
      if (node.type in visitorsMap) {
        const handlerInstance = visitorsMap[node.type];
        if (typeof handlerInstance.transform === "function") {
          handlerInstance.transform(node, parent, key, index, jsAST);
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
            if (typeof handlerInstance.transform === "function") {
              handlerInstance.transform(attribute, parent, key, index);
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

    transformedCustomedAST: ast,
    transformedjsAST: jsAST
  }

}





// Example usage with the AST object and visitors map
const transformedObjects = visit(customSyntaxObject, visitors,jsAST);

//console.log(JSON.stringify(transformedObjects.transformedjsAST, null,2)); // access specifc objects by keys e.g. transformedObjects[transformedjsAST]

const jsCode = escodegen.generate(transformedObjects.transformedjsAST);

//console.log(JSON.stringify(transformedObjects.transformedCustomedAST.section0[0],null,2));

console.log("js code: ", jsCode);

const parsedHTML = htmlParser.parseAST(transformedObjects.transformedCustomedAST.section0[0]);

console.log("html: ", parsedHTML);



//console.log(JSON.stringify(transformedAST, null, 2));
