import {
  _generateUniqueElementId,
} from '../utils/utils.js';

import GetNodePositions from '../utils/GetNodePositions.js';
import Walker from './deeperWalker.js';

// Event Handler Class Definitions
class MustacheAttribute {
  constructor(node, eventName, eventFunction, parentNode, elementId) {
    this.node = node;
    this.customAST = parentNode;
    this.eventName = eventName;
    this.eventFunction = eventFunction;
    this.elementId = elementId;
  }

  transform() {
    const cleanEventName = this.eventName.toLowerCase(); // "click" instead of "onclick"
    const cleanEventFunctionName = this.eventFunction.replace('()', '');
    return {
      elementId: this.elementId,
      eventName: cleanEventName,
      eventFunction: cleanEventFunctionName,
    };
  }
}

// Event Handler Map
const EVENT_HANDLER_MAP = {
  MustacheAttribute,
};

// Visitor Base Class
class Visitor {
  visitMustacheAttribute(node, eventName, eventFunction) {
    throw new Error("Method not implemented");
  }
}

// EventHandlerProcessor (Concrete Visitor)
export default class EventHandlerProcessor extends Visitor {
  constructor(node, eventName, eventFunction, eventHandlerType, parentNodeandIndex, elementId) {
    super();
    this.customAST = parentNodeandIndex.parentNode;
    this.node = node;
    this.eventName = eventName;
    this.eventFunction = eventFunction;
    this.eventHandlerType = eventHandlerType;
    this.elementId = elementId;
    this.eventHandlers = []; // Store all event handlers for this element
  }

  addEventHandler(eventName, eventFunction) {
    const HandlerClass = EVENT_HANDLER_MAP[this.eventHandlerType];
    if (HandlerClass) {
      const handlerInstance = new HandlerClass(
        this.node,
        eventName,
        eventFunction,
        this.customAST,
        this.elementId
      );
      this.eventHandlers.push(handlerInstance.transform());
    } else {
      throw new Error(`No handler found for type: ${this.eventHandlerType}`);
    }
  }

  generateCodeBlock() {
    const elementVar = `elem_${this.elementId}`;
    let codeBlock = `const ${elementVar} = document.getElementById("${this.elementId}");\n`;
    codeBlock += `if (${elementVar}) {\n`;

    this.eventHandlers.forEach(handler => {
      codeBlock += `  ${elementVar}.addEventListener("${handler.eventName}", ${handler.eventFunction});\n`;
    });

    codeBlock += `}`;
    return codeBlock;
  }
}