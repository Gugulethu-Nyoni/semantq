"use strict"; 


export default function deepWalker(ast, nodeKey, nodeKeyValue) {
  // Helper function to recursively traverse the AST
  function walk(node, callback) {
    // Call the callback on the current node
    callback(node);

    // Recursively traverse all properties of the node
    for (const key in node) {
      if (node.hasOwnProperty(key)) {
        const value = node[key];

        // If the value is an object or array, recursively walk it
        if (typeof value === "object" && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              if (typeof item === "object" && item !== null) {
                walk(item, callback);
              }
            });
          } else {
            walk(value, callback);
          }
        }
      }
    }
  }

  // Variable to store the found node
  let foundNode = null;

  // Start walking the AST
  walk(ast, (node) => {
    // Check if the current node has the specified key-value pair
    if (node[nodeKey] === nodeKeyValue) {
      foundNode = node;
    }
  });

  // Return the found node (or null if not found)
  return foundNode;
}

/*
const ast = {
  "jsAST_Card": {
    "type": "JavaScript",
    "content": {
      "type": "Program",
      "body": [
        {
          "type": "ImportDeclaration",
          "start": 1,
          "end": 45,
          "specifiers": [
            {
              "type": "ImportDefaultSpecifier",
              "start": 8,
              "end": 14,
              "local": {
                "type": "Identifier",
                "start": 8,
                "end": 14,
                "name": "Header"
              }
            }
          ],
          "source": {
            "type": "Literal",
            "start": 20,
            "end": 44,
            "value": "$components/Header.smq",
            "raw": "'$components/Header.smq'"
          }
        },
        {
          "type": "ImportDeclaration",
          "start": 46,
          "end": 84,
          "specifiers": [
            {
              "type": "ImportDefaultSpecifier",
              "start": 53,
              "end": 56,
              "local": {
                "type": "Identifier",
                "start": 53,
                "end": 56,
                "name": "Nav"
              }
            }
          ],
          "source": {
            "type": "Literal",
            "start": 62,
            "end": 83,
            "value": "$components/Nav.smq",
            "raw": "'$components/Nav.smq'"
          }
        },
        {
          "type": "ImportDeclaration",
          "start": 85,
          "end": 125,
          "specifiers": [
            {
              "type": "ImportDefaultSpecifier",
              "start": 92,
              "end": 96,
              "local": {
                "type": "Identifier",
                "start": 92,
                "end": 96,
                "name": "Body"
              }
            }
          ],
          "source": {
            "type": "Literal",
            "start": 102,
            "end": 124,
            "value": "$components/Body.smq",
            "raw": "'$components/Body.smq'"
          }
        }
      ],
      "sourceType": "module"
    }
  },
  "cssAST_Card": {
    "type": "CSS",
    "content": {
      "raws": {
        "after": ""
      },
      "type": "root",
      "nodes": [],
      "source": {
        "input": {
          "css": "",
          "hasBOM": false,
          "document": "",
          "file": "/Users/gugulethu/code/semantq/cmdapp/style"
        },
        "start": {
          "column": 1,
          "line": 1,
          "offset": 0
        },
        "end": null
      }
    }
  },
  "card": {
    "type": "Custom",
    "content": [
      {
        "html": {
          "start": 0,
          "end": 115,
          "type": "Fragment",
          "children": [
            {
              "start": 0,
              "end": 115,
              "type": "Element",
              "name": "customSyntax",
              "attributes": null,
              "children": [
                [
                  {
                    "start": 15,
                    "end": 99,
                    "type": "Element",
                    "name": "div",
                    "attributes": [
                      {
                        "start": 20,
                        "end": 42,
                        "type": "Attribute",
                        "name": "class",
                        "value": [
                          {
                            "start": 27,
                            "end": 41,
                            "type": "Text",
                            "raw": "main-container",
                            "data": "main-container"
                          }
                        ]
                      }
                    ],
                    "children": [
                      [
                        {
                          "start": 45,
                          "end": 63,
                          "type": "Element",
                          "name": "Header",
                          "attributes": null,
                          "children": [
                            []
                          ]
                        },
                        {
                          "start": 64,
                          "end": 76,
                          "type": "Element",
                          "name": "Nav",
                          "attributes": null,
                          "children": null
                        },
                        {
                          "start": 77,
                          "end": 91,
                          "type": "Element",
                          "name": "Body",
                          "attributes": null,
                          "children": null
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
    ]
  },
  "header": {
    "type": "HTML",
    "content": [
      {
        "html": {
          "start": 0,
          "end": 69,
          "type": "Fragment",
          "children": [
            {
              "start": 0,
              "end": 69,
              "type": "Element",
              "name": "customSyntax",
              "attributes": null,
              "children": [
                [
                  {
                    "start": 15,
                    "end": 53,
                    "type": "Element",
                    "name": "header",
                    "attributes": null,
                    "children": [
                      [
                        {
                          "start": 24,
                          "end": 43,
                          "type": "Element",
                          "name": "h1",
                          "attributes": null,
                          "children": [
                            [
                              {
                                "type": "Text",
                                "raw": "My Website",
                                "data": "My Website"
                              }
                            ]
                          ]
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
    ]
  },
  "nav": {
    "type": "HTML",
    "content": [
      {
        "html": {
          "start": 0,
          "end": 110,
          "type": "Fragment",
          "children": [
            {
              "start": 0,
              "end": 110,
              "type": "Element",
              "name": "customSyntax",
              "attributes": null,
              "children": [
                [
                  {
                    "start": 15,
                    "end": 94,
                    "type": "Element",
                    "name": "nav",
                    "attributes": null,
                    "children": [
                      [
                        {
                          "start": 21,
                          "end": 41,
                          "type": "Element",
                          "name": "a",
                          "attributes": [
                            {
                              "start": 24,
                              "end": 32,
                              "type": "Attribute",
                              "name": "href",
                              "value": [
                                {
                                  "start": 30,
                                  "end": 31,
                                  "type": "Text",
                                  "raw": "#",
                                  "data": "#"
                                }
                              ]
                            }
                          ],
                          "children": [
                            [
                              {
                                "type": "Text",
                                "raw": "Home",
                                "data": "Home"
                              }
                            ]
                          ]
                        },
                        {
                          "start": 42,
                          "end": 63,
                          "type": "Element",
                          "name": "a",
                          "attributes": [
                            {
                              "start": 45,
                              "end": 53,
                              "type": "Attribute",
                              "name": "href",
                              "value": [
                                {
                                  "start": 51,
                                  "end": 52,
                                  "type": "Text",
                                  "raw": "#",
                                  "data": "#"
                                }
                              ]
                            }
                          ],
                          "children": [
                            [
                              {
                                "type": "Text",
                                "raw": "About",
                                "data": "About"
                              }
                            ]
                          ]
                        },
                        {
                          "start": 64,
                          "end": 87,
                          "type": "Element",
                          "name": "a",
                          "attributes": [
                            {
                              "start": 67,
                              "end": 75,
                              "type": "Attribute",
                              "name": "href",
                              "value": [
                                {
                                  "start": 73,
                                  "end": 74,
                                  "type": "Text",
                                  "raw": "#",
                                  "data": "#"
                                }
                              ]
                            }
                          ],
                          "children": [
                            [
                              {
                                "type": "Text",
                                "raw": "Contact",
                                "data": "Contact"
                              }
                            ]
                          ]
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
    ]
  },
  "body": {
    "type": "HTML",
    "content": [
      {
        "html": {
          "start": 0,
          "end": 116,
          "type": "Fragment",
          "children": [
            {
              "start": 0,
              "end": 116,
              "type": "Element",
              "name": "customSyntax",
              "attributes": null,
              "children": [
                [
                  {
                    "start": 15,
                    "end": 100,
                    "type": "Element",
                    "name": "div",
                    "attributes": [
                      {
                        "start": 20,
                        "end": 37,
                        "type": "Attribute",
                        "name": "class",
                        "value": [
                          {
                            "start": 27,
                            "end": 36,
                            "type": "Text",
                            "raw": "container",
                            "data": "container"
                          }
                        ]
                      }
                    ],
                    "children": [
                      [
                        {
                          "start": 39,
                          "end": 55,
                          "type": "Element",
                          "name": "h2",
                          "attributes": null,
                          "children": [
                            [
                              {
                                "type": "Text",
                                "raw": "Welcome",
                                "data": "Welcome"
                              }
                            ]
                          ]
                        },
                        {
                          "start": 56,
                          "end": 93,
                          "type": "Element",
                          "name": "p",
                          "attributes": null,
                          "children": [
                            [
                              {
                                "type": "Text",
                                "raw": "This is the main content area.",
                                "data": "This is the main content area."
                              }
                            ]
                          ]
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
    ]
  }
}; 



const result = deepWalker(ast, "name", "h2");
//console.log(result);

///
console.log(ast.nav);

*/