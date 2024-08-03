{
  "type": "Program",
  "start": 0,
  "end": 296,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 3,
      "end": 60,
      "id": {
        "type": "Identifier",
        "start": 12,
        "end": 17,
        "name": "adder"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [
        {
          "type": "Identifier",
          "start": 18,
          "end": 19,
          "name": "a"
        },
        {
          "type": "Identifier",
          "start": 20,
          "end": 21,
          "name": "b"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "start": 23,
        "end": 60,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 26,
            "end": 44,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 32,
                "end": 43,
                "id": {
                  "type": "Identifier",
                  "start": 32,
                  "end": 35,
                  "name": "res"
                },
                "init": {
                  "type": "BinaryExpression",
                  "start": 38,
                  "end": 43,
                  "left": {
                    "type": "Identifier",
                    "start": 38,
                    "end": 39,
                    "name": "a"
                  },
                  "operator": "+",
                  "right": {
                    "type": "Identifier",
                    "start": 42,
                    "end": 43,
                    "name": "b"
                  }
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "ReturnStatement",
            "start": 46,
            "end": 57,
            "argument": {
              "type": "Identifier",
              "start": 53,
              "end": 56,
              "name": "res"
            }
          }
        ]
      }
    },
    {
      "type": "VariableDeclaration",
      "start": 62,
      "end": 74,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 68,
          "end": 73,
          "id": {
            "type": "Identifier",
            "start": 68,
            "end": 69,
            "name": "a"
          },
          "init": {
            "type": "Literal",
            "start": 72,
            "end": 73,
            "value": 4,
            "raw": "4"
          }
        }
      ],
      "kind": "const"
    },
    {
      "type": "VariableDeclaration",
      "start": 75,
      "end": 87,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 81,
          "end": 86,
          "id": {
            "type": "Identifier",
            "start": 81,
            "end": 82,
            "name": "b"
          },
          "init": {
            "type": "Literal",
            "start": 85,
            "end": 86,
            "value": 6,
            "raw": "6"
          }
        }
      ],
      "kind": "const"
    },
    {
      "type": "VariableDeclaration",
      "start": 89,
      "end": 112,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 95,
          "end": 111,
          "id": {
            "type": "Identifier",
            "start": 95,
            "end": 98,
            "name": "sum"
          },
          "init": {
            "type": "CallExpression",
            "start": 101,
            "end": 111,
            "callee": {
              "type": "Identifier",
              "start": 101,
              "end": 106,
              "name": "adder"
            },
            "arguments": [
              {
                "type": "Identifier",
                "start": 107,
                "end": 108,
                "name": "a"
              },
              {
                "type": "Identifier",
                "start": 109,
                "end": 110,
                "name": "b"
              }
            ],
            "optional": false
          }
        }
      ],
      "kind": "const"
    },
    {
      "type": "VariableDeclaration",
      "start": 115,
      "end": 135,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 119,
          "end": 134,
          "id": {
            "type": "Identifier",
            "start": 119,
            "end": 123,
            "name": "name"
          },
          "init": {
            "type": "Literal",
            "start": 126,
            "end": 134,
            "value": "World!",
            "raw": "'World!'"
          }
        }
      ],
      "kind": "let"
    },
    {
      "type": "VariableDeclaration",
      "start": 138,
      "end": 154,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 142,
          "end": 153,
          "id": {
            "type": "Identifier",
            "start": 142,
            "end": 149,
            "name": "counter"
          },
          "init": {
            "type": "Literal",
            "start": 152,
            "end": 153,
            "value": 0,
            "raw": "0"
          }
        }
      ],
      "kind": "let"
    },
    {
      "type": "FunctionDeclaration",
      "start": 157,
      "end": 197,
      "id": {
        "type": "Identifier",
        "start": 166,
        "end": 177,
        "name": "incrementer"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 181,
        "end": 197,
        "body": [
          {
            "type": "ExpressionStatement",
            "start": 184,
            "end": 194,
            "expression": {
              "type": "UpdateExpression",
              "start": 184,
              "end": 193,
              "operator": "++",
              "prefix": false,
              "argument": {
                "type": "Identifier",
                "start": 184,
                "end": 191,
                "name": "counter"
              }
            }
          },
          {
            "type": "Program",
            "start": 0,
            "end": 18,
            "body": [
              {
                "type": "ExpressionStatement",
                "start": 0,
                "end": 18,
                "expression": {
                  "type": "CallExpression",
                  "start": 0,
                  "end": 17,
                  "callee": {
                    "type": "Identifier",
                    "start": 0,
                    "end": 15,
                    "name": "reRenderCounter"
                  },
                  "arguments": [],
                  "optional": false
                }
              }
            ],
            "sourceType": "script"
          }
        ]
      }
    },
    {
      "type": "FunctionDeclaration",
      "start": 201,
      "end": 241,
      "id": {
        "type": "Identifier",
        "start": 210,
        "end": 221,
        "name": "decrementer"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 225,
        "end": 241,
        "body": [
          {
            "type": "ExpressionStatement",
            "start": 229,
            "end": 239,
            "expression": {
              "type": "UpdateExpression",
              "start": 229,
              "end": 238,
              "operator": "--",
              "prefix": false,
              "argument": {
                "type": "Identifier",
                "start": 229,
                "end": 236,
                "name": "counter"
              }
            }
          },
          {
            "type": "Program",
            "start": 0,
            "end": 18,
            "body": [
              {
                "type": "ExpressionStatement",
                "start": 0,
                "end": 18,
                "expression": {
                  "type": "CallExpression",
                  "start": 0,
                  "end": 17,
                  "callee": {
                    "type": "Identifier",
                    "start": 0,
                    "end": 15,
                    "name": "reRenderCounter"
                  },
                  "arguments": [],
                  "optional": false
                }
              }
            ],
            "sourceType": "script"
          }
        ]
      }
    },
    {
      "type": "VariableDeclaration",
      "start": 243,
      "end": 262,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 247,
          "end": 261,
          "id": {
            "type": "Identifier",
            "start": 247,
            "end": 250,
            "name": "day"
          },
          "init": {
            "type": "Literal",
            "start": 253,
            "end": 261,
            "value": "Monday",
            "raw": "'Monday'"
          }
        }
      ],
      "kind": "let"
    },
    {
      "type": "VariableDeclaration",
      "start": 264,
      "end": 294,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 268,
          "end": 293,
          "id": {
            "type": "Identifier",
            "start": 268,
            "end": 280,
            "name": "buttonStatus"
          },
          "init": {
            "type": "Literal",
            "start": 282,
            "end": 293,
            "value": "someValue",
            "raw": "'someValue'"
          }
        }
      ],
      "kind": "let"
    },
    {
      "type": "Program",
      "start": 0,
      "end": 712,
      "body": [
        {
          "type": "FunctionDeclaration",
          "start": 21,
          "end": 629,
          "id": {
            "type": "Identifier",
            "start": 30,
            "end": 45,
            "name": "reRenderCounter"
          },
          "expression": false,
          "generator": false,
          "async": false,
          "params": [],
          "body": {
            "type": "BlockStatement",
            "start": 48,
            "end": 629,
            "body": [
              {
                "type": "VariableDeclaration",
                "start": 81,
                "end": 144,
                "declarations": [
                  {
                    "type": "VariableDeclarator",
                    "start": 87,
                    "end": 143,
                    "id": {
                      "type": "Identifier",
                      "start": 87,
                      "end": 108,
                      "name": "b_XDi_282_rootElement"
                    },
                    "init": {
                      "type": "CallExpression",
                      "start": 111,
                      "end": 143,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 111,
                        "end": 133,
                        "object": {
                          "type": "Identifier",
                          "start": 111,
                          "end": 119,
                          "name": "document"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 120,
                          "end": 133,
                          "name": "createElement"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "Literal",
                          "start": 134,
                          "end": 142,
                          "value": "button",
                          "raw": "'button'"
                        }
                      ],
                      "optional": false
                    }
                  }
                ],
                "kind": "const"
              },
              {
                "type": "ExpressionStatement",
                "start": 163,
                "end": 213,
                "expression": {
                  "type": "CallExpression",
                  "start": 163,
                  "end": 212,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 163,
                    "end": 197,
                    "object": {
                      "type": "Identifier",
                      "start": 163,
                      "end": 184,
                      "name": "b_XDi_282_rootElement"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 185,
                      "end": 197,
                      "name": "setAttribute"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "Literal",
                      "start": 198,
                      "end": 202,
                      "value": "id",
                      "raw": "'id'"
                    },
                    {
                      "type": "Identifier",
                      "start": 204,
                      "end": 211,
                      "name": "counter"
                    }
                  ],
                  "optional": false
                }
              },
              {
                "type": "ExpressionStatement",
                "start": 214,
                "end": 277,
                "expression": {
                  "type": "CallExpression",
                  "start": 214,
                  "end": 276,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 214,
                    "end": 248,
                    "object": {
                      "type": "Identifier",
                      "start": 214,
                      "end": 235,
                      "name": "b_XDi_282_rootElement"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 236,
                      "end": 248,
                      "name": "setAttribute"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "Literal",
                      "start": 249,
                      "end": 258,
                      "value": "onclick",
                      "raw": "'onclick'"
                    },
                    {
                      "type": "Literal",
                      "start": 260,
                      "end": 275,
                      "value": "incrementer()",
                      "raw": "'incrementer()'"
                    }
                  ],
                  "optional": false
                }
              },
              {
                "type": "VariableDeclaration",
                "start": 278,
                "end": 333,
                "declarations": [
                  {
                    "type": "VariableDeclarator",
                    "start": 284,
                    "end": 332,
                    "id": {
                      "type": "Identifier",
                      "start": 284,
                      "end": 300,
                      "name": "textNode_247_lui"
                    },
                    "init": {
                      "type": "CallExpression",
                      "start": 303,
                      "end": 332,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 303,
                        "end": 326,
                        "object": {
                          "type": "Identifier",
                          "start": 303,
                          "end": 311,
                          "name": "document"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 312,
                          "end": 326,
                          "name": "createTextNode"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "Literal",
                          "start": 327,
                          "end": 331,
                          "value": "+ ",
                          "raw": "'+ '"
                        }
                      ],
                      "optional": false
                    }
                  }
                ],
                "kind": "const"
              },
              {
                "type": "ExpressionStatement",
                "start": 334,
                "end": 386,
                "expression": {
                  "type": "CallExpression",
                  "start": 334,
                  "end": 385,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 334,
                    "end": 367,
                    "object": {
                      "type": "Identifier",
                      "start": 334,
                      "end": 355,
                      "name": "b_XDi_282_rootElement"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 356,
                      "end": 367,
                      "name": "appendChild"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "Identifier",
                      "start": 368,
                      "end": 384,
                      "name": "textNode_247_lui"
                    }
                  ],
                  "optional": false
                }
              },
              {
                "type": "VariableDeclaration",
                "start": 400,
                "end": 463,
                "declarations": [
                  {
                    "type": "VariableDeclarator",
                    "start": 406,
                    "end": 462,
                    "id": {
                      "type": "Identifier",
                      "start": 406,
                      "end": 424,
                      "name": "target_element_xdi"
                    },
                    "init": {
                      "type": "CallExpression",
                      "start": 427,
                      "end": 462,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 427,
                        "end": 450,
                        "object": {
                          "type": "Identifier",
                          "start": 427,
                          "end": 435,
                          "name": "document"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 436,
                          "end": 450,
                          "name": "getElementById"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "Literal",
                          "start": 451,
                          "end": 461,
                          "value": "lz4myyii",
                          "raw": "'lz4myyii'"
                        }
                      ],
                      "optional": false
                    }
                  }
                ],
                "kind": "const"
              },
              {
                "type": "ExpressionStatement",
                "start": 476,
                "end": 510,
                "expression": {
                  "type": "AssignmentExpression",
                  "start": 476,
                  "end": 509,
                  "operator": "=",
                  "left": {
                    "type": "MemberExpression",
                    "start": 476,
                    "end": 504,
                    "object": {
                      "type": "Identifier",
                      "start": 476,
                      "end": 494,
                      "name": "target_element_xdi"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 495,
                      "end": 504,
                      "name": "innerHTML"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "right": {
                    "type": "Literal",
                    "start": 507,
                    "end": 509,
                    "value": "",
                    "raw": "''"
                  }
                }
              },
              {
                "type": "ExpressionStatement",
                "start": 559,
                "end": 613,
                "expression": {
                  "type": "CallExpression",
                  "start": 559,
                  "end": 612,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 559,
                    "end": 589,
                    "object": {
                      "type": "Identifier",
                      "start": 559,
                      "end": 577,
                      "name": "target_element_xdi"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 578,
                      "end": 589,
                      "name": "appendChild"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "Identifier",
                      "start": 590,
                      "end": 611,
                      "name": "b_XDi_282_rootElement"
                    }
                  ],
                  "optional": false
                }
              },
              {
                "type": "Program",
                "start": 0,
                "end": 601,
                "body": [
                  {
                    "type": "VariableDeclaration",
                    "start": 81,
                    "end": 142,
                    "declarations": [
                      {
                        "type": "VariableDeclarator",
                        "start": 87,
                        "end": 141,
                        "id": {
                          "type": "Identifier",
                          "start": 87,
                          "end": 107,
                          "name": "i_fy_634_rootElement"
                        },
                        "init": {
                          "type": "CallExpression",
                          "start": 110,
                          "end": 141,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 110,
                            "end": 132,
                            "object": {
                              "type": "Identifier",
                              "start": 110,
                              "end": 118,
                              "name": "document"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 119,
                              "end": 132,
                              "name": "createElement"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Literal",
                              "start": 133,
                              "end": 140,
                              "value": "input",
                              "raw": "'input'"
                            }
                          ],
                          "optional": false
                        }
                      }
                    ],
                    "kind": "const"
                  },
                  {
                    "type": "ExpressionStatement",
                    "start": 161,
                    "end": 207,
                    "expression": {
                      "type": "CallExpression",
                      "start": 161,
                      "end": 206,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 161,
                        "end": 194,
                        "object": {
                          "type": "Identifier",
                          "start": 161,
                          "end": 181,
                          "name": "i_fy_634_rootElement"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 182,
                          "end": 194,
                          "name": "setAttribute"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "Literal",
                          "start": 195,
                          "end": 199,
                          "value": "id",
                          "raw": "'id'"
                        },
                        {
                          "type": "Literal",
                          "start": 201,
                          "end": 205,
                          "value": "27",
                          "raw": "'27'"
                        }
                      ],
                      "optional": false
                    }
                  },
                  {
                    "type": "ExpressionStatement",
                    "start": 208,
                    "end": 258,
                    "expression": {
                      "type": "CallExpression",
                      "start": 208,
                      "end": 257,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 208,
                        "end": 241,
                        "object": {
                          "type": "Identifier",
                          "start": 208,
                          "end": 228,
                          "name": "i_fy_634_rootElement"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 229,
                          "end": 241,
                          "name": "setAttribute"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "Literal",
                          "start": 242,
                          "end": 248,
                          "value": "type",
                          "raw": "'type'"
                        },
                        {
                          "type": "Literal",
                          "start": 250,
                          "end": 256,
                          "value": "text",
                          "raw": "'text'"
                        }
                      ],
                      "optional": false
                    }
                  },
                  {
                    "type": "ExpressionStatement",
                    "start": 259,
                    "end": 311,
                    "expression": {
                      "type": "CallExpression",
                      "start": 259,
                      "end": 310,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 259,
                        "end": 292,
                        "object": {
                          "type": "Identifier",
                          "start": 259,
                          "end": 279,
                          "name": "i_fy_634_rootElement"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 280,
                          "end": 292,
                          "name": "setAttribute"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "Literal",
                          "start": 293,
                          "end": 300,
                          "value": "value",
                          "raw": "'value'"
                        },
                        {
                          "type": "Identifier",
                          "start": 302,
                          "end": 309,
                          "name": "counter"
                        }
                      ],
                      "optional": false
                    }
                  },
                  {
                    "type": "ExpressionStatement",
                    "start": 312,
                    "end": 367,
                    "expression": {
                      "type": "CallExpression",
                      "start": 312,
                      "end": 366,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 312,
                        "end": 345,
                        "object": {
                          "type": "Identifier",
                          "start": 312,
                          "end": 332,
                          "name": "i_fy_634_rootElement"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 333,
                          "end": 345,
                          "name": "setAttribute"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "Literal",
                          "start": 346,
                          "end": 357,
                          "value": "data-bind",
                          "raw": "'data-bind'"
                        },
                        {
                          "type": "Literal",
                          "start": 359,
                          "end": 365,
                          "value": "name",
                          "raw": "'name'"
                        }
                      ],
                      "optional": false
                    }
                  },
                  {
                    "type": "VariableDeclaration",
                    "start": 381,
                    "end": 443,
                    "declarations": [
                      {
                        "type": "VariableDeclarator",
                        "start": 387,
                        "end": 442,
                        "id": {
                          "type": "Identifier",
                          "start": 387,
                          "end": 404,
                          "name": "target_element_fy"
                        },
                        "init": {
                          "type": "CallExpression",
                          "start": 407,
                          "end": 442,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 407,
                            "end": 430,
                            "object": {
                              "type": "Identifier",
                              "start": 407,
                              "end": 415,
                              "name": "document"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 416,
                              "end": 430,
                              "name": "getElementById"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Literal",
                              "start": 431,
                              "end": 441,
                              "value": "lz4imcyi",
                              "raw": "'lz4imcyi'"
                            }
                          ],
                          "optional": false
                        }
                      }
                    ],
                    "kind": "const"
                  },
                  {
                    "type": "ExpressionStatement",
                    "start": 456,
                    "end": 489,
                    "expression": {
                      "type": "AssignmentExpression",
                      "start": 456,
                      "end": 488,
                      "operator": "=",
                      "left": {
                        "type": "MemberExpression",
                        "start": 456,
                        "end": 483,
                        "object": {
                          "type": "Identifier",
                          "start": 456,
                          "end": 473,
                          "name": "target_element_fy"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 474,
                          "end": 483,
                          "name": "innerHTML"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "right": {
                        "type": "Literal",
                        "start": 486,
                        "end": 488,
                        "value": "",
                        "raw": "''"
                      }
                    }
                  },
                  {
                    "type": "ExpressionStatement",
                    "start": 538,
                    "end": 590,
                    "expression": {
                      "type": "CallExpression",
                      "start": 538,
                      "end": 589,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 538,
                        "end": 567,
                        "object": {
                          "type": "Identifier",
                          "start": 538,
                          "end": 555,
                          "name": "target_element_fy"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 556,
                          "end": 567,
                          "name": "appendChild"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "Identifier",
                          "start": 568,
                          "end": 588,
                          "name": "i_fy_634_rootElement"
                        }
                      ],
                      "optional": false
                    }
                  }
                ],
                "sourceType": "script"
              }
            ]
          }
        },
        {
          "type": "ExpressionStatement",
          "start": 695,
          "end": 712,
          "expression": {
            "type": "CallExpression",
            "start": 695,
            "end": 712,
            "callee": {
              "type": "Identifier",
              "start": 695,
              "end": 710,
              "name": "reRenderCounter"
            },
            "arguments": [],
            "optional": false
          }
        }
      ],
      "sourceType": "script"
    },
    {
      "type": "Program",
      "start": 0,
      "end": 351,
      "body": [
        {
          "type": "VariableDeclaration",
          "start": 9,
          "end": 42,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 15,
              "end": 41,
              "id": {
                "type": "Identifier",
                "start": 15,
                "end": 35,
                "name": "mustacheExpr_872_4s4"
              },
              "init": {
                "type": "Identifier",
                "start": 38,
                "end": 41,
                "name": "sum"
              }
            }
          ],
          "kind": "const"
        },
        {
          "type": "VariableDeclaration",
          "start": 43,
          "end": 99,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 47,
              "end": 98,
              "id": {
                "type": "Identifier",
                "start": 47,
                "end": 67,
                "name": "M_tN_316_rootElement"
              },
              "init": {
                "type": "CallExpression",
                "start": 70,
                "end": 98,
                "callee": {
                  "type": "MemberExpression",
                  "start": 70,
                  "end": 93,
                  "object": {
                    "type": "Identifier",
                    "start": 70,
                    "end": 78,
                    "name": "document"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 79,
                    "end": 93,
                    "name": "createTextNode"
                  },
                  "computed": false,
                  "optional": false
                },
                "arguments": [
                  {
                    "type": "Identifier",
                    "start": 94,
                    "end": 97,
                    "name": "sum"
                  }
                ],
                "optional": false
              }
            }
          ],
          "kind": "let"
        },
        {
          "type": "VariableDeclaration",
          "start": 108,
          "end": 181,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 114,
              "end": 180,
              "id": {
                "type": "Identifier",
                "start": 114,
                "end": 142,
                "name": "target_mustacheidentifier_tn"
              },
              "init": {
                "type": "CallExpression",
                "start": 145,
                "end": 180,
                "callee": {
                  "type": "MemberExpression",
                  "start": 145,
                  "end": 168,
                  "object": {
                    "type": "Identifier",
                    "start": 145,
                    "end": 153,
                    "name": "document"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 154,
                    "end": 168,
                    "name": "getElementById"
                  },
                  "computed": false,
                  "optional": false
                },
                "arguments": [
                  {
                    "type": "Literal",
                    "start": 169,
                    "end": 179,
                    "value": "lz4b1l9j",
                    "raw": "'lz4b1l9j'"
                  }
                ],
                "optional": false
              }
            }
          ],
          "kind": "const"
        },
        {
          "type": "ExpressionStatement",
          "start": 190,
          "end": 232,
          "expression": {
            "type": "AssignmentExpression",
            "start": 190,
            "end": 231,
            "operator": "=",
            "left": {
              "type": "MemberExpression",
              "start": 190,
              "end": 228,
              "object": {
                "type": "Identifier",
                "start": 190,
                "end": 218,
                "name": "target_mustacheidentifier_tn"
              },
              "property": {
                "type": "Identifier",
                "start": 219,
                "end": 228,
                "name": "innerHTML"
              },
              "computed": false,
              "optional": false
            },
            "right": {
              "type": "Literal",
              "start": 229,
              "end": 231,
              "value": "",
              "raw": "''"
            }
          }
        },
        {
          "type": "ExpressionStatement",
          "start": 241,
          "end": 346,
          "expression": {
            "type": "CallExpression",
            "start": 241,
            "end": 345,
            "callee": {
              "type": "MemberExpression",
              "start": 241,
              "end": 282,
              "object": {
                "type": "Identifier",
                "start": 241,
                "end": 269,
                "name": "target_mustacheidentifier_tn"
              },
              "property": {
                "type": "Identifier",
                "start": 270,
                "end": 282,
                "name": "insertBefore"
              },
              "computed": false,
              "optional": false
            },
            "arguments": [
              {
                "type": "Identifier",
                "start": 283,
                "end": 303,
                "name": "M_tN_316_rootElement"
              },
              {
                "type": "MemberExpression",
                "start": 305,
                "end": 344,
                "object": {
                  "type": "Identifier",
                  "start": 305,
                  "end": 333,
                  "name": "target_mustacheidentifier_tn"
                },
                "property": {
                  "type": "Identifier",
                  "start": 334,
                  "end": 344,
                  "name": "firstChild"
                },
                "computed": false,
                "optional": false
              }
            ],
            "optional": false
          }
        }
      ],
      "sourceType": "script"
    },
    {
      "type": "Program",
      "start": 0,
      "end": 347,
      "body": [
        {
          "type": "VariableDeclaration",
          "start": 9,
          "end": 43,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 15,
              "end": 42,
              "id": {
                "type": "Identifier",
                "start": 15,
                "end": 35,
                "name": "mustacheExpr_225_9jn"
              },
              "init": {
                "type": "Identifier",
                "start": 38,
                "end": 42,
                "name": "name"
              }
            }
          ],
          "kind": "const"
        },
        {
          "type": "VariableDeclaration",
          "start": 44,
          "end": 100,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 48,
              "end": 99,
              "id": {
                "type": "Identifier",
                "start": 48,
                "end": 67,
                "name": "M_l_686_rootElement"
              },
              "init": {
                "type": "CallExpression",
                "start": 70,
                "end": 99,
                "callee": {
                  "type": "MemberExpression",
                  "start": 70,
                  "end": 93,
                  "object": {
                    "type": "Identifier",
                    "start": 70,
                    "end": 78,
                    "name": "document"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 79,
                    "end": 93,
                    "name": "createTextNode"
                  },
                  "computed": false,
                  "optional": false
                },
                "arguments": [
                  {
                    "type": "Identifier",
                    "start": 94,
                    "end": 98,
                    "name": "name"
                  }
                ],
                "optional": false
              }
            }
          ],
          "kind": "let"
        },
        {
          "type": "VariableDeclaration",
          "start": 109,
          "end": 181,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 115,
              "end": 180,
              "id": {
                "type": "Identifier",
                "start": 115,
                "end": 142,
                "name": "target_mustacheidentifier_l"
              },
              "init": {
                "type": "CallExpression",
                "start": 145,
                "end": 180,
                "callee": {
                  "type": "MemberExpression",
                  "start": 145,
                  "end": 168,
                  "object": {
                    "type": "Identifier",
                    "start": 145,
                    "end": 153,
                    "name": "document"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 154,
                    "end": 168,
                    "name": "getElementById"
                  },
                  "computed": false,
                  "optional": false
                },
                "arguments": [
                  {
                    "type": "Literal",
                    "start": 169,
                    "end": 179,
                    "value": "lz45bqc8",
                    "raw": "'lz45bqc8'"
                  }
                ],
                "optional": false
              }
            }
          ],
          "kind": "const"
        },
        {
          "type": "ExpressionStatement",
          "start": 190,
          "end": 231,
          "expression": {
            "type": "AssignmentExpression",
            "start": 190,
            "end": 230,
            "operator": "=",
            "left": {
              "type": "MemberExpression",
              "start": 190,
              "end": 227,
              "object": {
                "type": "Identifier",
                "start": 190,
                "end": 217,
                "name": "target_mustacheidentifier_l"
              },
              "property": {
                "type": "Identifier",
                "start": 218,
                "end": 227,
                "name": "innerHTML"
              },
              "computed": false,
              "optional": false
            },
            "right": {
              "type": "Literal",
              "start": 228,
              "end": 230,
              "value": "",
              "raw": "''"
            }
          }
        },
        {
          "type": "ExpressionStatement",
          "start": 240,
          "end": 342,
          "expression": {
            "type": "CallExpression",
            "start": 240,
            "end": 341,
            "callee": {
              "type": "MemberExpression",
              "start": 240,
              "end": 280,
              "object": {
                "type": "Identifier",
                "start": 240,
                "end": 267,
                "name": "target_mustacheidentifier_l"
              },
              "property": {
                "type": "Identifier",
                "start": 268,
                "end": 280,
                "name": "insertBefore"
              },
              "computed": false,
              "optional": false
            },
            "arguments": [
              {
                "type": "Identifier",
                "start": 281,
                "end": 300,
                "name": "M_l_686_rootElement"
              },
              {
                "type": "MemberExpression",
                "start": 302,
                "end": 340,
                "object": {
                  "type": "Identifier",
                  "start": 302,
                  "end": 329,
                  "name": "target_mustacheidentifier_l"
                },
                "property": {
                  "type": "Identifier",
                  "start": 330,
                  "end": 340,
                  "name": "firstChild"
                },
                "computed": false,
                "optional": false
              }
            ],
            "optional": false
          }
        }
      ],
      "sourceType": "script"
    },
    {
      "type": "Program",
      "start": 0,
      "end": 351,
      "body": [
        {
          "type": "VariableDeclaration",
          "start": 9,
          "end": 42,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 15,
              "end": 41,
              "id": {
                "type": "Identifier",
                "start": 15,
                "end": 35,
                "name": "mustacheExpr_325_2d5"
              },
              "init": {
                "type": "Identifier",
                "start": 38,
                "end": 41,
                "name": "day"
              }
            }
          ],
          "kind": "const"
        },
        {
          "type": "VariableDeclaration",
          "start": 43,
          "end": 99,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 47,
              "end": 98,
              "id": {
                "type": "Identifier",
                "start": 47,
                "end": 67,
                "name": "M_JQ_481_rootElement"
              },
              "init": {
                "type": "CallExpression",
                "start": 70,
                "end": 98,
                "callee": {
                  "type": "MemberExpression",
                  "start": 70,
                  "end": 93,
                  "object": {
                    "type": "Identifier",
                    "start": 70,
                    "end": 78,
                    "name": "document"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 79,
                    "end": 93,
                    "name": "createTextNode"
                  },
                  "computed": false,
                  "optional": false
                },
                "arguments": [
                  {
                    "type": "Identifier",
                    "start": 94,
                    "end": 97,
                    "name": "day"
                  }
                ],
                "optional": false
              }
            }
          ],
          "kind": "let"
        },
        {
          "type": "VariableDeclaration",
          "start": 108,
          "end": 181,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 114,
              "end": 180,
              "id": {
                "type": "Identifier",
                "start": 114,
                "end": 142,
                "name": "target_mustacheidentifier_jq"
              },
              "init": {
                "type": "CallExpression",
                "start": 145,
                "end": 180,
                "callee": {
                  "type": "MemberExpression",
                  "start": 145,
                  "end": 168,
                  "object": {
                    "type": "Identifier",
                    "start": 145,
                    "end": 153,
                    "name": "document"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 154,
                    "end": 168,
                    "name": "getElementById"
                  },
                  "computed": false,
                  "optional": false
                },
                "arguments": [
                  {
                    "type": "Literal",
                    "start": 169,
                    "end": 179,
                    "value": "lz4vomw7",
                    "raw": "'lz4vomw7'"
                  }
                ],
                "optional": false
              }
            }
          ],
          "kind": "const"
        },
        {
          "type": "ExpressionStatement",
          "start": 190,
          "end": 232,
          "expression": {
            "type": "AssignmentExpression",
            "start": 190,
            "end": 231,
            "operator": "=",
            "left": {
              "type": "MemberExpression",
              "start": 190,
              "end": 228,
              "object": {
                "type": "Identifier",
                "start": 190,
                "end": 218,
                "name": "target_mustacheidentifier_jq"
              },
              "property": {
                "type": "Identifier",
                "start": 219,
                "end": 228,
                "name": "innerHTML"
              },
              "computed": false,
              "optional": false
            },
            "right": {
              "type": "Literal",
              "start": 229,
              "end": 231,
              "value": "",
              "raw": "''"
            }
          }
        },
        {
          "type": "ExpressionStatement",
          "start": 241,
          "end": 346,
          "expression": {
            "type": "CallExpression",
            "start": 241,
            "end": 345,
            "callee": {
              "type": "MemberExpression",
              "start": 241,
              "end": 282,
              "object": {
                "type": "Identifier",
                "start": 241,
                "end": 269,
                "name": "target_mustacheidentifier_jq"
              },
              "property": {
                "type": "Identifier",
                "start": 270,
                "end": 282,
                "name": "insertBefore"
              },
              "computed": false,
              "optional": false
            },
            "arguments": [
              {
                "type": "Identifier",
                "start": 283,
                "end": 303,
                "name": "M_JQ_481_rootElement"
              },
              {
                "type": "MemberExpression",
                "start": 305,
                "end": 344,
                "object": {
                  "type": "Identifier",
                  "start": 305,
                  "end": 333,
                  "name": "target_mustacheidentifier_jq"
                },
                "property": {
                  "type": "Identifier",
                  "start": 334,
                  "end": 344,
                  "name": "firstChild"
                },
                "computed": false,
                "optional": false
              }
            ],
            "optional": false
          }
        }
      ],
      "sourceType": "script"
    },
    {
      "type": "Program",
      "start": 0,
      "end": 926,
      "body": [
        {
          "type": "VariableDeclaration",
          "start": 9,
          "end": 68,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 15,
              "end": 67,
              "id": {
                "type": "Identifier",
                "start": 15,
                "end": 34,
                "name": "f_U_751_rootElement"
              },
              "init": {
                "type": "CallExpression",
                "start": 37,
                "end": 67,
                "callee": {
                  "type": "MemberExpression",
                  "start": 37,
                  "end": 59,
                  "object": {
                    "type": "Identifier",
                    "start": 37,
                    "end": 45,
                    "name": "document"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 46,
                    "end": 59,
                    "name": "createElement"
                  },
                  "computed": false,
                  "optional": false
                },
                "arguments": [
                  {
                    "type": "Literal",
                    "start": 60,
                    "end": 66,
                    "value": "form",
                    "raw": "'form'"
                  }
                ],
                "optional": false
              }
            }
          ],
          "kind": "const"
        },
        {
          "type": "ExpressionStatement",
          "start": 87,
          "end": 138,
          "expression": {
            "type": "CallExpression",
            "start": 87,
            "end": 137,
            "callee": {
              "type": "MemberExpression",
              "start": 87,
              "end": 119,
              "object": {
                "type": "Identifier",
                "start": 87,
                "end": 106,
                "name": "f_U_751_rootElement"
              },
              "property": {
                "type": "Identifier",
                "start": 107,
                "end": 119,
                "name": "setAttribute"
              },
              "computed": false,
              "optional": false
            },
            "arguments": [
              {
                "type": "Literal",
                "start": 120,
                "end": 128,
                "value": "method",
                "raw": "'method'"
              },
              {
                "type": "Literal",
                "start": 130,
                "end": 136,
                "value": "post",
                "raw": "'post'"
              }
            ],
            "optional": false
          }
        },
        {
          "type": "ExpressionStatement",
          "start": 139,
          "end": 197,
          "expression": {
            "type": "CallExpression",
            "start": 139,
            "end": 196,
            "callee": {
              "type": "MemberExpression",
              "start": 139,
              "end": 171,
              "object": {
                "type": "Identifier",
                "start": 139,
                "end": 158,
                "name": "f_U_751_rootElement"
              },
              "property": {
                "type": "Identifier",
                "start": 159,
                "end": 171,
                "name": "setAttribute"
              },
              "computed": false,
              "optional": false
            },
            "arguments": [
              {
                "type": "Literal",
                "start": 172,
                "end": 180,
                "value": "action",
                "raw": "'action'"
              },
              {
                "type": "Literal",
                "start": 182,
                "end": 195,
                "value": "process.php",
                "raw": "'process.php'"
              }
            ],
            "optional": false
          }
        },
        {
          "type": "ExpressionStatement",
          "start": 198,
          "end": 245,
          "expression": {
            "type": "CallExpression",
            "start": 198,
            "end": 244,
            "callee": {
              "type": "MemberExpression",
              "start": 198,
              "end": 230,
              "object": {
                "type": "Identifier",
                "start": 198,
                "end": 217,
                "name": "f_U_751_rootElement"
              },
              "property": {
                "type": "Identifier",
                "start": 218,
                "end": 230,
                "name": "setAttribute"
              },
              "computed": false,
              "optional": false
            },
            "arguments": [
              {
                "type": "Literal",
                "start": 231,
                "end": 238,
                "value": "class",
                "raw": "'class'"
              },
              {
                "type": "Identifier",
                "start": 240,
                "end": 243,
                "name": "day"
              }
            ],
            "optional": false
          }
        },
        {
          "type": "VariableDeclaration",
          "start": 246,
          "end": 298,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 252,
              "end": 297,
              "id": {
                "type": "Identifier",
                "start": 252,
                "end": 264,
                "name": "span_966_qx4"
              },
              "init": {
                "type": "CallExpression",
                "start": 267,
                "end": 297,
                "callee": {
                  "type": "MemberExpression",
                  "start": 267,
                  "end": 289,
                  "object": {
                    "type": "Identifier",
                    "start": 267,
                    "end": 275,
                    "name": "document"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 276,
                    "end": 289,
                    "name": "createElement"
                  },
                  "computed": false,
                  "optional": false
                },
                "arguments": [
                  {
                    "type": "Literal",
                    "start": 290,
                    "end": 296,
                    "value": "span",
                    "raw": "'span'"
                  }
                ],
                "optional": false
              }
            }
          ],
          "kind": "const"
        },
        {
          "type": "ExpressionStatement",
          "start": 327,
          "end": 373,
          "expression": {
            "type": "CallExpression",
            "start": 327,
            "end": 372,
            "callee": {
              "type": "MemberExpression",
              "start": 327,
              "end": 358,
              "object": {
                "type": "Identifier",
                "start": 327,
                "end": 346,
                "name": "f_U_751_rootElement"
              },
              "property": {
                "type": "Identifier",
                "start": 347,
                "end": 358,
                "name": "appendChild"
              },
              "computed": false,
              "optional": false
            },
            "arguments": [
              {
                "type": "Identifier",
                "start": 359,
                "end": 371,
                "name": "span_966_qx4"
              }
            ],
            "optional": false
          }
        },
        {
          "type": "ExpressionStatement",
          "start": 392,
          "end": 436,
          "expression": {
            "type": "CallExpression",
            "start": 392,
            "end": 435,
            "callee": {
              "type": "MemberExpression",
              "start": 392,
              "end": 417,
              "object": {
                "type": "Identifier",
                "start": 392,
                "end": 404,
                "name": "span_966_qx4"
              },
              "property": {
                "type": "Identifier",
                "start": 405,
                "end": 417,
                "name": "setAttribute"
              },
              "computed": false,
              "optional": false
            },
            "arguments": [
              {
                "type": "Literal",
                "start": 418,
                "end": 422,
                "value": "id",
                "raw": "'id'"
              },
              {
                "type": "Literal",
                "start": 424,
                "end": 434,
                "value": "lz4imcyi",
                "raw": "'lz4imcyi'"
              }
            ],
            "optional": false
          }
        },
        {
          "type": "VariableDeclaration",
          "start": 437,
          "end": 491,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 443,
              "end": 490,
              "id": {
                "type": "Identifier",
                "start": 443,
                "end": 456,
                "name": "input_507_j4x"
              },
              "init": {
                "type": "CallExpression",
                "start": 459,
                "end": 490,
                "callee": {
                  "type": "MemberExpression",
                  "start": 459,
                  "end": 481,
                  "object": {
                    "type": "Identifier",
                    "start": 459,
                    "end": 467,
                    "name": "document"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 468,
                    "end": 481,
                    "name": "createElement"
                  },
                  "computed": false,
                  "optional": false
                },
                "arguments": [
                  {
                    "type": "Literal",
                    "start": 482,
                    "end": 489,
                    "value": "input",
                    "raw": "'input'"
                  }
                ],
                "optional": false
              }
            }
          ],
          "kind": "const"
        },
        {
          "type": "ExpressionStatement",
          "start": 520,
          "end": 567,
          "expression": {
            "type": "CallExpression",
            "start": 520,
            "end": 566,
            "callee": {
              "type": "MemberExpression",
              "start": 520,
              "end": 551,
              "object": {
                "type": "Identifier",
                "start": 520,
                "end": 539,
                "name": "f_U_751_rootElement"
              },
              "property": {
                "type": "Identifier",
                "start": 540,
                "end": 551,
                "name": "appendChild"
              },
              "computed": false,
              "optional": false
            },
            "arguments": [
              {
                "type": "Identifier",
                "start": 552,
                "end": 565,
                "name": "input_507_j4x"
              }
            ],
            "optional": false
          }
        },
        {
          "type": "ExpressionStatement",
          "start": 586,
          "end": 631,
          "expression": {
            "type": "CallExpression",
            "start": 586,
            "end": 630,
            "callee": {
              "type": "MemberExpression",
              "start": 586,
              "end": 612,
              "object": {
                "type": "Identifier",
                "start": 586,
                "end": 599,
                "name": "input_507_j4x"
              },
              "property": {
                "type": "Identifier",
                "start": 600,
                "end": 612,
                "name": "setAttribute"
              },
              "computed": false,
              "optional": false
            },
            "arguments": [
              {
                "type": "Literal",
                "start": 613,
                "end": 619,
                "value": "type",
                "raw": "'type'"
              },
              {
                "type": "Literal",
                "start": 621,
                "end": 629,
                "value": "submit",
                "raw": "'submit'"
              }
            ],
            "optional": false
          }
        },
        {
          "type": "ExpressionStatement",
          "start": 632,
          "end": 678,
          "expression": {
            "type": "CallExpression",
            "start": 632,
            "end": 677,
            "callee": {
              "type": "MemberExpression",
              "start": 632,
              "end": 658,
              "object": {
                "type": "Identifier",
                "start": 632,
                "end": 645,
                "name": "input_507_j4x"
              },
              "property": {
                "type": "Identifier",
                "start": 646,
                "end": 658,
                "name": "setAttribute"
              },
              "computed": false,
              "optional": false
            },
            "arguments": [
              {
                "type": "Literal",
                "start": 659,
                "end": 666,
                "value": "value",
                "raw": "'value'"
              },
              {
                "type": "Literal",
                "start": 668,
                "end": 676,
                "value": "Submit",
                "raw": "'Submit'"
              }
            ],
            "optional": false
          }
        },
        {
          "type": "ExpressionStatement",
          "start": 679,
          "end": 722,
          "expression": {
            "type": "CallExpression",
            "start": 679,
            "end": 721,
            "callee": {
              "type": "MemberExpression",
              "start": 679,
              "end": 705,
              "object": {
                "type": "Identifier",
                "start": 679,
                "end": 692,
                "name": "input_507_j4x"
              },
              "property": {
                "type": "Identifier",
                "start": 693,
                "end": 705,
                "name": "setAttribute"
              },
              "computed": false,
              "optional": false
            },
            "arguments": [
              {
                "type": "Literal",
                "start": 706,
                "end": 713,
                "value": "class",
                "raw": "'class'"
              },
              {
                "type": "Literal",
                "start": 715,
                "end": 720,
                "value": "btn",
                "raw": "'btn'"
              }
            ],
            "optional": false
          }
        },
        {
          "type": "VariableDeclaration",
          "start": 732,
          "end": 793,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 738,
              "end": 792,
              "id": {
                "type": "Identifier",
                "start": 738,
                "end": 754,
                "name": "target_element_u"
              },
              "init": {
                "type": "CallExpression",
                "start": 757,
                "end": 792,
                "callee": {
                  "type": "MemberExpression",
                  "start": 757,
                  "end": 780,
                  "object": {
                    "type": "Identifier",
                    "start": 757,
                    "end": 765,
                    "name": "document"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 766,
                    "end": 780,
                    "name": "getElementById"
                  },
                  "computed": false,
                  "optional": false
                },
                "arguments": [
                  {
                    "type": "Literal",
                    "start": 781,
                    "end": 791,
                    "value": "lz43704r",
                    "raw": "'lz43704r'"
                  }
                ],
                "optional": false
              }
            }
          ],
          "kind": "const"
        },
        {
          "type": "ExpressionStatement",
          "start": 802,
          "end": 832,
          "expression": {
            "type": "AssignmentExpression",
            "start": 802,
            "end": 831,
            "operator": "=",
            "left": {
              "type": "MemberExpression",
              "start": 802,
              "end": 828,
              "object": {
                "type": "Identifier",
                "start": 802,
                "end": 818,
                "name": "target_element_u"
              },
              "property": {
                "type": "Identifier",
                "start": 819,
                "end": 828,
                "name": "innerHTML"
              },
              "computed": false,
              "optional": false
            },
            "right": {
              "type": "Literal",
              "start": 829,
              "end": 831,
              "value": "",
              "raw": "''"
            }
          }
        },
        {
          "type": "ExpressionStatement",
          "start": 841,
          "end": 921,
          "expression": {
            "type": "CallExpression",
            "start": 841,
            "end": 920,
            "callee": {
              "type": "MemberExpression",
              "start": 841,
              "end": 870,
              "object": {
                "type": "Identifier",
                "start": 841,
                "end": 857,
                "name": "target_element_u"
              },
              "property": {
                "type": "Identifier",
                "start": 858,
                "end": 870,
                "name": "insertBefore"
              },
              "computed": false,
              "optional": false
            },
            "arguments": [
              {
                "type": "Identifier",
                "start": 871,
                "end": 890,
                "name": "f_U_751_rootElement"
              },
              {
                "type": "MemberExpression",
                "start": 892,
                "end": 919,
                "object": {
                  "type": "Identifier",
                  "start": 892,
                  "end": 908,
                  "name": "target_element_u"
                },
                "property": {
                  "type": "Identifier",
                  "start": 909,
                  "end": 919,
                  "name": "firstChild"
                },
                "computed": false,
                "optional": false
              }
            ],
            "optional": false
          }
        }
      ],
      "sourceType": "script"
    }
  ],
  "sourceType": "script"
}
