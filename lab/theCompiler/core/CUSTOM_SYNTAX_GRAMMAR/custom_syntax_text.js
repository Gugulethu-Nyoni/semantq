const ast = {
  "type": "Program",
  "body": [
    {
      "type": "IfStatement",
      "test": {
        "type": "Identifier",
        "start": 5,
        "end": 10
      },
      "consequent": {
        "html": {
          "start": 17,
          "end": 111,
          "type": "Fragment",
          "children": [
            {
              "start": 17,
              "end": 111,
              "type": "Element",
              "name": "div",
              "attributes": [
                {
                  "start": 22,
                  "end": 35,
                  "type": "Attribute",
                  "name": "class",
                  "value": [
                    {
                      "start": 29,
                      "end": 33,
                      "type": "Text",
                      "raw": "main",
                      "data": "main"
                    }
                  ]
                },
                {
                  "start": 35,
                  "end": 45,
                  "type": "Attribute",
                  "name": "id",
                  "value": [
                    {
                      "start": 39,
                      "end": 43,
                      "type": "Text",
                      "raw": "2324",
                      "data": "2324"
                    }
                  ]
                },
                {
                  "start": 45,
                  "end": 64,
                  "type": "Attribute",
                  "name": {
                    "start": 45,
                    "end": 51,
                    "type": "EventHandler",
                    "name": "click",
                    "modifiers": [],
                    "expression": {
                      "type": "CallExpression",
                      "start": 45,
                      "end": 51
                    }
                  },
                  "value": [
                    {
                      "start": 53,
                      "end": 62,
                      "type": "MustacheAttribute",
                      "name": {
                        "type": "Identifier",
                        "name": "increment"
                      }
                    }
                  ]
                },
                {
                  "start": 64,
                  "end": 80,
                  "type": "Attribute",
                  "name": {
                    "start": 64,
                    "end": 74,
                    "type": "EventHandler",
                    "name": "mouseover",
                    "modifiers": [],
                    "expression": {
                      "type": "CallExpression",
                      "start": 64,
                      "end": 74
                    }
                  },
                  "value": [
                    {
                      "start": 76,
                      "end": 78,
                      "type": "MustacheAttribute",
                      "name": {
                        "type": "Identifier",
                        "name": "do"
                      }
                    }
                  ]
                }
              ],
              "children": [
                [
                  {
                    "start": 81,
                    "end": 105,
                    "type": "Text",
                    "raw": " \n        Hi there \n    ",
                    "data": "Hi there"
                  }
                ]
              ]
            }
          ]
        }
      },
      "alternate": null
    }
  ],
  "sourceType": "module"
};



const attributeHandlers = {
  regular: (attr) => {
    const attributeName = attr.name;
    const attributeValue= attr.value[0]['data'];
    return `${attributeName}="${attributeValue}"`; // ="${value}"
  },

  eventHandler: (attr) => {
  //const eventName = attr.name;
  //console.log(JSON.stringify(attr,null,2)+"here"); 
  const handlerType = attr.value[0].type;


switch (handlerType) {
 
  case 'MustacheAttribute':
  const eventName = attr.name.name;
  const identifier = attr.value[0].name;
  return `@${eventName}={${identifier}}`; // {${handler}}  return `@${eventName}={${handler}}`;

  case 'MustacheAttributeValueWithParams':
  const paramEventName = attr.name.name;
  const functionName = attr.value[0].expression.callee.name; // "counter"
  const params = attr.value[0].expression.arguments.map(arg => arg.name); // ["param1", "param2", "param3"]
  return `@${paramEventName}={${functionName}(${params})}`;

case 'ArrowFunctionCall':
  const eventHandlerName = attr.name.name;
  const arrowFunctionName = attr.value[0].identifier;
  return `@${eventHandlerName}={() => ${arrowFunctionName}()}`;

case 'IIFE':
  const iifeEventHandlerName = attr.name.name;
  const iifeName = attr.value[0].identifier;
  return `@${iifeEventHandlerName}={() => (${iifeName})()}`;

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
  return processNode(ast.consequent.html);
}

// Generate HTML string
const htmlString = generateHTML(ast);
console.log(htmlString);
