import escodegen from 'escodegen';
import { parse } from 'acorn';
import customHtmlParser from '../customHtmlParser.js';
import fs from 'fs-extra';
//import fs from 'fs';
import path from 'path';
import Walker from './deeperWalker.js';


export default class Transpiler {

  constructor(identifiersInFunctions,customSyntaxAST, jsAST, activeBlock,nodeStatus) {
    this.identifiersinFunctionsObject = identifiersInFunctions;
    this.customSyntaxAST = customSyntaxAST;
    this.jsAST = jsAST;
    this.activeBlock = activeBlock;
    this.staticHandledIdentifiersJs = [];
    this.reactiveFunctionsRerenders = [];
    this.reactiveHandledIdentifiersFuncs = [];
    this.nodeStatus = nodeStatus;
    this.transpile();

  }

  transpile() {
    if (this.nodeStatus === 1) {
      //console.log("NV",this.activeBlock); return;
      this.transformReactive(this.activeBlock);
    } else {
      this.transformStatic(this.activeBlock);
    }
  
}






   transformStatic(block) {
    const identifier=block.identifier; 

    //console.log("STATIC",block);

    const targetNode=block.activeNode;
    const parentNode = block.parentNode;
    const parentNodeIndex = block.parentNodeIndex; 
    //const grandParentNode = block.grandParentNode;
    //const targetNodeIndex = block.targetNodeIndex;

    //console.log(nodeLocations);

    // Generate unique ID and placeholder span node
    const uniqueId = this.generateUniqueElementId();
    const placeholderSpan = this._generatePlaceHolderSpanNode(uniqueId);
    const newHTMLNode = placeholderSpan;

    // Replace node in grandParent
    parentNode.children[0][parentNodeIndex]=newHTMLNode; 


// Generate names for HTML and JS fragments
    const randomStr = this._generateRandomText();
    const randomNumber = () => Math.floor(Math.random() * (999 - 1 + 1)) + 1;

    const targetConstName = (`target_${targetNode.type}_${randomStr}`).toLowerCase();
    const fragmentHTMLName = (`fragment_${randomStr}`).toLowerCase();

    const tagNameConst = `${targetNode.name}_${randomStr}`;
    //const targetNodeHtml = customHtmlParser(targetNode);
    let newNodeCounter = 0;
    let NodeTypeRef;

        if (targetNode.type === 'Element') {
      NodeTypeRef=targetNode.name.charAt(0);
      } 
      else {
        NodeTypeRef=targetNode.type.charAt(0);
      }

    const rootElementName = NodeTypeRef + "_" +randomStr+"_"+randomNumber()+"_rootElement";
    const htmlToJs = this.walkHtmlAstToJS(targetNode,rootElementName);


    // Generate JavaScript code
    const newJsCode = `
        ${htmlToJs}
        const ${targetConstName} = document.getElementById('${uniqueId}');
        ${targetConstName}.innerHTML='';
        ${targetConstName}.insertBefore(${rootElementName}, ${targetConstName}.firstChild);
    `;

    // Parse and add new JS node to the AST
    const newJsNode = parse(newJsCode, { ecmaVersion: 'latest' });
    this.jsAST.body.push(newJsNode);
    this.staticHandledIdentifiersJs.push(identifier); // Add identifier to the handled list
}



/**
 * @block is the active node
 * @identifier is the is the reactive mustacheIdentifier (tag)
 * in this node - which is what makes the node reactive  
 */

  transformReactive(block) {

    //const walk = new Walker();

    const identifier=block.identifier; 
      //console.log("REACTIVE",identifier);
     // Generate unique ID and placeholder span node
    const targetNode=block.activeNode;
    //console.log(JSON.stringify(block,null,2));

    const parentNode = block.parentNode;
    const parentNodeIndex = block.parentNodeIndex

    // Generate unique ID and placeholder span node
    const uniqueId = this.generateUniqueElementId();
    const placeholderSpan = this._generatePlaceHolderSpanNode(uniqueId);
    const newHTMLNode = placeholderSpan;


    // Replace node in grandParent
    parentNode.children[0][parentNodeIndex]= newHTMLNode; 


    const functions = this.identifiersinFunctionsObject[0][identifier];
    const reRenderFunctionName = 'reRender' + identifier.charAt(0).toUpperCase() + identifier.slice(1);
    const reRenderFuncCall = `${reRenderFunctionName}();`;
    const reRenderCallNode = this._jsAstGenerator(reRenderFuncCall);
    const callerNode = reRenderCallNode;


    const walk = new Walker();

    functions.forEach(func => {
        
       

        const existsWithValue = this.identifiersinFunctionsObject.some((item) => {
  return Object.values(item).some((value) => value.includes(func));
});


        if (existsWithValue) {
           //console.log("there");
            const nodeType = 'FunctionDeclaration';
            const nodeName = func;
            const nodeNameChecker = (node, nodeName) => node.id.name === nodeName;
            const targetNode = walk.traverseForTypeAndName(this.jsAST, nodeType, nodeName, nodeNameChecker);
           

            const findNode = (ast, type, name) => {
              let result = null;

              const walker = (node) => {
                if (result) return; // If node is found, stop further walking

                if (Array.isArray(node)) {
                  node.forEach(walker);
                } else if (node && typeof node === 'object') {
                  if (node.type === type && node.name === name) {
                    result = node;
                    return;
                  }

                  // Recursively walk through the object properties
                  for (const key in node) {
                    if (node.hasOwnProperty(key)) {
                      walker(node[key]);
                    }
                  }
                }
              };

              walker(ast);
              return result;
            };

            const calleeNodeExists = findNode(targetNode, "Identifier", reRenderFunctionName);
            //console.log("there we go", calleeNodeExists);

            if (!calleeNodeExists) {

               targetNode[0].body.body.push(callerNode);


            }

           
                
            const reRendersLogger = { [identifier]: func };
            this.reactiveFunctionsRerenders.push(reRendersLogger);
              }

            
            });

      // Generate names for HTML and JS fragments
          const randomStr = this._generateRandomText();
          const randomNumber = () => Math.floor(Math.random() * (999 - 1 + 1)) + 1;
          const fragmentHTMLName = (`fragment_${randomStr}`).toLowerCase();

          const tagNameConst = `${targetNode.name}_${randomStr}`;
          //const targetNodeHtml = customHtmlParser(targetNode);
          let newNodeCounter = 0;
          let NodeTypeRef; 
          
          if (targetNode.type === 'Element') {
            NodeTypeRef=targetNode.name.charAt(0);
            } 
            else {
              NodeTypeRef=targetNode.type.charAt(0);
            }

            const targetConstName = (`target_${targetNode.type}_${randomStr}`).toLowerCase();
            const rootElementName = NodeTypeRef + "_" +randomStr+"_"+randomNumber()+"_rootElement";
            //console.log("NAME",rootElementName);
            const htmlToJs = this.walkHtmlAstToJS(targetNode,rootElementName);
            const jsNodeCreatorCode = `
            ${htmlToJs}
            const ${targetConstName} = document.getElementById('${uniqueId}');
            ${targetConstName}.innerHTML = ''; // Optional: clear previous content
            ${targetConstName}.appendChild(${rootElementName});`;

            const uppercaseIdentifier = identifier.charAt(0).toUpperCase() + identifier.slice(1); 
            /*  here we need to determine if this function has been created or not */

          //const walk = new Walker();
          const nodeType = 'FunctionDeclaration';
          const nodeName = `reRender${uppercaseIdentifier}`;
          const nodeNameChecker = (node, nodeName) => node.id.name === nodeName;
          const targetJsNode = walk.traverseForTypeAndName(this.jsAST, nodeType, nodeName, nodeNameChecker);


         


            // Create function
            if (targetJsNode.length === 0) {
                // Create the reRender${identifier} function
                const newJsCode = `
                    function reRender${uppercaseIdentifier}() {
                  ${jsNodeCreatorCode}
              }
              // ${uppercaseIdentifier} rendering
              

              //${reRenderFunctionName}()`;


          const newJsNode = parse(newJsCode, { ecmaVersion: 2022 });
          this.jsAST.body.push(newJsNode);
          this.reactiveHandledIdentifiersFuncs.push(identifier); // Adding identifier to the handled list
      } else {
          const newJsCode = `
              //Reactive rendering for ${uppercaseIdentifier} nodes
              ${jsNodeCreatorCode}
          `;
          const newJsNode = parse(newJsCode, { ecmaVersion: 2022 });
          targetJsNode[0].body.body.push(newJsNode);
          this.reactiveHandledIdentifiersFuncs.push(identifier); // Adding identifier to the handled list
      }
  
  }







   _jsAstGenerator (jsCode) {
      return parse(jsCode, { ecmaVersion: 'latest'});
   }





  generateUniqueElementId() {
  const timestamp = Date.now().toString(36).substr(0, 3);
  let randomStr = Math.random().toString(36).substr(2, 5);

  while (randomStr.length < 5) {
    randomStr += Math.random().toString(36).substr(2, 1);
  }

  return `${timestamp}${randomStr}`;
}

  _generatePlaceHolderSpanNode(uniqueId) {
    return {
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
                "raw": uniqueId,
                "data": uniqueId
              }
            ]
          }
        ],
        "children": []
      }

    }

  _generatePlaceHolderVariableAST(uniqueId) {
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
            "type": "Literal",
            "start": 28,
            "end": 36,
            "value": uniqueId,
            "raw": `'${uniqueId}'`
          }
        }
      ],
      "kind": "const"
    };
  }

_generateDataSpan (dataAttribute) {
  return {
        "start": 0,
        "end": 33,
        "type": "Element",
        "name": "span",
        "attributes": [
          {
            "start": 6,
            "end": 24,
            "type": "Attribute",
            "name": dataAttribute,
            "value": true
          }
        ],
        "children": [
          {
            "start": 25,
            "end": 26,
            "type": "Text",
            "raw": " ",
            "data": " "
          }
        ]
      }
}

 _generateRandomText() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let randomText = '';
  for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
    randomText += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomText;
}


/* START PARSE HTML AST TO JS CODE  BLOCK */
attributesToJs(attributes, elemVar) {
  let attributesCode = '';

  function _getValueFromPath(obj, path) {
    return path.split('.').reduce((acc, part) => {
      if (acc === undefined || acc === null) {
        return undefined;
      }
      const match = part.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\[(\d+)\])?$/);
      if (match) {
        const [, key, index] = match;
        acc = acc[key];
        if (index !== undefined) {
          acc = acc[parseInt(index, 10)];
        }
      }
      return acc;
    }, obj);
  }

  const logicMap = [
    {
      typeMaps: ['type', 'value[0].type']
    },
    {
      valueData: ['value', ['value[0].raw', 'value[0].name.name']]
    }
  ];

  attributes.forEach(attribute => {
    let type = null;
    let value = null;

    logicMap.forEach(logic => {
      if (logic.typeMaps) {
        type = _getValueFromPath(attribute, logic.typeMaps[0]);
      }
      if (logic.valueData) {
        if (Array.isArray(attribute.value)) {
          value = _getValueFromPath(attribute, logic.valueData[1][0]) || _getValueFromPath(attribute, logic.valueData[1][1]);
        } else {
          value = attribute.value;
        }
      }
    });

    const attributeName = attribute.name.name || attribute.name;

    if (typeof value === 'boolean') {
      if (attribute.smqtype && attribute.smqtype === 'BooleanIdentifierAttribute') {
        attributesCode += `${elemVar}.setAttribute(${attributeName}, '');\n`;
      } else {
        attributesCode += `${elemVar}.setAttribute(${attributeName}, '');\n`;
      }
    }

    if (Array.isArray(attribute.value) && attribute.value[0].type === 'MustacheAttribute') {

       if (attribute.name.type && attribute.name.type === 'EventHandler') {

        attributesCode += `${elemVar}.setAttribute('${attributeName}', '${attribute.value[0].name.name}');\n`;
       } else {
      attributesCode += `${elemVar}.setAttribute('${attributeName}', ${attribute.value[0].name.name});\n`;

    }
    }

    if (Array.isArray(attribute.value) && attribute.value[0].type !== 'MustacheAttribute') {
      attributesCode += `${elemVar}.setAttribute('${attributeName}', '${attribute.value[0].raw}');\n`;
    }
  });

  return attributesCode;
}




walkHtmlAstToJS(ast, rootElementName) {

  const selfClosingTags = [
    'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
    'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr', 'sspan'
  ];


  let jsCode = '';
  let parentStack = [];
  let rootElement = null;
  //let rootElement = rootElementName;
  let elementCounter = 0;
  let textNodeCounter = 0;
  let mustacheExprCounter = 0;

  const randomText = () => {
  return Math.random().toString(36).slice(2, 5);
}

const randomNumber = () => {
  return Math.floor(Math.random() * 900) + 100;
}


  const processNode = (node) => {
    if (Array.isArray(node)) {
      node.forEach(n => processNode(n));
      return;
    }

    if (node.type === 'Element' ) {
      const elemVar = rootElement ? `${node.name}_${randomNumber()}_${randomText()}` : rootElementName;
      if (!rootElement) {
        rootElement = node;
        jsCode += `const ${elemVar} = document.createElement('${node.name}');\n`;
        parentStack.push(elemVar);
      } 

        else {
        jsCode += `const ${elemVar} = document.createElement('${node.name}');\n`;
        jsCode += `// Append element to parent\n${parentStack[parentStack.length - 1]}.appendChild(${elemVar});\n`;
        parentStack.push(elemVar);
      }

      if (node.attributes && node.attributes.length > 0) {
        const attributesData = this.attributesToJs(node.attributes, elemVar);

        //console.log("DATA",attributesData);

        jsCode += `// Set attributes\n${attributesData}`;

      }

      if (node.children && node.children.length > 0) {
        node.children.forEach(child => processNode(child));
      }

      parentStack.pop();
    } else if (node.type === 'Text') {
      const textVar = `textNode_${randomNumber()}_${randomText()}`;



      // Escape every single quote by adding a backslash before it
      let escapedText = node.raw.replace(/'/g, "\\'");
      let cleanText = escapedText.replace(/(\r\n|\n|\r)/g, ' ');

      if (node.raw === ' ')
      {
       cleanText='';//'\u00A0'
      }

      
      const textNodeCreation = `const ${textVar} = document.createTextNode('${cleanText}');\n`;
      jsCode += textNodeCreation;
      jsCode += `${parentStack[parentStack.length - 1]}.appendChild(${textVar});\n`;
    } 

    else if (node.type === 'MustacheIdentifier') {
  const mustacheVar = `mustacheExpr_${randomNumber()}_${randomText()}`;
  const mustacheTagName = node.expression.name.name || node.expression.name;
  //jsCode += `const ${mustacheVar} = ${mustacheTagName};\n`;
  jsCode +=`const ${rootElementName} = document.createTextNode(${mustacheTagName});`
  //console.log("BUG", parentStack);
/*
  if (parentStack.length > 0) {
    jsCode += `${parentStack[parentStack.length - 1]}.appendChild(document.createTextNode(${mustacheVar}));\n`;
  } else if (rootElementName) {
    // Use rootElementName if parentStack is empty
    jsCode += `${rootElementName}.appendChild(document.createTextNode(${mustacheVar}));\n`;
  } else {
    // Fallback if no rootElementName is available
    jsCode += `document.body.appendChild(document.createTextNode(${mustacheVar}));\n`;
  }
  */


}




    else if (typeof node === 'object') {
      Object.values(node).forEach(value => processNode(value));
    }
  };

  processNode(ast);
  return jsCode;
}



/* END PASER HTML AST TO JS CODE BLOCK */

getTransformedASTs() {
    return {
      transformedCustomSyntaxAST: this.customSyntaxAST,
      transformedJsAST: this.jsAST
    };
  }


}
