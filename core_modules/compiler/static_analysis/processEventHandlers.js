import EventHandlerProcessor from './transformEventHandlers.js';


export default class ProcessEventHandlers {       

constructor (customAST, jsAST) {
this.customAST=customAST;
this.jsAST=jsAST;
this.process();

}



         process () {
          
            let eventHandlerNode;
            let enodeType = 'EventHandler';
            let ereturnType = { path:'name' };
            //let ereturnType = { path: 'value[0].name.name' };
            //let pathValue = this.eventFunction;
            let ematchLogic = walk.createMatchLogic(enodeType);
            eventHandlerNode = walk.deepWalker(block.parentNode, enodeType, ematchLogic, ereturnType);


            //console.log("BLOCK",JSON.stringify(block.parentNode,null,2));

            // Now we need to get event handler function 

            let eventFunctionNode;
            let fnodeType = 'MustacheAttribute';
            let freturnType = { path:'name.name' };
            let fmatchLogic = walk.createMatchLogic(fnodeType);
            eventFunctionNode = walk.deepWalker(block.parentNode, fnodeType, fmatchLogic, freturnType);

            //console.log("SECOND",JSON.stringify(eventFunctionNode,null,2));

            let eventListenerCode =''; 


            //console.log(identifier,JSON.stringify(eventHandlerNode,null,2));


            if (eventHandlerNode.length > 0 && eventFunctionNode.length > 0) {

             //console.log("Calling it ...",);
             //console.log("SEE",JSON.stringify(eventFunctionNode,null,2));

              const eventName = eventHandlerNode[0].value; // e.g. onclick
              const eventFunction = eventFunctionNode[0].value; // e.g. incrementer()

              //console.log("THERE",eventFunction);


              //console.log("SEE",JSON.stringify(eventFunction,null,2));


            const eventListenerCodeBuilder = new EventHandlerProcessor(block.parentNode, eventName, eventFunction, "MustacheAttribute", this.customSyntaxAST);
            eventListenerCode = eventListenerCodeBuilder.process();


            }

           //console.log("ELC",JSON.stringify(eventListenerCode,null,2));

}



}