const ast =  {
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


function findIdentifiers(ast) {
  let identifiers = [];

  function processAttributes(attr) {
    if (attr.value && Array.isArray(attr.value) && attr.value.length > 0) {
      if (attr.value[0].type === 'MustacheAttribute') {
       // console.log(`Processing MustacheAttribute: ${attr.value[0].name.name}`);
        return attr.value[0].name.name;
      }
    }

    if (attr.value && typeof attr.value === 'boolean') {
      if (attr.smqtype === 'BooleanIdentifierAttribute') {
       // console.log(`Processing BooleanIdentifierAttribute: ${attr.name}`);
        return attr.name;
      }
    }
  }

  function traverse(node) {
    if (!node) return;

    if (node.attributes && node.attributes.length > 0) {
      node.attributes.forEach(attr => {
        const result = processAttributes(attr);
        if (result) {
          //console.log(`Found attribute identifier: ${result}`);
          identifiers.push(result);
        }
      });
    }

    if (node.children) {
      if (Array.isArray(node.children[0])) {
        node.children.forEach(childArray => {
          childArray.forEach(child => {
            if (child.type === 'MustacheIdentifier') {
             // console.log(`Found MustacheIdentifier: ${child.expression.name}`);
              identifiers.push(child.expression.name);
            } else if (child.type === 'Element') {
              traverse(child);
            }
          });
        });
      } else {
        node.children.forEach(child => {
          if (child.type === 'MustacheIdentifier') {
           // console.log(`Found MustacheIdentifier: ${child.expression.name}`);
            identifiers.push(child.expression.name);
          } else if (child.type === 'Element') {
            traverse(child);
          }
        });
      }
    }
  }

  traverse(ast.html);

  return identifiers;
}



// Example usage
const identifiers = findIdentifiers(ast);
console.log(identifiers);







/*
function findIdentifiers(subRootNodeChildren) {
  let identifiers = [];

  const processAttributes = (attr, node) => {
            //console.log(attr);

// || typeof attr.value ==='boolean'
    if (attr.value && typeof attr.value ==='object' && attr.value.length > 0 ) {
      if (attr.value[0].type === 'MustacheAttribute') {
        //console.log("here??");
        return attr.value[0].name.name;
      } 
    }

if (attr.value && typeof attr.value ==='boolean') {
if (attr.smqtype === 'BooleanIdentifierAttribute') {
        //console.log("chk",attr.name);
        return attr.name;
      }
}




  };

  const traverse = (node) => {
    if (!node) return;
 
 //console.log(node.children.length); return;

    if(node.children && node.children.length > 0) {

    for(let i =0; i < node.children.length; i++) {





    if (node.attributes && node.attributes.length > 0) {

      

      node.attributes.forEach(attr => {

        const result = processAttributes(attr, node);

        if (result) {
          identifiers.push(result);
        }


      });
    }




    if (node.children && node.children[0].length > 0) {

      console.log(`Node ${node.name} has so many kids`,node.children[0].length); 


      node.children.forEach(child => {

        console.log("Kids exist*****", child[0].type); 

        if (child[0].type === 'MustacheIdentifier') {
         // console.log("Pushing++++++", child[0].expression.name);
          identifiers.push(child[0].expression.name);
        } 


        if (child[0].type === 'Element') {

          //console.log(child[0].type, child[0].name);
          
          //const identifier = child.name;

       // if (identifier) {             identifiers.push(identifier);
          // } 

          traverse(child);
        }
      });
    }
  };

}
}



  subRootNodeChildren[0].forEach(node => traverse(node));

  return identifiers;
}

const identifiers = findIdentifiers(ast.html.children[0].children);
console.log("ActiveNodes", identifiers);

//const identifiers = findIdentifiers(ast.html.children[0].children);
//console.log("ActiveNodes",identifiers);

*/



/*

function findHtmlElementsWithMustacheTags(ast) {
    const elementsWithMustacheTags = [];

    function traverseNode(node) {
        if (!node) return;

        // Check if the current node has mustache tags in its attributes
        if (node.attributes && node.attributes.some(attr => 
            attr.value && attr.value.some(val => val.type === 'MustacheAttribute'))) {
            elementsWithMustacheTags.push(node);
        }

        // Check if the current node has non-HTML children with mustache tags
        if (node.children) {
            let hasMustacheInChildren = false;

            node.children.forEach(childGroup => {
                if (Array.isArray(childGroup)) {
                    childGroup.forEach(child => {
                        if (child.type === 'MustacheIdentifier') {
                            hasMustacheInChildren = true;
                        }
                    });
                } else if (childGroup.type === 'MustacheIdentifier') {
                    hasMustacheInChildren = true;
                }
            });

            if (hasMustacheInChildren) {
                elementsWithMustacheTags.push(node);
            } else {
                // Continue traversing child nodes
                node.children.forEach(childGroup => {
                    if (Array.isArray(childGroup)) {
                        childGroup.forEach(traverseNode);
                    } else {
                        traverseNode(childGroup);
                    }
                });
            }
        }
    }

    ast.forEach(node => {
        traverseNode(node.html);
    });

    return elementsWithMustacheTags;
}

// Example usage:
const result = findHtmlElementsWithMustacheTags(ast);
console.log(result);
*/