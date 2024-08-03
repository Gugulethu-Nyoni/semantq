const ast = {
  "html": {
    "start": 0,
    "end": 134,
    "type": "Fragment",
    "children": [
      {
        "start": 0,
        "end": 134,
        "type": "IfBlock",
        "expression": {
          "type": "Identifier",
          "start": 5,
          "end": 12,
          "loc": {
            "start": {
              "line": 1,
              "column": 5
            },
            "end": {
              "line": 1,
              "column": 12
            }
          },
          "name": "counter"
        },
        "children": [
          {
            "start": 15,
            "end": 126,
            "type": "Element",
            "name": "button",
            "attributes": [
              {
                "start": 23,
                "end": 46,
                "type": "EventHandler",
                "name": "click",
                "modifiers": [],
                "expression": {
                  "type": "Identifier",
                  "start": 33,
                  "end": 45,
                  "loc": {
                    "start": {
                      "line": 3,
                      "column": 18
                    },
                    "end": {
                      "line": 3,
                      "column": 30
                    }
                  },
                  "name": "handlerClick"
                }
              },
              {
                "start": 47,
                "end": 59,
                "type": "Attribute",
                "name": "class",
                "value": [
                  {
                    "start": 54,
                    "end": 58,
                    "type": "Text",
                    "raw": "main",
                    "data": "main"
                  }
                ]
              }
            ],
            "children": [
              {
                "start": 60,
                "end": 72,
                "type": "Text",
                "raw": " \n\nClicked: ",
                "data": " \n\nClicked: "
              },
              {
                "start": 72,
                "end": 81,
                "type": "MustacheTag",
                "expression": {
                  "type": "Identifier",
                  "start": 73,
                  "end": 80,
                  "loc": {
                    "start": {
                      "line": 5,
                      "column": 10
                    },
                    "end": {
                      "line": 5,
                      "column": 17
                    }
                  },
                  "name": "counter"
                }
              },
              {
                "start": 81,
                "end": 82,
                "type": "Text",
                "raw": " ",
                "data": " "
              },
              {
                "start": 82,
                "end": 114,
                "type": "MustacheTag",
                "expression": {
                  "type": "ConditionalExpression",
                  "start": 83,
                  "end": 113,
                  "loc": {
                    "start": {
                      "line": 5,
                      "column": 20
                    },
                    "end": {
                      "line": 5,
                      "column": 50
                    }
                  },
                  "test": {
                    "type": "BinaryExpression",
                    "start": 83,
                    "end": 94,
                    "loc": {
                      "start": {
                        "line": 5,
                        "column": 20
                      },
                      "end": {
                        "line": 5,
                        "column": 31
                      }
                    },
                    "left": {
                      "type": "Identifier",
                      "start": 83,
                      "end": 90,
                      "loc": {
                        "start": {
                          "line": 5,
                          "column": 20
                        },
                        "end": {
                          "line": 5,
                          "column": 27
                        }
                      },
                      "name": "counter"
                    },
                    "operator": ">",
                    "right": {
                      "type": "Literal",
                      "start": 93,
                      "end": 94,
                      "loc": {
                        "start": {
                          "line": 5,
                          "column": 30
                        },
                        "end": {
                          "line": 5,
                          "column": 31
                        }
                      },
                      "value": 1,
                      "raw": "1"
                    }
                  },
                  "consequent": {
                    "type": "Literal",
                    "start": 97,
                    "end": 104,
                    "loc": {
                      "start": {
                        "line": 5,
                        "column": 34
                      },
                      "end": {
                        "line": 5,
                        "column": 41
                      }
                    },
                    "value": "times",
                    "raw": "'times'"
                  },
                  "alternate": {
                    "type": "Literal",
                    "start": 107,
                    "end": 113,
                    "loc": {
                      "start": {
                        "line": 5,
                        "column": 44
                      },
                      "end": {
                        "line": 5,
                        "column": 50
                      }
                    },
                    "value": "time",
                    "raw": "'time'"
                  }
                }
              },
              {
                "start": 114,
                "end": 117,
                "type": "Text",
                "raw": " \n\n",
                "data": " \n\n"
              }
            ]
          }
        ]
      }
    ]
  }
};


/*

function walk(ast) {
// check if the object has any data
// can't use ast.lenght > 0 check coz this is an object not an array 
// 

  if (ast && Object.keys(ast).length > 0) {
    console.log("Nodes found");


// check if the ast has any children
    if (Object.keys(ast).includes('html'))
    {
    console.log("AST has children");

    }

     if ('html'in ast)
    {
    console.log("AST has children 2");

    }



  //execute recursion 

let counter = 0; 

  if ('html' in ast && ast.html.children) {
      ast.html.children.forEach(child => {
        if (child.children) {
          walk(child);

          

          if (child.type ==="IfBlock") {

          	console.log(child);

          	console.log('Got the EventHandler node ...');
          }

          counter++;
        }
      });
    }

console.log(`${counter}`);


  }
}

*/

function walk(ast) {
  if (ast && Object.keys(ast).length > 0) {
    console.log("Nodes found");
    if ('html' in ast && ast.html.children) {
      ast.html.children.forEach(child => {
        walk(child);
        if (child.children) {
          child.children.forEach(grandchild => {
            walk(grandchild);
            if (grandchild.type === "Element" && grandchild.attributes) {
              grandchild.attributes.forEach(attr => {
                if (attr.type === "EventHandler") {
                  console.log("Got the EventHandler node ...");
                  console.log(attr);
                }
              });
            }
          });
        }
      });
    }
  }
}

walk(ast);

