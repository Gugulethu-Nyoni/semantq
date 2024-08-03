const astData= [
  {
    "html": {
      "start": 0,
      "end": 134,
      "type": "Fragment",
      "children": [
        {
          "start": 0,
          "end": 134,
          "type": "Element",
          "name": "customSyntax",
          "attributes": null,
          "children": [
            [
              {
                "start": 18,
                "end": 45,
                "type": "Element",
                "name": "p",
                "attributes": null,
                "children": [
                  [
                    {
                      "start": 22,
                      "end": 31,
                      "type": "Text",
                      "raw": "Counter: ",
                      "data": "Counter: "
                    },
                    {
                      "type": "MustacheIdentifier",
                      "start": {
                        "offset": 31,
                        "line": 5,
                        "column": 14
                      },
                      "end": {
                        "offset": 40,
                        "line": 5,
                        "column": 23
                      },
                      "expression": {
                        "type": "Identifier",
                        "start": {
                          "offset": 31,
                          "line": 5,
                          "column": 14
                        },
                        "end": {
                          "offset": 40,
                          "line": 5,
                          "column": 23
                        },
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 32,
                            "line": 5,
                            "column": 15
                          },
                          "end": {
                            "offset": 39,
                            "line": 5,
                            "column": 22
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
                      "start": 40,
                      "end": 41,
                      "type": "Text",
                      "raw": " ",
                      "data": " "
                    }
                  ]
                ]
              },
              {
                "start": 48,
                "end": 96,
                "type": "Element",
                "name": "button",
                "attributes": [
                  {
                    "start": 56,
                    "end": 76,
                    "type": "Attribute",
                    "name": {
                      "start": 56,
                      "end": 62,
                      "type": "EventHandler",
                      "name": "click",
                      "modifiers": [],
                      "expression": {
                        "type": "CallExpression",
                        "start": 56,
                        "end": 62
                      }
                    },
                    "value": [
                      {
                        "start": 64,
                        "end": 75,
                        "type": "MustacheAttribute",
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 64,
                            "line": 8,
                            "column": 17
                          },
                          "end": {
                            "offset": 75,
                            "line": 8,
                            "column": 28
                          },
                          "name": "incrementer"
                        }
                      }
                    ]
                  }
                ],
                "children": [
                  [
                    {
                      "start": 78,
                      "end": 87,
                      "type": "Text",
                      "raw": "Click Me ",
                      "data": "Click Me "
                    }
                  ]
                ]
              },
              {
                "start": 98,
                "end": 117,
                "type": "Element",
                "name": "div",
                "attributes": null,
                "children": [
                  [
                    {
                      "type": "MustacheIdentifier",
                      "start": {
                        "offset": 104,
                        "line": 10,
                        "column": 7
                      },
                      "end": {
                        "offset": 110,
                        "line": 10,
                        "column": 13
                      },
                      "expression": {
                        "type": "Identifier",
                        "start": {
                          "offset": 104,
                          "line": 10,
                          "column": 7
                        },
                        "end": {
                          "offset": 110,
                          "line": 10,
                          "column": 13
                        },
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 105,
                            "line": 10,
                            "column": 8
                          },
                          "end": {
                            "offset": 109,
                            "line": 10,
                            "column": 12
                          },
                          "name": "name"
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
                      "start": 110,
                      "end": 111,
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






const ast=astData[0];



function traverse(ast, targetNode) {
    const results = [];

    function _traverse(node, parent, key, index) {
        if (node === null || node === undefined) {
            return; // Stop traversal for non-existent nodes
        }

        if (node.type === targetNode) {
            results.push({
                targetNode: node,
                parent: parent,
                key: key,
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
                    _traverse(node[key], node, key, key);
                }
            }
        }
    }

    _traverse(ast, null, null, null); // Start traversal from the root node
    return results; // Return all found target nodes
}




// Example usage
let identifiersObject = [];

const targetNode = 'MustacheIdentifier';
//const walk = new walker();
const results = traverse(astData, targetNode);

// Extract identifiers from results
results.forEach(result => {
    const identifier = result.targetNode.expression.name.name;
    if (identifier) {
        identifiersObject.push(identifier);
    }
});

console.log(identifiersObject); // Output all identifiers



