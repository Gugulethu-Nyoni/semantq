"use strict";
import fs from "fs";
import path from "path";
import config from '../../semantq.config.js';


import { walk } from "estree-walker";
import { traverse } from "estraverse";

import GetNodePositions from "./utils/getNodePositions.js";
import elementWalker from "./utils/elementWalker.js";
import Walker from "./static_analysis/deeperWalker.js";

class SlotResolver {
  constructor(ast, filePath) {
    this.filePath = filePath;
    this.ast = ast;
    this.componentName = "";

    //
    const { components, globalComponents } = config;
    const actualComponentsPath = components['$components'];
    const actualGlobalComponentsPath = globalComponents['$global'];

    
    const fileName = path.basename(filePath, ".merged.ast");
    this.isPage = fileName.startsWith("+page");
    this.isComponent = !this.isPage;
    
    if (!this.isPage) this.componentName = fileName;
    
    this.jsASTKey = "jsAST";
    this.cssASTKey = "cssAST";
    this.htmlKey = this.isPage ? "customAST" : this.componentName.toLowerCase();
    
    this.jsAST = ast[this.jsASTKey] || { type: "JavaScript", content: { body: [] } };
    this.cssAST = ast[this.cssASTKey] || { type: "CSS", content: {} };
    this.customAST = this.ast[this.htmlKey] || { type: "Custom", content: [] };
    
    this.componentsRegistry = {};
    this.childrenSlotsRegistry = {};
    this.nameSlotBlocks={};
    this.mergedBlocks = {};
    this.finalAst='';
    
    this.buildComponentRegistry();
    this.resolvedAst = this.resolveNamedSlots(this.filePath);
    this.finalResolvedAst = this.resolveDefaultSlots(this.filePath);

    //
    this.removeComponentImports();
    // console.log(JSON.stringify(this.ast['jsAST'],null,2));
    this.writeResolvedAstFile();




  }

  getJSContent() {
    return this.jsAST.content.body || [];
  }

  buildComponentRegistry() {
    const jsContent = this.getJSContent();

    walk(jsContent, {
      enter: ({ type, source, specifiers }) => {
        if (type === "ImportDeclaration" && source.value.includes("$")) {
          const componentName = specifiers[0].local.name;
          let componentPath = source.value;

          if (componentPath.includes("$global")) {
            componentPath = componentPath.replace("$global", this.actualGlobalComponentsPath);
          }

          if (componentPath.includes("$components")) {
            componentPath = componentPath.replace("$components", this.actualComponentsPath);
          }

          if (elementWalker(this.customAST, "name", componentName)) {
            this.componentsRegistry[componentName] = componentPath;
          }
        }
      },
    });
  }






resolveNamedSlots(filePath) {
  const parentComponentFileName = path.basename(filePath);
  const parentComponentKey = this.isPage
    ? "customAST"
    : parentComponentFileName.replace(".merged.ast", "").toLowerCase();

  const parentComponentAST = this.ast[parentComponentKey];
  const walk = new Walker();
  let childComponentAstBlock; 
  const deepClone = (obj) => structuredClone(obj);


  // Initialize nameSlotBlocks once, outside the loop
  this.nameSlotBlocks = {};
  //let componentRegistryKey; 

  for (const key of Object.keys(this.componentsRegistry).reverse()) {
    const componentRegistryKey = key;
    const childComponentKey = key.toLowerCase();
    childComponentAstBlock = this.ast[childComponentKey];

    //console.log(key);

    const parentInstances = walk.deepWalker(
      parentComponentAST,
      "Element",
      walk.createMatchLogic("Element", key),
      { path: "name" }
    );


       // console.log(parentInstances);


    parentInstances.forEach((parentInstance) => {

     // for (const parentInstance in parentInstances[0]) {

      //console.log(parentInstance);


      //console.log("PI",parentInstance.node);
      
      //const parentInstanceImportAst = this.ast[parentInstance.value.toLowerCase()];

      //console.log(parentInstance.value.toLowerCase(),parentInstanceImportAst[0].html);


      const nodeType = "Attribute";
      const nodeName = "name"; 
      const returnType = { path: "value[0].raw" };
      const matchLogic = walk.createMatchLogic(nodeType,nodeName);

      const namedSlotNodesInComponent = walk.deepWalker(
        childComponentAstBlock,
        nodeType,
        matchLogic,
        returnType
      );

      //console.log(childComponentKey,namedSlotNodesInComponent);

      if (namedSlotNodesInComponent.length === 0) return; 


      // get this.ast[parentInstance.value.strTolower()];  
      // get nodes with slot attributes
      // if zero -- skip this parent instance 

      let parentNode = parentInstance.node;
      const idAttributeBlock = walk.ensureIdAttribute(parentNode.attributes);
      parentNode.attributes = idAttributeBlock.attributes;
      const parentNodeId = idAttributeBlock.id;
      const parentNodeKey = `${key}_${parentNodeId}`;

      //console.log(parentNodeKey);

      const slotNodes = walk.deepWalker(
        childComponentAstBlock,
        "Element",
        walk.createMatchLogic("Element", "slot"),
        { path: "attributes[0].value[0].raw" }
      );

      //slotNodes.forEach((slotBlock) => {
      for (const slotBlock of slotNodes) {
        const childSlotName = slotBlock.value;
        if (!childSlotName) continue;

        if (!this.nameSlotBlocks[parentNodeKey]) {
          this.nameSlotBlocks[parentNodeKey] = {};
        }

        //console.log(slotNodes);

        const parentSlotNodes = walk.deepWalker(
          parentNode,
          "Element",
          walk.createMatchLogic("Element"),
          { path: "attributes[0].value[0].raw" },
          childSlotName
        );

        //console.log(parentSlotNodes);

        parentSlotNodes.forEach((parentSlotNode) => {
          const contentToSet = parentSlotNode.node ?? slotBlock.node.children?.[0]?.[0] ?? [];

          if (!this.nameSlotBlocks[parentNodeKey][childSlotName]) {
            this.nameSlotBlocks[parentNodeKey][childSlotName] = [];
          }

          this.nameSlotBlocks[parentNodeKey][childSlotName].push(contentToSet);
        });
      };
    });
  }

  //console.log(this.nameSlotBlocks);

  // Merge slot content
  this.mergedBlocks = {};
  for (const slotKey in this.nameSlotBlocks) {
    if (Object.prototype.hasOwnProperty.call(this.nameSlotBlocks, slotKey)) {
      this.mergedBlocks[slotKey] = {};

      for (const childSlotName in this.nameSlotBlocks[slotKey]) {
        if (Object.prototype.hasOwnProperty.call(this.nameSlotBlocks[slotKey], childSlotName)) {
          this.mergedBlocks[slotKey][childSlotName] = this.nameSlotBlocks[slotKey][childSlotName].flat(Infinity);
        }
      }
    }
  }

  //console.log(this.mergedBlocks);
  let processedChildAstClone;
  let processedChildAstBlocks = [];
  let componentInstancekeys = [];

  for (const componentInstancekey in this.mergedBlocks) {
    const newNodes = this.mergedBlocks[componentInstancekey];
    //console.log(componentInstancekey,newNodes);

    const childASTClone = deepClone(childComponentAstBlock);


    //console.log("newNodes",newNodes);


    processedChildAstClone = this.processNamedSlots(newNodes, childASTClone);

    //console.log(JSON.stringify(processedChildAstClone,null,2)); 

    // Store the processed AST using componentInstancekey as the key
processedChildAstBlocks.push({ [componentInstancekey]: processedChildAstClone });
componentInstancekeys.push(componentInstancekey);
  

  }


 //console.log(JSON.stringify(processedChildAstClone,null,2));

 //console.log(JSON.stringify(processedChildAstBlocks,null,2));
 //console.log(componentInstancekeys);

 // great now let's replace the parent nodes in 

 componentInstancekeys.forEach((key) => {
  const chunks = key.split("_");
  const parentElemId = chunks[1];
  const parentElemName = chunks[0];
  //console.log(parentElemName);

  // Find the object that contains the key
  const newNode = processedChildAstBlocks.find((obj) => obj[key])?.[key];
  //console.log(newNode);


  // LET'S DO THIS 
 // get the element node with this parentElemId in the parent ast 

      const nodeType = 'Element';
      const nodeName = parentElemName;
      const returnType = { path: 'attributes[0].value[0].raw' };
      const pathValue = parentElemId;
      const matchLogic = walk.createMatchLogic(nodeType, nodeName);

      const parentSlotBlock = walk.deepWalker(
        parentComponentAST,
        nodeType,
        matchLogic,
        returnType,
        pathValue
      );


      //console.log(parentSlotBlock);

      const getNodeLocations = new GetNodePositions(parentComponentAST, parentSlotBlock[0].node);
      const nodeLocations = getNodeLocations.init();
      //console.log(nodeLocations);


      const slotParentNode = nodeLocations[0]?.parentNode;
        const slotNodeIndex = nodeLocations[0]?.nodeIndex;

        if (slotParentNode?.children?.[0]?.[slotNodeIndex]) {
          slotParentNode.children[0][slotNodeIndex] = newNode;
        }
      

       //console.log(this.componentsRegistry);

    //this.removeComponentImports(componentRegistryKey);


});




//console.log(JSON.stringify(parentComponentAST,null,2));

//console.log(JSON.stringify(this.ast[parentComponentKey],null,2));

}





processNamedSlots(newNodes, childAST) {
  const walk = new Walker(); // Utility for cloning child AST
  const deepClone = (obj) => structuredClone(obj); // Deep cloning utility
  const childAstClone = deepClone(childAST); // Clone the child AST to avoid mutating the original

  // Recursive function to traverse and replace slot nodes
  const traverseAndReplaceSlots = (node, parent, key) => {
    if (!node || typeof node !== 'object') return; // Skip invalid nodes

    // Check if the current node is a slot
    if (
      node.type === 'Element' &&
      node.name === 'slot' &&
      node.attributes?.some((attr) => attr.name === 'name')
    ) {
      const slotName = node.attributes.find((attr) => attr.name === 'name').value[0].data;

      // Replace the slot node with new content if it exists
      if (newNodes[slotName]) {
        const updatedNode = deepClone(newNodes[slotName]).map((node) => {
          if (node.attributes?.length) {
            node.attributes = node.attributes.filter((attr) => attr.name !== 'slot'); // Remove `slot` attribute
          }
          return node; // Return the updated node
        });

        parent[key] = updatedNode; // Replace the slot node with the updated content
      }
    }

    // Recursively traverse the AST
    if (Array.isArray(node.children)) {
      node.children.forEach((child, index) => traverseAndReplaceSlots(child, node.children, index));
    } else if (typeof node === 'object') {
      Object.keys(node).forEach((key) => {
        if (Object.hasOwnProperty.call(node, key)) {
          traverseAndReplaceSlots(node[key], node, key);
        }
      });
    }
  };

  traverseAndReplaceSlots(childAstClone, null, null); // Start traversal from the root
  return childAstClone; // Return the resolved child AST
}



/*

    // Step 1: Find the target node in the parent AST (the component instance)
    const targetNode = walk.deepWalker(
      parentComponentAST,
      walk.createMatchLogic("Element", key),
      "Element"
    )[0]?.node;

    if (!targetNode) continue; // Skip if the component instance is not found

    // Step 2: Find all named slots in the child component
    const slotNodes = walk.deepWalker(
      childComponentAstBlock,
      walk.createMatchLogic("Element", "slot"),
      "Element"
    );

    // Process each named slot in the child component
    for (const slotNode of slotNodes) {
      const slotName = slotNode.node.attributes?.find(attr => attr.name === "name")?.value;

      if (!slotName) continue; // Skip if the slot doesn't have a name (default slot)

      // Step 3: Find all parent elements with a matching slot attribute
      const parentSlotElements = walk.deepWalker(
        targetNode,
        walk.createMatchLogic("Element", null, { slot: slotName }),
        "Element"
      );

      // Step 3a: Get fallback content from the child slot
      const slotFallBackChildren = walk.findChildren(slotNode.node);

      // Resolve the content for the named slot
      const contentToSet = parentSlotElements.length > 0
        ? parentSlotElements.map(element => element.node) // Use all matching parent elements
        : slotFallBackChildren?.[0]; // Use fallback content if no parent content is found

      // Step 3c: Replace the child slot with the resolved content
      const slotNodeLocations = new GetNodePositions(childComponentAstBlock, slotNode.node).init();
      const parentNode = slotNodeLocations[0]?.parentNode;
      const targetNodeIndex = slotNodeLocations[0]?.nodeIndex;

      if (parentNode?.children?.[0]?.[targetNodeIndex]) {
        parentNode.children[0][targetNodeIndex] = contentToSet;
      }

      // Step 3b: Remove the `slot` attribute from the parent elements
      parentSlotElements.forEach(element => {
        if (element.node && typeof element.node === "object" && !Array.isArray(element.node)) {
          if (!element.node.attributes) {
            element.node.attributes = [];
          }
          element.node.attributes = element.node.attributes.filter(attr => attr.name !== "slot");
        } else {
          //console.warn("Unexpected node type:", element.node);
        }
      });
    }

    // Step 3d: Replace the component instance in the parent AST with the resolved child AST
    const parentNodeLocations = new GetNodePositions(parentComponentAST, targetNode).init();
    const actualParentNode = parentNodeLocations[0]?.parentNode;
    const actualTargetNodeIndex = parentNodeLocations[0]?.nodeIndex;

    if (actualParentNode?.children?.[0]?.[actualTargetNodeIndex]) {
      actualParentNode.children[0][actualTargetNodeIndex] = childComponentAstBlock;
    }

    // Clean up the resolved child component from the AST registry
    delete this.ast[childComponentKey];
  }

  // Final cleanup and file writing
  this.removeComponentImports();
  this.writeResolvedAstFile();
}

*/




  resolveDefaultSlots(filePath) {
    const parentComponentFileName = path.basename(filePath);
    const parentComponentKey = this.isPage
      ? "customAST"
      : parentComponentFileName.replace(".merged.ast", "").toLowerCase();

    const parentComponentAST = this.ast[parentComponentKey];
    const walk = new Walker();

    for (const key of Object.keys(this.componentsRegistry).reverse()) {
      const childComponentKey = key.toLowerCase();
      const childComponentAstBlock = this.ast[childComponentKey];




      //const nodeType = "Element";
            //console.log(typeof walk.createMatchLogic(nodeType, key));

      let nodeType = "Element";
      let nodeName = key; // e.g. Card
      let matchLogic = walk.createMatchLogic(nodeType, nodeName);
      let returnType = { path: "name" };
      // Call deepWalker with the correct arguments
      const getTargetNode = walk.deepWalker(
        parentComponentAST, 
        nodeType,  
        matchLogic,         
        returnType         
      );

      //console.log(getTargetNode);

      if (getTargetNode.length === 0) continue; // skip this one
      const targetNode = getTargetNode[0].node;
      const targetNodeChildren = walk.findChildren(targetNode);
       nodeType = "Element";
       nodeName = "slot"; 
       matchLogic = walk.createMatchLogic(nodeType, nodeName);
       returnType = { path: "name" };

      // Call deepWalker with the correct arguments
      const getSlotNode = walk.deepWalker(
        childComponentAstBlock,
        nodeType,              
        matchLogic,            
        returnType             
      );

      //console.log("HERE",getSlotNode);
      //return;

      let contentToSet = '';

      if (getSlotNode.length !== 0) {

        const slotNode = getSlotNode[0].node;
        const slotFallBackChildren = walk.findChildren(slotNode);
        contentToSet = targetNodeChildren?.[0]?.length > 0
          ? targetNodeChildren[0][0]
          : slotFallBackChildren?.[0]?.[0];

        

        const slotNodeLocations = new GetNodePositions(childComponentAstBlock, slotNode).init();
        const parentNode = slotNodeLocations[0]?.parentNode;
        const targetNodeIndex = slotNodeLocations[0]?.nodeIndex;

        if (parentNode?.children?.[0]?.[targetNodeIndex]) {
          parentNode.children[0][targetNodeIndex] = contentToSet;
        }  


      }
      

      const parentNodeLocations = new GetNodePositions(parentComponentAST, targetNode).init();
      const actualParentNode = parentNodeLocations[0]?.parentNode;
      const actualTargetNodeIndex = parentNodeLocations[0]?.nodeIndex;

      if (actualParentNode?.children?.[0]?.[actualTargetNodeIndex]) {
        //console.log("Ngena???");
        actualParentNode.children[0][actualTargetNodeIndex] = childComponentAstBlock;
        //console.log(JSON.stringify(actualParentNode,null,2));
      }


      delete this.ast[childComponentKey];

            //console.log("HERE JS",JSON.stringify(this.ast['jsAST'],null,2));

    }

    //this.writeResolvedAstFile();
  }

  writeResolvedAstFile(parentComponentKey) {
    if (!this.ast || !this.filePath) throw new Error("AST data or filePath is missing");
    const resolvedFilePath = this.filePath.replace(/merged/, "resolved");
    const resolvedDir = path.dirname(resolvedFilePath);
    if (!fs.existsSync(resolvedDir)) fs.mkdirSync(resolvedDir, { recursive: true });

    //console.log("HERE JS",JSON.stringify(this.ast['jsAST'],null,2));

    fs.writeFileSync(resolvedFilePath, JSON.stringify(this.ast, null, 2), "utf8");
  }

/*
  removeComponentImports() {
    for (const componentName in this.componentsRegistry) {
      walk(this.ast["jsAST"], {
        enter: (node, parent) => {
          if (node.type === "ImportDeclaration") {
            node.specifiers.forEach((specifier) => {
              if (
                specifier.type === "ImportDefaultSpecifier" &&
                specifier.local.name === componentName
              ) {
                if (parent && Array.isArray(parent.body)) {
                  parent.body = parent.body.filter((n) => n !== node);
                }
                return false;
              }
            });
          }
        },
      });
    }
  }

*/

removeComponentImports() {
    for (const componentName in this.componentsRegistry) {
      walk(this.ast["jsAST"], {
        enter: (node, parent) => {
          if (node.type === "ImportDeclaration") {
            node.specifiers.forEach((specifier) => {
              if (
                specifier.type === "ImportDefaultSpecifier" &&
                specifier.local.name === componentName
              ) {


                if (parent && Array.isArray(parent.body)) {
                  parent.body = parent.body.filter((n) => n !== node);

                }


                return false;
              }
            });
          }
        },
      });
    }


  }


}

// Helper function: Recursively find all `.merged.ast` files
function findMergedAstFiles(dir) {
    const targetFileName = '+page.merged.ast';
    let files = [];
    
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            files = files.concat(findMergedAstFiles(fullPath)); // Recursive call for subdirectories
        } else if (file ===  targetFileName) {
            files.push(fullPath);
        }
    });
    
    return files;
}

// Loop through given directory - get all `.merged.ast` files and process them with SlotResolver
export async function processMergedFiles(destDir) {
    const files = findMergedAstFiles(destDir);
    
    for (const filePath of files) {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const ast = JSON.parse(fileContent);
            
            // Resolve AST
            const resolvedAst = new SlotResolver(ast, filePath);
            
        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
        }
    }
}
