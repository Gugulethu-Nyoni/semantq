const ast = 
    {
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
                                "raw": "lydzhkpc8p8uvv",
                                "data": "lydzhkpc8p8uvv"
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





const attributeHandlers = {
  regular: (attr) => {
    const attributeName = attr.name;
    const attributeValue= attr.value[0]['data'];
    return `${attributeName}="${attributeValue}"`; // ="${value}"
  },

  eventHandler: (attr) => {
    //console.log(attr.value[0].name.name);
  //const eventName = attr.name;
  //console.log(JSON.stringify(attr,null,2)+"here"); 
  const handlerType = attr.value[0].type;


switch (handlerType) {
 
  case 'MustacheAttribute':
  let eventName = attr.name.name;
  //eventName=eventName.replace("@", "on");
  const identifier = attr.value[0].name;
  const parens='()';
  return `on${eventName}="${attr.value[0].name.name+parens}"`; // {${handler}}  return `@${eventName}={${handler}}`;

  case 'MustacheAttributeValueWithParams':
  const paramEventName = attr.name.name;
  const functionName = attr.value[0].expression.callee.name.name; // "counter"
  //console.log(JSON.stringify(functionName,2,null));
  const params = attr.value[0].expression.arguments.map(arg => arg.name); // ["param1", "param2", "param3"]
  return `on${paramEventName}="${functionName}(${params})"`;

case 'ArrowFunctionCall':
  const eventHandlerName = attr.name.name;
  const arrowFunctionName = attr.value[0].identifier.name;
  //console.log(arrowFunctionName);
  return `on${eventHandlerName}={() => ${arrowFunctionName}()}`;

case 'IIFE':
  const iifeEventHandlerName = attr.name.name;
  const iifeName = attr.value[0].identifier.name;
  //console.log(iifeName);
  return `on${iifeEventHandlerName}={() => (${iifeName})()}`;

  default:
    throw new Error(`Unknown handler type: ${handler}`);

    

}

  
},


};

function processAttributes(attributes) {
  if (!attributes) return '';

  //console.log(JSON.stringify(attributes,null,2));
  //return; 

  return attributes.map(attr => {
 //console.log(JSON.stringify(attr.name,null,2) + "<-HERE");

 //console.log(JSON.stringify(attr.name.type,null,2));

  if (attr.name.type ==="EventHandler") {
    //console.log("within");
    return attributeHandlers.eventHandler(attr);
  } else {
    //console.log(attr.name.type);
    return attributeHandlers.regular(attr);
  }

  }).join(' ');


}


function processNode(node) {
  if (node.type === 'Text') {
    return node.raw.trim(); // Remove extra spaces
  } else if (node.type === 'Element') {
    const attrString = processAttributes(node.attributes);
    const children = node.children.map(child => Array.isArray(child) ? child.map(processNode).join('') : processNode(child)).join('');
    if (node.children.length === 0) {
      return `<${node.name} ${attrString}/>`; // Add a space before attributes and remove extra comma
    } else {
      return `<${node.name} ${attrString}>${children}</${node.name}>`;
    }
  } else if (node.type === 'Fragment') {
    return node.children.map(processNode).join('');
  }
}


function generateHTML(ast) {
  if (ast.type === 'Fragment') {
    // Assume ast.body contains an IfStatement node
    const ifStatement = ast.body.find(node => node.type === 'IfStatement');
    if (ifStatement && ifStatement.consequent && ifStatement.consequent.html) {
      return processNode(ifStatement.consequent.html);
    } else {
      throw new Error('No IfStatement with consequent HTML found in the AST.');
    }
  } else {
    throw new Error('Invalid AST structure.');
  }
}

// Generate HTML string
try {
  const htmlString = generateHTML(ast);
  console.log(htmlString);
} catch (error) {
  console.error(error.message);
}

