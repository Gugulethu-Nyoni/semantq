import EventHandlerProcessor from './transformEventHandlers.js';
import GetNodePositions from '../utils/GetNodePositions.js';
import Walker from './deeperWalker.js';
import { _generateUniqueElementId} from '../utils/utils.js';
import { parse } from 'acorn';



export default class ProcessEventHandlers {
  constructor(customAST, jsAST) {
    this.customAST = customAST;
    this.jsAST = jsAST;
    this.idCache = new Map(); // Cache to store element IDs
    this.process();
  }

  process() {
    const walk = new Walker();
    const nodeType = 'Attribute';
    const returnType = { path: 'value[0].type' };
    const pathValue = 'MustacheAttribute';
    const matchLogic = walk.createMatchLogic(nodeType);

    const eventHandlers = walk.deepWalker(
      this.customAST,
      nodeType,
      matchLogic,
      returnType,
      pathValue
    );

    eventHandlers.forEach(attr => {
      const eventName = attr.node.name.name;
      const eventFunctionName = attr.node.value[0].name.name;

      // Get node locations
      const getNodeLocations = new GetNodePositions(this.customAST, attr.node);
      const nodeLocations = getNodeLocations.init();
      const parentNodeandIndex = nodeLocations[0];

      // Check if the element already has an ID in the cache
      const elementKey = `${parentNodeandIndex.parentNode.start}-${parentNodeandIndex.parentNode.end}`;
      let elementId = this.idCache.get(elementKey);

      if (!elementId) {
        // Generate a new ID and cache it
        elementId = _generateUniqueElementId();
        this.idCache.set(elementKey, elementId);

        // Add the ID to the AST
        this.addIdToAST(parentNodeandIndex.parentNode, elementId);
      }

      const eventListenerCodeBuilder = new EventHandlerProcessor(
        attr.node,
        eventName,
        eventFunctionName,
        pathValue,
        parentNodeandIndex,
        elementId // Pass the cached ID
      );

      const eventListenerCode= eventListenerCodeBuilder.process();
      const eventListenerAST = parse(eventListenerCode, { ecmaVersion: 'latest' });
      this.jsAST.body.push(...eventListenerAST.body);

      //console.log(this.jsAST);
      // noe remove the event handler node from the custom ast 

     // walk.findEventHandlerAndRemove(parentNodeandIndex.parentNode, eventFunctionName)


    });
  }

  addIdToAST(parentNode, elementId) {
    parentNode.attributes.unshift({
      start: 150,
      end: 164,
      type: "Attribute",
      name: "id",
      value: [{
        start: 154,
        end: 163,
        type: "Text",
        raw: elementId,
        data: elementId,
      }],
    });
  }




}