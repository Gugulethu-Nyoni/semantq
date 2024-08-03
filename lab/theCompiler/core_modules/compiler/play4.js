const ast =  [
  {
    "html": {
      "start": 0,
      "end": 337,
      "type": "Fragment",
      "children": [
        {
          "start": 0,
          "end": 337,
          "type": "Element",
          "name": "customSyntax",
          "attributes": null,
          "children": [
            [
              {
                "type": "Text",
                "raw": "Hello ",
                "data": "Hello "
              },
              {
                "type": "MustacheIdentifier",
                "start": {
                  "offset": 23,
                  "line": 4,
                  "column": 7
                },
                "end": {
                  "offset": 29,
                  "line": 4,
                  "column": 13
                },
                "expression": {
                  "type": "Identifier",
                  "start": {
                    "offset": 23,
                    "line": 4,
                    "column": 7
                  },
                  "end": {
                    "offset": 29,
                    "line": 4,
                    "column": 13
                  },
                  "name": {
                    "type": "Identifier",
                    "start": {
                      "offset": 24,
                      "line": 4,
                      "column": 8
                    },
                    "end": {
                      "offset": 28,
                      "line": 4,
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
                "start": 31,
                "end": 86,
                "type": "Element",
                "name": "button",
                "attributes": [
                  {
                    "start": 39,
                    "end": 52,
                    "type": "Attribute",
                    "name": "id",
                    "value": [
                      {
                        "start": 43,
                        "end": 50,
                        "type": "MustacheAttribute",
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 43,
                            "line": 6,
                            "column": 13
                          },
                          "end": {
                            "offset": 50,
                            "line": 6,
                            "column": 20
                          },
                          "name": "counter"
                        }
                      }
                    ]
                  },
                  {
                    "start": 52,
                    "end": 73,
                    "type": "Attribute",
                    "name": {
                      "start": 52,
                      "end": 58,
                      "type": "EventHandler",
                      "name": "click",
                      "modifiers": [],
                      "expression": {
                        "type": "CallExpression",
                        "start": 52,
                        "end": 58
                      }
                    },
                    "value": [
                      {
                        "start": 60,
                        "end": 71,
                        "type": "MustacheAttribute",
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 60,
                            "line": 6,
                            "column": 30
                          },
                          "end": {
                            "offset": 71,
                            "line": 6,
                            "column": 41
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
                      "type": "Text",
                      "raw": "+ ",
                      "data": "+ "
                    }
                  ]
                ]
              },
              {
                "start": 87,
                "end": 144,
                "type": "Element",
                "name": "button",
                "attributes": [
                  {
                    "start": 95,
                    "end": 116,
                    "type": "Attribute",
                    "name": {
                      "start": 95,
                      "end": 101,
                      "type": "EventHandler",
                      "name": "click",
                      "modifiers": [],
                      "expression": {
                        "type": "CallExpression",
                        "start": 95,
                        "end": 101
                      }
                    },
                    "value": [
                      {
                        "start": 103,
                        "end": 114,
                        "type": "MustacheAttribute",
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 103,
                            "line": 7,
                            "column": 17
                          },
                          "end": {
                            "offset": 114,
                            "line": 7,
                            "column": 28
                          },
                          "name": "decrementer"
                        }
                      }
                    ]
                  },
                  {
                    "start": 116,
                    "end": 131,
                    "type": "Attribute",
                    "smqtype": "BooleanIdentifierAttribute",
                    "name": "buttonStatus",
                    "value": true
                  }
                ],
                "children": [
                  [
                    {
                      "type": "Text",
                      "raw": "- ",
                      "data": "- "
                    }
                  ]
                ]
              },
              {
                "start": 146,
                "end": 281,
                "type": "Element",
                "name": "form",
                "attributes": [
                  {
                    "start": 152,
                    "end": 166,
                    "type": "Attribute",
                    "name": "method",
                    "value": [
                      {
                        "start": 160,
                        "end": 164,
                        "type": "Text",
                        "raw": "post",
                        "data": "post"
                      }
                    ]
                  },
                  {
                    "start": 166,
                    "end": 187,
                    "type": "Attribute",
                    "name": "action",
                    "value": [
                      {
                        "start": 174,
                        "end": 185,
                        "type": "Text",
                        "raw": "process.php",
                        "data": "process.php"
                      }
                    ]
                  },
                  {
                    "start": 187,
                    "end": 198,
                    "type": "Attribute",
                    "name": "class",
                    "value": [
                      {
                        "start": 194,
                        "end": 197,
                        "type": "MustacheAttribute",
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 194,
                            "line": 9,
                            "column": 49
                          },
                          "end": {
                            "offset": 197,
                            "line": 9,
                            "column": 52
                          },
                          "name": "day"
                        }
                      }
                    ]
                  }
                ],
                "children": [
                  [
                    {
                      "start": 201,
                      "end": 274,
                      "type": "Element",
                      "name": "input",
                      "attributes": [
                        {
                          "start": 208,
                          "end": 216,
                          "type": "Attribute",
                          "name": "id",
                          "value": [
                            {
                              "start": 212,
                              "end": 214,
                              "type": "Text",
                              "raw": "27",
                              "data": "27"
                            }
                          ]
                        },
                        {
                          "start": 216,
                          "end": 228,
                          "type": "Attribute",
                          "name": "type",
                          "value": [
                            {
                              "start": 222,
                              "end": 226,
                              "type": "Text",
                              "raw": "text",
                              "data": "text"
                            }
                          ]
                        },
                        {
                          "start": 228,
                          "end": 244,
                          "type": "Attribute",
                          "name": "value",
                          "value": [
                            {
                              "start": 235,
                              "end": 242,
                              "type": "MustacheAttribute",
                              "name": {
                                "type": "Identifier",
                                "start": {
                                  "offset": 235,
                                  "line": 11,
                                  "column": 35
                                },
                                "end": {
                                  "offset": 242,
                                  "line": 11,
                                  "column": 42
                                },
                                "name": "counter"
                              }
                            }
                          ]
                        },
                        {
                          "start": 244,
                          "end": 261,
                          "type": "Attribute",
                          "name": "data-bind",
                          "value": [
                            {
                              "start": 255,
                              "end": 259,
                              "type": "Text",
                              "raw": "name",
                              "data": "name"
                            }
                          ]
                        },
                        {
                          "start": 261,
                          "end": 270,
                          "type": "Attribute",
                          "name": "disabled",
                          "value": true
                        }
                      ],
                      "children": []
                    }
                  ]
                ]
              },
              {
                "type": "Text",
                "raw": "Thanks a mil, it's an awesome ",
                "data": "Thanks a mil, it's an awesome "
              },
              {
                "type": "MustacheIdentifier",
                "start": {
                  "offset": 313,
                  "line": 15,
                  "column": 31
                },
                "end": {
                  "offset": 318,
                  "line": 15,
                  "column": 36
                },
                "expression": {
                  "type": "Identifier",
                  "start": {
                    "offset": 313,
                    "line": 15,
                    "column": 31
                  },
                  "end": {
                    "offset": 318,
                    "line": 15,
                    "column": 36
                  },
                  "name": {
                    "type": "Identifier",
                    "start": {
                      "offset": 314,
                      "line": 15,
                      "column": 32
                    },
                    "end": {
                      "offset": 317,
                      "line": 15,
                      "column": 35
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
                "type": "Text",
                "raw": "!.\n\n",
                "data": "!.\n\n"
              }
            ]
          ]
        }
      ]
    }
  }
];




function processAttributes(attributes) {
  let processedAttributesObject = '';

  attributes.forEach((attribute) => {
    const attrName = attribute.name;
    let attrString = '';

    if (typeof attribute.value === 'boolean') {
      if (attribute.smqtype && attribute.smqtype === 'BooleanIdentifierAttribute') {
        attrString = ` {${attrName}}`;
      } else {
        attrString = ` ${attrName}`;
      }
    } else if (Array.isArray(attribute.value) && attribute.value[0].type === 'Text') {
      attrString = ` ${attrName}='${attribute.value[0].data}'`;
    } else if (attrName === 'id' || attrName === 'class') {
      if (attribute.value[0].type === 'MustacheAttribute' && attribute.value[0].name.type === 'Identifier') {
        attrString = ` ${attrName}='{${attribute.value[0].name.name}}'`;
      } else {
        attrString = ` ${attrName}='${attribute.value[0].data}'`;
      }
    } else if (typeof attrName === 'object') {
      if (attrName.type === 'EventHandler') {
        if (attribute.value[0].type === 'MustacheAttribute' && attribute.value[0].name.type === 'Identifier') {
          attrString = ` on${attrName.name}='${attribute.value[0].name.name}()'`;
        }
      }
    } else if (
      attrName.name !== 'object' &&
      attribute.value[0].type === 'MustacheAttribute' &&
      attribute.value[0].name.type === 'Identifier'
    ) {
      attrString = ` ${attrName}='{${attribute.value[0].name.name}}'`;
    } else if (attrName.toLowerCase().startsWith('smq-'.toLowerCase())) {
      attrString = ` ${attrName}`;
    }

    processedAttributesObject += attrString;
  });

  return processedAttributesObject;
}


export default function walk(ast) {
  const selfClosingTags = [
    'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
    'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr', 'sspan'
  ];

  let regularHtml = '';

  const processNode = (node) => {
    if (node.type === 'Element') {
      let attributesData = '';
      if (node.attributes !== null) {
        const processedAttributes = processAttributes(node.attributes);
        attributesData += processedAttributes;
      }

      if (!selfClosingTags.includes(node.name)) {
        regularHtml += `<${node.name}${attributesData}>`;
      } else {
        regularHtml += `<${node.name}${attributesData}/>`;
        return; // Self-closing tags don't have children, so return early
      }
    }

    if (node.type === 'Text') {
      regularHtml += node.raw;
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(child => nestedWalker(child));
    } else if (typeof node === 'object' && node !== null) {
      Object.values(node).forEach(value => nestedWalker(value));
    }

    if (node.type === 'Element' && !selfClosingTags.includes(node.name)) {
      regularHtml += `</${node.name}>`; // Add closing tag here
    }

    if (node.type === 'MustacheIdentifier') {
      let mustacheTagName = node.expression.name.name || node.expression.name;
      regularHtml += `\${${mustacheTagName}}`;
    }
  };

  const nestedWalker = (node) => {
    if (Array.isArray(node)) {
      node.forEach(item => nestedWalker(item));
    } else if (typeof node === 'object' && node !== null) {
      processNode(node);
    }
  };

  nestedWalker(ast);

  return regularHtml;
}

const htmlOutput = walk(ast[0]);
console.log(htmlOutput);

