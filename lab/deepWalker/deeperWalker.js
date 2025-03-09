function deepWalker(ast, nodeType, matchLogic, returnType = null, pathValue = null) {
    if (!ast) {
        console.log("No AST object provided e.g. deepWalker(ast, nodeType,etc);");
        return;
    }

    if (!matchLogic) {
        console.log("You need to define matchLogic e.g. deepWalker(ast, nodeType, matchLogic);");
        return;
    }

    if (!nodeType) {
        console.log('There is no target or return type in your deepWalker request! Please specify target e.g. deepWalker(ast, nodeType, returnType)');
        return;
    }

    let results = [];
    const visited = new Set();

    function _deepWalk(node) {
        if (!node || visited.has(node)) return; // Stop infinite loops
        visited.add(node);

        // Check if node matches the matchLogic criteria
        if (matchLogic(node)) {
            if (returnType && returnType.path) {
                const valueByPath = getValueByPath(node, returnType.path);

                if (pathValue && valueByPath === pathValue) {
                    results.push({ value: valueByPath, node: node });
                } else if (!pathValue) {
                    results.push({ value: valueByPath, node: node });
                }
            } else {
                // No returnType or path defined
                results.push({ value: node, node: node });
            }
        }

        // Traverse arrays
        if (Array.isArray(node)) {
            for (let child of node) {
                _deepWalk(child);
            }
        }

        // Traverse objects
        if (typeof node === 'object' && node !== null) {
            for (let key in node) {
                if (node.hasOwnProperty(key)) {
                    _deepWalk(node[key]);
                }
            }
        }
    }

    // Helper function to get value by path (if needed)
    function getValueByPath(obj, path) {
        const keys = path.split(/\.|\[|\]/).filter(Boolean);
        let value = obj;

        for (const key of keys) {
            if (value === undefined || value === null) {
                return undefined; // Path does not exist
            }

            if (Array.isArray(value) && !isNaN(key)) {
                value = value[parseInt(key)];
            } else {
                value = value[key];
            }
        }

        return value;
    }

    _deepWalk(ast);
    return results;
}



const ast = [
    {
      "html": {
        "start": 0,
        "end": 324,
        "type": "Fragment",
        "children": [
          {
            "start": 0,
            "end": 324,
            "type": "Element",
            "name": "customSyntax",
            "attributes": null,
            "children": [
              [
                {
                  "start": 15,
                  "end": 308,
                  "type": "Element",
                  "name": "div",
                  "attributes": [
                    {
                      "start": 20,
                      "end": 32,
                      "type": "Attribute",
                      "name": "class",
                      "value": [
                        {
                          "start": 27,
                          "end": 31,
                          "type": "Text",
                          "raw": "card",
                          "data": "card"
                        }
                      ]
                    }
                  ],
                  "children": [
                    [
                      {
                        "start": 34,
                        "end": 84,
                        "type": "Element",
                        "name": "h2",
                        "attributes": null,
                        "children": [
                          [
                            {
                              "start": 38,
                              "end": 79,
                              "type": "Element",
                              "name": "slot",
                              "attributes": [
                                {
                                  "start": 44,
                                  "end": 56,
                                  "type": "Attribute",
                                  "name": "name",
                                  "value": [
                                    {
                                      "start": 50,
                                      "end": 55,
                                      "type": "Text",
                                      "raw": "title",
                                      "data": "title"
                                    }
                                  ]
                                }
                              ],
                              "children": [
                                [
                                  {
                                    "type": "Text",
                                    "raw": "c Child Title  ",
                                    "data": "c Child Title  "
                                  }
                                ]
                              ]
                            }
                          ]
                        ]
                      },
                      {
                        "start": 86,
                        "end": 201,
                        "type": "Element",
                        "name": "div",
                        "attributes": [
                          {
                            "start": 91,
                            "end": 106,
                            "type": "Attribute",
                            "name": "class",
                            "value": [
                              {
                                "start": 98,
                                "end": 105,
                                "type": "Text",
                                "raw": "content",
                                "data": "content"
                              }
                            ]
                          }
                        ],
                        "children": [
                          [
                            {
                              "start": 108,
                              "end": 194,
                              "type": "Element",
                              "name": "slot",
                              "attributes": [
                                {
                                  "start": 114,
                                  "end": 128,
                                  "type": "Attribute",
                                  "name": "name",
                                  "value": [
                                    {
                                      "start": 120,
                                      "end": 127,
                                      "type": "Text",
                                      "raw": "content",
                                      "data": "content"
                                    }
                                  ]
                                }
                              ],
                              "children": [
                                [
                                  {
                                    "start": 130,
                                    "end": 186,
                                    "type": "Element",
                                    "name": "p",
                                    "attributes": null,
                                    "children": [
                                      [
                                        {
                                          "type": "Text",
                                          "raw": "c No content provided. This is fallback content.",
                                          "data": "c No content provided. This is fallback content."
                                        }
                                      ]
                                    ]
                                  }
                                ]
                              ]
                            }
                          ]
                        ]
                      },
                      {
                        "start": 203,
                        "end": 301,
                        "type": "Element",
                        "name": "footer",
                        "attributes": null,
                        "children": [
                          [
                            {
                              "start": 212,
                              "end": 291,
                              "type": "Element",
                              "name": "slot",
                              "attributes": [
                                {
                                  "start": 218,
                                  "end": 231,
                                  "type": "Attribute",
                                  "name": "name",
                                  "value": [
                                    {
                                      "start": 224,
                                      "end": 230,
                                      "type": "Text",
                                      "raw": "footer",
                                      "data": "footer"
                                    }
                                  ]
                                }
                              ],
                              "children": [
                                [
                                  {
                                    "start": 233,
                                    "end": 283,
                                    "type": "Element",
                                    "name": "p",
                                    "attributes": null,
                                    "children": [
                                      [
                                        {
                                          "type": "Text",
                                          "raw": "c Child footer: No custom footer provided.",
                                          "data": "c Child footer: No custom footer provided."
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
                  ]
                }
              ]
            ]
          }
        ]
      }
    }
  ];
  
const nodeType = "Attribute";
const nodeName = "name"; 
const returnType = { path: "value[0].raw" };
const matchLogic = (node) => node.type === "Attribute" && node.name === "name";

const namedSlotNodesInComponent = deepWalker(
    ast,
    nodeType,
    matchLogic,
    returnType
);

console.log("Card", namedSlotNodesInComponent);

