import customHtmlParser from '../customHtmlParser.js';


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



function traverse(targetNodeType, ast) {
    const results = [];

    function _traverse(node, parent, grandParent) {
        if (node === null || node === undefined) {
            return; // Stop traversal for non-existent nodes
        }

        if (node.type === targetNodeType) {
            results.push({
                targetNode: node,
                parent: parent,
                grandParent: grandParent,
            }); 
        }

        // Traverse children if they exist
        if (node.children) {
            node.children.forEach((childArray, childKey) => {
                if (Array.isArray(childArray)) {
                    childArray.forEach((child, childIndex) => {
                      _traverse(child, node, parent);
                    });
                } else {
                   _traverse(childArray, node, parent);
                }
            });
        }
    }

    _traverse(ast.html, null, null, null, null, null);
    return results;
}






// Example usage:
const targetNodeType = 'MustacheIdentifier';

//
const mustacheIdentifierBlocks = traverse(targetNodeType, customSyntaxAST[0]);
console.log(mustacheIdentifierBlocks);


const newNode = {
    "start": 0,
    "end": 17,
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
                    "raw": "345",
                    "data": "345"
                }
            ]
        }
    ],
    "children": []
};



