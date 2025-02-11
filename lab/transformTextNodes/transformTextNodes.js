"use strict";
import deepWalker from '../deepWalker/deepWalker.js';


class TransformTextNodes {
  constructor (subRootNodeChildren)
  {
    this.subRootNodeChildren = subRootNodeChildren; 
    this.transformTextNodes();

  }
  transformTextNodes() {
    if (!this.subRootNodeChildren || !this.subRootNodeChildren.children || !Array.isArray(this.subRootNodeChildren.children[0])) {
      return;
    }

    for (let i = 0; i < this.subRootNodeChildren.children[0].length; i++) {
      const node = this.subRootNodeChildren.children[0][i];
      const newLines = '\n\n\n\n';
      const whiteSpaces = ' ';

      if (node.type === 'Text' && node.raw !== newLines && node.raw !== whiteSpaces) {
        this.subRootNodeChildren.children[0][i] = this.createTextNode(node);
        return this.subRootNodeChildren; 
      }
    }
  }



  createTextNode(node) {
    return {
      start: node.start,
      end: node.end,
      type: "Element",
      name: "span",
      attributes: [],
      children: [
        {
          start: node.start,
          end: node.end,
          type: "Text",
          raw: node.raw,
          data: node.data
        }
      ]
    };
  }
}


/*
function visitTextNodes(ast) {
    console.log("inside");

  if (!ast || !ast.html) return;

  const customSyntaxNode = findCustomSyntaxNode(ast.html);
  if (!customSyntaxNode) return;

  const textNodesInstance = new TransformTextNodes(customSyntaxNode);
  //textNodesInstance.transformTextNodes(customSyntaxNode);
}




function findCustomSyntaxNode(node) {
  if (!node) return null;
  if (node.type === 'Element' && node.name === 'customSyntax') return node;

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      const result = findCustomSyntaxNode(child);
      if (result) return result;
    }
  }
  return null;
}
*/

const ast = {
  "jsAST_Body": {
    "type": "JavaScript",
    "content": {
      "type": "Program",
      "start": 0,
      "end": 0,
      "body": [],
      "sourceType": "module"
    }
  },
  "cssAST_Body": {
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
          "file": "/Users/gugulethu/code/semantq/cmdapp/style"
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
  "body": {
    "type": "HTML",
    "content": [
      {
        "html": {
          "start": 0,
          "end": 43,
          "type": "Fragment",
          "children": [
            {
              "start": 0,
              "end": 43,
              "type": "Element",
              "name": "customSyntax",
              "attributes": null,
              "children": [
                [
                  {
                    "type": "Text",
                    "raw": "Hello World!\n",
                    "data": "Hello World!\n"
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

const node = deepWalker(ast.body, "name", "customSyntax");
console.log("RAW",JSON.stringify(node,null,2));
const transformTextNodes = new TransformTextNodes(node);
console.log("Fixed", JSON.stringify(transformTextNodes,null,2));
