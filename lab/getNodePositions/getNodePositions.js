"use strict";

export default class GetNodePositions {
  constructor (ast, targetNode) {
    this.ast=ast;
    this.targetNode=targetNode;
    //console.log("inside",JSON.stringify(ast,null,2));
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
      if (node && (node.type === 'Element' || node.type === 'Text' || node.type === 'MustacheIdentifier' || node.type === 'Attribute')) {
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





attributesChecker(nodeToCheck) {
  if (Array.isArray(nodeToCheck)) {
    for (let i = 0; i < nodeToCheck.length; ++i) {
      if (this.findAttributes(nodeToCheck[i])) {
        return nodeToCheck[i];
      }
    }
  } else if (typeof nodeToCheck === 'object' && nodeToCheck !== null) {
    for (let key in nodeToCheck) {
      if (this.findAttributes(nodeToCheck[key])) {
        return nodeToCheck[key];
      }
    }
  } else {
    return this.findAttributes(nodeToCheck);
  }

  return false; // No attributes found
}



findAttributes(node) {
  if (node && typeof node === 'object') {
    if (node.attributes && Array.isArray(node.attributes) && node.attributes.length > 0) {
      return node.attributes; // Return attributes if found
    }

    // Recursively search through properties
    for (const key in node) {
      if (node.hasOwnProperty(key)) {
        const result = this.findAttributes(node[key]);
        if (result) {
          return result;
        }
      }
    }
  }

  return false;
}


findIndexInAttributes(parent) {
  if (!parent.attributes || !Array.isArray(parent.attributes)) {
    return -1;
  }

  for (let i = 0; i < parent.attributes.length; i++) {
    const attr = parent.attributes[i];

    if (
      attr.start === this.targetNode.start &&
      attr.end === this.targetNode.end &&
      attr.type === this.targetNode.type &&
      this.deepEqual(attr.name, this.targetNode.name) &&
      this.deepEqual(attr.value, this.targetNode.value)
    ) {
      return i; // Return index if found
    }
  }

  return -1; // Return -1 if not found
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
 * spans - so every node at this stage is an html tag === node.type 'Element'
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
//console.log(nodeStack);
let nodeLocations = [];
//console.log("NODE STACK"); 
//console.log(JSON.stringify(nodeStack,null,2));


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
  }



}

//console.log("HERE now",nodeLocations);

return nodeLocations; 

}



}



const ast = [
  {
    "html": {
      "start": 0,
      "end": 328,
      "type": "Fragment",
      "children": [
        {
          "start": 0,
          "end": 328,
          "type": "Element",
          "name": "customSyntax",
          "attributes": null,
          "children": [
            [
              {
                "start": 15,
                "end": 312,
                "type": "Element",
                "name": "div",
                "attributes": [
                  {
                    "start": 20,
                    "end": 32,
                    "type": "Attribute",
                    "name": "class",
                    "value": [
                      {
                        "start": 27,
                        "end": 31,
                        "type": "Text",
                        "raw": "card",
                        "data": "card"
                      }
                    ]
                  }
                ],
                "children": [
                  [
                    {
                      "start": 34,
                      "end": 86,
                      "type": "Element",
                      "name": "h2",
                      "attributes": null,
                      "children": [
                        [
                          {
                            "start": 38,
                            "end": 81,
                            "type": "Element",
                            "name": "slot",
                            "attributes": [
                              {
                                "start": 44,
                                "end": 56,
                                "type": "Attribute",
                                "name": "name",
                                "value": [
                                  {
                                    "start": 50,
                                    "end": 55,
                                    "type": "Text",
                                    "raw": "title",
                                    "data": "title"
                                  }
                                ]
                              }
                            ],
                            "children": [
                              [
                                {
                                  "type": "Text",
                                  "raw": "c Default Title  ",
                                  "data": "c Default Title  "
                                }
                              ]
                            ]
                          }
                        ]
                      ]
                    },
                    {
                      "start": 88,
                      "end": 203,
                      "type": "Element",
                      "name": "div",
                      "attributes": [
                        {
                          "start": 93,
                          "end": 108,
                          "type": "Attribute",
                          "name": "class",
                          "value": [
                            {
                              "start": 100,
                              "end": 107,
                              "type": "Text",
                              "raw": "content",
                              "data": "content"
                            }
                          ]
                        }
                      ],
                      "children": [
                        [
                          {
                            "start": 110,
                            "end": 196,
                            "type": "Element",
                            "name": "slot",
                            "attributes": [
                              {
                                "start": 116,
                                "end": 130,
                                "type": "Attribute",
                                "name": "name",
                                "value": [
                                  {
                                    "start": 122,
                                    "end": 129,
                                    "type": "Text",
                                    "raw": "content",
                                    "data": "content"
                                  }
                                ]
                              }
                            ],
                            "children": [
                              [
                                {
                                  "start": 132,
                                  "end": 188,
                                  "type": "Element",
                                  "name": "p",
                                  "attributes": null,
                                  "children": [
                                    [
                                      {
                                        "type": "Text",
                                        "raw": "c No content provided. This is fallback content.",
                                        "data": "c No content provided. This is fallback content."
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
                      "start": 205,
                      "end": 305,
                      "type": "Element",
                      "name": "footer",
                      "attributes": null,
                      "children": [
                        [
                          {
                            "start": 214,
                            "end": 295,
                            "type": "Element",
                            "name": "slot",
                            "attributes": [
                              {
                                "start": 220,
                                "end": 233,
                                "type": "Attribute",
                                "name": "name",
                                "value": [
                                  {
                                    "start": 226,
                                    "end": 232,
                                    "type": "Text",
                                    "raw": "footer",
                                    "data": "footer"
                                  }
                                ]
                              }
                            ],
                            "children": [
                              [
                                {
                                  "start": 235,
                                  "end": 287,
                                  "type": "Element",
                                  "name": "p",
                                  "attributes": null,
                                  "children": [
                                    [
                                      {
                                        "type": "Text",
                                        "raw": "c Default footer: No custom footer provided.",
                                        "data": "c Default footer: No custom footer provided."
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
];






const targetNode = 
    {
      "start": 38,
      "end": 81,
      "type": "Element",
      "name": "slot",
      "attributes": [
        {
          "start": 44,
          "end": 56,
          "type": "Attribute",
          "name": "name",
          "value": [
            {
              "start": 50,
              "end": 55,
              "type": "Text",
              "raw": "title",
              "data": "title"
            }
          ]
        }
      ],
      "children": [
        [
          {
            "type": "Text",
            "raw": "c Default Title  ",
            "data": "c Default Title  "
          }
        ]
      ]
    };



const getNodeLocations = new GetNodePositions(ast, targetNode);
const nodeLocations = getNodeLocations.init();
console.log(nodeLocations);



