{
  "html": {
    "start": 0,
    "end": 161,
    "type": "Fragment",
    "children": [
      {
        "start": 0,
        "end": 161,
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
            "end": 153,
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
                  "name": "handlerClick()"
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
              },
              {
                "start": 60,
                "end": 86,
                "type": "EventHandler",
                "name": "mouseover",
                "modifiers": [],
                "expression": {
                  "type": "Identifier",
                  "start": 74,
                  "end": 85,
                  "loc": {
                    "start": {
                      "line": 3,
                      "column": 59
                    },
                    "end": {
                      "line": 3,
                      "column": 70
                    }
                  },
                  "name": "mouserevent()"
                }
              }
            ],
            "children": [
              {
                "start": 87,
                "end": 99,
                "type": "Text",
                "raw": " \n\nClicked: ",
                "data": " \n\nClicked: "
              },
              {
                "start": 99,
                "end": 108,
                "type": "MustacheTag",
                "expression": {
                  "type": "Identifier",
                  "start": 100,
                  "end": 107,
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
                "start": 108,
                "end": 109,
                "type": "Text",
                "raw": " ",
                "data": " "
              },
              {
                "start": 109,
                "end": 141,
                "type": "MustacheTag",
                "expression": {
                  "type": "ConditionalExpression",
                  "start": 110,
                  "end": 140,
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
                    "start": 110,
                    "end": 121,
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
                      "start": 110,
                      "end": 117,
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
                      "start": 120,
                      "end": 121,
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
                    "start": 124,
                    "end": 131,
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
                    "start": 134,
                    "end": 140,
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
                "start": 141,
                "end": 144,
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
}
