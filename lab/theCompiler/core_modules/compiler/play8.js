import customHtmlParser from './customHtmlParser.js';


const ast =  {
  "html": {
    "start": 0,
    "end": 702,
    "type": "Fragment",
    "children": [
      {
        "start": 0,
        "end": 702,
        "type": "Element",
        "name": "customSyntax",
        "attributes": null,
        "children": [
          [
            {
              "type": "Element",
              "name": "span",
              "attributes": [],
              "children": [
                {
                  "type": "Text",
                  "raw": "Hello ",
                  "data": "Hello "
                }
              ]
            },
            {
              "start": 0,
              "end": 20,
              "type": "Element",
              "name": "span",
              "attributes": [],
              "children": [
                {
                  "start": 6,
                  "end": 7,
                  "type": "Text",
                  "raw": " ",
                  "data": " "
                },
                {
                  "start": 7,
                  "end": 12,
                  "type": "MustacheIdentifier",
                  "expression": {
                    "type": "Identifier",
                    "start": 8,
                    "end": 11,
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 8
                      },
                      "end": {
                        "line": 1,
                        "column": 11
                      }
                    },
                    "name": "name"
                  }
                },
                {
                  "start": 12,
                  "end": 13,
                  "type": "Text",
                  "raw": " ",
                  "data": " "
                }
              ]
            },
            {
              "start": 32,
              "end": 646,
              "type": "Element",
              "name": "div",
              "attributes": null,
              "children": [
                [
                  {
                    "start": 39,
                    "end": 471,
                    "type": "Element",
                    "name": "table",
                    "attributes": [
                      {
                        "start": 46,
                        "end": 59,
                        "type": "Attribute",
                        "name": "class",
                        "value": [
                          {
                            "start": 53,
                            "end": 58,
                            "type": "Text",
                            "raw": "table",
                            "data": "table"
                          }
                        ]
                      }
                    ],
                    "children": [
                      [
                        {
                          "start": 61,
                          "end": 140,
                          "type": "Element",
                          "name": "thead",
                          "attributes": null,
                          "children": [
                            [
                              {
                                "start": 69,
                                "end": 131,
                                "type": "Element",
                                "name": "tr",
                                "attributes": null,
                                "children": [
                                  [
                                    {
                                      "start": 74,
                                      "end": 89,
                                      "type": "Element",
                                      "name": "th",
                                      "attributes": null,
                                      "children": [
                                        [
                                          {
                                            "type": "Text",
                                            "raw": "Name ",
                                            "data": "Name "
                                          }
                                        ]
                                      ]
                                    },
                                    {
                                      "start": 90,
                                      "end": 108,
                                      "type": "Element",
                                      "name": "th",
                                      "attributes": null,
                                      "children": [
                                        [
                                          {
                                            "type": "Text",
                                            "raw": "Surname ",
                                            "data": "Surname "
                                          }
                                        ]
                                      ]
                                    },
                                    {
                                      "start": 109,
                                      "end": 125,
                                      "type": "Element",
                                      "name": "th",
                                      "attributes": null,
                                      "children": [
                                        [
                                          {
                                            "type": "Text",
                                            "raw": "Email ",
                                            "data": "Email "
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
                          "start": 142,
                          "end": 462,
                          "type": "Element",
                          "name": "tbody",
                          "attributes": null,
                          "children": [
                            [
                              {
                                "start": 151,
                                "end": 224,
                                "type": "Element",
                                "name": "tr",
                                "attributes": null,
                                "children": [
                                  [
                                    {
                                      "start": 156,
                                      "end": 172,
                                      "type": "Element",
                                      "name": "td",
                                      "attributes": null,
                                      "children": [
                                        [
                                          {
                                            "type": "Text",
                                            "raw": "Musa  ",
                                            "data": "Musa  "
                                          }
                                        ]
                                      ]
                                    },
                                    {
                                      "start": 173,
                                      "end": 188,
                                      "type": "Element",
                                      "name": "td",
                                      "attributes": null,
                                      "children": [
                                        [
                                          {
                                            "type": "Text",
                                            "raw": "Moyo ",
                                            "data": "Moyo "
                                          }
                                        ]
                                      ]
                                    },
                                    {
                                      "start": 189,
                                      "end": 218,
                                      "type": "Element",
                                      "name": "td",
                                      "attributes": null,
                                      "children": [
                                        [
                                          {
                                            "type": "Text",
                                            "raw": "mxmoyo@example.com ",
                                            "data": "mxmoyo@example.com "
                                          }
                                        ]
                                      ]
                                    }
                                  ]
                                ]
                              },
                              {
                                "start": 226,
                                "end": 300,
                                "type": "Element",
                                "name": "tr",
                                "attributes": null,
                                "children": [
                                  [
                                    {
                                      "start": 231,
                                      "end": 248,
                                      "type": "Element",
                                      "name": "td",
                                      "attributes": null,
                                      "children": [
                                        [
                                          {
                                            "type": "Text",
                                            "raw": "James  ",
                                            "data": "James  "
                                          }
                                        ]
                                      ]
                                    },
                                    {
                                      "start": 249,
                                      "end": 265,
                                      "type": "Element",
                                      "name": "td",
                                      "attributes": null,
                                      "children": [
                                        [
                                          {
                                            "type": "Text",
                                            "raw": "Okura ",
                                            "data": "Okura "
                                          }
                                        ]
                                      ]
                                    },
                                    {
                                      "start": 266,
                                      "end": 294,
                                      "type": "Element",
                                      "name": "td",
                                      "attributes": null,
                                      "children": [
                                        [
                                          {
                                            "type": "Text",
                                            "raw": "okfuy@website.com ",
                                            "data": "okfuy@website.com "
                                          }
                                        ]
                                      ]
                                    }
                                  ]
                                ]
                              },
                              {
                                "start": 302,
                                "end": 452,
                                "type": "Element",
                                "name": "tr",
                                "attributes": null,
                                "children": [
                                  [
                                    {
                                      "start": 307,
                                      "end": 445,
                                      "type": "Element",
                                      "name": "td",
                                      "attributes": [
                                        {
                                          "start": 311,
                                          "end": 322,
                                          "type": "Attribute",
                                          "name": "colspan",
                                          "value": [
                                            {
                                              "start": 320,
                                              "end": 321,
                                              "type": "Text",
                                              "raw": "3",
                                              "data": "3"
                                            }
                                          ]
                                        }
                                      ],
                                      "children": [
                                        [
                                          {
                                            "start": 325,
                                            "end": 380,
                                            "type": "Element",
                                            "name": "button",
                                            "attributes": [
                                              {
                                                "start": 333,
                                                "end": 346,
                                                "type": "Attribute",
                                                "name": "id",
                                                "value": [
                                                  {
                                                    "start": 337,
                                                    "end": 344,
                                                    "type": "MustacheAttribute",
                                                    "name": {
                                                      "type": "Identifier",
                                                      "start": {
                                                        "offset": 337,
                                                        "line": 35,
                                                        "column": 13
                                                      },
                                                      "end": {
                                                        "offset": 344,
                                                        "line": 35,
                                                        "column": 20
                                                      },
                                                      "name": "counter"
                                                    }
                                                  }
                                                ]
                                              },
                                              {
                                                "start": 346,
                                                "end": 367,
                                                "type": "Attribute",
                                                "name": {
                                                  "start": 346,
                                                  "end": 352,
                                                  "type": "EventHandler",
                                                  "name": "click",
                                                  "modifiers": [],
                                                  "expression": {
                                                    "type": "CallExpression",
                                                    "start": 346,
                                                    "end": 352
                                                  }
                                                },
                                                "value": [
                                                  {
                                                    "start": 354,
                                                    "end": 365,
                                                    "type": "MustacheAttribute",
                                                    "name": {
                                                      "type": "Identifier",
                                                      "start": {
                                                        "offset": 354,
                                                        "line": 35,
                                                        "column": 30
                                                      },
                                                      "end": {
                                                        "offset": 365,
                                                        "line": 35,
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
                                            "start": 381,
                                            "end": 438,
                                            "type": "Element",
                                            "name": "button",
                                            "attributes": [
                                              {
                                                "start": 389,
                                                "end": 410,
                                                "type": "Attribute",
                                                "name": {
                                                  "start": 389,
                                                  "end": 395,
                                                  "type": "EventHandler",
                                                  "name": "click",
                                                  "modifiers": [],
                                                  "expression": {
                                                    "type": "CallExpression",
                                                    "start": 389,
                                                    "end": 395
                                                  }
                                                },
                                                "value": [
                                                  {
                                                    "start": 397,
                                                    "end": 408,
                                                    "type": "MustacheAttribute",
                                                    "name": {
                                                      "type": "Identifier",
                                                      "start": {
                                                        "offset": 397,
                                                        "line": 36,
                                                        "column": 17
                                                      },
                                                      "end": {
                                                        "offset": 408,
                                                        "line": 36,
                                                        "column": 28
                                                      },
                                                      "name": "decrementer"
                                                    }
                                                  }
                                                ]
                                              },
                                              {
                                                "start": 410,
                                                "end": 425,
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
                  },
                  {
                    "start": 474,
                    "end": 638,
                    "type": "Element",
                    "name": "div",
                    "attributes": [
                      {
                        "start": 479,
                        "end": 492,
                        "type": "Attribute",
                        "name": "id",
                        "value": [
                          {
                            "start": 483,
                            "end": 491,
                            "type": "Text",
                            "raw": "form-div",
                            "data": "form-div"
                          }
                        ]
                      }
                    ],
                    "children": [
                      [
                        {
                          "start": 495,
                          "end": 630,
                          "type": "Element",
                          "name": "form",
                          "attributes": [
                            {
                              "start": 501,
                              "end": 515,
                              "type": "Attribute",
                              "name": "method",
                              "value": [
                                {
                                  "start": 509,
                                  "end": 513,
                                  "type": "Text",
                                  "raw": "post",
                                  "data": "post"
                                }
                              ]
                            },
                            {
                              "start": 515,
                              "end": 536,
                              "type": "Attribute",
                              "name": "action",
                              "value": [
                                {
                                  "start": 523,
                                  "end": 534,
                                  "type": "Text",
                                  "raw": "process.php",
                                  "data": "process.php"
                                }
                              ]
                            },
                            {
                              "start": 536,
                              "end": 547,
                              "type": "Attribute",
                              "name": "class",
                              "value": [
                                {
                                  "start": 543,
                                  "end": 546,
                                  "type": "MustacheAttribute",
                                  "name": {
                                    "type": "Identifier",
                                    "start": {
                                      "offset": 543,
                                      "line": 48,
                                      "column": 49
                                    },
                                    "end": {
                                      "offset": 546,
                                      "line": 48,
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
                                "start": 550,
                                "end": 623,
                                "type": "Element",
                                "name": "input",
                                "attributes": [
                                  {
                                    "start": 557,
                                    "end": 565,
                                    "type": "Attribute",
                                    "name": "id",
                                    "value": [
                                      {
                                        "start": 561,
                                        "end": 563,
                                        "type": "Text",
                                        "raw": "27",
                                        "data": "27"
                                      }
                                    ]
                                  },
                                  {
                                    "start": 565,
                                    "end": 577,
                                    "type": "Attribute",
                                    "name": "type",
                                    "value": [
                                      {
                                        "start": 571,
                                        "end": 575,
                                        "type": "Text",
                                        "raw": "text",
                                        "data": "text"
                                      }
                                    ]
                                  },
                                  {
                                    "start": 577,
                                    "end": 593,
                                    "type": "Attribute",
                                    "name": "value",
                                    "value": [
                                      {
                                        "start": 584,
                                        "end": 591,
                                        "type": "MustacheAttribute",
                                        "name": {
                                          "type": "Identifier",
                                          "start": {
                                            "offset": 584,
                                            "line": 50,
                                            "column": 35
                                          },
                                          "end": {
                                            "offset": 591,
                                            "line": 50,
                                            "column": 42
                                          },
                                          "name": "counter"
                                        }
                                      }
                                    ]
                                  },
                                  {
                                    "start": 593,
                                    "end": 610,
                                    "type": "Attribute",
                                    "name": "data-bind",
                                    "value": [
                                      {
                                        "start": 604,
                                        "end": 608,
                                        "type": "Text",
                                        "raw": "name",
                                        "data": "name"
                                      }
                                    ]
                                  },
                                  {
                                    "start": 610,
                                    "end": 619,
                                    "type": "Attribute",
                                    "name": "disabled",
                                    "value": true
                                  }
                                ],
                                "children": []
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
              "type": "Element",
              "name": "span",
              "attributes": [],
              "children": [
                {
                  "type": "Text",
                  "raw": "Thanks a mil, it's an awesome ",
                  "data": "Thanks a mil, it's an awesome "
                }
              ]
            },
            {
              "start": 0,
              "end": 20,
              "type": "Element",
              "name": "span",
              "attributes": [],
              "children": [
                {
                  "start": 6,
                  "end": 7,
                  "type": "Text",
                  "raw": " ",
                  "data": " "
                },
                {
                  "start": 7,
                  "end": 12,
                  "type": "MustacheIdentifier",
                  "expression": {
                    "type": "Identifier",
                    "start": 8,
                    "end": 11,
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 8
                      },
                      "end": {
                        "line": 1,
                        "column": 11
                      }
                    },
                    "name": "day"
                  }
                },
                {
                  "start": 12,
                  "end": 13,
                  "type": "Text",
                  "raw": " ",
                  "data": " "
                }
              ]
            },
            {
              "type": "Element",
              "name": "span",
              "attributes": [],
              "children": [
                {
                  "type": "Text",
                  "raw": "!.\n\n",
                  "data": "!.\n\n"
                }
              ]
            }
          ]
        ]
      }
    ]
  }
};




/*

function parseHtmlElementToJs(htmlString, randomStr) {
  // Define Node constants for non-browser environments
  const TEXT_NODE = 3;
  const ELEMENT_NODE = 1;

  function escapeString(str) {
    return str.replace(/'/g, "\\'");
  }

  // Parse HTML string to an object representation
  const parseHtmlToObject = (htmlString) => {
    const container = { tagName: '', attributes: [], childNodes: [] };
    const regex = /<(\w+)([^>]*)>(.*?)<\/\1>/s;
    const match = htmlString.match(regex);
    
    if (match) {
      container.tagName = match[1];
      container.attributes = [...match[2].matchAll(/(\w+)="([^"]*)"/g)].map(attr => ({ name: attr[1], value: attr[2] }));
      container.childNodes.push({ nodeType: TEXT_NODE, textContent: match[3] });
    }
    return container;
  };

  // Internal function to handle attributes
  function handleAttributes(attributes) {
    const keyValueAttributes = [];
    const keyOnlyAttributes = [];

    attributes.forEach(attr => {
      if (attr.value) {
        keyValueAttributes.push(`'${attr.name}': '${escapeString(attr.value)}'`);
      } else {
        keyOnlyAttributes.push(`'${attr.name}'`);
      }
    });

    return {
      keyValueAttributes: keyValueAttributes.join(', '),
      keyOnlyAttributes: keyOnlyAttributes.join(', ')
    };
  }

  // Create JavaScript code to reconstruct the element
  function createElementJsCode(element) {
    //const transpiler =new Transpiler();
    const tagName = element.tagName.toLowerCase();
    const { keyValueAttributes, keyOnlyAttributes } = handleAttributes(element.attributes);

    let jsCode = `const ${tagName}_${randomStr} = document.createElement('${tagName}');\n`;

    if (keyValueAttributes) {
      jsCode += `Object.assign(${tagName}_${randomStr}.attributes, { ${keyValueAttributes} });\n`;
    }

    if (keyOnlyAttributes) {
      keyOnlyAttributes.split(', ').forEach(attr => {
        jsCode += `${tagName}_${randomStr}.setAttribute(${attr}, '');\n`;
      });
    }

    if (element.childNodes.length > 0) {
      element.childNodes.forEach(child => {
        if (child.nodeType === TEXT_NODE) {
          jsCode += `${tagName}_${randomStr}.textContent += \`${escapeString(child.textContent)}\`;\n`;
        } else if (child.nodeType === ELEMENT_NODE) {
          const childTagName = child.tagName.toLowerCase();
          jsCode += `const child_${childTagName} = ${createElementJsCode(child)};\n`;
          jsCode += `${tagName}_${randomStr}.appendChild(child_${childTagName});\n`;
        }
      });
    }

    return jsCode;
  }

  const element = parseHtmlToObject(htmlString);
  return createElementJsCode(element);



}

*/




/*

function createElementStatement(tagName) {
  return `const element = document.createElement('${tagName}');\n`;
}
*/

function processAttributesForJS(attributes, elemVar) {
  let attributesCode = '';


  attributes.forEach((attribute) => {
    const attrName = attribute.name;
    let attrValue = attribute.value;

    if (typeof attrValue === 'boolean') {

      if (attribute.smqtype && attribute.smqtype === 'BooleanIdentifierAttribute') {


              attributesCode += `${elemVar}.setAttribute('${attrValue.name}', '');\n`;

      }
      
      else  {
        attributesCode += `${elemVar}.setAttribute('${attrName}', '${attrName}');\n`;
      }

    } 

    else if (Array.isArray(attrValue) && attrValue[0].type === 'Text') {
      attrValue = attrValue[0].data;
    } else if (attrName === 'class' || attrName === 'id') {
      if (attrValue[0].type === 'MustacheAttribute' && attrValue[0].name.type === 'Identifier') {
      

       attrValue = `${attrValue[0].name.name}`;
      //attrValue = processedAttrValue;
      } else {
        attrValue = attrValue[0].data;
      }
    } 


    else if (attrName === 'class') {
      attributesCode += `${elemVar}.className = '${attrValue}';\n`;
    } else if (attrName === 'style') {
      attributesCode += `${elemVar}.style.cssText = '${attrValue}';\n`;
    } else {
      if (attrValue[0].type === 'MustacheAttribute' && attrValue[0].name.type === 'Identifier') {
        

        attrValue = `${attrValue[0].name.name}`;
      
      }
      attributesCode += `${elemVar}.setAttribute('${attrName}', '${attrValue}');\n`;
    }
  });

 //let nothing;

  return attributesCode;
}


export default function walkHtmlAstToJS(ast) {
  const selfClosingTags = [
    'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
    'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr', 'sspan'
  ];

  let jsCode = '';
  let parentStack = [];
  let rootElement = null;
  let elementCounter = 0;
  let textNodeCounter = 0;
  let mustacheExprCounter = 0;

  const processNode = (node) => {
    if (Array.isArray(node)) {
      node.forEach(n => processNode(n));
      return;
    }

    if (node.type === 'Element') {
      const elemVar = rootElement ? `${node.name}_${elementCounter++}` : 'rootElement';
      if (!rootElement) {
        rootElement = node;
        jsCode += `const ${elemVar} = document.createElement('${node.name}');\n`;
        parentStack.push(elemVar);
      } else {
        jsCode += `const ${elemVar} = document.createElement('${node.name}');\n`;
        jsCode += `// Append element to parent\n${parentStack[parentStack.length - 1]}.appendChild(${elemVar});\n`;
        parentStack.push(elemVar);
      }

      if (node.attributes && node.attributes.length > 0) {
        const attributesData = processAttributesForJS(node.attributes, elemVar);
        jsCode += `// Set attributes\n${attributesData}`;

      }

      if (node.children && node.children.length > 0) {
        node.children.forEach(child => processNode(child));
      }

      parentStack.pop();
    } else if (node.type === 'Text') {
      const textVar = `textNode_${textNodeCounter++}`;



      // Escape every single quote by adding a backslash before it
      let escapedText = node.raw.replace(/'/g, "\\'");
      let cleanText = escapedText.replace(/(\r\n|\n|\r)/g, ' ');

      if (node.raw === ' ')
      {
       cleanText='';//'\u00A0'
      }

      
      const textNodeCreation = `const ${textVar} = document.createTextNode('${cleanText}');\n`;
      jsCode += textNodeCreation;
      jsCode += `${parentStack[parentStack.length - 1]}.appendChild(${textVar});\n`;
    } else if (node.type === 'MustacheIdentifier') {
      const mustacheVar = `mustacheExpr_${mustacheExprCounter++}`;
      const mustacheTagName = node.expression.name.name || node.expression.name;
      jsCode += `const ${mustacheVar} = ${mustacheTagName};\n`;
      jsCode += `${parentStack[parentStack.length - 1]}.appendChild(document.createTextNode(${mustacheVar}));\n`;
    } else if (typeof node === 'object') {
      Object.values(node).forEach(value => processNode(value));
    }
  };

  processNode(ast);

  jsCode += `
const targetElementId = uniqueid;
const targetElement = document.getElementById(targetElementId);
targetElement.innerHTML='';
targetElement.parentNode.insertBefore(rootElement, targetElement);
`;


  return jsCode;
}

const randomStr = "yth";
const html = customHtmlParser(ast);
const htmlToJs = walkHtmlAstToJS(ast);
console.log(htmlToJs);
