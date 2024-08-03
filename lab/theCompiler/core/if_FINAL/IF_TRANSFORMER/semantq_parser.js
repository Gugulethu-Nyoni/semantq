function parseAttributes(attributes) {
  if (!attributes) return '';

  return attributes.map(attr => {
    if (attr.type === 'Attribute') {
      const name = typeof attr.name === 'object' && attr.name.name ? attr.name.name : attr.name;
      
      // Handle EventHandler type
      if (attr.name.type === 'EventHandler') {
        const eventName = attr.name.name;
        const eventHandler = attr.value && attr.value[0].name && attr.value[0].name.name ? attr.value[0].name.name : '';
        return `on${eventName}="${eventHandler}"`;
      }

      const value = attr.value && attr.value.length > 0 ? attr.value[0].data : '';
      return `${name}="${value}"`;
    }
    return '';
  }).join(' ');
}


function parseChildren(children) {
  if (!children || children.length === 0) return '';

  return children.map(child => {
    if (Array.isArray(child)) {
      return parseChildren(child);
    }

    switch (child.type) {
      case 'Text':
        return child.data;
      case 'Element':
        return parseElement(child);
      case 'SelfClosingElement':
        return parseSelfClosingElement(child);
      default:
        return '';
    }
  }).join('');
}

function parseElement(element) {
  const { name, attributes, children } = element;
  const attrs = parseAttributes(attributes);
  const childContent = parseChildren(children);
  //console.log(`<${name}${attrs}>${childContent}</${name}>`);

  return `<${name} ${attrs}>${childContent}</${name}>`;


}

function parseSelfClosingElement(element) {

  //console.log(element);

  const { name, attributes } = element;
  const attrs = parseAttributes(attributes);

  //console.log(`<${name} ${attrs} />`);

  return `<${name} ${attrs} />`;
}

export function parseAST(ast) {
  if (ast.html && ast.html.children) {
    return parseChildren(ast.html.children);
  }
  return '';
}


export default { parseAST, parseAttributes, parseChildren, parseElement, parseSelfClosingElement };

/*

const ast = {
  "html": {
    "start": 0,
    "end": 197,
    "type": "Fragment",
    "children": [
      {
        "start": 0,
        "end": 197,
        "type": "Element",
        "name": "customSyntax",
        "attributes": null,
        "children": [
          [
            {
              "start": 17,
              "end": 88,
              "type": "Element",
              "name": "button",
              "attributes": [
                {
                  "start": 25,
                  "end": 46,
                  "type": "Attribute",
                  "name": {
                    "start": 25,
                    "end": 31,
                    "type": "EventHandler",
                    "name": "click",
                    "modifiers": [],
                    "expression": {
                      "type": "CallExpression",
                      "start": 25,
                      "end": 31
                    }
                  },
                  "value": [
                    {
                      "start": 33,
                      "end": 44,
                      "type": "MustacheAttribute",
                      "name": {
                        "type": "Identifier",
                        "start": 33,
                        "end": 44,
                        "name": "handleClick()"
                      }
                    }
                  ]
                },
                {
                  "start": 46,
                  "end": 55,
                  "type": "Attribute",
                  "name": "id",
                  "value": [
                    {
                      "start": 50,
                      "end": 53,
                      "type": "Text",
                      "raw": "123",
                      "data": "123"
                    }
                  ]
                },
                {
                  "start": 55,
                  "end": 68,
                  "type": "Attribute",
                  "name": "class",
                  "value": [
                    {
                      "start": 62,
                      "end": 66,
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
                    "start": 69,
                    "end": 79,
                    "type": "Text",
                    "raw": " Click Me ",
                    "data": " Click Me "
                  }
                ]
              ]
            },
            {
              "start": 90,
              "end": 180,
              "type": "Element",
              "name": "span",
              "attributes": null,
              "children": [
                [
                  {
                    "start": 96,
                    "end": 105,
                    "type": "Text",
                    "raw": " Clicked:",
                    "data": " Clicked:"
                  },
                  {
                    "start": 0,
                    "end": 18,
                    "type": "SelfClosingElement",
                    "name": "span",
                    "attributes": [
                      {
                        "start": 6,
                        "end": 15,
                        "type": "Attribute",
                        "name": "id",
                        "value": [
                          {
                            "start": 10,
                            "end": 14,
                            "type": "Text",
                            "raw": "lyegq82x133tfu",
                            "data": "lyegq82x133tfu"
                          }
                        ]
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
  }
};


const html = parseAST(ast);
console.log(html);

*/
