"use strict";

export default class GetNodePositions {
  constructor(ast, targetNode, mode = null) {
    this.ast = ast;
    this.targetNode = targetNode;
    this.mode = mode;
  }

  /**
   * Finds the index of the target node in a parent's children array
   */
  findIndexInChildren(parent) {
    if (!parent.children) return -1;

    // Handle both array of arrays and flat arrays
    const children = Array.isArray(parent.children) ? parent.children : [];
    
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      
      // Compare basic properties first for efficiency
      if (child.type === this.targetNode.type &&
          child.name === this.targetNode.name) {
        
        // Handle different start/end formats (object vs number)
        const startMatch = this.comparePositions(child.start, this.targetNode.start);
        const endMatch = this.comparePositions(child.end, this.targetNode.end);
        
        if (startMatch && endMatch &&
            this.deepEqual(child.attributes, this.targetNode.attributes)) {
          return i;
        }
      }
    }
    
    return -1;
  }

  /**
   * Compares two position objects/values
   */
  comparePositions(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return a == b;
    
    if (typeof a === 'object' && typeof b === 'object') {
      return a.offset === b.offset && a.line === b.line && a.column === b.column;
    }
    
    return a === b;
  }

  /**
   * Deep comparison of objects/arrays
   */
  deepEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return a == b;

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
      const allKeys = new Set([...keysA, ...keysB]);
      
      for (const key of allKeys) {
        if (!this.deepEqual(a[key], b[key])) return false;
      }
      return true;
    }

    return false;
  }

  /**
   * Walks the AST and collects all nodes in order
   */
  walk() {
    let nodeStack = [];
    
    const traverse = (node) => {
      if (!node) return;

      // Push relevant nodes to stack
      if (node.type && (node.type === 'Element' || node.type === 'Fragment' || 
                        node.type === 'Text' || node.type === 'MustacheIdentifier' || 
                        node.type === 'Attribute')) {
        nodeStack.push({
          node: node,
          nodeName: node.name || node.type,
          nodeType: node.type,
          nodeText: node.type === 'Text' ? node.data || node.value || node.text : null
        });
      }

      // Traverse children recursively
      if (node.children) {
        if (Array.isArray(node.children)) {
          node.children.forEach(child => traverse(child));
        } else if (typeof node.children === 'object') {
          Object.values(node.children).forEach(child => traverse(child));
        }
      }

      // Also check content property (common in ASTs)
      if (node.content && typeof node.content === 'object') {
        traverse(node.content);
      }
    };

    // Start traversal from the appropriate root
    if (this.ast.content && this.ast.content.html) {
      traverse(this.ast.content.html);
    } else {
      traverse(this.ast);
    }

    return nodeStack;
  }

  /**
   * Finds children in a node
   */
  findChildren(node) {
    if (!node) return false;
    
    if (node.type === 'Element' && node.children) {
      return node.children;
    }
    
    // Search through object properties
    if (typeof node === 'object') {
      for (const key in node) {
        if (node.hasOwnProperty(key)) {
          const result = this.findChildren(node[key]);
          if (result) return result;
        }
      }
    }
    
    return false;
  }

  /**
   * Checks if a node has children and returns them
   */
  childrenChecker(nodeToCheck) {
    if (!nodeToCheck) return false;
    
    if (Array.isArray(nodeToCheck)) {
      for (let i = 0; i < nodeToCheck.length; i++) {
        const result = this.findChildren(nodeToCheck[i]);
        if (result) return { node: nodeToCheck[i], children: result };
      }
    } 
    else if (typeof nodeToCheck === 'object') {
      // Handle node objects directly
      const result = this.findChildren(nodeToCheck);
      if (result) return { node: nodeToCheck, children: result };
      
      // Search through properties
      for (const key in nodeToCheck) {
        if (nodeToCheck.hasOwnProperty(key)) {
          const result = this.findChildren(nodeToCheck[key]);
          if (result) return { node: nodeToCheck[key], children: result };
        }
      }
    }
    
    return false;
  }

  /**
   * Finds attributes in a node
   */
  findAttributes(node) {
    if (!node) return false;
    
    if (node.attributes && Array.isArray(node.attributes)) {
      return node.attributes;
    }
    
    if (typeof node === 'object') {
      for (const key in node) {
        if (node.hasOwnProperty(key)) {
          const result = this.findAttributes(node[key]);
          if (result) return result;
        }
      }
    }
    
    return false;
  }

  /**
   * Checks if a node has attributes and returns them
   */
  attributesChecker(nodeToCheck) {
    if (!nodeToCheck) return false;
    
    if (Array.isArray(nodeToCheck)) {
      for (let i = 0; i < nodeToCheck.length; i++) {
        const result = this.findAttributes(nodeToCheck[i]);
        if (result) return { node: nodeToCheck[i], attributes: result };
      }
    } 
    else if (typeof nodeToCheck === 'object') {
      const result = this.findAttributes(nodeToCheck);
      if (result) return { node: nodeToCheck, attributes: result };
      
      for (const key in nodeToCheck) {
        if (nodeToCheck.hasOwnProperty(key)) {
          const result = this.findAttributes(nodeToCheck[key]);
          if (result) return { node: nodeToCheck[key], attributes: result };
        }
      }
    }
    
    return false;
  }

  /**
   * Finds index of target attribute in parent's attributes
   */
  findIndexInAttributes(parent) {
    if (!parent.attributes || !Array.isArray(parent.attributes)) return -1;

    for (let i = 0; i < parent.attributes.length; i++) {
      const attr = parent.attributes[i];
      
      if (attr.type === this.targetNode.type &&
          this.comparePositions(attr.start, this.targetNode.start) &&
          this.comparePositions(attr.end, this.targetNode.end) &&
          this.deepEqual(attr.name, this.targetNode.name) &&
          this.deepEqual(attr.value, this.targetNode.value)) {
        return i;
      }
    }
    
    return -1;
  }

  /**
   * Main initialization method
   */
  init() {
    const nodeStack = this.walk();
    const nodeLocations = [];

    if (this.mode === 'attribute') {
      for (let i = 0; i < nodeStack.length; i++) {
        const nodeToCheck = nodeStack[i];
        const result = this.attributesChecker(nodeToCheck.node);

        if (result && result.attributes) {
          const existsIndex = this.findIndexInAttributes(result.node);
          if (existsIndex > -1) {
            nodeLocations.push({
              parentNode: result.node,
              nodeIndex: existsIndex
            });
            return nodeLocations;
          }
        }
      }
    } 
    else {
      for (let i = 0; i < nodeStack.length; i++) {
        const nodeToCheck = nodeStack[i];
        const result = this.childrenChecker(nodeToCheck.node);

        if (result && result.children) {
          const existsIndex = this.findIndexInChildren(result.node);
          if (existsIndex > -1) {
            nodeLocations.push({
              parentNode: result.node,
              nodeIndex: existsIndex
            });
            return nodeLocations;
          }
        }
      }
    }

    return nodeLocations;
  }
}