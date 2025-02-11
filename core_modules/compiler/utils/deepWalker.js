"use strict";

export default class Walker  {
constructor (ast, targetNode) {
}


deepWalker(ast,matchLogic,nodeType = null,returnType = null) {
    if (!ast) {
        console.log("No AST object provided e.g. deepWalker(ast, nodeType,etc);");
        return;
    }

    if (!matchLogic) {
        console.log("You need to define matchLogic e.g. deepWalker(ast, nodeType,matchLogic);");
        return;
    }

    if (!nodeType) {
        console.log('There is no target or return type in your deepWalker request!. Please specify target e.g. deepWalker(ast, nodeType, returnType)');
        return;
    }

    let results = [];
    const visited = new Set();

    function _deepWalk(node) {
        if (!node || visited.has(node)) return; // Stop infinite loops
        visited.add(node);

        if (matchLogic(node)) {
                            //results.push(getValueByPath(node, returnType.path));
            results.push({node: node});

            
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
 * when a match is found based on your matchLogic the function use that path to exract the target value from the matched node
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




}