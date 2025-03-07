import {
  _jsAstGenerator,
  _generateUniqueElementId,
  _generatePlaceHolderSpanNode,
  _generatePlaceHolderVariableAST,
  _generateDataSpan,
  _generateRandomText,
} from '../utils/utils.js';

import GetNodePositions from '../utils/GetNodePositions.js';
import Walker from './deeperWalker.js';



// Event Handler Class Definitions
class MustacheAttribute {
  constructor(node, eventName, eventFunction) {
    this.node = node;
    this.eventName = eventName;
    //console.log("EVENTNAME",this.eventName);
    this.eventFunction = eventFunction;
    //this.eventListenerCode = 
    //this.transform(); // Store transformed code
    this.eventListenerCode = this.transform(); // Store transformed code
  }

  

  transform() {

// get the element id
const walk = new Walker();

let nodeType = 'Attribute';
let nodeName = 'id';
let returnType = { path:'value[0].raw' };
let elementAttributes=this.node.attributes[0];
//console.log("ATTR",elementAttributes);
let matchLogic = walk.createMatchLogic(nodeType,nodeName);
const parentIdNode = walk.deepWalker(elementAttributes, nodeType, matchLogic, returnType);

//console.log("ID NAME?",JSON.stringify(parentIdNode[0].node.value[0].raw, null, 2));
const elementId = parentIdNode[0].node.value[0].raw; 

const uniqueId = _generateUniqueElementId();
const elementVar = `elem_${uniqueId}`; 
const cleanEventName = this.eventName.slice(2); // Remove "on" prefix
const cleanEventFunctionName = this.eventFunction.replace('()', ''); // Remove "on" prefix

return `
    const ${elementVar} = document.getElementById("${elementId}");
    if (${elementVar}) {
      ${elementVar}.addEventListener("${cleanEventName}", ${cleanEventFunctionName});
    }
    `;

    //return code; 
  }
}





// More event handler classes can be added here...
// class AnotherEventHandler { ... }

// Event Handler Map
const EVENT_HANDLER_MAP = {
  "MustacheAttribute": MustacheAttribute,
  // Add more event handler mappings here...
};

// Visitor Base Class
class Visitor {
  visitMustacheAttribute(node, eventName, eventFunction) {
    throw new Error("Method not implemented");
  }
}





// EventHandlerProcessor (Concrete Visitor)
export default class EventHandlerProcessor extends Visitor {
  constructor(node, eventName, eventFunction, eventHandlerType, customAST) {
    super();
    this.customAST = customAST; 
    this.node = node;
    this.eventName = eventName;
    this.eventFunction = eventFunction;
    this.eventHandlerType = eventHandlerType;
  }

  process() {
    const walk = new Walker(); 
    let nodeType = 'Attribute';
    let nodeName = 'id';
    let returnType = { path: 'name' };
    let elementAttributes = this.node.attributes[0];
  
    let matchLogic = walk.createMatchLogic(nodeType, nodeName);
    let parentIdNode = walk.deepWalker(elementAttributes, nodeType, matchLogic, returnType);

    // Check if ID is missing and add it
    if (parentIdNode.length < 1) {
      //console.log("No ID found. Adding one...");
      this.addIdNode();
    }

    //console.log("Updated node after adding ID:", JSON.stringify(this.node, null, 2));

    // Get the appropriate event handler class
    const HandlerClass = EVENT_HANDLER_MAP[this.eventHandlerType];
    if (HandlerClass) {
      const handlerInstance = new HandlerClass(this.node, this.eventName, this.eventFunction);
      //console.log("Generated Event Code:", handlerInstance.eventListenerCode);

      /* HERE YOU CAN REMOVE THE EVENT HANDLER */


      let enodeType = 'Attribute';
      let ereturnType = { path: 'value[0].name.name' };
      let pathValue = this.eventFunction;
    
      let ematchLogic = walk.createMatchLogic(enodeType);
      let getTargetNode = walk.deepWalker(this.node, enodeType, ematchLogic, ereturnType, pathValue);
      
      //console.log("START",getTargetNode);
      let targetNode;

      if (getTargetNode) {
        targetNode = getTargetNode[0].node;
       // console.log("AST BODY",JSON.stringify(elementAttributes,null,2), "Target Node",JSON.stringify(targetNode,null,2));

        walk.findEventHandlerAndRemove(this.customAST, this.eventFunction);

     // const getNodeLocations = new GetNodePositions(this.customAST, targetNode);
     // const nodeLocations = getNodeLocations.init();
     //console.log("LOCS",nodeLocations);



      }





      /* END REMOVE EVENT HANDLER */
      
      // Ensure the code is returned from process() directly
      return handlerInstance.eventListenerCode;
    } else {
      throw new Error(`No handler found for type: ${this.eventHandlerType}`);
    }
  }

  addIdNode() {
    const uniqueId = _generateUniqueElementId(); 
    const idAttributeNode = {
      start: 150,
      end: 164,
      type: "Attribute",
      name: "id",
      value: [
        {
          start: 154,
          end: 163,
          type: "Text",
          raw: uniqueId,
          data: uniqueId
        }
      ]
    };
    this.node.attributes.unshift(idAttributeNode);
  }
}



// Example Usage
/*

eventListenerCode = new EventHandlerProcessor(block.parentNode, eventName, eventFunction, "MustacheAttribute");

const node = { name: "@click", value: "{someFunction}" };
const processor = new EventHandlerProcessor(node, "@click", "someFunction", "MustacheAttribute");

console.log(processor.process());

*/


