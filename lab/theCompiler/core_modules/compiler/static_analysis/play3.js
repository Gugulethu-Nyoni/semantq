/*
const ast ={
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
};



const targetParentNode = {
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
};


*/


const customSyntaxAST=  [
  {
    "html": {
      "start": 0,
      "end": 379,
      "type": "Fragment",
      "children": [
        {
          "start": 0,
          "end": 379,
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
                "end": 331,
                "type": "Element",
                "name": "span",
                "attributes": null,
                "children": [
                  [
                    {
                      "start": 297,
                      "end": 318,
                      "type": "Text",
                      "raw": "Yesterday was not a: ",
                      "data": "Yesterday was not a: "
                    },
                    {
                      "type": "MustacheIdentifier",
                      "start": {
                        "offset": 318,
                        "line": 15,
                        "column": 29
                      },
                      "end": {
                        "offset": 323,
                        "line": 15,
                        "column": 34
                      },
                      "expression": {
                        "type": "Identifier",
                        "start": {
                          "offset": 318,
                          "line": 15,
                          "column": 29
                        },
                        "end": {
                          "offset": 323,
                          "line": 15,
                          "column": 34
                        },
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 319,
                            "line": 15,
                            "column": 30
                          },
                          "end": {
                            "offset": 322,
                            "line": 15,
                            "column": 33
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
                      "start": 323,
                      "end": 324,
                      "type": "Text",
                      "raw": " ",
                      "data": " "
                    }
                  ]
                ]
              },
              {
                "start": 334,
                "end": 362,
                "type": "Element",
                "name": "h3",
                "attributes": null,
                "children": [
                  [
                    {
                      "start": 339,
                      "end": 351,
                      "type": "Text",
                      "raw": "Today is a: ",
                      "data": "Today is a: "
                    },
                    {
                      "type": "MustacheIdentifier",
                      "start": {
                        "offset": 351,
                        "line": 18,
                        "column": 18
                      },
                      "end": {
                        "offset": 356,
                        "line": 18,
                        "column": 23
                      },
                      "expression": {
                        "type": "Identifier",
                        "start": {
                          "offset": 351,
                          "line": 18,
                          "column": 18
                        },
                        "end": {
                          "offset": 356,
                          "line": 18,
                          "column": 23
                        },
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 352,
                            "line": 18,
                            "column": 19
                          },
                          "end": {
                            "offset": 355,
                            "line": 18,
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
                      "start": 356,
                      "end": 357,
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


function walk(ast, targetNodeType) {
    const results = [];

    function _walk(node, parent, grandParent) {
        if (node === null || node === undefined) return; 
        //const index = 23; 



        if (node.type === targetNodeType) {

          // console.log("FLAG",node.type);

        //const walk = new Walker();

        //console.log("FormatTT",parent);
        //  let index;

         const index =findIndexInChildren(grandParent, parent);


       /*
          if (grandParent.type === 'Fragment') {

          grandParent = parent;
          index =findIndexInChildren(grandParent, parent);



          }


        if (index === -1) {
          console.log("lana",JSON.stringify(index));
        } */
        //console.log(index);

            results.push({
                targetNode: node,
                parent: parent,
                grandParent: grandParent,
                index: index
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

    _walk(ast.html, null, null);
    //console.log("All Blocks",results);
    return results;
}






// Helper function for deep equality check
function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return false;
}

function findIndexInChildren(grandParent, targetNode) {
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
              deepEqual(child.attributes, targetNode.attributes) &&
              deepEqual(child.children, targetNode.children)
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
                deepEqual(child.attributes, targetNode.attributes) &&
                deepEqual(child.children, targetNode.children)
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

const targetNodeType='MustacheIdentifier';
const blocks = walk(customSyntaxAST[0], targetNodeType);

//const res= findIndexInChildren(ast, targetParentNode);
console.log(blocks);