
const customSyntaxAST=  [
  {
    "html": {
      "start": 0,
      "end": 335,
      "type": "Fragment",
      "children": [
        {
          "start": 0,
          "end": 335,
          "type": "Element",
          "name": "customSyntax",
          "attributes": null,
          "children": [
            [
              {
                "start": 18,
                "end": 90,
                "type": "Element",
                "name": "button",
                "attributes": [
                  {
                    "start": 26,
                    "end": 47,
                    "type": "Attribute",
                    "name": {
                      "start": 26,
                      "end": 32,
                      "type": "EventHandler",
                      "name": "click",
                      "modifiers": [],
                      "expression": {
                        "type": "CallExpression",
                        "start": 26,
                        "end": 32
                      }
                    },
                    "value": [
                      {
                        "start": 34,
                        "end": 45,
                        "type": "MustacheAttribute",
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 34,
                            "line": 5,
                            "column": 17
                          },
                          "end": {
                            "offset": 45,
                            "line": 5,
                            "column": 28
                          },
                          "name": "incrementer"
                        }
                      }
                    ]
                  },
                  {
                    "start": 47,
                    "end": 58,
                    "type": "Attribute",
                    "name": "id",
                    "value": [
                      {
                        "start": 51,
                        "end": 56,
                        "type": "Text",
                        "raw": "btnId",
                        "data": "btnId"
                      }
                    ]
                  },
                  {
                    "start": 58,
                    "end": 69,
                    "type": "Attribute",
                    "name": "class",
                    "value": [
                      {
                        "start": 65,
                        "end": 68,
                        "type": "Text",
                        "raw": "btn",
                        "data": "btn"
                      }
                    ]
                  }
                ],
                "children": [
                  [
                    {
                      "start": 71,
                      "end": 81,
                      "type": "Text",
                      "raw": "Increment ",
                      "data": "Increment "
                    }
                  ]
                ]
              },
              {
                "start": 91,
                "end": 98,
                "type": "Element",
                "name": "br",
                "attributes": null,
                "children": []
              },
              {
                "start": 98,
                "end": 170,
                "type": "Element",
                "name": "button",
                "attributes": [
                  {
                    "start": 106,
                    "end": 127,
                    "type": "Attribute",
                    "name": {
                      "start": 106,
                      "end": 112,
                      "type": "EventHandler",
                      "name": "click",
                      "modifiers": [],
                      "expression": {
                        "type": "CallExpression",
                        "start": 106,
                        "end": 112
                      }
                    },
                    "value": [
                      {
                        "start": 114,
                        "end": 125,
                        "type": "MustacheAttribute",
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 114,
                            "line": 7,
                            "column": 17
                          },
                          "end": {
                            "offset": 125,
                            "line": 7,
                            "column": 28
                          },
                          "name": "decrementer"
                        }
                      }
                    ]
                  },
                  {
                    "start": 127,
                    "end": 138,
                    "type": "Attribute",
                    "name": "id",
                    "value": [
                      {
                        "start": 131,
                        "end": 136,
                        "type": "Text",
                        "raw": "btnId",
                        "data": "btnId"
                      }
                    ]
                  },
                  {
                    "start": 138,
                    "end": 149,
                    "type": "Attribute",
                    "name": "class",
                    "value": [
                      {
                        "start": 145,
                        "end": 148,
                        "type": "Text",
                        "raw": "btn",
                        "data": "btn"
                      }
                    ]
                  }
                ],
                "children": [
                  [
                    {
                      "start": 151,
                      "end": 161,
                      "type": "Text",
                      "raw": "Decrement ",
                      "data": "Decrement "
                    }
                  ]
                ]
              },
              {
                "start": 171,
                "end": 178,
                "type": "Element",
                "name": "br",
                "attributes": null,
                "children": []
              },
              {
                "start": 178,
                "end": 227,
                "type": "Element",
                "name": "p",
                "attributes": [
                  {
                    "start": 181,
                    "end": 193,
                    "type": "Attribute",
                    "name": "class",
                    "value": [
                      {
                        "start": 188,
                        "end": 192,
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
                      "start": 195,
                      "end": 213,
                      "type": "Text",
                      "raw": "Counter value is: ",
                      "data": "Counter value is: "
                    },
                    {
                      "type": "MustacheIdentifier",
                      "start": {
                        "offset": 213,
                        "line": 9,
                        "column": 36
                      },
                      "end": {
                        "offset": 222,
                        "line": 9,
                        "column": 45
                      },
                      "expression": {
                        "type": "Identifier",
                        "start": {
                          "offset": 213,
                          "line": 9,
                          "column": 36
                        },
                        "end": {
                          "offset": 222,
                          "line": 9,
                          "column": 45
                        },
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 214,
                            "line": 9,
                            "column": 37
                          },
                          "end": {
                            "offset": 221,
                            "line": 9,
                            "column": 44
                          },
                          "name": "counter"
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
                      "start": 222,
                      "end": 223,
                      "type": "Text",
                      "raw": " ",
                      "data": " "
                    }
                  ]
                ]
              },
              {
                "start": 230,
                "end": 287,
                "type": "Element",
                "name": "div",
                "attributes": null,
                "children": [
                  [
                    {
                      "start": 236,
                      "end": 264,
                      "type": "Text",
                      "raw": "The button has been clicked ",
                      "data": "The button has been clicked "
                    },
                    {
                      "type": "MustacheIdentifier",
                      "start": {
                        "offset": 264,
                        "line": 12,
                        "column": 35
                      },
                      "end": {
                        "offset": 273,
                        "line": 12,
                        "column": 44
                      },
                      "expression": {
                        "type": "Identifier",
                        "start": {
                          "offset": 264,
                          "line": 12,
                          "column": 35
                        },
                        "end": {
                          "offset": 273,
                          "line": 12,
                          "column": 44
                        },
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 265,
                            "line": 12,
                            "column": 36
                          },
                          "end": {
                            "offset": 272,
                            "line": 12,
                            "column": 43
                          },
                          "name": "counter"
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
                      "start": 273,
                      "end": 281,
                      "type": "Text",
                      "raw": " times! ",
                      "data": " times! "
                    }
                  ]
                ]
              },
              {
                "start": 290,
                "end": 318,
                "type": "Element",
                "name": "h3",
                "attributes": null,
                "children": [
                  [
                    {
                      "start": 295,
                      "end": 307,
                      "type": "Text",
                      "raw": "Today is a: ",
                      "data": "Today is a: "
                    },
                    {
                      "type": "MustacheIdentifier",
                      "start": {
                        "offset": 307,
                        "line": 15,
                        "column": 18
                      },
                      "end": {
                        "offset": 312,
                        "line": 15,
                        "column": 23
                      },
                      "expression": {
                        "type": "Identifier",
                        "start": {
                          "offset": 307,
                          "line": 15,
                          "column": 18
                        },
                        "end": {
                          "offset": 312,
                          "line": 15,
                          "column": 23
                        },
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 308,
                            "line": 15,
                            "column": 19
                          },
                          "end": {
                            "offset": 311,
                            "line": 15,
                            "column": 22
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
                      "start": 312,
                      "end": 313,
                      "type": "Text",
                      "raw": " ",
                      "data": " "
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



   function walk (ast, targetNode) {

    function _walk(node, parentNode, grandParentNode) { 
     const totalNodeChildren=Object.keys(node).length;
      if (node === null || node === undefined) {
        console.log("traversal stopped"); // Stop traversal for non-existent nodes
        return;
      }
      if (node.type === targetNode) {
        ///console.log("targetParentNode",JSON.stringify(parentNode,null,2));


        const index = parentElementIndexFinder(grandParentNode, parentNode);
        console.log("Index", index); return;

        //console.log("Index",index);
        const newNode ={
        "start": 0,
        "end": 22,
        "type": "Element",
        "name": "span",
        "attributes": [
          {
            "start": 6,
            "end": 14,
            "type": "Attribute",
            "name": "id",
            "value": [
              {
                "start": 10,
                "end": 13,
                "type": "Text",
                "raw": "123",
                "data": "123"
              }
            ]
          }
        ],
        "children": []
      }; 

      //replace 
      const trans = grandParentNode.children[index]=newNode;

      //console.log(JSON.stringify(grandParentNode,null,2));



      }

    if (node.children) {    
        node.children.forEach((childArray, childKey) => {
          //console.log(typeof childArray);
          if (Array.isArray(childArray)) {
            childArray.forEach((childArray, childIndex) => {
              console.log("died in the array case");
             _walk(childArray, node, grandParentNode);
            });      

          } else {
          //console.log("childArray", childKey);
          //console.log("firstKey",childKey); 
          
          _walk(childArray, node, parentNode);
          }
        });
      }
    }

_walk(ast.html, null, null);
   }




function parentElementIndexFinder(ast, targetNode) {

    function isEqual(node1, node2) {
        if (node1 === node2) return true;

        if (typeof node1 !== 'object' || typeof node2 !== 'object') return false;

        const keys1 = Object.keys(node1);
        const keys2 = Object.keys(node2);

        if (keys1.length !== keys2.length) return false;

        for (const key of keys1) {
            if (!isEqual(node1[key], node2[key])) return false;
        }

        return true;
    }

    function _findIndex(node, targetNode, nodeIndex) {
      let childrenLoopIndex = nodeIndex;



        if (node === null || node === undefined) return -1;

        if (isEqual(node, targetNode)) return nodeIndex;

        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                const childIndex = childrenLoopIndex++;

                const result = _findIndex(child, targetNode, childIndex);
                if (result !== -1) {
                    return result;
                }
            }
        }

        return -1; // return -1 if the targetNode is not found
    }

    return _findIndex(ast, targetNode, 0);
}









const targetNode = "MustacheIdentifier";
const results= walk(customSyntaxAST[0], targetNode);
console.log(results);


