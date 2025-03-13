import escodegen from 'escodegen';

const ast= {
  "jsAST": {
    "type": "JavaScript",
    "content": {
      "type": "Program",
      "start": 0,
      "end": 1689,
      "body": [
        {
          "type": "ClassDeclaration",
          "start": 2,
          "end": 1571,
          "id": {
            "type": "Identifier",
            "start": 8,
            "end": 24,
            "name": "RegistrationForm"
          },
          "superClass": null,
          "body": {
            "type": "ClassBody",
            "start": 25,
            "end": 1571,
            "body": [
              {
                "type": "MethodDefinition",
                "start": 27,
                "end": 226,
                "static": false,
                "computed": false,
                "key": {
                  "type": "Identifier",
                  "start": 27,
                  "end": 38,
                  "name": "constructor"
                },
                "kind": "constructor",
                "value": {
                  "type": "FunctionExpression",
                  "start": 38,
                  "end": 226,
                  "id": null,
                  "expression": false,
                  "generator": false,
                  "async": false,
                  "params": [
                    {
                      "type": "Identifier",
                      "start": 39,
                      "end": 50,
                      "name": "containerId"
                    }
                  ],
                  "body": {
                    "type": "BlockStatement",
                    "start": 52,
                    "end": 226,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 54,
                        "end": 108,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 54,
                          "end": 107,
                          "operator": "=",
                          "left": {
                            "type": "MemberExpression",
                            "start": 54,
                            "end": 68,
                            "object": {
                              "type": "ThisExpression",
                              "start": 54,
                              "end": 58
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 59,
                              "end": 68,
                              "name": "container"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "right": {
                            "type": "CallExpression",
                            "start": 71,
                            "end": 107,
                            "callee": {
                              "type": "MemberExpression",
                              "start": 71,
                              "end": 94,
                              "object": {
                                "type": "Identifier",
                                "start": 71,
                                "end": 79,
                                "name": "document"
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 80,
                                "end": 94,
                                "name": "getElementById"
                              },
                              "computed": false,
                              "optional": false
                            },
                            "arguments": [
                              {
                                "type": "Identifier",
                                "start": 95,
                                "end": 106,
                                "name": "containerId"
                              }
                            ],
                            "optional": false
                          }
                        }
                      },
                      {
                        "type": "IfStatement",
                        "start": 109,
                        "end": 205,
                        "test": {
                          "type": "UnaryExpression",
                          "start": 113,
                          "end": 128,
                          "operator": "!",
                          "prefix": true,
                          "argument": {
                            "type": "MemberExpression",
                            "start": 114,
                            "end": 128,
                            "object": {
                              "type": "ThisExpression",
                              "start": 114,
                              "end": 118
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 119,
                              "end": 128,
                              "name": "container"
                            },
                            "computed": false,
                            "optional": false
                          }
                        },
                        "consequent": {
                          "type": "BlockStatement",
                          "start": 130,
                          "end": 205,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 132,
                              "end": 195,
                              "expression": {
                                "type": "CallExpression",
                                "start": 132,
                                "end": 194,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 132,
                                  "end": 145,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 132,
                                    "end": 139,
                                    "name": "console"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 140,
                                    "end": 145,
                                    "name": "error"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "TemplateLiteral",
                                    "start": 146,
                                    "end": 193,
                                    "expressions": [
                                      {
                                        "type": "Identifier",
                                        "start": 168,
                                        "end": 179,
                                        "name": "containerId"
                                      }
                                    ],
                                    "quasis": [
                                      {
                                        "type": "TemplateElement",
                                        "start": 147,
                                        "end": 166,
                                        "value": {
                                          "raw": "Container with ID '",
                                          "cooked": "Container with ID '"
                                        },
                                        "tail": false
                                      },
                                      {
                                        "type": "TemplateElement",
                                        "start": 180,
                                        "end": 192,
                                        "value": {
                                          "raw": "' not found.",
                                          "cooked": "' not found."
                                        },
                                        "tail": true
                                      }
                                    ]
                                  }
                                ],
                                "optional": false
                              }
                            },
                            {
                              "type": "ReturnStatement",
                              "start": 196,
                              "end": 203,
                              "argument": null
                            }
                          ]
                        },
                        "alternate": null
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 206,
                        "end": 224,
                        "expression": {
                          "type": "CallExpression",
                          "start": 206,
                          "end": 223,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 206,
                            "end": 221,
                            "object": {
                              "type": "ThisExpression",
                              "start": 206,
                              "end": 210
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 211,
                              "end": 221,
                              "name": "createForm"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [],
                          "optional": false
                        }
                      }
                    ]
                  }
                }
              },
              {
                "type": "MethodDefinition",
                "start": 228,
                "end": 1049,
                "static": false,
                "computed": false,
                "key": {
                  "type": "Identifier",
                  "start": 228,
                  "end": 238,
                  "name": "createForm"
                },
                "kind": "method",
                "value": {
                  "type": "FunctionExpression",
                  "start": 238,
                  "end": 1049,
                  "id": null,
                  "expression": false,
                  "generator": false,
                  "async": false,
                  "params": [],
                  "body": {
                    "type": "BlockStatement",
                    "start": 241,
                    "end": 1049,
                    "body": [
                      {
                        "type": "VariableDeclaration",
                        "start": 243,
                        "end": 287,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 249,
                            "end": 286,
                            "id": {
                              "type": "Identifier",
                              "start": 249,
                              "end": 253,
                              "name": "form"
                            },
                            "init": {
                              "type": "CallExpression",
                              "start": 256,
                              "end": 286,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 256,
                                "end": 278,
                                "object": {
                                  "type": "Identifier",
                                  "start": 256,
                                  "end": 264,
                                  "name": "document"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 265,
                                  "end": 278,
                                  "name": "createElement"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "Literal",
                                  "start": 279,
                                  "end": 285,
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
                        "start": 288,
                        "end": 317,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 288,
                          "end": 316,
                          "operator": "=",
                          "left": {
                            "type": "MemberExpression",
                            "start": 288,
                            "end": 295,
                            "object": {
                              "type": "Identifier",
                              "start": 288,
                              "end": 292,
                              "name": "form"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 293,
                              "end": 295,
                              "name": "id"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "right": {
                            "type": "Literal",
                            "start": 298,
                            "end": 316,
                            "value": "registrationForm",
                            "raw": "'registrationForm'"
                          }
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 318,
                        "end": 380,
                        "expression": {
                          "type": "CallExpression",
                          "start": 318,
                          "end": 379,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 318,
                            "end": 339,
                            "object": {
                              "type": "Identifier",
                              "start": 318,
                              "end": 322,
                              "name": "form"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 323,
                              "end": 339,
                              "name": "addEventListener"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Literal",
                              "start": 340,
                              "end": 348,
                              "value": "submit",
                              "raw": "'submit'"
                            },
                            {
                              "type": "CallExpression",
                              "start": 350,
                              "end": 378,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 350,
                                "end": 372,
                                "object": {
                                  "type": "MemberExpression",
                                  "start": 350,
                                  "end": 367,
                                  "object": {
                                    "type": "ThisExpression",
                                    "start": 350,
                                    "end": 354
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 355,
                                    "end": 367,
                                    "name": "handleSubmit"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 368,
                                  "end": 372,
                                  "name": "bind"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "ThisExpression",
                                  "start": 373,
                                  "end": 377
                                }
                              ],
                              "optional": false
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "VariableDeclaration",
                        "start": 382,
                        "end": 439,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 388,
                            "end": 438,
                            "id": {
                              "type": "Identifier",
                              "start": 388,
                              "end": 397,
                              "name": "nameLabel"
                            },
                            "init": {
                              "type": "CallExpression",
                              "start": 400,
                              "end": 438,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 400,
                                "end": 416,
                                "object": {
                                  "type": "ThisExpression",
                                  "start": 400,
                                  "end": 404
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 405,
                                  "end": 416,
                                  "name": "createLabel"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "Literal",
                                  "start": 417,
                                  "end": 424,
                                  "value": "Name:",
                                  "raw": "'Name:'"
                                },
                                {
                                  "type": "Literal",
                                  "start": 426,
                                  "end": 437,
                                  "value": "nameInput",
                                  "raw": "'nameInput'"
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
                        "start": 440,
                        "end": 504,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 446,
                            "end": 503,
                            "id": {
                              "type": "Identifier",
                              "start": 446,
                              "end": 455,
                              "name": "nameInput"
                            },
                            "init": {
                              "type": "CallExpression",
                              "start": 458,
                              "end": 503,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 458,
                                "end": 474,
                                "object": {
                                  "type": "ThisExpression",
                                  "start": 458,
                                  "end": 462
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 463,
                                  "end": 474,
                                  "name": "createInput"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "Literal",
                                  "start": 475,
                                  "end": 481,
                                  "value": "text",
                                  "raw": "'text'"
                                },
                                {
                                  "type": "Literal",
                                  "start": 483,
                                  "end": 494,
                                  "value": "nameInput",
                                  "raw": "'nameInput'"
                                },
                                {
                                  "type": "Literal",
                                  "start": 496,
                                  "end": 502,
                                  "value": "name",
                                  "raw": "'name'"
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
                        "start": 506,
                        "end": 572,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 512,
                            "end": 571,
                            "id": {
                              "type": "Identifier",
                              "start": 512,
                              "end": 524,
                              "name": "surnameLabel"
                            },
                            "init": {
                              "type": "CallExpression",
                              "start": 527,
                              "end": 571,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 527,
                                "end": 543,
                                "object": {
                                  "type": "ThisExpression",
                                  "start": 527,
                                  "end": 531
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 532,
                                  "end": 543,
                                  "name": "createLabel"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "Literal",
                                  "start": 544,
                                  "end": 554,
                                  "value": "Surname:",
                                  "raw": "'Surname:'"
                                },
                                {
                                  "type": "Literal",
                                  "start": 556,
                                  "end": 570,
                                  "value": "surnameInput",
                                  "raw": "'surnameInput'"
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
                        "start": 573,
                        "end": 646,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 579,
                            "end": 645,
                            "id": {
                              "type": "Identifier",
                              "start": 579,
                              "end": 591,
                              "name": "surnameInput"
                            },
                            "init": {
                              "type": "CallExpression",
                              "start": 594,
                              "end": 645,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 594,
                                "end": 610,
                                "object": {
                                  "type": "ThisExpression",
                                  "start": 594,
                                  "end": 598
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 599,
                                  "end": 610,
                                  "name": "createInput"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "Literal",
                                  "start": 611,
                                  "end": 617,
                                  "value": "text",
                                  "raw": "'text'"
                                },
                                {
                                  "type": "Literal",
                                  "start": 619,
                                  "end": 633,
                                  "value": "surnameInput",
                                  "raw": "'surnameInput'"
                                },
                                {
                                  "type": "Literal",
                                  "start": 635,
                                  "end": 644,
                                  "value": "surname",
                                  "raw": "'surname'"
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
                        "start": 648,
                        "end": 699,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 654,
                            "end": 698,
                            "id": {
                              "type": "Identifier",
                              "start": 654,
                              "end": 663,
                              "name": "submitBtn"
                            },
                            "init": {
                              "type": "CallExpression",
                              "start": 666,
                              "end": 698,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 666,
                                "end": 688,
                                "object": {
                                  "type": "Identifier",
                                  "start": 666,
                                  "end": 674,
                                  "name": "document"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 675,
                                  "end": 688,
                                  "name": "createElement"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "Literal",
                                  "start": 689,
                                  "end": 697,
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
                        "start": 700,
                        "end": 726,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 700,
                          "end": 725,
                          "operator": "=",
                          "left": {
                            "type": "MemberExpression",
                            "start": 700,
                            "end": 714,
                            "object": {
                              "type": "Identifier",
                              "start": 700,
                              "end": 709,
                              "name": "submitBtn"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 710,
                              "end": 714,
                              "name": "type"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "right": {
                            "type": "Literal",
                            "start": 717,
                            "end": 725,
                            "value": "submit",
                            "raw": "'submit'"
                          }
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 727,
                        "end": 762,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 727,
                          "end": 761,
                          "operator": "=",
                          "left": {
                            "type": "MemberExpression",
                            "start": 727,
                            "end": 748,
                            "object": {
                              "type": "Identifier",
                              "start": 727,
                              "end": 736,
                              "name": "submitBtn"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 737,
                              "end": 748,
                              "name": "textContent"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "right": {
                            "type": "Literal",
                            "start": 751,
                            "end": 761,
                            "value": "Register",
                            "raw": "'Register'"
                          }
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 764,
                        "end": 792,
                        "expression": {
                          "type": "CallExpression",
                          "start": 764,
                          "end": 791,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 764,
                            "end": 780,
                            "object": {
                              "type": "Identifier",
                              "start": 764,
                              "end": 768,
                              "name": "form"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 769,
                              "end": 780,
                              "name": "appendChild"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 781,
                              "end": 790,
                              "name": "nameLabel"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 793,
                        "end": 821,
                        "expression": {
                          "type": "CallExpression",
                          "start": 793,
                          "end": 820,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 793,
                            "end": 809,
                            "object": {
                              "type": "Identifier",
                              "start": 793,
                              "end": 797,
                              "name": "form"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 798,
                              "end": 809,
                              "name": "appendChild"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 810,
                              "end": 819,
                              "name": "nameInput"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 822,
                        "end": 869,
                        "expression": {
                          "type": "CallExpression",
                          "start": 822,
                          "end": 868,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 822,
                            "end": 838,
                            "object": {
                              "type": "Identifier",
                              "start": 822,
                              "end": 826,
                              "name": "form"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 827,
                              "end": 838,
                              "name": "appendChild"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "CallExpression",
                              "start": 839,
                              "end": 867,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 839,
                                "end": 861,
                                "object": {
                                  "type": "Identifier",
                                  "start": 839,
                                  "end": 847,
                                  "name": "document"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 848,
                                  "end": 861,
                                  "name": "createElement"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "Literal",
                                  "start": 862,
                                  "end": 866,
                                  "value": "br",
                                  "raw": "'br'"
                                }
                              ],
                              "optional": false
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 871,
                        "end": 902,
                        "expression": {
                          "type": "CallExpression",
                          "start": 871,
                          "end": 901,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 871,
                            "end": 887,
                            "object": {
                              "type": "Identifier",
                              "start": 871,
                              "end": 875,
                              "name": "form"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 876,
                              "end": 887,
                              "name": "appendChild"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 888,
                              "end": 900,
                              "name": "surnameLabel"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 903,
                        "end": 934,
                        "expression": {
                          "type": "CallExpression",
                          "start": 903,
                          "end": 933,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 903,
                            "end": 919,
                            "object": {
                              "type": "Identifier",
                              "start": 903,
                              "end": 907,
                              "name": "form"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 908,
                              "end": 919,
                              "name": "appendChild"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 920,
                              "end": 932,
                              "name": "surnameInput"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 935,
                        "end": 982,
                        "expression": {
                          "type": "CallExpression",
                          "start": 935,
                          "end": 981,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 935,
                            "end": 951,
                            "object": {
                              "type": "Identifier",
                              "start": 935,
                              "end": 939,
                              "name": "form"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 940,
                              "end": 951,
                              "name": "appendChild"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "CallExpression",
                              "start": 952,
                              "end": 980,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 952,
                                "end": 974,
                                "object": {
                                  "type": "Identifier",
                                  "start": 952,
                                  "end": 960,
                                  "name": "document"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 961,
                                  "end": 974,
                                  "name": "createElement"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "Literal",
                                  "start": 975,
                                  "end": 979,
                                  "value": "br",
                                  "raw": "'br'"
                                }
                              ],
                              "optional": false
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 984,
                        "end": 1012,
                        "expression": {
                          "type": "CallExpression",
                          "start": 984,
                          "end": 1011,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 984,
                            "end": 1000,
                            "object": {
                              "type": "Identifier",
                              "start": 984,
                              "end": 988,
                              "name": "form"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 989,
                              "end": 1000,
                              "name": "appendChild"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 1001,
                              "end": 1010,
                              "name": "submitBtn"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 1014,
                        "end": 1047,
                        "expression": {
                          "type": "CallExpression",
                          "start": 1014,
                          "end": 1046,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 1014,
                            "end": 1040,
                            "object": {
                              "type": "MemberExpression",
                              "start": 1014,
                              "end": 1028,
                              "object": {
                                "type": "ThisExpression",
                                "start": 1014,
                                "end": 1018
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 1019,
                                "end": 1028,
                                "name": "container"
                              },
                              "computed": false,
                              "optional": false
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 1029,
                              "end": 1040,
                              "name": "appendChild"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 1041,
                              "end": 1045,
                              "name": "form"
                            }
                          ],
                          "optional": false
                        }
                      }
                    ]
                  }
                }
              },
              {
                "type": "MethodDefinition",
                "start": 1051,
                "end": 1189,
                "static": false,
                "computed": false,
                "key": {
                  "type": "Identifier",
                  "start": 1051,
                  "end": 1062,
                  "name": "createLabel"
                },
                "kind": "method",
                "value": {
                  "type": "FunctionExpression",
                  "start": 1062,
                  "end": 1189,
                  "id": null,
                  "expression": false,
                  "generator": false,
                  "async": false,
                  "params": [
                    {
                      "type": "Identifier",
                      "start": 1063,
                      "end": 1067,
                      "name": "text"
                    },
                    {
                      "type": "Identifier",
                      "start": 1069,
                      "end": 1074,
                      "name": "forId"
                    }
                  ],
                  "body": {
                    "type": "BlockStatement",
                    "start": 1076,
                    "end": 1189,
                    "body": [
                      {
                        "type": "VariableDeclaration",
                        "start": 1078,
                        "end": 1124,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 1084,
                            "end": 1123,
                            "id": {
                              "type": "Identifier",
                              "start": 1084,
                              "end": 1089,
                              "name": "label"
                            },
                            "init": {
                              "type": "CallExpression",
                              "start": 1092,
                              "end": 1123,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 1092,
                                "end": 1114,
                                "object": {
                                  "type": "Identifier",
                                  "start": 1092,
                                  "end": 1100,
                                  "name": "document"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 1101,
                                  "end": 1114,
                                  "name": "createElement"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "Literal",
                                  "start": 1115,
                                  "end": 1122,
                                  "value": "label",
                                  "raw": "'label'"
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
                        "start": 1125,
                        "end": 1147,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 1125,
                          "end": 1146,
                          "operator": "=",
                          "left": {
                            "type": "MemberExpression",
                            "start": 1125,
                            "end": 1138,
                            "object": {
                              "type": "Identifier",
                              "start": 1125,
                              "end": 1130,
                              "name": "label"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 1131,
                              "end": 1138,
                              "name": "htmlFor"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "right": {
                            "type": "Identifier",
                            "start": 1141,
                            "end": 1146,
                            "name": "forId"
                          }
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 1148,
                        "end": 1173,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 1148,
                          "end": 1172,
                          "operator": "=",
                          "left": {
                            "type": "MemberExpression",
                            "start": 1148,
                            "end": 1165,
                            "object": {
                              "type": "Identifier",
                              "start": 1148,
                              "end": 1153,
                              "name": "label"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 1154,
                              "end": 1165,
                              "name": "textContent"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "right": {
                            "type": "Identifier",
                            "start": 1168,
                            "end": 1172,
                            "name": "text"
                          }
                        }
                      },
                      {
                        "type": "ReturnStatement",
                        "start": 1174,
                        "end": 1187,
                        "argument": {
                          "type": "Identifier",
                          "start": 1181,
                          "end": 1186,
                          "name": "label"
                        }
                      }
                    ]
                  }
                }
              },
              {
                "type": "MethodDefinition",
                "start": 1191,
                "end": 1359,
                "static": false,
                "computed": false,
                "key": {
                  "type": "Identifier",
                  "start": 1191,
                  "end": 1202,
                  "name": "createInput"
                },
                "kind": "method",
                "value": {
                  "type": "FunctionExpression",
                  "start": 1202,
                  "end": 1359,
                  "id": null,
                  "expression": false,
                  "generator": false,
                  "async": false,
                  "params": [
                    {
                      "type": "Identifier",
                      "start": 1203,
                      "end": 1207,
                      "name": "type"
                    },
                    {
                      "type": "Identifier",
                      "start": 1209,
                      "end": 1211,
                      "name": "id"
                    },
                    {
                      "type": "Identifier",
                      "start": 1213,
                      "end": 1217,
                      "name": "name"
                    }
                  ],
                  "body": {
                    "type": "BlockStatement",
                    "start": 1219,
                    "end": 1359,
                    "body": [
                      {
                        "type": "VariableDeclaration",
                        "start": 1221,
                        "end": 1267,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 1227,
                            "end": 1266,
                            "id": {
                              "type": "Identifier",
                              "start": 1227,
                              "end": 1232,
                              "name": "input"
                            },
                            "init": {
                              "type": "CallExpression",
                              "start": 1235,
                              "end": 1266,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 1235,
                                "end": 1257,
                                "object": {
                                  "type": "Identifier",
                                  "start": 1235,
                                  "end": 1243,
                                  "name": "document"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 1244,
                                  "end": 1257,
                                  "name": "createElement"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "Literal",
                                  "start": 1258,
                                  "end": 1265,
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
                        "start": 1268,
                        "end": 1286,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 1268,
                          "end": 1285,
                          "operator": "=",
                          "left": {
                            "type": "MemberExpression",
                            "start": 1268,
                            "end": 1278,
                            "object": {
                              "type": "Identifier",
                              "start": 1268,
                              "end": 1273,
                              "name": "input"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 1274,
                              "end": 1278,
                              "name": "type"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "right": {
                            "type": "Identifier",
                            "start": 1281,
                            "end": 1285,
                            "name": "type"
                          }
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 1287,
                        "end": 1301,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 1287,
                          "end": 1300,
                          "operator": "=",
                          "left": {
                            "type": "MemberExpression",
                            "start": 1287,
                            "end": 1295,
                            "object": {
                              "type": "Identifier",
                              "start": 1287,
                              "end": 1292,
                              "name": "input"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 1293,
                              "end": 1295,
                              "name": "id"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "right": {
                            "type": "Identifier",
                            "start": 1298,
                            "end": 1300,
                            "name": "id"
                          }
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 1302,
                        "end": 1320,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 1302,
                          "end": 1319,
                          "operator": "=",
                          "left": {
                            "type": "MemberExpression",
                            "start": 1302,
                            "end": 1312,
                            "object": {
                              "type": "Identifier",
                              "start": 1302,
                              "end": 1307,
                              "name": "input"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 1308,
                              "end": 1312,
                              "name": "name"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "right": {
                            "type": "Identifier",
                            "start": 1315,
                            "end": 1319,
                            "name": "name"
                          }
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 1321,
                        "end": 1343,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 1321,
                          "end": 1342,
                          "operator": "=",
                          "left": {
                            "type": "MemberExpression",
                            "start": 1321,
                            "end": 1335,
                            "object": {
                              "type": "Identifier",
                              "start": 1321,
                              "end": 1326,
                              "name": "input"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 1327,
                              "end": 1335,
                              "name": "required"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "right": {
                            "type": "Literal",
                            "start": 1338,
                            "end": 1342,
                            "value": true,
                            "raw": "true"
                          }
                        }
                      },
                      {
                        "type": "ReturnStatement",
                        "start": 1344,
                        "end": 1357,
                        "argument": {
                          "type": "Identifier",
                          "start": 1351,
                          "end": 1356,
                          "name": "input"
                        }
                      }
                    ]
                  }
                }
              },
              {
                "type": "MethodDefinition",
                "start": 1361,
                "end": 1569,
                "static": false,
                "computed": false,
                "key": {
                  "type": "Identifier",
                  "start": 1361,
                  "end": 1373,
                  "name": "handleSubmit"
                },
                "kind": "method",
                "value": {
                  "type": "FunctionExpression",
                  "start": 1373,
                  "end": 1569,
                  "id": null,
                  "expression": false,
                  "generator": false,
                  "async": false,
                  "params": [
                    {
                      "type": "Identifier",
                      "start": 1374,
                      "end": 1379,
                      "name": "event"
                    }
                  ],
                  "body": {
                    "type": "BlockStatement",
                    "start": 1381,
                    "end": 1569,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 1383,
                        "end": 1406,
                        "expression": {
                          "type": "CallExpression",
                          "start": 1383,
                          "end": 1405,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 1383,
                            "end": 1403,
                            "object": {
                              "type": "Identifier",
                              "start": 1383,
                              "end": 1388,
                              "name": "event"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 1389,
                              "end": 1403,
                              "name": "preventDefault"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [],
                          "optional": false
                        }
                      },
                      {
                        "type": "VariableDeclaration",
                        "start": 1407,
                        "end": 1463,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 1413,
                            "end": 1462,
                            "id": {
                              "type": "Identifier",
                              "start": 1413,
                              "end": 1417,
                              "name": "name"
                            },
                            "init": {
                              "type": "MemberExpression",
                              "start": 1420,
                              "end": 1462,
                              "object": {
                                "type": "CallExpression",
                                "start": 1420,
                                "end": 1456,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 1420,
                                  "end": 1443,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 1420,
                                    "end": 1428,
                                    "name": "document"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 1429,
                                    "end": 1443,
                                    "name": "getElementById"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "Literal",
                                    "start": 1444,
                                    "end": 1455,
                                    "value": "nameInput",
                                    "raw": "'nameInput'"
                                  }
                                ],
                                "optional": false
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 1457,
                                "end": 1462,
                                "name": "value"
                              },
                              "computed": false,
                              "optional": false
                            }
                          }
                        ],
                        "kind": "const"
                      },
                      {
                        "type": "VariableDeclaration",
                        "start": 1464,
                        "end": 1526,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 1470,
                            "end": 1525,
                            "id": {
                              "type": "Identifier",
                              "start": 1470,
                              "end": 1477,
                              "name": "surname"
                            },
                            "init": {
                              "type": "MemberExpression",
                              "start": 1480,
                              "end": 1525,
                              "object": {
                                "type": "CallExpression",
                                "start": 1480,
                                "end": 1519,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 1480,
                                  "end": 1503,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 1480,
                                    "end": 1488,
                                    "name": "document"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 1489,
                                    "end": 1503,
                                    "name": "getElementById"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "Literal",
                                    "start": 1504,
                                    "end": 1518,
                                    "value": "surnameInput",
                                    "raw": "'surnameInput'"
                                  }
                                ],
                                "optional": false
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 1520,
                                "end": 1525,
                                "name": "value"
                              },
                              "computed": false,
                              "optional": false
                            }
                          }
                        ],
                        "kind": "const"
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 1527,
                        "end": 1567,
                        "expression": {
                          "type": "CallExpression",
                          "start": 1527,
                          "end": 1566,
                          "callee": {
                            "type": "Identifier",
                            "start": 1527,
                            "end": 1532,
                            "name": "alert"
                          },
                          "arguments": [
                            {
                              "type": "TemplateLiteral",
                              "start": 1533,
                              "end": 1565,
                              "expressions": [
                                {
                                  "type": "Identifier",
                                  "start": 1548,
                                  "end": 1552,
                                  "name": "name"
                                },
                                {
                                  "type": "Identifier",
                                  "start": 1556,
                                  "end": 1563,
                                  "name": "surname"
                                }
                              ],
                              "quasis": [
                                {
                                  "type": "TemplateElement",
                                  "start": 1534,
                                  "end": 1546,
                                  "value": {
                                    "raw": "Registered: ",
                                    "cooked": "Registered: "
                                  },
                                  "tail": false
                                },
                                {
                                  "type": "TemplateElement",
                                  "start": 1553,
                                  "end": 1554,
                                  "value": {
                                    "raw": " ",
                                    "cooked": " "
                                  },
                                  "tail": false
                                },
                                {
                                  "type": "TemplateElement",
                                  "start": 1564,
                                  "end": 1564,
                                  "value": {
                                    "raw": "",
                                    "cooked": ""
                                  },
                                  "tail": true
                                }
                              ]
                            }
                          ],
                          "optional": false
                        }
                      }
                    ]
                  }
                }
              }
            ]
          }
        },
        {
          "type": "ExpressionStatement",
          "start": 1573,
          "end": 1663,
          "expression": {
            "type": "CallExpression",
            "start": 1573,
            "end": 1662,
            "callee": {
              "type": "MemberExpression",
              "start": 1573,
              "end": 1598,
              "object": {
                "type": "Identifier",
                "start": 1573,
                "end": 1581,
                "name": "document"
              },
              "property": {
                "type": "Identifier",
                "start": 1582,
                "end": 1598,
                "name": "addEventListener"
              },
              "computed": false,
              "optional": false
            },
            "arguments": [
              {
                "type": "Literal",
                "start": 1599,
                "end": 1617,
                "value": "DOMContentLoaded",
                "raw": "'DOMContentLoaded'"
              },
              {
                "type": "ArrowFunctionExpression",
                "start": 1619,
                "end": 1661,
                "id": null,
                "expression": false,
                "generator": false,
                "async": false,
                "params": [],
                "body": {
                  "type": "BlockStatement",
                  "start": 1625,
                  "end": 1661,
                  "body": [
                    {
                      "type": "ExpressionStatement",
                      "start": 1627,
                      "end": 1659,
                      "expression": {
                        "type": "NewExpression",
                        "start": 1627,
                        "end": 1658,
                        "callee": {
                          "type": "Identifier",
                          "start": 1631,
                          "end": 1647,
                          "name": "RegistrationForm"
                        },
                        "arguments": [
                          {
                            "type": "Literal",
                            "start": 1648,
                            "end": 1657,
                            "value": "regForm",
                            "raw": "'regForm'"
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ],
            "optional": false
          }
        },
        {
          "type": "ExpressionStatement",
          "start": 1665,
          "end": 1688,
          "expression": {
            "type": "CallExpression",
            "start": 1665,
            "end": 1687,
            "callee": {
              "type": "MemberExpression",
              "start": 1665,
              "end": 1676,
              "object": {
                "type": "Identifier",
                "start": 1665,
                "end": 1672,
                "name": "console"
              },
              "property": {
                "type": "Identifier",
                "start": 1673,
                "end": 1676,
                "name": "log"
              },
              "computed": false,
              "optional": false
            },
            "arguments": [
              {
                "type": "Literal",
                "start": 1677,
                "end": 1686,
                "value": "nothing",
                "raw": "'nothing'"
              }
            ],
            "optional": false
          }
        }
      ],
      "sourceType": "module"
    }
  },
  "cssAST": {
    "type": "CSS",
    "content": {
      "raws": {
        "after": ""
      },
      "type": "root",
      "nodes": [],
      "source": {
        "input": {
          "css": "",
          "hasBOM": false,
          "document": "",
          "file": "/Users/gugulethu/code/semantq/spark/style"
        },
        "start": {
          "column": 1,
          "line": 1,
          "offset": 0
        },
        "end": null
      }
    }
  },
  "customAST": {
    "type": "HTML",
    "content": [
      {
        "html": {
          "start": 0,
          "end": 70,
          "type": "Fragment",
          "children": [
            {
              "start": 0,
              "end": 70,
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
                        "raw": "Hello world!\n\n",
                        "data": "Hello world!\n\n"
                      }
                    ]
                  },
                  {
                    "start": 29,
                    "end": 54,
                    "type": "Element",
                    "name": "div",
                    "attributes": [
                      {
                        "start": 34,
                        "end": 46,
                        "type": "Attribute",
                        "name": "id",
                        "value": [
                          {
                            "start": 38,
                            "end": 45,
                            "type": "Text",
                            "raw": "regForm",
                            "data": "regForm"
                          }
                        ]
                      }
                    ],
                    "children": [
                      []
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


const asta = {
  "type": "Program",
  "start": 0,
  "end": 35,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 12,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 4,
          "end": 12,
          "id": {
            "type": "Identifier",
            "start": 4,
            "end": 5,
            "name": "x"
          },
          "init": {
            "type": "Literal",
            "start": 8,
            "end": 12,
            "value": 10,
            "raw": "10"
          }
        }
      ],
      "kind": "let"
    },
    {
      "type": "ExpressionStatement",
      "start": 14,
      "end": 35,
      "expression": {
        "type": "CallExpression",
        "start": 14,
        "end": 34,
        "callee": {
          "type": "Identifier",
          "start": 14,
          "end": 19,
          "name": "console"
        },
        "arguments": [
          {
            "type": "Literal",
            "start": 20,
            "end": 33,
            "value": "Hello, World!",
            "raw": "'Hello, World!'"
          }
        ]
      }
    }
  ],
  "sourceType": "module"
}


function validateAST(node) {
    if (!node || !node.type) {
        console.warn('Invalid AST node:', node);
        return false;
    }
    return true;
}

// Validate before generating code
if (ast.jsAST.content.body.every(validateAST)) {
    const generatedCode = escodegen.generate(ast.jsAST.content, {
        format: { indent: { style: '    ' }, quotes: 'single' }
    });
    console.log(generatedCode);
} else {
    console.error('AST validation failed.');
}



// Assuming jsAST is defined as an object in the same file
/*
try {
    const generatedCode = escodegen.generate(ast.jsAST.content.body, {
        format: { indent: { style: '    ' }, quotes: 'single' }
    });
    console.log(generatedCode);
} catch (error) {
    console.error('Error generating code:', error);
}
*/
