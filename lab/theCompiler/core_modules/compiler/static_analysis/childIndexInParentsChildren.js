const allASTs = {
  "jsAST": {
    "type": "JavaScript",
    "content": {
      "type": "Program",
      "start": 0,
      "end": 183,
      "body": [
        {
          "type": "VariableDeclaration",
          "start": 2,
          "end": 22,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 6,
              "end": 21,
              "id": {
                "type": "Identifier",
                "start": 6,
                "end": 10,
                "name": "name"
              },
              "init": {
                "type": "Literal",
                "start": 13,
                "end": 21,
                "value": "World!",
                "raw": "'World!'"
              }
            }
          ],
          "kind": "let"
        },
        {
          "type": "VariableDeclaration",
          "start": 25,
          "end": 41,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 29,
              "end": 40,
              "id": {
                "type": "Identifier",
                "start": 29,
                "end": 36,
                "name": "counter"
              },
              "init": {
                "type": "Literal",
                "start": 39,
                "end": 40,
                "value": 0,
                "raw": "0"
              }
            }
          ],
          "kind": "let"
        },
        {
          "type": "FunctionDeclaration",
          "start": 44,
          "end": 84,
          "id": {
            "type": "Identifier",
            "start": 53,
            "end": 64,
            "name": "incrementer"
          },
          "expression": false,
          "generator": false,
          "async": false,
          "params": [],
          "body": {
            "type": "BlockStatement",
            "start": 68,
            "end": 84,
            "body": [
              {
                "type": "ExpressionStatement",
                "start": 71,
                "end": 81,
                "expression": {
                  "type": "UpdateExpression",
                  "start": 71,
                  "end": 80,
                  "operator": "++",
                  "prefix": false,
                  "argument": {
                    "type": "Identifier",
                    "start": 71,
                    "end": 78,
                    "name": "counter"
                  }
                }
              }
            ]
          }
        },
        {
          "type": "FunctionDeclaration",
          "start": 88,
          "end": 128,
          "id": {
            "type": "Identifier",
            "start": 97,
            "end": 108,
            "name": "decrementer"
          },
          "expression": false,
          "generator": false,
          "async": false,
          "params": [],
          "body": {
            "type": "BlockStatement",
            "start": 112,
            "end": 128,
            "body": [
              {
                "type": "ExpressionStatement",
                "start": 116,
                "end": 126,
                "expression": {
                  "type": "UpdateExpression",
                  "start": 116,
                  "end": 125,
                  "operator": "--",
                  "prefix": false,
                  "argument": {
                    "type": "Identifier",
                    "start": 116,
                    "end": 123,
                    "name": "counter"
                  }
                }
              }
            ]
          }
        },
        {
          "type": "VariableDeclaration",
          "start": 130,
          "end": 149,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 134,
              "end": 148,
              "id": {
                "type": "Identifier",
                "start": 134,
                "end": 137,
                "name": "day"
              },
              "init": {
                "type": "Literal",
                "start": 140,
                "end": 148,
                "value": "Monday",
                "raw": "'Monday'"
              }
            }
          ],
          "kind": "let"
        },
        {
          "type": "VariableDeclaration",
          "start": 151,
          "end": 181,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 155,
              "end": 180,
              "id": {
                "type": "Identifier",
                "start": 155,
                "end": 167,
                "name": "buttonStatus"
              },
              "init": {
                "type": "Literal",
                "start": 169,
                "end": 180,
                "value": "someValue",
                "raw": "'someValue'"
              }
            }
          ],
          "kind": "let"
        }
      ],
      "sourceType": "script"
    }
  },
  "cssAST": {
    "type": "CSS",
    "content": {
      "raws": {
        "semicolon": false,
        "after": "\n\n"
      },
      "type": "root",
      "nodes": [
        {
          "raws": {
            "before": "\n\n",
            "between": "",
            "semicolon": true,
            "after": ""
          },
          "type": "rule",
          "nodes": [
            {
              "raws": {
                "before": " ",
                "between": ": "
              },
              "type": "decl",
              "source": {
                "end": {
                  "column": 29,
                  "line": 3,
                  "offset": 31
                },
                "inputId": 0,
                "start": {
                  "column": 7,
                  "line": 3,
                  "offset": 8
                }
              },
              "prop": "background-color",
              "value": "blue"
            },
            {
              "raws": {
                "before": " ",
                "between": ": ",
                "value": {
                  "raw": "25px ",
                  "value": "25px"
                }
              },
              "type": "decl",
              "source": {
                "end": {
                  "column": 51,
                  "line": 3,
                  "offset": 53
                },
                "inputId": 0,
                "start": {
                  "column": 31,
                  "line": 3,
                  "offset": 32
                }
              },
              "prop": "border-radius",
              "value": "25px"
            }
          ],
          "source": {
            "end": {
              "column": 52,
              "line": 3,
              "offset": 54
            },
            "inputId": 0,
            "start": {
              "column": 1,
              "line": 3,
              "offset": 2
            }
          },
          "selector": ".btn",
          "lastEach": 1,
          "indexes": {}
        }
      ],
      "source": {
        "end": {
          "column": 1,
          "line": 5,
          "offset": 56
        },
        "inputId": 0,
        "start": {
          "column": 1,
          "line": 1,
          "offset": 0
        }
      },
      "lastEach": 1,
      "indexes": {},
      "inputs": [
        {
          "hasBOM": false,
          "css": "\n\n.btn{ background-color: blue; border-radius: 25px ;}\n\n",
          "file": "/Users/gugulethu/code/semantiq/lab/theCompiler/core_modules/compiler/style"
        }
      ]
    }
  },
  "customAST": {
    "type": "Custom",
    "content": [
      {
        "html": {
          "start": 0,
          "end": 934,
          "type": "Fragment",
          "children": [
            {
              "start": 0,
              "end": 934,
              "type": "Element",
              "name": "customSyntax",
              "attributes": null,
              "children": [
                [
                  {
                    "start": 15,
                    "end": 918,
                    "type": "Element",
                    "name": "div",
                    "attributes": [
                      {
                        "start": 20,
                        "end": 26,
                        "type": "Attribute",
                        "name": "id",
                        "value": [
                          {
                            "start": 24,
                            "end": 25,
                            "type": "Text",
                            "raw": "1",
                            "data": "1"
                          }
                        ]
                      }
                    ],
                    "children": [
                      [
                        {
                          "start": 28,
                          "end": 911,
                          "type": "Element",
                          "name": "div",
                          "attributes": [
                            {
                              "start": 33,
                              "end": 39,
                              "type": "Attribute",
                              "name": "id",
                              "value": [
                                {
                                  "start": 37,
                                  "end": 38,
                                  "type": "Text",
                                  "raw": "2",
                                  "data": "2"
                                }
                              ]
                            }
                          ],
                          "children": [
                            [
                              {
                                "start": 41,
                                "end": 904,
                                "type": "Element",
                                "name": "div",
                                "attributes": [
                                  {
                                    "start": 46,
                                    "end": 52,
                                    "type": "Attribute",
                                    "name": "id",
                                    "value": [
                                      {
                                        "start": 50,
                                        "end": 51,
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
                                      "start": 54,
                                      "end": 897,
                                      "type": "Element",
                                      "name": "section",
                                      "attributes": [
                                        {
                                          "start": 63,
                                          "end": 69,
                                          "type": "Attribute",
                                          "name": "id",
                                          "value": [
                                            {
                                              "start": 67,
                                              "end": 68,
                                              "type": "Text",
                                              "raw": "4",
                                              "data": "4"
                                            }
                                          ]
                                        }
                                      ],
                                      "children": [
                                        [
                                          {
                                            "type": "Text",
                                            "raw": "Hello ",
                                            "data": "Hello "
                                          },
                                          {
                                            "type": "MustacheIdentifier",
                                            "start": {
                                              "offset": 80,
                                              "line": 5,
                                              "column": 7
                                            },
                                            "end": {
                                              "offset": 86,
                                              "line": 5,
                                              "column": 13
                                            },
                                            "expression": {
                                              "type": "Identifier",
                                              "start": {
                                                "offset": 80,
                                                "line": 5,
                                                "column": 7
                                              },
                                              "end": {
                                                "offset": 86,
                                                "line": 5,
                                                "column": 13
                                              },
                                              "name": {
                                                "type": "Identifier",
                                                "start": {
                                                  "offset": 81,
                                                  "line": 5,
                                                  "column": 8
                                                },
                                                "end": {
                                                  "offset": 85,
                                                  "line": 5,
                                                  "column": 12
                                                },
                                                "name": "name"
                                              },
                                              "loc": {
                                                "start": {
                                                  "line": 1,
                                                  "column": 2
                                                },
                                                "end": {
                                                  "line": 1,
                                                  "column": 3
                                                }
                                              }
                                            }
                                          },
                                          {
                                            "start": 88,
                                            "end": 846,
                                            "type": "Element",
                                            "name": "div",
                                            "attributes": [
                                              {
                                                "start": 93,
                                                "end": 100,
                                                "type": "Attribute",
                                                "name": "id",
                                                "value": [
                                                  {
                                                    "start": 97,
                                                    "end": 99,
                                                    "type": "Text",
                                                    "raw": "5c",
                                                    "data": "5c"
                                                  }
                                                ]
                                              }
                                            ],
                                            "children": [
                                              [
                                                {
                                                  "start": 103,
                                                  "end": 521,
                                                  "type": "Element",
                                                  "name": "table",
                                                  "attributes": [
                                                    {
                                                      "start": 110,
                                                      "end": 123,
                                                      "type": "Attribute",
                                                      "name": "class",
                                                      "value": [
                                                        {
                                                          "start": 117,
                                                          "end": 122,
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
                                                        "start": 125,
                                                        "end": 204,
                                                        "type": "Element",
                                                        "name": "thead",
                                                        "attributes": null,
                                                        "children": [
                                                          [
                                                            {
                                                              "start": 133,
                                                              "end": 195,
                                                              "type": "Element",
                                                              "name": "tr",
                                                              "attributes": null,
                                                              "children": [
                                                                [
                                                                  {
                                                                    "start": 138,
                                                                    "end": 153,
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
                                                                    "start": 154,
                                                                    "end": 172,
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
                                                                    "start": 173,
                                                                    "end": 189,
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
                                                        "start": 206,
                                                        "end": 512,
                                                        "type": "Element",
                                                        "name": "tbody",
                                                        "attributes": null,
                                                        "children": [
                                                          [
                                                            {
                                                              "start": 215,
                                                              "end": 288,
                                                              "type": "Element",
                                                              "name": "tr",
                                                              "attributes": null,
                                                              "children": [
                                                                [
                                                                  {
                                                                    "start": 220,
                                                                    "end": 236,
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
                                                                    "start": 237,
                                                                    "end": 252,
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
                                                                    "start": 253,
                                                                    "end": 282,
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
                                                              "start": 290,
                                                              "end": 364,
                                                              "type": "Element",
                                                              "name": "tr",
                                                              "attributes": null,
                                                              "children": [
                                                                [
                                                                  {
                                                                    "start": 295,
                                                                    "end": 312,
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
                                                                    "start": 313,
                                                                    "end": 329,
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
                                                                    "start": 330,
                                                                    "end": 358,
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
                                                              "start": 366,
                                                              "end": 502,
                                                              "type": "Element",
                                                              "name": "tr",
                                                              "attributes": null,
                                                              "children": [
                                                                [
                                                                  {
                                                                    "start": 371,
                                                                    "end": 495,
                                                                    "type": "Element",
                                                                    "name": "td",
                                                                    "attributes": [
                                                                      {
                                                                        "start": 375,
                                                                        "end": 386,
                                                                        "type": "Attribute",
                                                                        "name": "colspan",
                                                                        "value": [
                                                                          {
                                                                            "start": 384,
                                                                            "end": 385,
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
                                                                          "start": 389,
                                                                          "end": 444,
                                                                          "type": "Element",
                                                                          "name": "button",
                                                                          "attributes": [
                                                                            {
                                                                              "start": 397,
                                                                              "end": 410,
                                                                              "type": "Attribute",
                                                                              "name": "id",
                                                                              "value": [
                                                                                {
                                                                                  "start": 401,
                                                                                  "end": 408,
                                                                                  "type": "MustacheAttribute",
                                                                                  "name": {
                                                                                    "type": "Identifier",
                                                                                    "start": {
                                                                                      "offset": 401,
                                                                                      "line": 35,
                                                                                      "column": 13
                                                                                    },
                                                                                    "end": {
                                                                                      "offset": 408,
                                                                                      "line": 35,
                                                                                      "column": 20
                                                                                    },
                                                                                    "name": "counter"
                                                                                  }
                                                                                }
                                                                              ]
                                                                            },
                                                                            {
                                                                              "start": 410,
                                                                              "end": 431,
                                                                              "type": "Attribute",
                                                                              "name": {
                                                                                "start": 410,
                                                                                "end": 416,
                                                                                "type": "EventHandler",
                                                                                "name": "click",
                                                                                "modifiers": [],
                                                                                "expression": {
                                                                                  "type": "CallExpression",
                                                                                  "start": 410,
                                                                                  "end": 416
                                                                                }
                                                                              },
                                                                              "value": [
                                                                                {
                                                                                  "start": 418,
                                                                                  "end": 429,
                                                                                  "type": "MustacheAttribute",
                                                                                  "name": {
                                                                                    "type": "Identifier",
                                                                                    "start": {
                                                                                      "offset": 418,
                                                                                      "line": 35,
                                                                                      "column": 30
                                                                                    },
                                                                                    "end": {
                                                                                      "offset": 429,
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
                                                                          "start": 445,
                                                                          "end": 488,
                                                                          "type": "Element",
                                                                          "name": "button",
                                                                          "attributes": [
                                                                            {
                                                                              "start": 453,
                                                                              "end": 475,
                                                                              "type": "Attribute",
                                                                              "name": {
                                                                                "start": 453,
                                                                                "end": 459,
                                                                                "type": "EventHandler",
                                                                                "name": "click",
                                                                                "modifiers": [],
                                                                                "expression": {
                                                                                  "type": "CallExpression",
                                                                                  "start": 453,
                                                                                  "end": 459
                                                                                }
                                                                              },
                                                                              "value": [
                                                                                {
                                                                                  "start": 461,
                                                                                  "end": 472,
                                                                                  "type": "MustacheAttribute",
                                                                                  "name": {
                                                                                    "type": "Identifier",
                                                                                    "start": {
                                                                                      "offset": 461,
                                                                                      "line": 36,
                                                                                      "column": 17
                                                                                    },
                                                                                    "end": {
                                                                                      "offset": 472,
                                                                                      "line": 36,
                                                                                      "column": 28
                                                                                    },
                                                                                    "name": "decrementer"
                                                                                  }
                                                                                }
                                                                              ]
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
                                                  "start": 524,
                                                  "end": 731,
                                                  "type": "Element",
                                                  "name": "div",
                                                  "attributes": [
                                                    {
                                                      "start": 529,
                                                      "end": 542,
                                                      "type": "Attribute",
                                                      "name": "id",
                                                      "value": [
                                                        {
                                                          "start": 533,
                                                          "end": 541,
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
                                                        "start": 545,
                                                        "end": 723,
                                                        "type": "Element",
                                                        "name": "form",
                                                        "attributes": [
                                                          {
                                                            "start": 551,
                                                            "end": 565,
                                                            "type": "Attribute",
                                                            "name": "method",
                                                            "value": [
                                                              {
                                                                "start": 559,
                                                                "end": 563,
                                                                "type": "Text",
                                                                "raw": "post",
                                                                "data": "post"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "start": 565,
                                                            "end": 586,
                                                            "type": "Attribute",
                                                            "name": "action",
                                                            "value": [
                                                              {
                                                                "start": 573,
                                                                "end": 584,
                                                                "type": "Text",
                                                                "raw": "process.php",
                                                                "data": "process.php"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "start": 586,
                                                            "end": 597,
                                                            "type": "Attribute",
                                                            "name": "class",
                                                            "value": [
                                                              {
                                                                "start": 593,
                                                                "end": 596,
                                                                "type": "MustacheAttribute",
                                                                "name": {
                                                                  "type": "Identifier",
                                                                  "start": {
                                                                    "offset": 593,
                                                                    "line": 48,
                                                                    "column": 49
                                                                  },
                                                                  "end": {
                                                                    "offset": 596,
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
                                                              "start": 600,
                                                              "end": 664,
                                                              "type": "Element",
                                                              "name": "input",
                                                              "attributes": [
                                                                {
                                                                  "start": 607,
                                                                  "end": 615,
                                                                  "type": "Attribute",
                                                                  "name": "id",
                                                                  "value": [
                                                                    {
                                                                      "start": 611,
                                                                      "end": 613,
                                                                      "type": "Text",
                                                                      "raw": "27",
                                                                      "data": "27"
                                                                    }
                                                                  ]
                                                                },
                                                                {
                                                                  "start": 615,
                                                                  "end": 627,
                                                                  "type": "Attribute",
                                                                  "name": "type",
                                                                  "value": [
                                                                    {
                                                                      "start": 621,
                                                                      "end": 625,
                                                                      "type": "Text",
                                                                      "raw": "text",
                                                                      "data": "text"
                                                                    }
                                                                  ]
                                                                },
                                                                {
                                                                  "start": 627,
                                                                  "end": 643,
                                                                  "type": "Attribute",
                                                                  "name": "value",
                                                                  "value": [
                                                                    {
                                                                      "start": 634,
                                                                      "end": 641,
                                                                      "type": "MustacheAttribute",
                                                                      "name": {
                                                                        "type": "Identifier",
                                                                        "start": {
                                                                          "offset": 634,
                                                                          "line": 50,
                                                                          "column": 35
                                                                        },
                                                                        "end": {
                                                                          "offset": 641,
                                                                          "line": 50,
                                                                          "column": 42
                                                                        },
                                                                        "name": "counter"
                                                                      }
                                                                    }
                                                                  ]
                                                                },
                                                                {
                                                                  "start": 643,
                                                                  "end": 660,
                                                                  "type": "Attribute",
                                                                  "name": "data-bind",
                                                                  "value": [
                                                                    {
                                                                      "start": 654,
                                                                      "end": 658,
                                                                      "type": "Text",
                                                                      "raw": "name",
                                                                      "data": "name"
                                                                    }
                                                                  ]
                                                                }
                                                              ],
                                                              "children": []
                                                            },
                                                            {
                                                              "start": 664,
                                                              "end": 716,
                                                              "type": "Element",
                                                              "name": "input",
                                                              "attributes": [
                                                                {
                                                                  "start": 671,
                                                                  "end": 685,
                                                                  "type": "Attribute",
                                                                  "name": "type",
                                                                  "value": [
                                                                    {
                                                                      "start": 677,
                                                                      "end": 683,
                                                                      "type": "Text",
                                                                      "raw": "submit",
                                                                      "data": "submit"
                                                                    }
                                                                  ]
                                                                },
                                                                {
                                                                  "start": 685,
                                                                  "end": 700,
                                                                  "type": "Attribute",
                                                                  "name": "value",
                                                                  "value": [
                                                                    {
                                                                      "start": 692,
                                                                      "end": 698,
                                                                      "type": "Text",
                                                                      "raw": "Submit",
                                                                      "data": "Submit"
                                                                    }
                                                                  ]
                                                                },
                                                                {
                                                                  "start": 700,
                                                                  "end": 712,
                                                                  "type": "Attribute",
                                                                  "name": "class",
                                                                  "value": [
                                                                    {
                                                                      "start": 707,
                                                                      "end": 710,
                                                                      "type": "Text",
                                                                      "raw": "btn",
                                                                      "data": "btn"
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
                                                },
                                                {
                                                  "start": 733,
                                                  "end": 838,
                                                  "type": "Element",
                                                  "name": "p",
                                                  "attributes": null,
                                                  "children": [
                                                    [
                                                      {
                                                        "type": "Text",
                                                        "raw": "Example Button Below ",
                                                        "data": "Example Button Below "
                                                      },
                                                      {
                                                        "start": 758,
                                                        "end": 765,
                                                        "type": "Element",
                                                        "name": "br",
                                                        "attributes": null,
                                                        "children": []
                                                      },
                                                      {
                                                        "start": 765,
                                                        "end": 832,
                                                        "type": "Element",
                                                        "name": "button",
                                                        "attributes": [
                                                          {
                                                            "start": 773,
                                                            "end": 785,
                                                            "type": "Attribute",
                                                            "name": "class",
                                                            "value": [
                                                              {
                                                                "start": 780,
                                                                "end": 783,
                                                                "type": "Text",
                                                                "raw": "btn",
                                                                "data": "btn"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "start": 785,
                                                            "end": 793,
                                                            "type": "Attribute",
                                                            "name": "disabled",
                                                            "value": true
                                                          }
                                                        ],
                                                        "children": [
                                                          [
                                                            {
                                                              "type": "Text",
                                                              "raw": "I am a disabled Button. -:) ",
                                                              "data": "I am a disabled Button. -:) "
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
                                            "type": "Text",
                                            "raw": "Thanks a mil, it's an awesome ",
                                            "data": "Thanks a mil, it's an awesome "
                                          },
                                          {
                                            "type": "MustacheIdentifier",
                                            "start": {
                                              "offset": 878,
                                              "line": 66,
                                              "column": 31
                                            },
                                            "end": {
                                              "offset": 883,
                                              "line": 66,
                                              "column": 36
                                            },
                                            "expression": {
                                              "type": "Identifier",
                                              "start": {
                                                "offset": 878,
                                                "line": 66,
                                                "column": 31
                                              },
                                              "end": {
                                                "offset": 883,
                                                "line": 66,
                                                "column": 36
                                              },
                                              "name": {
                                                "type": "Identifier",
                                                "start": {
                                                  "offset": 879,
                                                  "line": 66,
                                                  "column": 32
                                                },
                                                "end": {
                                                  "offset": 882,
                                                  "line": 66,
                                                  "column": 35
                                                },
                                                "name": "day"
                                              },
                                              "loc": {
                                                "start": {
                                                  "line": 1,
                                                  "column": 2
                                                },
                                                "end": {
                                                  "line": 1,
                                                  "column": 3
                                                }
                                              }
                                            }
                                          },
                                          {
                                            "type": "Text",
                                            "raw": "!.\n\n",
                                            "data": "!.\n\n"
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
            }
          ]
        }
      }
    ]
  }
};


const targetNode = {
                                            "type": "MustacheIdentifier",
                                            "start": {
                                              "offset": 878,
                                              "line": 66,
                                              "column": 31
                                            },
                                            "end": {
                                              "offset": 883,
                                              "line": 66,
                                              "column": 36
                                            },
                                            "expression": {
                                              "type": "Identifier",
                                              "start": {
                                                "offset": 878,
                                                "line": 66,
                                                "column": 31
                                              },
                                              "end": {
                                                "offset": 883,
                                                "line": 66,
                                                "column": 36
                                              },
                                              "name": {
                                                "type": "Identifier",
                                                "start": {
                                                  "offset": 879,
                                                  "line": 66,
                                                  "column": 32
                                                },
                                                "end": {
                                                  "offset": 882,
                                                  "line": 66,
                                                  "column": 35
                                                },
                                                "name": "day"
                                              },
                                              "loc": {
                                                "start": {
                                                  "line": 1,
                                                  "column": 2
                                                },
                                                "end": {
                                                  "line": 1,
                                                  "column": 3
                                                }
                                              }
                                            }
                                          };




class GetNodePositions {

  constructor (ast, targetNode) {
    this.ast=ast;
    this.targetNode=targetNode;
    //console.log("inside",this.ast);
  }


findIndexInChildren(parent) {  

const isObject = (value) => value && typeof value === 'object';
  
  if (parent.children) {
    if (Array.isArray(parent.children)) {
      // Iterate over the array of arrays
      for (let i = 0; i < parent.children.length; i++) {
        const childArray = parent.children[i];
        if (Array.isArray(childArray)) {
          for (let j = 0; j < childArray.length; j++) {
            const child = childArray[j];

            //console.log("TYPE",parent.name, child.type);

      const startMatch = isObject(child.start) ? this.deepEqual(child.start, this.targetNode.start) : child.start === this.targetNode.start;
      const endMatch = isObject(child.end) ? this.deepEqual(child.end, this.targetNode.end) : child.end === this.targetNode.end;      
            
            if (
              startMatch
              && endMatch
              && child.type === this.targetNode.type 
              && child.name === this.targetNode.name 
              && this.deepEqual(child.attributes, this.targetNode.attributes) 
              && this.deepEqual(child.children, this.targetNode.children)
            ) {
             
             //console.log("matchFound", "child",child, "target",this.targetNode);

              //return [i, j]; // Return the indices of the child node
              return j; // return index only
            }


          }
        }
      }
    } else {
      // Iterate over the object
      for (const key in parent.children) {
        if (Object.hasOwnProperty.call(parent.children, key)) {
          const childArray = parent.children[key];
          if (Array.isArray(childArray)) {
            for (let j = 0; j < childArray.length; j++) {
              const child = childArray[j];
              if (
                child.start === this.targetNode.start &&
                child.end === this.targetNode.end &&
                child.type === this.targetNode.type &&
                child.name === this.targetNode.name &&
                this.deepEqual(child.attributes, this.targetNode.attributes) &&
                this.deepEqual(child.children, this.targetNode.children)
              ) {
                //return [key, j]; // Return the key and index of the child node
                return j; // return index only
              }
            }
          }
        }
      }
    }
  }

    
  return -1; // Return -1 if the targetNode is not found
}


 deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!this.deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key) || !this.deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
}


walk() {
    let matchFound = false;
    let nodeStack = [];
    let visitedNodes = new Set();

    const processNode = (node) => {
      if (node && (node.type === 'Element' || node.type === 'Text' || node.type === 'MustacheIdentifier')) {
        const nodeKey = `${node.type}-${node.start}-${node.end}`;
        if (!visitedNodes.has(nodeKey)) {
          visitedNodes.add(nodeKey);
          nodeStack.push({
            node: node,
            nodeName: node.name || node.type,
            nodeType: node.type,
            nodeText: node.type === 'Text' ? node.text : null,
          });
        }
      }

      if (
        node.start === this.targetNode.start &&
        node.end === this.targetNode.end &&
        node.type === this.targetNode.type &&
        node.name === this.targetNode.name &&
        this.deepEqual(node.attributes, this.targetNode.attributes) &&
        this.deepEqual(node.children, this.targetNode.children)
      ) {
        matchFound = true;
      }

      if (!matchFound) {
        if (Array.isArray(node.children)) {
          node.children.forEach((child) => nestedWalker(child));
        } else if (typeof node === 'object' && node !== null) {
          Object.values(node).forEach((value) => nestedWalker(value));
        }
      }
    };

    const nestedWalker = (node) => {
      if (!matchFound) {
        if (Array.isArray(node)) {
          node.forEach((item) => nestedWalker(item));
        } else if (typeof node === 'object' && node !== null) {
          processNode(node);
          if (node.children) {
            node.children.forEach((child) => nestedWalker(child));
          }
        }
      }
    };

    nestedWalker(this.ast);
    //console.log("HERE", nodeStack);
    return nodeStack;
  }


 findChildren(node) {
  const _findChildren = (node) => {
    if (node && typeof node === 'object') {
      if (node.type === 'Element' && node.children && typeof node.children === 'object' && Object.keys(node.children).length > 0) {
        // node has a children object which is not empty
        return node.children;
      } else if (node.children && typeof node.children === 'object' && Object.keys(node.children).length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          _findChildren(node.children[i]);
        }
      }

      if (node.type === 'Element' && Array.isArray(node.children) && node.children.length > 0) {
        // node has a children array which is not empty
        return node.children;
      } else if (Array.isArray(node.children) && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          _findChildren(node.children[i]);
        }
      }

      // Recursively search through the properties of the node
      for (const key in node) {
        if (node.hasOwnProperty(key)) {
          const result = _findChildren(node[key]);
          if (result) {
            return result;
          }
        }
      }
    }
    return false;
  };

  return _findChildren(node);
}
 


/** @childrenChecker(nodeToCheck)
 * use for drilling down until there is no array or object passed
 * it drills down to the very elements objects/arrays
 * it won't pass an object
 * useful for traversing objects/arrays for element/units
 * WON'T WORK FOR PASSING NODES (OBJECTS OR ARRAYS) 
 */

/*
function childrenChecker(nodeToCheck) {
    // Helper function to drill down into arrays and objects
    function deepCheck(node) {
        if (Array.isArray(node)) {
            for (let i = 0; i < node.length; ++i) {
                if (deepCheck(node[i])) {
                    return true;
                }
            }
        } else if (typeof node === 'object' && node !== null) {
            for (let key in node) {
                if (deepCheck(node[key])) {
                    return true;
                }
            }
        } else {
            // Base case: when node is neither an array nor an object
            console.log("event got here",node);
            return findChildren(node);
        }
        return false;
    }

    return deepCheck(nodeToCheck);
}

*/

 childrenChecker(nodeToCheck) {
    if (Array.isArray(nodeToCheck)) {
        for (let i = 0; i < nodeToCheck.length; ++i) {
            if (this.findChildren(nodeToCheck[i])) {
              //console.log("here",nodeToCheck[i]);
                 return nodeToCheck[i]; //return true;
            }
        }
    } else if (typeof nodeToCheck === 'object' && nodeToCheck !== null) {
        for (let key in nodeToCheck) {
            if (this.findChildren(nodeToCheck[key])) {
              //console.log("here",nodeToCheck[key]);
                return nodeToCheck[key]; //return true;
            }
        }
    } else {
      //console.log("here",nodeToCheck);
        return this.findChildren(nodeToCheck);
    }

    return false; // If no children are found in the array or object
}


/**@nodeStack - careful that parent could be sibling 
 * - because parent is simply the previous node encountered in the traversal
 * - to find the parent we need to get the first node in the stack 
 * with the targetNode in it's children
 * - a button element in a table td - will exist in that td and in the tr of that td 
 * - we must get the immediate parent so that catch that as the active node to be replaced 
 * in the grandParent node
 */


/** @for Lopp
 * 1. iterate through the nodeStack - this nodeStack has all nodes in the ast 
 * in their respective order
 * all nodes at this stage are 'Element' types - no loose hanging text or mustache tags 
 * at this point - if such existed they have been transformed already and wrapped in 
 * spans - so very node at this stage is an html tag === node.type 'Element'
 * nodeStack is a result of a deep exhaustive traversal 
 * - same logic used by the Semantq html parser - so there is no node left out 
 * 2. @childrenChecker checks if node has children 
 * - if it doesn't we don't have to bother  looking for the targetNode in it 
 * 3. if nodeToCheck has children then we proceed to findIndexInChildren()
 * if index is -1 then targetNode is ƒNOT found in the node
 * if existsIndex > -1 then we have found the tagetNode in the node and 
 * hev the index as 
 * 4. with the parentNode and nodeIndex plus newNode - we can replace the node
 */

init() {

//console.log("HERE now",this.ast);
const nodeStack = this.walk(this.ast);
let nodeLocations = [];
//console.log("NODE STACK",nodeStack); 
//console.log(JSON.stringify(nodeStack,null,2));


for (let i = 0; i < nodeStack.length; i++) {
  const nodeToCheck = nodeStack[i];
  const result = this.childrenChecker(nodeToCheck);


  if (result && result.children) {
    const existsIndex = this.findIndexInChildren(result);

      //console.log(existsIndex);

    if (existsIndex > -1) {
        nodeLocations.push({
        parentNode: nodeToCheck.node,
        nodeIndex: existsIndex,
      });

      return nodeLocations;
    }
  }



}

///console.log("HERE now",nodeLocations);

//return nodeLocations; 

}



}


const customSyntaxAST = allASTs.customAST.content[0];
//console.log(customSyntaxAST);


const finder = new GetNodePositions(customSyntaxAST, targetNode);
const result = finder.init();

console.log(result);


