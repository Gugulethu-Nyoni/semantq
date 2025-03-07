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
  constructor(node, eventName, eventFunction, parentNode,elementId) {
    this.node = node;
    this.elementId = elementId;
    this.customAST = parentNode;
    this.eventName = eventName;
    this.eventFunction = eventFunction;
    this.eventListenerCode = this.transform();
  }

  transform() {
    const uniqueId = _generateUniqueElementId();
    const elementVar = `elem_${uniqueId}`;
    const cleanEventName = `on${this.eventName}`;
    const cleanEventFunctionName = this.eventFunction.replace('()', '');

    return `
      const ${elementVar} = document.getElementById("${this.elementId}");
      if (${elementVar}) {
        ${elementVar}.addEventListener("${cleanEventName}", ${cleanEventFunctionName});
      }
    `;
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
export default class EventHandlerProcessor {
  constructor(node, eventName, eventFunction, eventHandlerType, parentNodeandIndex, elementId) {
    this.customAST = parentNodeandIndex.parentNode;
    this.node = node;
    this.eventName = eventName;
    this.eventFunction = eventFunction;
    this.eventHandlerType = eventHandlerType;
    this.elementId = elementId; // Use the cached ID
  }

  process() {
    const HandlerClass = EVENT_HANDLER_MAP[this.eventHandlerType];
    if (HandlerClass) {
      const handlerInstance = new HandlerClass(
        this.node,
        this.eventName,
        this.eventFunction,
        this.customAST,
        this.elementId // Pass the cached ID
      );
      return handlerInstance.eventListenerCode;
    } else {
      throw new Error(`No handler found for type: ${this.eventHandlerType}`);
    }
  }
}

