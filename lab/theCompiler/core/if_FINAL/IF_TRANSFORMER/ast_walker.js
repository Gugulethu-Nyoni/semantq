// we are looking for the consequent in an iff block - get the consequent node, its parent and its key and index

function getConsequentNode(ast, parent = null, key = null, index = null) {
  let result = null;

  function _visit(node, parent, key, index) {
    // console.log('Visiting node:', node);

    if (node && typeof node === 'object') {
      if (node.consequent) {
        //console.log('Found consequent node:', JSON.stringify(node, null, 2));
        result = {
          node: node.consequent,
          parent: node,  // The current node is the parent of its consequent
          key: 'consequent',
          index: null,  // Not applicable here as 'consequent' is not an array element
        };
        return; // Exit early if target node is found
      }

      for (let prop in node) {
        if (node.hasOwnProperty(prop)) {
          const child = node[prop];

          if (Array.isArray(child)) {
            child.forEach((subNode, idx) => {
              _visit(subNode, node, prop, idx);
            });
          } else if (typeof child === 'object') {
            _visit(child, node, prop, null);
          }
        }
      }
    } else if (Array.isArray(node)) {
      node.forEach((subNode, idx) => {
        _visit(subNode, parent, key, idx);
      });
    }
  }

  _visit(ast, parent, key, index);
  return result;
}


// Example usage:

const ast = {
  "type": "IfStatement",
  "start": 105,
  "end": 163,
  "test": {
    "type": "BinaryExpression",
    "start": 112,
    "end": 123,
    "left": {
      "type": "Identifier",
      "start": 112,
      "end": 123,
      "name": "counter"
    },
    "operator": ">",
    "right": {
      "type": "Literal",
      "start": 112,
      "end": 123,
      "value": 1,
      "raw": "1"
    }
  },
  "consequent": {
    "type": "BlockStatement",
    "start": 127,
    "end": 163,
    "body": [
      {
        "type": "ExpressionStatement",
        "start": 127,
        "end": 163,
        "expression": {
          "type": "ConditionalExpression",
          "start": 127,
          "end": 163,
          "test": {
            "type": "BinaryExpression",
            "start": 129,
            "end": 142,
            "left": {
              "type": "Identifier",
              "start": 129,
              "end": 142,
              "name": "counter"
            },
            "operator": "===",
            "right": {
              "type": "Literal",
              "start": 129,
              "end": 142,
              "value": 1,
              "raw": "1"
            }
          },
          "consequent": {
            "type": "Literal",
            "start": 23,
            "end": 34,
            "value": "time",
            "raw": "'time'"
          },
          "alternate": {
            "type": "Literal",
            "start": 34,
            "end": 45,
            "value": "times",
            "raw": "'times'"
          }
        }
      }
    ]
  },
  "alternate": null
};



const result = getConsequentNode(ast);
console.log(result.key);
