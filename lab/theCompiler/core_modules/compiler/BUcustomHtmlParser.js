/*
const ast = [
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
                          "name": "incrementer()"
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
                          "name": "decrementer()"
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
                      "start": 0,
                      "end": 33,
                      "type": "Element",
                      "name": "span",
                      "attributes": [
                        {
                          "start": 6,
                          "end": 24,
                          "type": "Attribute",
                          "name": "smq-counter-data",
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
                      "start": 0,
                      "end": 33,
                      "type": "Element",
                      "name": "span",
                      "attributes": [
                        {
                          "start": 6,
                          "end": 24,
                          "type": "Attribute",
                          "name": "smq-counter-data",
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
                      "start": 0,
                      "end": 33,
                      "type": "Element",
                      "name": "span",
                      "attributes": [
                        {
                          "start": 6,
                          "end": 24,
                          "type": "Attribute",
                          "name": "smq-day-data",
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

*/



function processAttributes(attributes) {
  let processedAttributesObject = '';

  attributes.forEach((attribute) => {
    const attrType = attribute.type;
    const attrName = typeof attribute.name === 'object' ? attribute.name.name : attribute.name;
    let attrString;

    if (attrName === 'id' || attrName === 'class') {
      if (attribute.value[0].type === 'Text') {
        attrString = ` ${attrName}='${attribute.value[0].data}'`;
        processedAttributesObject += attrString;
      }
    }

    if (typeof attribute.name === 'object') {
      attrString = ` on${attrName}='${attribute.value[0].name.name}'`;
      processedAttributesObject += attrString;
    }

    if (attrName.toLowerCase().startsWith('smq-'.toLowerCase())) {
      attrString = ` ${attrName}`;
      processedAttributesObject += attrString;
    }
  });

  return processedAttributesObject;
}

 

export default function walk(ast) {
  const selfClosingTags = [
    'area',
    'base',
    'br',
    'col',
    'command',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'menuitem',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
    'sspan'
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
        if (attributesData.trim().length === 0) {
          const buildHtmlTag = `<${node.name}></${node.name}>`;
          regularHtml += buildHtmlTag;
        } else {
          const buildHtmlTag = `<${node.name} ${attributesData}></${node.name}>`;
          regularHtml += buildHtmlTag;
        }
      } else {
        if (attributesData.trim().length === 0) {
          const buildHtmlTag = `<${node.name}/>`;
          regularHtml += buildHtmlTag;
        } else {
          const buildHtmlTag = `<${node.name} ${attributesData} />`;
          regularHtml += buildHtmlTag;
        }
      }
    }

    if (node.type === 'Text') {
      const buildHtmlTag = `${node.raw}`;
      regularHtml += buildHtmlTag;
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(child => nestedWalker(child));
    } else if (typeof node === 'object' && node !== null) {
      Object.values(node).forEach(value => nestedWalker(value));
    }
  };

  const nestedWalker = (node) => {
    if (Array.isArray(node)) {
      node.forEach(item => nestedWalker(item));
    } else if (typeof node === 'object' && node !== null) {
      //console.log("ND", node.type);
      processNode(node);
    }
  };

  nestedWalker(ast);

  return regularHtml;
}



/*
const htmlOutput = walk(ast[0]);
console.log(htmlOutput);
*/
