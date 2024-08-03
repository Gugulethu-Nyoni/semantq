import escodegen from 'escodegen';
import { parse } from 'acorn';
import * as htmlParser from './semantq_parser.js';


const jsAST={
  "type": "Program",
  "start": 0,
  "end": 22,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 2,
      "end": 18,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 6,
          "end": 17,
          "id": {
            "type": "Identifier",
            "start": 6,
            "end": 13,
            "name": "counter"
          },
          "init": {
            "type": "Literal",
            "start": 16,
            "end": 17,
            "value": 1,
            "raw": "1"
          }
        }
      ],
      "kind": "let"
    }
  ],
  "sourceType": "script"
}



const customSyntaxAST=[
  {
    "html": {
      "start": 0,
      "end": 63,
      "type": "Fragment",
      "children": [
        {
          "start": 0,
          "end": 63,
          "type": "Element",
          "name": "customSyntax",
          "attributes": null,
          "children": [
            [
              {
                "start": 18,
                "end": 45,
                "type": "Element",
                "name": "p",
                "attributes": null,
                "children": [
                  [
                    {
                      "start": 22,
                      "end": 31,
                      "type": "Text",
                      "raw": "Counter: ",
                      "data": "Counter: "
                    },
                    {
                      "type": "MustacheIdentifier",
                      "start": {
                        "offset": 31,
                        "line": 5,
                        "column": 14
                      },
                      "end": {
                        "offset": 40,
                        "line": 5,
                        "column": 23
                      },
                      "expression": {
                        "type": "Identifier",
                        "start": {
                          "offset": 31,
                          "line": 5,
                          "column": 14
                        },
                        "end": {
                          "offset": 40,
                          "line": 5,
                          "column": 23
                        },
                        "name": {
                          "type": "Identifier",
                          "start": {
                            "offset": 32,
                            "line": 5,
                            "column": 15
                          },
                          "end": {
                            "offset": 39,
                            "line": 5,
                            "column": 22
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
                      "start": 40,
                      "end": 41,
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
]



const customSyntaxObject = {};

// Assuming your structure, you can assign parts of customSyntaxAST to customSyntaxObject
customSyntaxAST.forEach((section, index) => {
  customSyntaxObject[`section${index}`] = section;
});





class NodeVisitor {

  transformerNode(node) {
    // Implement your visit logic here
  }

addNode (ast, parentNode, key, newNode) {

return transformedAst;

}


removeNode (ast, parentNode, key ) {

return transformedAst;

}


createNode () {


  
}





}




class TransformEventHandler extends NodeVisitor {

  transform(attribute, parent, key, index) {
    // Transform code here

    if (attribute.name.type === 'EventHandler')
        {

        const tranformedfunctionIdentifier = attribute.value[0].name.name + "()";
        //console.log(tranformedfunctionIdentifier);

        attribute.value[0].name.name = tranformedfunctionIdentifier; 

        }
      
    //console.log(JSON.stringify(attribute, null, 2));
  }
}


class TransformIfStatement extends NodeVisitor {

 generateUniqueElementId() {
  const timestamp = Date.now().toString(36); // Convert current timestamp to base-36 string
  let randomStr = Math.random().toString(36).substr(2, 6); // Generate 6-character random string

  // Ensure randomStr is exactly 6 characters long
  while (randomStr.length < 6) {
    randomStr += Math.random().toString(36).substr(2, 1); // Add characters until length is 6
  }

  const uniqueId = `${timestamp}${randomStr}`; // Combine timestamp and random string
  return uniqueId;
}




    _generatePlaceHolderSpanNode (uniqueId)
    {
      return {
        "start": 0,
        "end": 18,
        "type": "SelfClosingElement",
        "name": "span",
        "attributes": [
          {
            "start": 6,
            "end": 15,
            "type": "Attribute",
            "name": "id",
            "value": [
              {
                "start": 10,
                "end": 14,
                "type": "Text",
                "raw": uniqueId,
                "data": uniqueId
              }
            ]
          }
        ],
        "children": []
      }; 
    }



_generatePlaceHolderVariableAST (uniqueId) {

return {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 37,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 6,
          "end": 36,
          "id": {
            "type": "Identifier",
            "start": 6,
            "end": 26,
            "name": "placeHolderElementId"
          },
          "init": {
            "type": "Identifier",
            "start": 28,
            "end": 36,
            "name": `'${uniqueId}'`
          }
        }
      ],
      "kind": "const"
    }


}



  _getConsequentNode(ast, parent = null, key = null, index = null) {
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



transform(node, parent, key, index,jsAST) {
    // Transform code here

  //console.log(JSON.stringify(node,null,2));

const uniqueId = this.generateUniqueElementId();
const placeholderSpan=this._generatePlaceHolderSpanNode(uniqueId);
const newNode = placeholderSpan;
   //console.log(node.consequent.body[0].type);
// adding new span node to customAST  object
    parent[key]=newNode; 

const placeHolderNodeConst = this._generatePlaceHolderVariableAST (uniqueId);
//console.log(JSON.stringify(placeHolderNodeConst,null,2));
 //console.log(JSON.stringify(parent,null,2));

// before we push the if statement node to jsAST object we need to get the consequnt node and transform it where needs be 

const consequentAstObject = this._getConsequentNode(node);
//console.log(consequentAstObject.key);

const consequentRawCode = escodegen.generate(consequentAstObject.node);

//console.log(consequentRawCode);

// remove the mustache custom syntax curly braces around the expression
const cleanConsequentRawCode = consequentRawCode.replace(/{|}/g, '');

const consequentExpressionConst = `const expr = ${cleanConsequentRawCode}`
const expressionEmitterBuilder= `const locationElement = document.getElementById(placeHolderElementId);
const newSpan=document.createElement('span');
const textNode=expr;
newSpan.textContent= textNode;
locationElement.appendChild(newSpan);`;

const newIntegratedConsequent= "{" + consequentExpressionConst + expressionEmitterBuilder + "}"; 

//console.log(consequentExpressionConst);


const newConsequentAST= parse(newIntegratedConsequent);
//console.log("Code:",JSON.stringify(newConsequentAST.body,null,2));


// NOW APPEND THE IF STATEMENT TO THE jsAST
jsAST.body.push(placeHolderNodeConst);

// now replace the  consequent node in  the IfStatement node with the new consequent ast

const updatedIfStatement = consequentAstObject.parent[consequentAstObject.key]=newConsequentAST;


//jsAST.body.push(newConsequentAST.body);


jsAST.body.push(node);


/* IF TRANSFORMER HELPER FUNCTITONS */



}






  }





// Instantiate the TransformEventHandler
const eventHandlerInstance = new TransformEventHandler();
const IfStatementInstance = new TransformIfStatement();



// The visitors map with the instance of TransformEventHandler
const visitors = {
  'EventHandler': eventHandlerInstance, // Note the key is a string
  'IfStatement' : IfStatementInstance
};



function visit(ast, visitorsMap, jsAST) {
  function _visit(node, parent, key, index, jsAST) {

    if (node && node.type && node.type !== "Element") {
      if (node.type in visitorsMap) {
        const handlerInstance = visitorsMap[node.type];
        if (typeof handlerInstance.transform === "function") {
          handlerInstance.transform(node, parent, key, index, jsAST);
        }
      }
    }

    if (node !== null && node.type === "Element") {
      const attributes = node.attributes;
      if (attributes) {
        for (const attribute of attributes) {
          const attributeType = attribute.name.type;
          if (attributeType in visitorsMap) {
            //console.log(`Visiting attribute of type: ${attributeType}`);
            const handlerInstance = visitorsMap[attributeType];
            if (typeof handlerInstance.transform === "function") {
              handlerInstance.transform(attribute, parent, key, index);
            }
          }
        }
      }
    }

    if (Array.isArray(node)) {
      node.forEach((childNode, childIndex) => {
        _visit(childNode, node, childIndex, childIndex, jsAST);
      });
    } else if (typeof node === 'object' && node !== null) {
      Object.keys(node).forEach((prop) => {
        _visit(node[prop], node, prop, null, jsAST);
      });
    }
  }

  _visit(ast, null, null, null, jsAST);

  //return ast;

  return {

    transformedCustomedAST: ast,
    transformedjsAST: jsAST
  }

}







// Example usage with the AST object and visitors map
const transformedObjects = visit(customSyntaxObject, visitors,jsAST);

//console.log(JSON.stringify(transformedObjects.transformedjsAST, null,2)); // access specifc objects by keys e.g. transformedObjects[transformedjsAST]

const jsCode = escodegen.generate(transformedObjects.transformedjsAST);

//console.log(JSON.stringify(transformedObjects.transformedCustomedAST.section0[0],null,2));

console.log("js code: ", jsCode);

const parsedHTML = htmlParser.parseAST(transformedObjects.transformedCustomedAST.section0[0]);

console.log("html: ", parsedHTM