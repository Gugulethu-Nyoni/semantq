const ast =  [
  {
    "html": {
      "start": 0,
      "end": 422,
      "type": "Fragment",
      "children": [
        {
          "start": 0,
          "end": 422,
          "type": "Element",
          "name": "customSyntax",
          "attributes": null,
          "children": [
            [
              {
                "start": 18,
                "end": 53,
                "type": "Element",
                "name": "h3",
                "attributes": null,
                "children": [
                  [
                    {
                      "type": "Text",
                      "raw": "Interactive Weather Data ",
                      "data": "Interactive Weather Data "
                    }
                  ]
                ]
              },
              {
                "start": 55,
                "end": 402,
                "type": "Element",
                "name": "div",
                "attributes": null,
                "children": [
                  [
                    {
                      "start": 62,
                      "end": 83,
                      "type": "Element",
                      "name": "h1",
                      "attributes": null,
                      "children": [
                        [
                          {
                            "type": "Text",
                            "raw": "Weather Data",
                            "data": "Weather Data"
                          }
                        ]
                      ]
                    },
                    {
                      "start": 84,
                      "end": 131,
                      "type": "Element",
                      "name": "label",
                      "attributes": [
                        {
                          "start": 91,
                          "end": 108,
                          "type": "Attribute",
                          "name": "for",
                          "value": [
                            {
                              "start": 96,
                              "end": 107,
                              "type": "Text",
                              "raw": "city-select",
                              "data": "city-select"
                            }
                          ]
                        }
                      ],
                      "children": [
                        [
                          {
                            "type": "Text",
                            "raw": "Select a city:",
                            "data": "Select a city:"
                          }
                        ]
                      ]
                    },
                    {
                      "start": 132,
                      "end": 324,
                      "type": "Element",
                      "name": "select",
                      "attributes": [
                        {
                          "start": 140,
                          "end": 157,
                          "type": "Attribute",
                          "name": "id",
                          "value": [
                            {
                              "start": 144,
                              "end": 155,
                              "type": "Text",
                              "raw": "city-select",
                              "data": "city-select"
                            }
                          ]
                        },
                        {
                          "start": 157,
                          "end": 177,
                          "type": "Attribute",
                          "name": {
                            "start": 157,
                            "end": 164,
                            "type": "EventHandler",
                            "name": "change",
                            "modifiers": [],
                            "expression": {
                              "type": "CallExpression",
                              "start": 157,
                              "end": 164
                            }
                          },
                          "value": [
                            {
                              "start": 166,
                              "end": 176,
                              "type": "MustacheAttribute",
                              "name": {
                                "type": "Identifier",
                                "start": {
                                  "offset": 166,
                                  "line": 11,
                                  "column": 35
                                },
                                "end": {
                                  "offset": 176,
                                  "line": 11,
                                  "column": 45
                                },
                                "name": "weatherWiz"
                              }
                            }
                          ]
                        }
                      ],
                      "children": [
                        [
                          {
                            "start": 179,
                            "end": 222,
                            "type": "Element",
                            "name": "option",
                            "attributes": [
                              {
                                "start": 187,
                                "end": 195,
                                "type": "Attribute",
                                "name": "value",
                                "value": [
                                  {
                                    "start": 194,
                                    "end": 194,
                                    "type": "Text",
                                    "raw": "",
                                    "data": ""
                                  }
                                ]
                              }
                            ],
                            "children": [
                              [
                                {
                                  "type": "Text",
                                  "raw": "--Select a city--",
                                  "data": "--Select a city--"
                                }
                              ]
                            ]
                          },
                          {
                            "start": 223,
                            "end": 265,
                            "type": "Element",
                            "name": "option",
                            "attributes": [
                              {
                                "start": 231,
                                "end": 247,
                                "type": "Attribute",
                                "name": "value",
                                "value": [
                                  {
                                    "start": 238,
                                    "end": 246,
                                    "type": "Text",
                                    "raw": "New York",
                                    "data": "New York"
                                  }
                                ]
                              }
                            ],
                            "children": [
                              [
                                {
                                  "type": "Text",
                                  "raw": "New York",
                                  "data": "New York"
                                }
                              ]
                            ]
                          },
                          {
                            "start": 266,
                            "end": 314,
                            "type": "Element",
                            "name": "option",
                            "attributes": [
                              {
                                "start": 274,
                                "end": 293,
                                "type": "Attribute",
                                "name": "value",
                                "value": [
                                  {
                                    "start": 281,
                                    "end": 292,
                                    "type": "Text",
                                    "raw": "Los Angeles",
                                    "data": "Los Angeles"
                                  }
                                ]
                              }
                            ],
                            "children": [
                              [
                                {
                                  "type": "Text",
                                  "raw": "Los Angeles",
                                  "data": "Los Angeles"
                                }
                              ]
                            ]
                          }
                        ]
                      ]
                    },
                    {
                      "start": 326,
                      "end": 393,
                      "type": "Element",
                      "name": "div",
                      "attributes": [
                        {
                          "start": 331,
                          "end": 349,
                          "type": "Attribute",
                          "name": "id",
                          "value": [
                            {
                              "start": 335,
                              "end": 347,
                              "type": "Text",
                              "raw": "weather-info",
                              "data": "weather-info"
                            }
                          ]
                        },
                        {
                          "start": 349,
                          "end": 369,
                          "type": "Attribute",
                          "name": "class",
                          "value": [
                            {
                              "start": 356,
                              "end": 368,
                              "type": "Text",
                              "raw": "weather-info",
                              "data": "weather-info"
                            }
                          ]
                        }
                      ],
                      "children": [
                        [
                          {
                            "type": "MustacheIdentifier",
                            "start": {
                              "offset": 372,
                              "line": 19,
                              "column": 1
                            },
                            "end": {
                              "offset": 385,
                              "line": 19,
                              "column": 14
                            },
                            "expression": {
                              "type": "Identifier",
                              "start": {
                                "offset": 372,
                                "line": 19,
                                "column": 1
                              },
                              "end": {
                                "offset": 385,
                                "line": 19,
                                "column": 14
                              },
                              "name": {
                                "type": "Identifier",
                                "start": {
                                  "offset": 373,
                                  "line": 19,
                                  "column": 2
                                },
                                "end": {
                                  "offset": 384,
                                  "line": 19,
                                  "column": 13
                                },
                                "name": "weatherData"
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
                            "raw": "\n\n",
                            "data": "\n\n"
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
];


const jsAST =  {
  "type": "Program",
  "start": 0,
  "end": 793,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 2,
      "end": 25,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 6,
          "end": 24,
          "id": {
            "type": "Identifier",
            "start": 6,
            "end": 17,
            "name": "weatherData"
          },
          "init": {
            "type": "Literal",
            "start": 20,
            "end": 24,
            "value": null,
            "raw": "null"
          }
        }
      ],
      "kind": "let"
    },
    {
      "type": "FunctionDeclaration",
      "start": 27,
      "end": 791,
      "id": {
        "type": "Identifier",
        "start": 36,
        "end": 46,
        "name": "weatherWiz"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 50,
        "end": 791,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 53,
            "end": 636,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 59,
                "end": 635,
                "id": {
                  "type": "Identifier",
                  "start": 59,
                  "end": 63,
                  "name": "data"
                },
                "init": {
                  "type": "ObjectExpression",
                  "start": 66,
                  "end": 635,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 68,
                      "end": 349,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Literal",
                        "start": 68,
                        "end": 78,
                        "value": "New York",
                        "raw": "\"New York\""
                      },
                      "value": {
                        "type": "ObjectExpression",
                        "start": 80,
                        "end": 349,
                        "properties": [
                          {
                            "type": "Property",
                            "start": 82,
                            "end": 97,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 82,
                              "end": 93,
                              "name": "temperature"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 95,
                              "end": 97,
                              "value": 25,
                              "raw": "25"
                            },
                            "kind": "init"
                          },
                          {
                            "type": "Property",
                            "start": 99,
                            "end": 111,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 99,
                              "end": 107,
                              "name": "humidity"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 109,
                              "end": 111,
                              "value": 60,
                              "raw": "60"
                            },
                            "kind": "init"
                          },
                          {
                            "type": "Property",
                            "start": 113,
                            "end": 133,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 113,
                              "end": 124,
                              "name": "description"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 126,
                              "end": 133,
                              "value": "Sunny",
                              "raw": "\"Sunny\""
                            },
                            "kind": "init"
                          },
                          {
                            "type": "Property",
                            "start": 135,
                            "end": 148,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 135,
                              "end": 144,
                              "name": "windSpeed"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 146,
                              "end": 148,
                              "value": 15,
                              "raw": "15"
                            },
                            "kind": "init"
                          },
                          {
                            "type": "Property",
                            "start": 150,
                            "end": 347,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 150,
                              "end": 158,
                              "name": "forecast"
                            },
                            "value": {
                              "type": "ArrayExpression",
                              "start": 160,
                              "end": 347,
                              "elements": [
                                {
                                  "type": "ObjectExpression",
                                  "start": 162,
                                  "end": 226,
                                  "properties": [
                                    {
                                      "type": "Property",
                                      "start": 164,
                                      "end": 177,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 164,
                                        "end": 167,
                                        "name": "day"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 169,
                                        "end": 177,
                                        "value": "Monday",
                                        "raw": "\"Monday\""
                                      },
                                      "kind": "init"
                                    },
                                    {
                                      "type": "Property",
                                      "start": 179,
                                      "end": 194,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 179,
                                        "end": 190,
                                        "name": "temperature"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 192,
                                        "end": 194,
                                        "value": 27,
                                        "raw": "27"
                                      },
                                      "kind": "init"
                                    },
                                    {
                                      "type": "Property",
                                      "start": 196,
                                      "end": 224,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 196,
                                        "end": 207,
                                        "name": "description"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 209,
                                        "end": 224,
                                        "value": "Partly Cloudy",
                                        "raw": "\"Partly Cloudy\""
                                      },
                                      "kind": "init"
                                    }
                                  ]
                                },
                                {
                                  "type": "ObjectExpression",
                                  "start": 228,
                                  "end": 285,
                                  "properties": [
                                    {
                                      "type": "Property",
                                      "start": 230,
                                      "end": 244,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 230,
                                        "end": 233,
                                        "name": "day"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 235,
                                        "end": 244,
                                        "value": "Tuesday",
                                        "raw": "\"Tuesday\""
                                      },
                                      "kind": "init"
                                    },
                                    {
                                      "type": "Property",
                                      "start": 246,
                                      "end": 261,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 246,
                                        "end": 257,
                                        "name": "temperature"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 259,
                                        "end": 261,
                                        "value": 26,
                                        "raw": "26"
                                      },
                                      "kind": "init"
                                    },
                                    {
                                      "type": "Property",
                                      "start": 263,
                                      "end": 283,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 263,
                                        "end": 274,
                                        "name": "description"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 276,
                                        "end": 283,
                                        "value": "Sunny",
                                        "raw": "\"Sunny\""
                                      },
                                      "kind": "init"
                                    }
                                  ]
                                },
                                {
                                  "type": "ObjectExpression",
                                  "start": 287,
                                  "end": 345,
                                  "properties": [
                                    {
                                      "type": "Property",
                                      "start": 289,
                                      "end": 305,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 289,
                                        "end": 292,
                                        "name": "day"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 294,
                                        "end": 305,
                                        "value": "Wednesday",
                                        "raw": "\"Wednesday\""
                                      },
                                      "kind": "init"
                                    },
                                    {
                                      "type": "Property",
                                      "start": 307,
                                      "end": 322,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 307,
                                        "end": 318,
                                        "name": "temperature"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 320,
                                        "end": 322,
                                        "value": 24,
                                        "raw": "24"
                                      },
                                      "kind": "init"
                                    },
                                    {
                                      "type": "Property",
                                      "start": 324,
                                      "end": 343,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 324,
                                        "end": 335,
                                        "name": "description"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 337,
                                        "end": 343,
                                        "value": "Rain",
                                        "raw": "\"Rain\""
                                      },
                                      "kind": "init"
                                    }
                                  ]
                                }
                              ]
                            },
                            "kind": "init"
                          }
                        ]
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 351,
                      "end": 632,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Literal",
                        "start": 351,
                        "end": 364,
                        "value": "Los Angeles",
                        "raw": "\"Los Angeles\""
                      },
                      "value": {
                        "type": "ObjectExpression",
                        "start": 366,
                        "end": 632,
                        "properties": [
                          {
                            "type": "Property",
                            "start": 368,
                            "end": 383,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 368,
                              "end": 379,
                              "name": "temperature"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 381,
                              "end": 383,
                              "value": 30,
                              "raw": "30"
                            },
                            "kind": "init"
                          },
                          {
                            "type": "Property",
                            "start": 385,
                            "end": 397,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 385,
                              "end": 393,
                              "name": "humidity"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 395,
                              "end": 397,
                              "value": 50,
                              "raw": "50"
                            },
                            "kind": "init"
                          },
                          {
                            "type": "Property",
                            "start": 399,
                            "end": 423,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 399,
                              "end": 410,
                              "name": "description"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 412,
                              "end": 423,
                              "value": "Clear Sky",
                              "raw": "\"Clear Sky\""
                            },
                            "kind": "init"
                          },
                          {
                            "type": "Property",
                            "start": 425,
                            "end": 438,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 425,
                              "end": 434,
                              "name": "windSpeed"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 436,
                              "end": 438,
                              "value": 10,
                              "raw": "10"
                            },
                            "kind": "init"
                          },
                          {
                            "type": "Property",
                            "start": 440,
                            "end": 630,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 440,
                              "end": 448,
                              "name": "forecast"
                            },
                            "value": {
                              "type": "ArrayExpression",
                              "start": 450,
                              "end": 630,
                              "elements": [
                                {
                                  "type": "ObjectExpression",
                                  "start": 452,
                                  "end": 508,
                                  "properties": [
                                    {
                                      "type": "Property",
                                      "start": 454,
                                      "end": 467,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 454,
                                        "end": 457,
                                        "name": "day"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 459,
                                        "end": 467,
                                        "value": "Monday",
                                        "raw": "\"Monday\""
                                      },
                                      "kind": "init"
                                    },
                                    {
                                      "type": "Property",
                                      "start": 469,
                                      "end": 484,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 469,
                                        "end": 480,
                                        "name": "temperature"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 482,
                                        "end": 484,
                                        "value": 29,
                                        "raw": "29"
                                      },
                                      "kind": "init"
                                    },
                                    {
                                      "type": "Property",
                                      "start": 486,
                                      "end": 506,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 486,
                                        "end": 497,
                                        "name": "description"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 499,
                                        "end": 506,
                                        "value": "Sunny",
                                        "raw": "\"Sunny\""
                                      },
                                      "kind": "init"
                                    }
                                  ]
                                },
                                {
                                  "type": "ObjectExpression",
                                  "start": 510,
                                  "end": 567,
                                  "properties": [
                                    {
                                      "type": "Property",
                                      "start": 512,
                                      "end": 526,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 512,
                                        "end": 515,
                                        "name": "day"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 517,
                                        "end": 526,
                                        "value": "Tuesday",
                                        "raw": "\"Tuesday\""
                                      },
                                      "kind": "init"
                                    },
                                    {
                                      "type": "Property",
                                      "start": 528,
                                      "end": 543,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 528,
                                        "end": 539,
                                        "name": "temperature"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 541,
                                        "end": 543,
                                        "value": 31,
                                        "raw": "31"
                                      },
                                      "kind": "init"
                                    },
                                    {
                                      "type": "Property",
                                      "start": 545,
                                      "end": 565,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 545,
                                        "end": 556,
                                        "name": "description"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 558,
                                        "end": 565,
                                        "value": "Sunny",
                                        "raw": "\"Sunny\""
                                      },
                                      "kind": "init"
                                    }
                                  ]
                                },
                                {
                                  "type": "ObjectExpression",
                                  "start": 569,
                                  "end": 628,
                                  "properties": [
                                    {
                                      "type": "Property",
                                      "start": 571,
                                      "end": 587,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 571,
                                        "end": 574,
                                        "name": "day"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 576,
                                        "end": 587,
                                        "value": "Wednesday",
                                        "raw": "\"Wednesday\""
                                      },
                                      "kind": "init"
                                    },
                                    {
                                      "type": "Property",
                                      "start": 589,
                                      "end": 604,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 589,
                                        "end": 600,
                                        "name": "temperature"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 602,
                                        "end": 604,
                                        "value": 32,
                                        "raw": "32"
                                      },
                                      "kind": "init"
                                    },
                                    {
                                      "type": "Property",
                                      "start": 606,
                                      "end": 626,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 606,
                                        "end": 617,
                                        "name": "description"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 619,
                                        "end": 626,
                                        "value": "Sunny",
                                        "raw": "\"Sunny\""
                                      },
                                      "kind": "init"
                                    }
                                  ]
                                }
                              ]
                            },
                            "kind": "init"
                          }
                        ]
                      },
                      "kind": "init"
                    }
                  ]
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "VariableDeclaration",
            "start": 639,
            "end": 695,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 645,
                "end": 694,
                "id": {
                  "type": "Identifier",
                  "start": 645,
                  "end": 653,
                  "name": "selector"
                },
                "init": {
                  "type": "CallExpression",
                  "start": 656,
                  "end": 694,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 656,
                    "end": 679,
                    "object": {
                      "type": "Identifier",
                      "start": 656,
                      "end": 664,
                      "name": "document"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 665,
                      "end": 679,
                      "name": "getElementById"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "Literal",
                      "start": 680,
                      "end": 693,
                      "value": "city-select",
                      "raw": "'city-select'"
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
            "start": 697,
            "end": 786,
            "expression": {
              "type": "CallExpression",
              "start": 697,
              "end": 786,
              "callee": {
                "type": "MemberExpression",
                "start": 697,
                "end": 723,
                "object": {
                  "type": "Identifier",
                  "start": 697,
                  "end": 705,
                  "name": "selector"
                },
                "property": {
                  "type": "Identifier",
                  "start": 706,
                  "end": 723,
                  "name": "addEventListerner"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 724,
                  "end": 732,
                  "value": "change",
                  "raw": "'change'"
                },
                {
                  "type": "FunctionExpression",
                  "start": 734,
                  "end": 785,
                  "id": null,
                  "expression": false,
                  "generator": false,
                  "async": false,
                  "params": [],
                  "body": {
                    "type": "BlockStatement",
                    "start": 745,
                    "end": 785,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 747,
                        "end": 782,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 747,
                          "end": 781,
                          "operator": "=",
                          "left": {
                            "type": "Identifier",
                            "start": 747,
                            "end": 758,
                            "name": "weatherData"
                          },
                          "right": {
                            "type": "MemberExpression",
                            "start": 761,
                            "end": 781,
                            "object": {
                              "type": "Identifier",
                              "start": 761,
                              "end": 765,
                              "name": "data"
                            },
                            "property": {
                              "type": "MemberExpression",
                              "start": 766,
                              "end": 780,
                              "object": {
                                "type": "Identifier",
                                "start": 766,
                                "end": 774,
                                "name": "selector"
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 775,
                                "end": 780,
                                "name": "value"
                              },
                              "computed": false,
                              "optional": false
                            },
                            "computed": true,
                            "optional": false
                          }
                        }
                      }
                    ]
                  }
                }
              ],
              "optional": false
            }
          }
        ]
      }
    }
  ],
  "sourceType": "script"
};

/**@deepWalker traverses any ast body throuhgly and exhaustively 
 * it can search for node name, node type and actual nodes
 * it returns a configurable results which could be 
 * boolean - true/false for found or not 
 * nodeName 
 * nodeType 
 * and actual node match 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

/**@subASt traverse this to get identifiers - reactive identifiers must not be confused with
 * identifiers for functions in event handlers
 * 
 * so in <button @click={incrementer} id={counter}> + </button> 
 * 
 * identifiers we want is {counter} and not {incrementer}
 * 
 * 
 * 
 */

const subAst = [
  {
    html: {
      start: 0,
      end: 54,
      type: 'Fragment',
      children: [
        {
          start: 0,
          end: 54,
          type: 'Element',
          name: 'button',
          attributes: [
            {
              start: 8,
              end: 29,
              type: 'Attribute',
              name: {
                start: 8,
                end: 14,
                type: 'EventHandler',
                name: 'click',
                modifiers: [],
                expression: {
                  type: 'CallExpression',
                  start: 8,
                  end: 14
                }
              },
              value: [
                {
                  start: 16,
                  end: 27,
                  type: 'MustacheAttribute',
                  name: {
                    type: 'Identifier',
                    start: {
                      offset: 16,
                      line: 1,
                      column: 17
                    },
                    end: {
                      offset: 27,
                      line: 1,
                      column: 28
                    },
                    name: 'incrementer'
                  }
                }
              ]
            },
            {
              start: 29,
              end: 41,
              type: 'Attribute',
              name: 'id',
              value: [
                {
                  start: 33,
                  end: 40,
                  type: 'MustacheAttribute',
                  name: {
                    type: 'Identifier',
                    start: {
                      offset: 33,
                      line: 1,
                      column: 34
                    },
                    end: {
                      offset: 40,
                      line: 1,
                      column: 41
                    },
                    name: 'counter'
                  }
                }
              ]
            }
          ],
          children: [
            [
              {
                start: undefined,
                end: undefined,
                type: 'Text',
                raw: '+ ',
                data: '+ '
              }
            ]
          ]
        }
      ]
    }
  }
]; 




function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
}



function deepWalker(ast, nodeType = null, matchLogic, returnType = null) {
    if (!ast) {
        console.log("No AST object provided e.g. deepWalker(ast, nodeType,etc);");
        return;
    }

    if (!matchLogic) {
        console.log("You need to define matchLogic e.g. deepWalker(ast, nodeType,matchLogic);");
        return;
    }

    if (!nodeType || !returnType) {
        console.log('There is no target or return type in your deepWalker request!. Please specify target e.g. deepWalker(ast, nodeType, returnType)');
        return;
    }

    let results = [];
    const visited = new Set();

    function _deepWalk(node) {
        if (!node || visited.has(node)) return; // Stop infinite loops
        visited.add(node);

        if (matchLogic(node)) {
            if (returnType.path) {
                results.push({value: getValueByPath(node, returnType.path), node: node});
            }
        }

        // Traverse arrays
        if (Array.isArray(node)) {
            for (let child of node) {
                _deepWalk(child);
            }
        }

        // Traverse objects
        if (typeof node === 'object') {
            for (let key in node) {
                if (node.hasOwnProperty(key)) {
                    _deepWalk(node[key]);
                }
            }
        }
    }

    function getValueByPath(obj, path) {
        const keys = path.split('.');
        let value = obj;
        for (const key of keys) {
            if (Array.isArray(value) && !isNaN(key)) {
                value = value[parseInt(key)];
            } else {
                value = value[key];
            }
            if (value === undefined || value === null) {
                return undefined;
            }
        }
        return value;
    }

    _deepWalk(ast);
    return results;
}





// 

/**@createMatchLogic important function for creating fucntions that check for specified
 * parameters in the node
 * function takes only three params - nodeType, nodeName and NodeValue - all are optional
 * if no parameters is set function will return: (node) => true;
 * e.g. to check if a node type exists you can create the matchLogic this way
 * 
 * const nodeType='Element';
 * const matchLogic = createMatchLogic(nodeType);
 * // (node) => node.type === nodeType;
 * 
 * if you want to check for node type and node name
 * 
 * const nodeType='Element';
 * const nodeName='span';
 * const matchLogic = createMatchLogic(nodeType,nodeName);
 * // (node) => node.type === nodeType && node.name === nodeName;
 * 
 * you also have to set the path of the item to be returned
 * 
 * e.g.const returnType = {path: 'expression.name.name'}; 
 * when a match is found based on your matchLogic the function use that path to exract the target value from the matched node
 * Then you can call the walker this way:
 * const results = deepWalker(ast, nodeType, matchLogic, returnType);
 * 
 * 
 * 
 * 
 */

function createMatchLogic(nodeType = null, nodeName = null, nodeValue = null) {
    if (nodeType && !nodeName && !nodeValue) {
        return (node) => node.type === nodeType;
    }

    if (nodeType && nodeName && !nodeValue) {
        return (node) => node.type === nodeType && node.name === nodeName;
    }

    if (nodeType && nodeName && nodeValue) {
        return (node) => node.type === nodeType && node.name === nodeName && node.value === nodeValue;
    }

    // Optional: handle cases where no parameters or some combination is provided
    return (node) => true;
}



const nodeType = 'MustacheIdentifier';
const nodeName ='h3';
const returnType = {path: 'expression.name.name'}; 
const nodeValue="Data";
const matchLogic = createMatchLogic(nodeType);

//console.log(matchLogic.toString());
const results = deepWalker(ast, nodeType, matchLogic, returnType);

console.log(results); 

//now get active node
let activeNodes =[];

for(let i = 0; i < results.length; ++i ) {

const nodeTyper = 'MustacheIdentifier';
const nodeNamer ='h3';
const returnTyper = {path: 'expression.name.name'}; 
const nodeValuer="Data";
const matchLogicr = createMatchLogic(nodeTyper);


const results = deepWalker(ast, nodeTyper, matchLogicr, returnTyper);




}








// good junk
// OR const matchLogic = (node,targetNode) => node === targetNode; // deepEqual 
/*

if (
      node.start === targetNode.start &&
      node.end === targetNode.end &&
      node.type === targetNode.type &&
      node.name === targetNode.name &&
      deepEqual(node.attributes, targetNode.attributes) &&
      deepEqual(node.children, targetNode.children)
    ) {
      matchFound = true;
    }


*/




/*

    const nodeNameChecker = (node, nodeName) => node.name === nodeName;
    const identifierResults = walk.traverseForTypeAndName(node, nodeType, nodeName, 

        const nodeNameChecker = (node, funcNodeName) => node.id.name === funcNodeName;


        if (currentNode.type === nodeType && nodeNameChecker(currentNode, nodeName)) {

*/

