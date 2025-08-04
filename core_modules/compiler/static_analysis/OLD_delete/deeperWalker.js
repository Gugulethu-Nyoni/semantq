import { _generateUniqueElementId } from '../utils/utils.js';

export default class Walker  {

traverse(ast, targetNode, eventHandlers=null) {
    const results = [];

    //console.log("E Handlers", eventHandlers); return;

    function _traverse(node, parent, key, index, eventHandlers=null ) {
        if (node === null || node === undefined) {
            return; // Stop traversal for non-existent nodes
        }

        if (node.type === targetNode && node.name.type=== 'EventHandler') {

         // console.log("LAPAHA",JSON.stringify(node,null,2)); return;

            results.push({
                targetNode: node,
                parent: parent,
                key: targetNode,
                index: index
            });
        }

        if (Array.isArray(node)) {
            for (let i = 0; i < node.length; i++) {
                _traverse(node[i], node, i, i);
            }
        } else if (typeof node === 'object') {
            for (let key in node) {
                if (node.hasOwnProperty(key)) {
                    _traverse(node[key], node, targetNode, key);
                }
            }
        }
    }



    _traverse(ast, null, targetNode, null,eventHandlers); // Start traversal from the root node
    return results; // Return all found target nodes
}



walk(ast, targetNodeType) {
  //console.log("Problem",JSON.stringify(ast,null,2));
    const results = [];

    function _walk(node, parent, grandParent) {
      //console.log("LPAHA",JSON.stringify(node.html.children,null,2));
        if (node === null || node === undefined) return; 
        //const index = 23; 



        if (node.type === targetNodeType) {

          // console.log("FLAG",node.type);

        const walk = new Walker();

        //console.log("FormatTT",parent);
        const index =walk.findIndexInChildren(grandParent, parent);

            results.push({
                targetNode: node,
                parent: parent,
                grandParent: grandParent,
                parentIndex: index
            }); 
        }

        // Traverse children if they exist
        if (node.children) {
            node.children.forEach((childArray, childKey) => {
                if (Array.isArray(childArray)) {
                    childArray.forEach((child, childIndex) => {
                      _walk(child, node, parent);
                    });
                } else {
                   _walk(childArray, node, parent);
                }
            });
        }
    }

     // Ensure ast is properly structured
  if (ast && ast.html) {
    _walk(ast.html, null, null);
  } else {
    console.error("AST or AST.html is not defined");
  }
    //console.log("All Blocks",results);
    return results;
}





deepWalker(ast, nodeType, matchLogic, returnType = null, pathValue = null) {
    if (!ast) {
        console.log("No AST object provided e.g. deepWalker(ast, nodeType,etc);");
        return;
    }

    if (!matchLogic) {
        console.log("You need to define matchLogic e.g. deepWalker(ast, nodeType, matchLogic);");
        return;
    }

    if (!nodeType) {
        console.log('There is no target or return type in your deepWalker request! Please specify target e.g. deepWalker(ast, nodeType, returnType)');
        return;
    }

    let results = [];
    const visited = new Set();

    function _deepWalk(node) {
        if (!node || visited.has(node)) return; // Stop infinite loops
        visited.add(node);

        // Check if node matches the matchLogic criteria
        if (matchLogic(node)) {
            if (returnType && returnType.path) {
                const valueByPath = getValueByPath(node, returnType.path);

                if (pathValue && valueByPath === pathValue) {
                    results.push({ value: valueByPath, node: node });
                } else if (!pathValue) {
                    results.push({ value: valueByPath, node: node });
                }
            } else {
                // No returnType or path defined
                results.push({ value: node, node: node });
            }
        }

        // Traverse arrays
        if (Array.isArray(node)) {
            for (let child of node) {
                _deepWalk(child);
            }
        }

        // Traverse objects
        if (typeof node === 'object' && node !== null) {
            for (let key in node) {
                if (node.hasOwnProperty(key)) {
                    _deepWalk(node[key]);
                }
            }
        }
    }

    // Helper function to get value by path (if needed)
    function getValueByPath(obj, path) {
        const keys = path.split(/\.|\[|\]/).filter(Boolean);
        let value = obj;

        for (const key of keys) {
            if (value === undefined || value === null) {
                return undefined; // Path does not exist
            }

            if (Array.isArray(value) && !isNaN(key)) {
                value = value[parseInt(key)];
            } else {
                value = value[key];
            }
        }

        return value;
    }

    _deepWalk(ast);
    return results;
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
 * you also have to set the path of the item to returned
 * 
 * e.g.const returnType = {path: 'expression.name.name'}; 
 * when a match is found based on your matchLogic the function
 *  use that path to exract the target value from the matched node
 * 
 */

createMatchLogic(nodeType = null, nodeName = null, nodeValue = null) {
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




deepEqual(a, b) {
  const walk = new Walker();

  if (a === b) return true;
  if (a == null || b == null) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!walk.deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key) || !walk.deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
}



findIndexInChildren(grandParent, targetNode) {
  const walk = new Walker();

  const isObject = (value) => value && typeof value === 'object';


  if (grandParent.children) {
    if (Array.isArray(grandParent.children)) {
      // Iterate over the array of arrays
      for (let i = 0; i < grandParent.children.length; i++) {
        const childArray = grandParent.children[i];
        if (Array.isArray(childArray)) {
          for (let j = 0; j < childArray.length; j++) {
            const child = childArray[j];

      const startMatch = isObject(child.start) ? walk.deepEqual(child.start, walk.targetNode.start) : child.start === targetNode.start;
      const endMatch = isObject(child.end) ? walk.deepEqual(child.end, walk.targetNode.end) : child.end === targetNode.end;      

            if (
              startMatch
              && endMatch
              && child.type === targetNode.type
              && child.name === targetNode.name
              && walk.deepEqual(child.attributes, targetNode.attributes)
              && walk.deepEqual(child.children, targetNode.children)
            ) {
              //return [i, j]; // Return the indices of the child node
              return j; // return index only
            }
          }
        }
      }
    } else {
      // Iterate over the object
      for (const key in grandParent.children) {
        if (Object.hasOwnProperty.call(grandParent.children, key)) {
          const childArray = grandParent.children[key];
          if (Array.isArray(childArray)) {
            for (let j = 0; j < childArray.length; j++) {
              const child = childArray[j];
              if (
                child.start === targetNode.start &&
                child.end === targetNode.end &&
                child.type === targetNode.type &&
                child.name === targetNode.name &&
                walk.deepEqual(child.attributes, targetNode.attributes) &&
                walk.deepEqual(child.children, targetNode.children)
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


traverseForTypeAndName(node, nodeType, nodeName, nodeNameChecker) {
    const results = [];

    const walkRecursive = (currentNode) => {
      if (Array.isArray(currentNode)) {
        currentNode.forEach(item => walkRecursive(item));
      } else if (typeof currentNode === 'object' && currentNode !== null) {
        if (currentNode.type === nodeType && nodeNameChecker(currentNode, nodeName)) {
          results.push(currentNode);
        }
        for (const key in currentNode) {
          if (Object.prototype.hasOwnProperty.call(currentNode, key)) {
            walkRecursive(currentNode[key]);
          }
        }
      }
    };

    walkRecursive(node);
    return results;
  }







/// REMOVE specific event handler attributes

findEventHandlerAndRemove(node, targetValue) {
    if (!node || typeof node !== "object") return;

    function predicate(n) {
      return (
        n?.type === "Attribute" &&
        Array.isArray(n?.value) &&
        n.value[0]?.name?.name === targetValue
      );
    }

    if (Array.isArray(node)) {
      for (let i = node.length - 1; i >= 0; i--) {
        if (predicate(node[i])) {
          node.splice(i, 1);
        } else {
          this.findEventHandlerAndRemove(node[i], targetValue);
        }
      }
    } else {
      Object.keys(node).forEach((key) => {
        if (predicate(node[key])) {
          delete node[key];
        } else {
          this.findEventHandlerAndRemove(node[key], targetValue);
        }
      });
    }
  }


// Example usage
//findEventHandlerAndRemove(ast, "incrementer");

//console.log(JSON.stringify(ast, null, 2)); // Output modified AST



ensureIdAttribute(attributes) {
    const idValue = _generateUniqueElementId(); // Assuming this function exists and generates a unique ID

    // Check if attributes is not an array, initialize it as an empty array
    if (!Array.isArray(attributes)) {
        attributes = [];
    }

    // Check if an 'id' attribute already exists
    const existingIdAttribute = attributes.find(attr => attr.name === 'id');
    let idToUse = existingIdAttribute ? existingIdAttribute.value[0].data : idValue;

    if (!existingIdAttribute) {
        // Create the new 'id' attribute object
        const idAttribute = {
            start: 0, // Assuming start at the beginning; adjust as necessary
            end: 0,   // Assuming end at the beginning; adjust as necessary
            type: "Attribute",
            name: "id",
            value: [
                {
                    start: 0, // Adjust based on actual positioning
                    end: 0,   // Adjust based on actual positioning
                    type: "Text",
                    raw: idValue,
                    data: idValue
                }
            ]
        };

        // Add the 'id' attribute to the top of the attributes array
        attributes.unshift(idAttribute);
    }

    // Return both the updated attributes and the id value
    return {
        attributes: attributes,
        id: idToUse
    };
}


findAttributeAndRemove(node, attributeName) {
  if (!node || typeof node !== "object") return node; // Return the node if it's invalid

  // Predicate to check if the node is the target attribute
  function predicate(n) {
    return n?.type === "Attribute" && n?.name === attributeName;
  }

  // Traverse arrays
  if (Array.isArray(node)) {
    for (let i = node.length - 1; i >= 0; i--) {
      if (predicate(node[i])) {
        node.splice(i, 1); // Remove the attribute from the array
      } else {
        this.findAttributeAndRemove(node[i], attributeName); // Recurse into nested structures
      }
    }
  }
  // Traverse objects
  else {
    Object.keys(node).forEach((key) => {
      if (predicate(node[key])) {
        delete node[key]; // Remove the attribute from the object
      } else {
        this.findAttributeAndRemove(node[key], attributeName); // Recurse into nested structures
      }
    });
  }

  return node; // Return the modified node
}



}

