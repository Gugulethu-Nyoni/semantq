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




function processAttributes(attributes, isSvg = false, tagName = '') {
  let processedAttributes = '';

  if (attributes) {
    attributes.forEach((attribute) => {
      const attrName = attribute.name;
      let attrString = '';

      if (typeof attribute.value === 'boolean') {
        // Boolean attributes (like "checked", "disabled")
        attrString = attribute.smqtype === 'BooleanIdentifierAttribute' ? ` {${attrName}}` : ` ${attrName}`;
      } else if (Array.isArray(attribute.value) && attribute.value[0]?.type === 'Text') {
        // Text attributes
        const value = attribute.value[0].data;
        // Handle SVG attributes like `d` for <path>
        if (isSvg && attrName === 'd') {
          if (tagName === 'path') {
            // Skip empty `d` attributes for <path> elements
            attrString = ` ${attrName}="${attribute.value[0].raw}"`;
            //console.log("D Attribute",attribute); 
          } else {
            attrString = ` ${attrName}="${value}"`;
          }
        } else {
          attrString = ` ${attrName}="${value}"`;
        }
      } else if (attrName === 'id' || attrName === 'class') {
        // Handle id and class attributes
        const value = attribute.value[0];
        attrString = value?.type === 'MustacheAttribute' && value?.name?.type === 'Identifier'
          ? ` ${attrName}="{${value.name.name}}"`
          : ` ${attrName}="${value?.data}"`;
      } else if (attrName?.type === 'EventHandler') {
        // Handle event handlers
        const value = attribute.value[0];
        attrString = value?.type === 'MustacheAttribute' && value?.name?.type === 'Identifier'
          ? ` ${attrName.name}="{${value.name.name}}"`
          : ` ${attrName.name}="${value?.data}"`;
      } else if (attribute.smqtype === 'SlotPropAttribute') {
        // Slot props (Svelte-specific syntax)
        attrString = ` ${attrName}:${attribute.value} `;
      } else if (attrName.toLowerCase().startsWith('smq-')) {
        // Custom attributes (starts with smq-)
        attrString = ` ${attrName}`;
      } else {
        // Other attributes (including mustache syntax)
        const value = attribute.value[0];
        attrString = value?.type === 'MustacheAttribute' && value?.name?.type === 'Identifier'
          ? ` ${attrName}="{${value.name.name}}"`
          : ` ${attrName}="${value?.raw}"`;
      }

      processedAttributes += attrString;
    });
  }

  return processedAttributes;
}

export default function walk(astBlock) {
//console.log("INN",astBlock);
let ast;
if (Array.isArray(astBlock)) {

ast = astBlock[0].html.children; 

} else {
ast = astBlock; 

}

//console.log("INN",ast);

  //const ast = astBlock[0].html.children
  const selfClosingTags = new Set([
    'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
    'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr', 'sspan'
  ]);

  const svgTags = new Set([
    'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'text', 'g', 'defs', 'use'
  ]);

  let regularHtml = '';

  const processNode = (node) => {
    if (!node || typeof node !== 'object') return; // Skip invalid nodes

    if (node.type === 'Element') {
      const isSvg = svgTags.has(node.name); // Check if the element is an SVG element
      let openingTag;
      let skipTag = false; 

      if (node.name == 'customSyntax') {
      // Step 1: Build the opening tag
      openingTag = ''; 
      skipTag = true;

      } else {

      openingTag = `<${node.name}`; 

      }


      // Add attributes
      if (!skipTag && node.attributes) {
        openingTag += processAttributes(node.attributes, isSvg, node.name);
      }

      // Close the opening tag
      if (selfClosingTags.has(node.name)) {
        if (!skipTag) {
        openingTag += ' />';
        regularHtml += openingTag;
        return; // Stop processing for self-closing tags
      } else {
        openingTag += '';
        regularHtml += openingTag;
        return; // Stop processing for self-closing tags
      }
      } else {

        if (!skipTag) {
        openingTag += '>';
        regularHtml += openingTag;
      } else {
        openingTag += '';
        regularHtml += openingTag;

      }
      }

      // Step 2: Process children
      if (node.children) {
        traverse(node.children); // Traverse children recursively
      }

      // Step 3: Add the closing tag
      if (!selfClosingTags.has(node.name)) {

        if (!skipTag) {
        regularHtml += `</${node.name}>`;
        } else {
        regularHtml += ``;
        }


      }
    } else if (node.type === 'Text') {
      // Plain text
      regularHtml += node.raw;
    } else if (node.type === 'MustacheIdentifier') {
      // Mustache attribute
      const mustacheTagName = node.expression?.name?.name || node.expression?.name;
      if (mustacheTagName) {
        regularHtml += `{${mustacheTagName}}`;
      }
    }
  };

  // Traverse the AST recursively
  const traverse = (nodes) => {
    //console.log(nodes);
    if (Array.isArray(nodes)) {
      nodes.forEach((child) => {
        if (Array.isArray(child)) {
          traverse(child); // Recursively traverse nested arrays
        } else if (typeof child === 'object' && child !== null) {
          //console.log("child",child);
          processNode(child); // Process the current node


        }
      });
    } else if (typeof nodes === 'object' && nodes !== null) {
      processNode(nodes); // Process the current node
          //console.log("LAST",nodes);

    }
  };

  // Start traversal from the root of the AST
  traverse(ast);

  return regularHtml;
}


//const htmlOutput = walk(ast);
//console.log(htmlOutput);