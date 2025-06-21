"use strict"; 


export default function elementWalker(ast, nodeKey, nodeKeyValue) {
  // Helper function to recursively traverse the AST
  function walk(node, callback) {
    // Call the callback on the current node
    callback(node);

    // Recursively traverse all properties of the node
    for (const key in node) {
      if (node.hasOwnProperty(key)) {
        const value = node[key];

        // If the value is an object or array, recursively walk it
        if (typeof value === "object" && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              if (typeof item === "object" && item !== null) {
                walk(item, callback);
              }
            });
          } else {
            walk(value, callback);
          }
        }
      }
    }
  }

  // Variable to store the found node
  let foundNode = null;

  // Start walking the AST
  walk(ast, (node) => {
    // Check if the current node has the specified key-value pair
    if (node[nodeKey] === nodeKeyValue) {
      foundNode = node;
    }
  });

  // Return the found node (or null if not found)
  return foundNode;
}