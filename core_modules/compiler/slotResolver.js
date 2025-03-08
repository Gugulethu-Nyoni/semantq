"use strict";
import fs from "fs";
import path from "path";

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
    
    this.buildComponentRegistry();
    //this.resolvedAst = this.resolveDefaultSlots(this.filePath);
    this.resolvedAst = this.resolveNamedSlots(this.filePath);
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
            componentPath = componentPath.replace("$global", "$components/global");
          }

          if (elementWalker(this.customAST, "name", componentName)) {
            this.componentsRegistry[componentName] = componentPath;
          }
        }
      },
    });
  }



resolveNamedSlots(filePath) {
  // Step 0: Prepare the parent component AST
  const parentComponentFileName = path.basename(filePath);
  const parentComponentKey = this.isPage
    ? "customAST"
    : parentComponentFileName.replace(".merged.ast", "").toLowerCase();

  const parentComponentAST = this.ast[parentComponentKey];
  const walk = new Walker();

  // Iterate over all components in the registry (in reverse order)
  for (const key of Object.keys(this.componentsRegistry).reverse()) {
    const childComponentKey = key.toLowerCase();
    const childComponentAstBlock = this.ast[childComponentKey];

    // Step 1: Get child component slot elements and their name attribute values
    const nodeType = 'Element';
    const nodeName = 'slot';
    const returnType = { path: 'attributes[0].value[0].raw' };
    const matchLogic = walk.createMatchLogic(nodeType, nodeName);

    const slotNodes = walk.deepWalker(
      childComponentAstBlock,
      nodeType,
      matchLogic,
      returnType
    );

    // Step 2: For each slot element, get corresponding elements in the parent
    slotNodes.forEach(slotBlock => {
      const pnodeType = 'Element';
      const preturnType = { path: 'attributes[0].value[0].raw' };
      const pathValue = slotBlock.value;
      const pmatchLogic = walk.createMatchLogic(pnodeType);

      const parentNodes = walk.deepWalker(
        parentComponentAST,
        pnodeType,
        pmatchLogic,
        preturnType,
        pathValue
      );

      // Initialize the nameSlotBlocks object if it doesn't exist
      if (!this.nameSlotBlocks[key]) {
        this.nameSlotBlocks[slotBlock.value] = [];
      }

      // Step 3: Set content for each parent node
      parentNodes.forEach(parentNodeBlock => {
        let contentToSet;
        if (parentNodeBlock.node.children && parentNodeBlock.node.children[0]?.length > 0) {
          contentToSet = parentNodeBlock.node.children[0];
        } else {
          contentToSet = slotBlock.node.children?.[0] || [];
        }

        this.nameSlotBlocks[slotBlock.value].push(contentToSet);
     

    // Merge all nested arrays under each key
    let mergedBlocks = {};
    for (const slotKey in this.nameSlotBlocks) {
      if (Object.hasOwnProperty.call(this.nameSlotBlocks, slotKey)) {
        mergedBlocks[slotKey] = this.nameSlotBlocks[slotKey].flat(Infinity);
      }
    }

    // Step 4: Replace the slot element nodes in the child AST
    for (const slotKey in mergedBlocks) {
      const nodeType = 'Element';
      const nodeName = 'slot';
      const returnType = { path: 'attributes[0].value[0].raw' };
      const pathValue = slotKey;
      const matchLogic = walk.createMatchLogic(nodeType, nodeName);

      const slotNodeBlock = walk.deepWalker(
        childComponentAstBlock,
        nodeType,
        matchLogic,
        returnType,
        pathValue
      );

      if (slotNodeBlock.length > 0) {
        const getNodeLocations = new GetNodePositions(childComponentAstBlock, slotNodeBlock[0].node);
        const nodeLocations = getNodeLocations.init();

        if (nodeLocations.length > 0) {
          // Replace the slot element in the child component parent node
          const parentNode = nodeLocations[0].parentNode;
          const nodeIndex = nodeLocations[0].nodeIndex;

          if (parentNode?.children?.[0]?.[nodeIndex]) {
            parentNode.children[0][nodeIndex] = mergedBlocks[slotKey];
          }
        }
      }
    }


    // now replace the component node in parent ast  
    /*

      const pnodeType = 'Element';
      const pnodeName = key;
      const returnType = { path: 'name' };
      const pmatchLogic = walk.createMatchLogic(pnodeType, pnodeName);

      const theParentNodeBlock = walk.deepWalker(
        parentComponentAST,
        pnodeType,
        pmatchLogic,
        returnType
      );

      if (theParentNodeBlock.length > 0) {
        const getParentNodeLocations = new GetNodePositions(parentComponentAST, theParentNodeBlock[0].node);
        const parentNodeLocations = getParentNodeLocations.init();

        if (parentNodeLocations.length > 0) {
          // Replace the slot element in the child component parent node
          const theParentNode = parentNodeLocations[0].parentNode;
          const theNodeIndex = parentNodeLocations[0].nodeIndex;

          if (theParentNode?.children?.[0]?.[theNodeIndex]) {
            theParentNode.children[0][theNodeIndex] = childComponentAstBlock;
          }
        }
      }

  */



/// CLOSE for parentNodes loop
    });
// close for child slot nodes loop  


    });

// child ast has been fully updated at this point 
    console.log(JSON.stringify(childComponentAstBlock,null,2));



  }
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
      const targetNode = walk.deepWalker(
        parentComponentAST,
        walk.createMatchLogic("Element", key),
        "Element"
      )[0]?.node;

      const targetNodeChildren = walk.findChildren(targetNode);
      const getSlotNode = walk.deepWalker(
        childComponentAstBlock,
        walk.createMatchLogic("Element", "slot"),
        "Element"
      )[0];

      if (getSlotNode) {
        const slotNode = getSlotNode.node;
        const slotFallBackChildren = walk.findChildren(slotNode);
        const contentToSet = targetNodeChildren?.[0]?.length > 0
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
        actualParentNode.children[0][actualTargetNodeIndex] = childComponentAstBlock;
      }

      delete this.ast[childComponentKey];
    }

    this.removeComponentImports();
    this.writeResolvedAstFile();
  }

  writeResolvedAstFile() {
    if (!this.ast || !this.filePath) throw new Error("AST data or filePath is missing");
    const resolvedFilePath = this.filePath.replace(/merged/, "resolved");
    const resolvedDir = path.dirname(resolvedFilePath);
    if (!fs.existsSync(resolvedDir)) fs.mkdirSync(resolvedDir, { recursive: true });
    fs.writeFileSync(resolvedFilePath, JSON.stringify(this.ast, null, 2), "utf8");
  }

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
