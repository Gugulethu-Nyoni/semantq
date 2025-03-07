import EventHandlerProcessor from './transformEventHandlers.js';
import GetNodePositions from '../utils/GetNodePositions.js';
import Walker from './deeperWalker.js';



export default class ProcessEventHandlers {       

constructor (customAST, jsAST) {
this.customAST=customAST;
this.jsAST=jsAST;
this.process();

}



         process () {

            //console.log(this.customAST, this.jsAST)

            const walk = new Walker();


          
            let eventHandlers;
            let nodeType = 'Attribute';
            let returnType = { path:'value[0].type' };
            let pathValue = 'MustacheAttribute';
            let matchLogic = walk.createMatchLogic(nodeType);
            eventHandlers = walk.deepWalker(this.customAST, nodeType, matchLogic, returnType,pathValue);

            //console.log(JSON.stringify(eventHandlers,null,2));

            eventHandlers.forEach(attr => {

                const eventName = attr.node.name.name;
                const eventFunctionName = attr.node.value[0].name.name;

                // get node locations

                const getNodeLocations = new GetNodePositions(this.customAST, attr.node);
                const nodeLocations = getNodeLocations.init();

                console.log(nodeLocations);




           // const eventListenerCodeBuilder = new EventHandlerProcessor(attr.node, eventName, eventFunctionName, pathValue, this.customAST);
           // eventListenerCode = eventListenerCodeBuilder.process();


            //console.log(eventListenerCode);




            }); 

            
            
}



}