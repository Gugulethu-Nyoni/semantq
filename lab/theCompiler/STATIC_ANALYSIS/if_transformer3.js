//import pkg from 'json-stringify-safe';
//const { stringify } = pkg;

import escodegen from 'escodegen';

// Example AST object
const ast = {
  "html": {
    "start": 0,
    "end": 161,
    "type": "Fragment",
    "children": [
      {
        "start": 0,
        "end": 161,
        "type": "IfBlock",
        "expression": {
          "type": "Identifier",
          "start": 5,
          "end": 12,
          "loc": {
            "start": {
              "line": 1,
              "column": 5
            },
            "end": {
              "line": 1,
              "column": 12
            }
          },
          "name": "counter"
        },
        "children": [
          {
            "start": 15,
            "end": 153,
            "type": "Element",
            "name": "button",
            "attributes": [
              {
                "start": 23,
                "end": 46,
                "type": "EventHandler",
                "name": "click",
                "modifiers": [],
                "expression": {
                  "type": "Identifier",
                  "start": 33,
                  "end": 45,
                  "loc": {
                    "start": {
                      "line": 3,
                      "column": 18
                    },
                    "end": {
                      "line": 3,
                      "column": 30
                    }
                  },
                  "name": "handlerClick"
                }
              },
              {
                "start": 47,
                "end": 59,
                "type": "Attribute",
                "name": "class",
                "value": [
                  {
                    "start": 54,
                    "end": 58,
                    "type": "Text",
                    "raw": "main",
                    "data": "main"
                  }
                ]
              },
              {
                "start": 60,
                "end": 86,
                "type": "EventHandler",
                "name": "mouseover",
                "modifiers": [],
                "expression": {
                  "type": "Identifier",
                  "start": 74,
                  "end": 85,
                  "loc": {
                    "start": {
                      "line": 3,
                      "column": 59
                    },
                    "end": {
                      "line": 3,
                      "column": 70
                    }
                  },
                  "name": "mouserevent"
                }
              }
            ],
            "children": [
              {
                "start": 87,
                "end": 99,
                "type": "Text",
                "raw": " \n\nClicked: ",
                "data": " \n\nClicked: "
              },
              {
                "start": 99,
                "end": 108,
                "type": "MustacheTag",
                "expression": {
                  "type": "Identifier",
                  "start": 100,
                  "end": 107,
                  "loc": {
                    "start": {
                      "line": 5,
                      "column": 10
                    },
                    "end": {
                      "line": 5,
                      "column": 17
                    }
                  },
                  "name": "counter"
                }
              },
              {
                "start": 108,
                "end": 109,
                "type": "Text",
                "raw": " ",
                "data": " "
              },
              {
                "start": 109,
                "end": 141,
                "type": "MustacheTag",
                "expression": {
                  "type": "ConditionalExpression",
                  "start": 110,
                  "end": 140,
                  "loc": {
                    "start": {
                      "line": 5,
                      "column": 20
                    },
                    "end": {
                      "line": 5,
                      "column": 50
                    }
                  },
                  "test": {
                    "type": "BinaryExpression",
                    "start": 110,
                    "end": 121,
                    "loc": {
                      "start": {
                        "line": 5,
                        "column": 20
                      },
                      "end": {
                        "line": 5,
                        "column": 31
                      }
                    },
                    "left": {
                      "type": "Identifier",
                      "start": 110,
                      "end": 117,
                      "loc": {
                        "start": {
                          "line": 5,
                          "column": 20
                        },
                        "end": {
                          "line": 5,
                          "column": 27
                        }
                      },
                      "name": "counter"
                    },
                    "operator": ">",
                    "right": {
                      "type": "Literal",
                      "start": 120,
                      "end": 121,
                      "loc": {
                        "start": {
                          "line": 5,
                          "column": 30
                        },
                        "end": {
                          "line": 5,
                          "column": 31
                        }
                      },
                      "value": 1,
                      "raw": "1"
                    }
                  },
                  "consequent": {
                    "type": "Literal",
                    "start": 124,
                    "end": 131,
                    "loc": {
                      "start": {
                        "line": 5,
                        "column": 34
                      },
                      "end": {
                        "line": 5,
                        "column": 41
                      }
                    },
                    "value": "times",
                    "raw": "'times'"
                  },
                  "alternate": {
                    "type": "Literal",
                    "start": 134,
                    "end": 140,
                    "loc": {
                      "start": {
                        "line": 5,
                        "column": 44
                      },
                      "end": {
                        "line": 5,
                        "column": 50
                      }
                    },
                    "value": "time",
                    "raw": "'time'"
                  }
                }
              },
              {
                "start": 141,
                "end": 144,
                "type": "Text",
                "raw": " \n\n",
                "data": " \n\n"
              }
            ]
          }
        ]
      }
    ]
  }
};


// Transformation function for attributes
function transformAttributes(attributes) {
  attributes.forEach(attr => {
    if (attr.type === 'EventHandler' && attr.expression && attr.expression.name) {
      attr.expression.name += '()'; // Append '()' to the event handler name
    }
  });
}

// Recursive function to traverse and transform the AST
function walk(node) {


  if (node.attributes) {
    transformAttributes(node.attributes); // Apply transformation to attributes of the current node
  }



 if (node.type === 'Element') {

  const transformedElement = htmlToJs(node);
  node = transformedElement;

  //console.log(node.type);
 }



  if (node.children) {
    node.children.forEach(child => walk(child)); // Recursively walk through children nodes
  }



}



function htmlToJs(elementNode) {

//console.log("htmlToJs");

  const jsAst = {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: 'document.createElement'
    },
    arguments: [
      {
        type: 'Literal',
        value: elementNode.name
      }
    ]
  };

  // Set attributes
  elementNode.attributes.forEach(attr => {
    jsAst.arguments.push({
      type: 'AssignmentExpression',
      operator: '=',
      left: {
        type: 'MemberExpression',
        object: jsAst,
        property: attr.name
      },
      right: {
        type: 'Literal',
        value: attr.value
      }
    });
  });

  // Set innerText
  if (elementNode.children.length > 0) {
    const textNode = elementNode.children[0];
    jsAst.arguments.push({
      type: 'AssignmentExpression',
      operator: '=',
      left: {
        type: 'MemberExpression',
        object: jsAst,
        property: 'innerText'
      },
      right: {
        type: 'Literal',
        value: textNode.raw
      }
    });
  }

    //console.log(jsAst);


  return jsAst;


}






// Execute the walk function to transform the AST
walk(ast.html);

 
const transformedAST = ast;

const options = {
  format: {
    indent: {
      style: 'tab'
    }
  }
};

//console.log(JSON.stringify(ast,null,2));



const targetAST= {
  "type": "Program",
  "start": 0,
  "end": 382,
  "body": [
    {
      "type": "IfStatement",
      "start": 0,
      "end": 382,
      "test": {
        "type": "Identifier",
        "start": 4,
        "end": 11,
        "name": "counter"
      },
      "consequent": {
        "type": "BlockStatement",
        "start": 13,
        "end": 382,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 17,
            "end": 65,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 23,
                "end": 64,
                "id": {
                  "type": "Identifier",
                  "start": 23,
                  "end": 29,
                  "name": "button"
                },
                "init": {
                  "type": "CallExpression",
                  "start": 32,
                  "end": 64,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 32,
                    "end": 54,
                    "object": {
                      "type": "Identifier",
                      "start": 32,
                      "end": 40,
                      "name": "document"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 41,
                      "end": 54,
                      "name": "createElement"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "Literal",
                      "start": 55,
                      "end": 63,
                      "value": "button",
                      "raw": "'button'"
                    }
                  ],
                  "optional": false
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "ExpressionStatement",
            "start": 68,
            "end": 115,
            "expression": {
              "type": "CallExpression",
              "start": 68,
              "end": 114,
              "callee": {
                "type": "MemberExpression",
                "start": 68,
                "end": 91,
                "object": {
                  "type": "Identifier",
                  "start": 68,
                  "end": 74,
                  "name": "button"
                },
                "property": {
                  "type": "Identifier",
                  "start": 75,
                  "end": 91,
                  "name": "addEventListener"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 92,
                  "end": 99,
                  "value": "click",
                  "raw": "'click'"
                },
                {
                  "type": "Identifier",
                  "start": 101,
                  "end": 113,
                  "name": "handlerClick"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 118,
            "end": 167,
            "expression": {
              "type": "CallExpression",
              "start": 118,
              "end": 166,
              "callee": {
                "type": "MemberExpression",
                "start": 118,
                "end": 141,
                "object": {
                  "type": "Identifier",
                  "start": 118,
                  "end": 124,
                  "name": "button"
                },
                "property": {
                  "type": "Identifier",
                  "start": 125,
                  "end": 141,
                  "name": "addEventListener"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 142,
                  "end": 153,
                  "value": "mouseover",
                  "raw": "'mouseover'"
                },
                {
                  "type": "Identifier",
                  "start": 155,
                  "end": 165,
                  "name": "mouseevent"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 170,
            "end": 196,
            "expression": {
              "type": "AssignmentExpression",
              "start": 170,
              "end": 195,
              "operator": "=",
              "left": {
                "type": "MemberExpression",
                "start": 170,
                "end": 186,
                "object": {
                  "type": "Identifier",
                  "start": 170,
                  "end": 176,
                  "name": "button"
                },
                "property": {
                  "type": "Identifier",
                  "start": 177,
                  "end": 186,
                  "name": "className"
                },
                "computed": false,
                "optional": false
              },
              "right": {
                "type": "Literal",
                "start": 189,
                "end": 195,
                "value": "main",
                "raw": "'main'"
              }
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 199,
            "end": 240,
            "expression": {
              "type": "AssignmentExpression",
              "start": 199,
              "end": 239,
              "operator": "=",
              "left": {
                "type": "MemberExpression",
                "start": 199,
                "end": 215,
                "object": {
                  "type": "Identifier",
                  "start": 199,
                  "end": 205,
                  "name": "button"
                },
                "property": {
                  "type": "Identifier",
                  "start": 206,
                  "end": 215,
                  "name": "innerText"
                },
                "computed": false,
                "optional": false
              },
              "right": {
                "type": "TemplateLiteral",
                "start": 218,
                "end": 239,
                "expressions": [
                  {
                    "type": "Identifier",
                    "start": 230,
                    "end": 237,
                    "name": "counter"
                  }
                ],
                "quasis": [
                  {
                    "type": "TemplateElement",
                    "start": 219,
                    "end": 228,
                    "value": {
                      "raw": "Clicked: ",
                      "cooked": "Clicked: "
                    },
                    "tail": false
                  },
                  {
                    "type": "TemplateElement",
                    "start": 238,
                    "end": 238,
                    "value": {
                      "raw": "",
                      "cooked": ""
                    },
                    "tail": true
                  }
                ]
              }
            }
          },
          {
            "type": "IfStatement",
            "start": 243,
            "end": 343,
            "test": {
              "type": "BinaryExpression",
              "start": 247,
              "end": 258,
              "left": {
                "type": "Identifier",
                "start": 247,
                "end": 254,
                "name": "counter"
              },
              "operator": ">",
              "right": {
                "type": "Literal",
                "start": 257,
                "end": 258,
                "value": 1,
                "raw": "1"
              }
            },
            "consequent": {
              "type": "BlockStatement",
              "start": 260,
              "end": 299,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 266,
                  "end": 295,
                  "expression": {
                    "type": "AssignmentExpression",
                    "start": 266,
                    "end": 294,
                    "operator": "+=",
                    "left": {
                      "type": "MemberExpression",
                      "start": 266,
                      "end": 282,
                      "object": {
                        "type": "Identifier",
                        "start": 266,
                        "end": 272,
                        "name": "button"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 273,
                        "end": 282,
                        "name": "innerText"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "right": {
                      "type": "Literal",
                      "start": 286,
                      "end": 294,
                      "value": " times",
                      "raw": "' times'"
                    }
                  }
                }
              ]
            },
            "alternate": {
              "type": "BlockStatement",
              "start": 305,
              "end": 343,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 311,
                  "end": 339,
                  "expression": {
                    "type": "AssignmentExpression",
                    "start": 311,
                    "end": 338,
                    "operator": "+=",
                    "left": {
                      "type": "MemberExpression",
                      "start": 311,
                      "end": 327,
                      "object": {
                        "type": "Identifier",
                        "start": 311,
                        "end": 317,
                        "name": "button"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 318,
                        "end": 327,
                        "name": "innerText"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "right": {
                      "type": "Literal",
                      "start": 331,
                      "end": 338,
                      "value": " time",
                      "raw": "' time'"
                    }
                  }
                }
              ]
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 346,
            "end": 380,
            "expression": {
              "type": "CallExpression",
              "start": 346,
              "end": 379,
              "callee": {
                "type": "MemberExpression",
                "start": 346,
                "end": 371,
                "object": {
                  "type": "MemberExpression",
                  "start": 346,
                  "end": 359,
                  "object": {
                    "type": "Identifier",
                    "start": 346,
                    "end": 354,
                    "name": "document"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 355,
                    "end": 359,
                    "name": "body"
                  },
                  "computed": false,
                  "optional": false
                },
                "property": {
                  "type": "Identifier",
                  "start": 360,
                  "end": 371,
                  "name": "appendChild"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 372,
                  "end": 378,
                  "name": "button"
                }
              ],
              "optional": false
            }
          }
        ]
      },
      "alternate": null
    }
  ],
  "sourceType": "module"
}

const code = escodegen.generate(targetAST, options);
console.log(code);

// Output the modified AST
//console.log(JSON.stringify(ast, null, 2));
