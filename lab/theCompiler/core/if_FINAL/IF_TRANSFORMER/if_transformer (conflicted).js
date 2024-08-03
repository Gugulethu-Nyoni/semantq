const jsAST={
  "type": "Program",
  "start": 0,
  "end": 94,
  "body": [
    {
      "type": "ExpressionStatement",
      "start": 2,
      "end": 14,
      "expression": {
        "type": "AssignmentExpression",
        "start": 2,
        "end": 13,
        "operator": "=",
        "left": {
          "type": "Identifier",
          "start": 2,
          "end": 9,
          "name": "counter"
        },
        "right": {
          "type": "Literal",
          "start": 12,
          "end": 13,
          "value": 1,
          "raw": "1"
        }
      }
    },
    {
      "type": "FunctionDeclaration",
      "start": 16,
      "end": 57,
      "id": {
        "type": "Identifier",
        "start": 25,
        "end": 36,
        "name": "handleClick"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 40,
        "end": 57,
        "body": [
          {
            "type": "ExpressionStatement",
            "start": 43,
            "end": 55,
            "expression": {
              "type": "AssignmentExpression",
              "start": 43,
              "end": 54,
              "operator": "+=",
              "left": {
                "type": "Identifier",
                "start": 43,
                "end": 50,
                "name": "counter"
              },
              "right": {
                "type": "Literal",
                "start": 53,
                "end": 54,
                "value": 1,
                "raw": "1"
              }
            }
          }
        ]
      }
    }
  ],
  "sourceType": "script"
};





const customSyntaxAST=[
  [
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
                            "name": "handleClick"
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
                        "type": "IfStatement",
                        "start": 105,
                        "end": 163,
                        "test": {
                          "type": "BinaryExpression",
                          "start": 112,
                          "end": 123,
                          "left": {
                            "type": "Identifier",
                            "start": 112,
                            "end": 123,
                            "name": "counter"
                          },
                          "operator": ">",
                          "right": {
                            "type": "Literal",
                            "start": 112,
                            "end": 123,
                            "value": 1,
                            "raw": "1"
                          }
                        },
                        "consequent": {
                          "type": "BlockStatement",
                          "start": 127,
                          "end": 163,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 127,
                              "end": 163,
                              "expression": {
                                "type": "ConditionalExpression",
                                "start": 127,
                                "end": 163,
                                "test": {
                                  "type": "BinaryExpression",
                                  "start": 129,
                                  "end": 142,
                                  "left": {
                                    "type": "Identifier",
                                    "start": 129,
                                    "end": 142,
                                    "name": "counter"
                                  },
                                  "operator": "===",
                                  "right": {
                                    "type": "Literal",
                                    "start": 129,
                                    "end": 142,
                                    "value": 1,
                                    "raw": "1"
                                  }
                                },
                                "consequent": {
                                  "type": "Literal",
                                  "start": 23,
                                  "end": 34,
                                  "value": "time",
                                  "raw": "'time'"
                                },
                                "alternate": {
                                  "type": "Literal",
                                  "start": 34,
                                  "end": 45,
                                  "value": "times",
                                  "raw": "'times'"
                                }
                              }
                            }
                          ]
                        },
                        "alternate": null
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
  ],
  []
];



const customSyntaxObject = {};

// Assuming your structure, you can assign parts of customSyntaxAST to customSyntaxObject
customSyntaxAST.forEach((section, index) => {
  customSyntaxObject[`section${index}`] = section;
});

//console.log(JSON.stringify(customSyntaxObject,null,2));



class NodeVisitor {

visitEventHandlerMustacheAttribute (node){}


}


class TransformAttribute extends NodeVisitor {


visitEventHandlerMustacheAttribute (node) {

/// transform code here 

}


}





function traversecustomSyntaxAST(ast, visitors) {

  
  if (typeof ast === 'object' && ast !== null) 
  {


    


    
  }



/* FETCH type: EventHandler and type: MustacheAttribute */






}





const mustacheAttributeVisitor= new TransformAttribute();

const visitors = {
mustacheAttributeVisitor

}



traversecustomSyntaxAST (customSyntaxObject, visitors);


/* TRIGGER THE TRANSFOMERS HERE */


