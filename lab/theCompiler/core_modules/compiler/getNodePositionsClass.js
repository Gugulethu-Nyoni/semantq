class GetNodePositions {

  constructor (ast, targetNode) {
    this.ast=ast;
    this.targetNode=targetNode;
    //console.log(this.targetNode);
  }

findIndexInChildren(parent) {  
  if (parent.children) {
    if (Array.isArray(parent.children)) {
      // Iterate over the array of arrays
      for (let i = 0; i < parent.children.length; i++) {
        const childArray = parent.children[i];
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



walk(ast) {
  let matchFound = false;
  let nodeStack = [];


  const processNode = (node) => {
    if (node && node.type === 'Element') {
      nodeStack.push({
        node: node,
        nodeName: node.name,
        nodeType: node.type,
      });
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

  nestedWalker(ast);
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
 * it drill down to the very elements objects/arrays
 * it won't pass an object
 * useful for traversing objects/arrays for element/units
 * WON'T WORK FOR PASSING NODES (OBJECTS OR ARRAYS)
 * 
 * 
 * 
 * 
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
 * - aim is to get the immediate parent so that we update node in the parent not
 * and not the grandParent 
 * 
 * 
 * 
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
 * if index is -1 then targetNode is NOT found in the node
 * if existsIndex > -1 then we have found the tagetNode in the node and 
 * hev the index as 
 * 4. with the parentNode and nodeIndex plus newNode - we can replace the node
 * 
 */

init() {

const nodeStack = this.walk(this.ast);
let nodeLocations = [];

//console.log(nodeStack);


for (let i = 0; i < nodeStack.length; i++) {
  const nodeToCheck = nodeStack[i];
  const result = this.childrenChecker(nodeToCheck);

  if (result && result.children) {
    const existsIndex = this.findIndexInChildren(result);


    if (existsIndex > -1) {
        nodeLocations.push({
        parentNode: nodeToCheck.node,
        nodeIndex: existsIndex,
      });

      return nodeLocations;
    }
  } else {
    console.log("Node has no children!");
  }
}


return nodeLocations; 

}



}





const ast =  {
  "html": {
    "start": 0,
    "end": 702,
    "type": "Fragment",
    "children": [
      {
        "start": 0,
        "end": 702,
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
              "start": 32,
              "end": 646,
              "type": "Element",
              "name": "div",
              "attributes": null,
              "children": [
                [
                  {
                    "start": 39,
                    "end": 471,
                    "type": "Element",
                    "name": "table",
                    "attributes": [
                      {
                        "start": 46,
                        "end": 59,
                        "type": "Attribute",
                        "name": "class",
                        "value": [
                          {
                            "start": 53,
                            "end": 58,
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
                          "start": 61,
                          "end": 140,
                          "type": "Element",
                          "name": "thead",
                          "attributes": null,
                          "children": [
                            [
                              {
                                "start": 69,
                                "end": 131,
                                "type": "Element",
                                "name": "tr",
                                "attributes": null,
                                "children": [
                                  [
                                    {
                                      "start": 74,
                                      "end": 89,
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
                                      "start": 90,
                                      "end": 108,
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
                                      "start": 109,
                                      "end": 125,
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
                          "start": 142,
                          "end": 462,
                          "type": "Element",
                          "name": "tbody",
                          "attributes": null,
                          "children": [
                            [
                              {
                                "start": 151,
                                "end": 224,
                                "type": "Element",
                                "name": "tr",
                                "attributes": null,
                                "children": [
                                  [
                                    {
                                      "start": 156,
                                      "end": 172,
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
                                      "start": 173,
                                      "end": 188,
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
                                      "start": 189,
                                      "end": 218,
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
                                "start": 226,
                                "end": 300,
                                "type": "Element",
                                "name": "tr",
                                "attributes": null,
                                "children": [
                                  [
                                    {
                                      "start": 231,
                                      "end": 248,
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
                                      "start": 249,
                                      "end": 265,
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
                                      "start": 266,
                                      "end": 294,
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
                                "start": 302,
                                "end": 452,
                                "type": "Element",
                                "name": "tr",
                                "attributes": null,
                                "children": [
                                  [
                                    {
                                      "start": 307,
                                      "end": 445,
                                      "type": "Element",
                                      "name": "td",
                                      "attributes": [
                                        {
                                          "start": 311,
                                          "end": 322,
                                          "type": "Attribute",
                                          "name": "colspan",
                                          "value": [
                                            {
                                              "start": 320,
                                              "end": 321,
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
                                            "start": 325,
                                            "end": 380,
                                            "type": "Element",
                                            "name": "button",
                                            "attributes": [
                                              {
                                                "start": 333,
                                                "end": 346,
                                                "type": "Attribute",
                                                "name": "id",
                                                "value": [
                                                  {
                                                    "start": 337,
                                                    "end": 344,
                                                    "type": "MustacheAttribute",
                                                    "name": {
                                                      "type": "Identifier",
                                                      "start": {
                                                        "offset": 337,
                                                        "line": 35,
                                                        "column": 13
                                                      },
                                                      "end": {
                                                        "offset": 344,
                                                        "line": 35,
                                                        "column": 20
                                                      },
                                                      "name": "counter"
                                                    }
                                                  }
                                                ]
                                              },
                                              {
                                                "start": 346,
                                                "end": 367,
                                                "type": "Attribute",
                                                "name": {
                                                  "start": 346,
                                                  "end": 352,
                                                  "type": "EventHandler",
                                                  "name": "click",
                                                  "modifiers": [],
                                                  "expression": {
                                                    "type": "CallExpression",
                                                    "start": 346,
                                                    "end": 352
                                                  }
                                                },
                                                "value": [
                                                  {
                                                    "start": 354,
                                                    "end": 365,
                                                    "type": "MustacheAttribute",
                                                    "name": {
                                                      "type": "Identifier",
                                                      "start": {
                                                        "offset": 354,
                                                        "line": 35,
                                                        "column": 30
                                                      },
                                                      "end": {
                                                        "offset": 365,
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
                                            "start": 381,
                                            "end": 438,
                                            "type": "Element",
                                            "name": "button",
                                            "attributes": [
                                              {
                                                "start": 389,
                                                "end": 410,
                                                "type": "Attribute",
                                                "name": {
                                                  "start": 389,
                                                  "end": 395,
                                                  "type": "EventHandler",
                                                  "name": "click",
                                                  "modifiers": [],
                                                  "expression": {
                                                    "type": "CallExpression",
                                                    "start": 389,
                                                    "end": 395
                                                  }
                                                },
                                                "value": [
                                                  {
                                                    "start": 397,
                                                    "end": 408,
                                                    "type": "MustacheAttribute",
                                                    "name": {
                                                      "type": "Identifier",
                                                      "start": {
                                                        "offset": 397,
                                                        "line": 36,
                                                        "column": 17
                                                      },
                                                      "end": {
                                                        "offset": 408,
                                                        "line": 36,
                                                        "column": 28
                                                      },
                                                      "name": "decrementer"
                                                    }
                                                  }
                                                ]
                                              },
                                              {
                                                "start": 410,
                                                "end": 425,
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
                    "start": 474,
                    "end": 638,
                    "type": "Element",
                    "name": "div",
                    "attributes": [
                      {
                        "start": 479,
                        "end": 492,
                        "type": "Attribute",
                        "name": "id",
                        "value": [
                          {
                            "start": 483,
                            "end": 491,
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
                          "start": 495,
                          "end": 630,
                          "type": "Element",
                          "name": "form",
                          "attributes": [
                            {
                              "start": 501,
                              "end": 515,
                              "type": "Attribute",
                              "name": "method",
                              "value": [
                                {
                                  "start": 509,
                                  "end": 513,
                                  "type": "Text",
                                  "raw": "post",
                                  "data": "post"
                                }
                              ]
                            },
                            {
                              "start": 515,
                              "end": 536,
                              "type": "Attribute",
                              "name": "action",
                              "value": [
                                {
                                  "start": 523,
                                  "end": 534,
                                  "type": "Text",
                                  "raw": "process.php",
                                  "data": "process.php"
                                }
                              ]
                            },
                            {
                              "start": 536,
                              "end": 547,
                              "type": "Attribute",
                              "name": "class",
                              "value": [
                                {
                                  "start": 543,
                                  "end": 546,
                                  "type": "MustacheAttribute",
                                  "name": {
                                    "type": "Identifier",
                                    "start": {
                                      "offset": 543,
                                      "line": 48,
                                      "column": 49
                                    },
                                    "end": {
                                      "offset": 546,
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
                                "start": 550,
                                "end": 623,
                                "type": "Element",
                                "name": "input",
                                "attributes": [
                                  {
                                    "start": 557,
                                    "end": 565,
                                    "type": "Attribute",
                                    "name": "id",
                                    "value": [
                                      {
                                        "start": 561,
                                        "end": 563,
                                        "type": "Text",
                                        "raw": "27",
                                        "data": "27"
                                      }
                                    ]
                                  },
                                  {
                                    "start": 565,
                                    "end": 577,
                                    "type": "Attribute",
                                    "name": "type",
                                    "value": [
                                      {
                                        "start": 571,
                                        "end": 575,
                                        "type": "Text",
                                        "raw": "text",
                                        "data": "text"
                                      }
                                    ]
                                  },
                                  {
                                    "start": 577,
                                    "end": 593,
                                    "type": "Attribute",
                                    "name": "value",
                                    "value": [
                                      {
                                        "start": 584,
                                        "end": 591,
                                        "type": "MustacheAttribute",
                                        "name": {
                                          "type": "Identifier",
                                          "start": {
                                            "offset": 584,
                                            "line": 50,
                                            "column": 35
                                          },
                                          "end": {
                                            "offset": 591,
                                            "line": 50,
                                            "column": 42
                                          },
                                          "name": "counter"
                                        }
                                      }
                                    ]
                                  },
                                  {
                                    "start": 593,
                                    "end": 610,
                                    "type": "Attribute",
                                    "name": "data-bind",
                                    "value": [
                                      {
                                        "start": 604,
                                        "end": 608,
                                        "type": "Text",
                                        "raw": "name",
                                        "data": "name"
                                      }
                                    ]
                                  },
                                  {
                                    "start": 610,
                                    "end": 619,
                                    "type": "Attribute",
                                    "name": "disabled",
                                    "value": true
                                  }
                                ],
                                "children": []
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


const targetNode = {
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
  };




const getNodeLocations = new GetNodePositions(ast, targetNode);
const nodeLocations= getNodeLocations.init();

console.log(nodeLocations);


/* TEST BLOCK */


const newNode={
"start": 45,
"end": 56,
"type": "Element",
"name": "placeHolderSpan",
"attributes": [],
"children": [],

}


console.log(nodeLocations[0]);


console.log("BEFORE",JSON.stringify(nodeLocations[0].parentNode,null,2));

nodeLocations[0].parentNode.children[0][nodeLocations[0].nodeIndex]= newNode; 

console.log("AFTER",JSON.stringify(nodeLocations[0].parentNode, null,2));



/* END TEST BLOCK */


 




