"use strict";


import escodegen from 'escodegen';
import { parse } from 'acorn';
import customHtmlParser from '../customHtmlParser.js';
import fs from 'fs-extra';
//import fs from 'fs';
import path from 'path';

import prettier from 'prettier';
import * as estraverse from "estraverse";
import Walker from './deeperWalker.js';
import GetNodePositions from '../utils/GetNodePositions.js';
import Transpiler from './transpiler.js'; 
import ProcessEventHandlers from './processEventHandlers.js';



/**
 * Main function to transform ASTs and write output to a file.
 * @param {Object} jsAST - The JavaScript AST.
 * @param {Object} cssCode - The CSS AST.
 * @param {Object} customSyntaxAST - The custom HTML AST.
 * @param {String} filePath - The path to the output file.
 */
export default async function transformASTs(jsAST, cssCode, customSyntaxAST, filePath) {
  const customSyntaxObject = customSyntaxAST[0];



  // Process mustache and event handler nodes
  if (customSyntaxObject) visitMustacheIdentifierNodes(customSyntaxObject);
  if (customSyntaxObject) visitEventHandlerNodes(customSyntaxObject,jsAST);

  // Initialize tracking variables
  let nodeStatus;
  let identifiersInFunctions;
  let activeBlock;
  let stackCount;
  const processedBlocks = new Set(); // Tracks processed blocks to avoid redundancy

  let transformedASTs;
  let reRendersObject = "";
  const uniqueCalls = new Set();

  // --------------------
  // Transform Reactive Nodes
  // --------------------
  nodeStatus = 1;
  if (customSyntaxObject && jsAST ) {
  stackCount = getActiveNodes(customSyntaxAST, customSyntaxObject, jsAST, nodeStatus, 2);


  for (let n = 0; n < stackCount; n++) {
    const reactiveNode = getActiveNodes(customSyntaxAST, customSyntaxObject, jsAST, nodeStatus);
    identifiersInFunctions = reactiveNode.identifiersInFunctions;
    activeBlock = reactiveNode.reactiveStack;
    
    const blockKey = JSON.stringify(activeBlock);
    if (!processedBlocks.has(blockKey)) {
      const transpilerReactive = new Transpiler(identifiersInFunctions, customSyntaxObject, jsAST, activeBlock, nodeStatus);
      transformedASTs = transpilerReactive.getTransformedASTs();
      processedBlocks.add(blockKey);
    }

    // Prepare reRender function calls
    identifiersInFunctions.forEach(obj => {
      Object.keys(obj).forEach(key => {
        const reRenderCall = `reRender${key.charAt(0).toUpperCase()}${key.slice(1)}();`;
        if (!uniqueCalls.has(reRenderCall)) {
          uniqueCalls.add(reRenderCall);
          reRendersObject += reRenderCall;
        }
      });
    });
  }

  // --------------------
  // Transform Static Nodes
  // --------------------
  nodeStatus = 0;
  stackCount = getActiveNodes(customSyntaxAST, customSyntaxObject, jsAST, nodeStatus, 1);

  for (let n = 0; n < stackCount; n++) {
    const staticNode = getActiveNodes(customSyntaxAST, customSyntaxObject, jsAST, nodeStatus);
    if (!staticNode) continue;

    identifiersInFunctions = Array.isArray(staticNode.identifiersInFunctions) ? staticNode.identifiersInFunctions : [];
    activeBlock = staticNode.staticStack;
    
    const blockKey = JSON.stringify(activeBlock);
    if (!processedBlocks.has(blockKey)) {
      const transpilerStatic = new Transpiler(identifiersInFunctions, customSyntaxObject, jsAST, activeBlock, nodeStatus);
      transformedASTs = transpilerStatic.getTransformedASTs();
      processedBlocks.add(blockKey);
    }
  }


}



  // --------------------
  // Generate final ASTs
  // --------------------
  let newJsAST = transformedASTs ? transformedASTs.transformedJsAST : jsAST;
  let newHTMLAST = transformedASTs ? transformedASTs.transformedCustomSyntaxAST : customSyntaxAST;
  let routeLayout = false; 
  let layoutJS = '';
  let imports = `import Router from '/core_modules/router/router.js';\n`;

      //console.log("NJST",JSON.stringify(newHTMLAST,null,2));


//console.log("NJST",newJsAST);

  // --------------------
  // Extract Function Names for Global Scope
  // --------------------
  /*
  if (jsAST) {
  const walk = new Walker();
  const nodeType = "FunctionDeclaration";
  const returnType = { path: "id.name" };
  const matchLogic = walk.createMatchLogic(nodeType);
  const functions = walk.deepWalker(newJsAST, nodeType, matchLogic, returnType);
}
*/

  //let appendtoJsScriptTag = `\n${reRendersObject}\n`;

function hoistImports(ast) {
  let importsAST = [];
  let jsCodeAST = [];

  // Separate import statements from other code
  ast.body.forEach(node => {
    if (node.type === "ImportDeclaration") {
      importsAST.push(node); // Collect import statements
    } else {
      jsCodeAST.push(node); // Collect the rest of the code
    }
  });

  // Return the imports and other code as separate objects
  return {
    importsAST,
    jsCodeAST,
  };
}

let jsCode ='';
//let imports;


// Validate newJsAST
if (newJsAST.body && newJsAST.body.length > 0) {
  //console.warn("Processing:", filePath);

  const { importsAST, jsCodeAST } = hoistImports(newJsAST);



  // Generate code from AST (only if AST is not empty)
  if (importsAST.length > 0) {
    try {
      imports += escodegen.generate({
        type: "Program",
        body: importsAST,
        sourceType: "module" // Ensure it's treated as a module
      });
    } catch (error) {
      console.error("Error generating imports:", error);
    }
  } else {
    //console.warn("No import statements found in:", filePath);
  }

    //console.log("LANA",JSON.stringify(jsCodeAST,null,2));


  if (jsCodeAST.length > 0) {
    try {
      jsCode = escodegen.generate({
        type: "Program",
        body: jsCodeAST
      });
    } catch (error) {
      console.error("Error generating JS code:", error);
    }

    //console.log("LANA",jsCode);


  } else {
    console.warn("No JavaScript code found in:", filePath);
  }
} else {
  console.error('Skipping', filePath);
}

//console.log("Imports:", imports);
//console.log("JS Code:", jsCode);
//return;





  async function processLayoutFile(filePath) {
  // Extract the target directory from the filePath
  const targetDir = path.dirname(filePath); // This will give the directory containing the file
  const routeDirName = path.basename(targetDir); // This will give the last directory name (e.g., "admin")

  //console.log(`Processing layout file in route directory: ${routeDirName}`);

  // Define the layout file paths
  const layoutResolvedPath = path.join(targetDir, '@layout.resolved.ast');
  const layoutSmqPath = path.join(targetDir, '@layout.smq.ast');

  let layoutFilePath;

  // Check if @layout.resolved.ast exists
  if (fs.existsSync(layoutResolvedPath)) {
    layoutFilePath = layoutResolvedPath;
  }
  // If not, check if @layout.smq.ast exists
  else if (fs.existsSync(layoutSmqPath)) {
    layoutFilePath = layoutSmqPath;
  } else {
    // No layout file found
   // console.log('No layout file found.');
    return;
  }

  //console.log(layoutFilePath);

  // Read the layout file content
  const layoutContent = fs.readFileSync(layoutFilePath, 'utf-8');
  const layoutAST = JSON.parse(layoutContent);

  //console.log("LAPHA", filePath, layoutAST);

// Extract header, main, and footer blocks from the layout AST
let layoutAstBlocks = {
  head: null,
  main: null,
  footer: null,
};

// Helper function to traverse the AST and extract blocks
function traverse(node) {
 // console.log("Current Node:", node);

  // If the node is an array, traverse each item in the array
  if (Array.isArray(node)) {
    node.forEach(child => traverse(child));
    return;
  }

  // If the node is an object, check its type and name
  if (node.type === 'Element') {
    if (node.name === 'head') {
      layoutAstBlocks.head = node;
    } else if (node.name === 'main') {
      layoutAstBlocks.main = node;
    } else if (node.name === 'footer') {
      layoutAstBlocks.footer = node;
    }
  }

  // Traverse nested children
  if (node.children) {
    node.children.forEach(child => traverse(child));
  }
}

// Start traversal from the root of the layout AST
let rootNode;
//console.log(filePath, layoutAST);

if (layoutAST.customAST) {
  //console.log("here",layoutAST);
  rootNode = layoutAST.customAST.content[0].html.children[0].children[0];
  traverse(rootNode);
}

//const rootNode = layoutAST.customAST.content[0].html.children[0].children[0];
//console.log("Extracted Blocks:", layoutAstBlocks);

  // Parse each block using customHtmlParser
  const layoutHtml = {
    head: layoutAstBlocks.head ? customHtmlParser(layoutAstBlocks.head) : '',
    main: layoutAstBlocks.main ? customHtmlParser(layoutAstBlocks.main) : '',
    footer: layoutAstBlocks.footer ? customHtmlParser(layoutAstBlocks.footer) : '',
  };

  // Append the layoutHtml object to the jsCode object
  /*
  const updatedJsCode = {
    ...jsCode,
    layoutHtml,
  };
  */

  return layoutHtml;
}




  function wrapCodeInInit(ast) {
  let imports = [];
  let otherCode = [];

  // Separate import statements from other code
  ast.body.forEach(node => {
    if (node.type === "ImportDeclaration") {
      imports.push(node);
    } else {
      otherCode.push(node);
    }
  });

  // Create the async init function
  const initFunction = {
    type: "FunctionDeclaration",
    id: { type: "Identifier", name: "init" },
    params: [],
    body: { type: "BlockStatement", body: otherCode },
    async: true, // Add the async keyword
  };

  // Create the export statement for the async init function
  const exportInit = {
    type: "ExportNamedDeclaration",
    declaration: initFunction,
    specifiers: [],
    source: null,
  };

  // Update the AST body to include imports and the async init function
  ast.body = [...imports, exportInit];
  return ast;
}




  if (!newJsAST.__wrapped) { // Ensure wrapCodeInInit is applied only once
  let reRendersAST;

  if (reRendersObject) {
    reRendersAST = parse(reRendersObject, { ecmaVersion: 2022, sourceType: "module" });

    // Append body of reRendersAST to newJsAST
    newJsAST.body.push(...reRendersAST.body);
  }



      /// so here check if layout file exists | either @layout.smq.ast or @layout.resolved.ast
    /// check for @layout.resolved.ast first - if not there get @layout.smq.ast if there
    /// read content of the file - in the file we want to get header and main and footer elements ast and keep these in an object e.g const layoutAstBlocks = {header: body: footer}, note that a layout file may have any of those blocks as each is optional - so we only get what's there 
    // then parse each block using: customHtmlParser(headerAST); customHtmlParser(bodyAST); customHtmlParser(footerAST); - if those ast blocks exist

    // final html outputs must be stored in a layoutHtml object and appended to to the top of jsCode object above  (jsCode = escodegen.generate(newJsAST); so we should add the layoutHtml object (with header, body, footer) sub blocks in such a way that they can extracted easily.  


  //const layoutHTML = processLayoutFile(filePath); 
  const layoutHTML = await processLayoutFile(filePath);
  //console.log("LAYOUT HTML",layoutHTML);

  let layoutAST; 
  
  if (layoutHTML) {

  routeLayout = true;

  const layoutAST = `const layoutBlocks = {
  head: \`${layoutHTML.head}\`,
  body: \`${layoutHTML.main}\`,
  footer: \`${layoutHTML.footer}\`
  };`;
}

  //console.log("const layoutHTML",layoutHTML);
  //console.log("const layoutAST",layoutAST);

/*
  // Parse the layoutAST string into an AST
    const parsedLayoutAST = parse(layoutAST, {
      ecmaVersion: 'latest',
      sourceType: 'module'
    });

  // get ast object of const 

  newJsAST.body.push(...parsedLayoutAST.body);

  */

//console.log("Updated",JSON.stringify(newJsAST,null,2));



  if (layoutHTML) {

const layoutRenderer = `

function layoutInit() {

const layoutBlocks = {
  head: \`${layoutHTML.head}\`,
  body: \`${layoutHTML.main}\`,
  footer: \`${layoutHTML.footer}\`
  };


  if (layoutBlocks) {

    // Step 1: Update <head> if header exists
    if (layoutBlocks.head) {
      updateHead(layoutBlocks.head);
    }

    // Step 2: Update <body> if body exists
    if (layoutBlocks.body) {
      updateBody(layoutBlocks.body);
    }

    // Step 3: Append <footer> to <body> if footer exists
    if (layoutBlocks.footer) {
      appendFooter(layoutBlocks.footer);
    }

  
// Utility function to load scripts and ensure they execute
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }


function updateHead(headerHTML) {
  const head = document.head;

  // Create a template for the new header content
  const template = document.createElement('template');
  template.innerHTML = headerHTML;

  // Preserve only Vite-injected scripts and modulepreload links
  const preservedElements = [];
  head.querySelectorAll("script, link[rel='modulepreload']").forEach(el => {
    if (
      (el.tagName === "SCRIPT" && el.type === "module") || 
      (el.tagName === "LINK" && el.rel === "modulepreload") ||
      el.src?.includes("/assets/router-") ||  
      el.href?.includes("/assets/modulepreload-polyfill")
    ) {
      preservedElements.push(el.outerHTML); 
    }
  });

  // Remove all existing head content
  while (head.firstChild) {
    head.removeChild(head.firstChild);
  }

  // Append new head content
  const newElements = template.content.cloneNode(true);
  head.appendChild(newElements);

  // Re-add preserved Vite scripts
  preservedElements.forEach(scriptHTML => {
    const temp = document.createElement("template");
    temp.innerHTML = scriptHTML;
    head.appendChild(temp.content.firstChild);
  });

  console.log("Updated head with layout content while preserving Vite scripts.");
}



function updateBody(bodyHTML) {
  const body = document.body;

  // Create a template for the body content
  const template = document.createElement('template');
  template.innerHTML = bodyHTML;

  // Replace the body content with the cloned template
  body.innerHTML = ''; // Clear existing content
  body.appendChild(template.content.cloneNode(true));
}

function appendFooter(footerHTML) {
  const body = document.body;

  // Create a template for the footer content
  const template = document.createElement('template');
  template.innerHTML = footerHTML;

  // Append the cloned template content to the body
  body.appendChild(template.content.cloneNode(true));
}

}

}

// initiate it 
layoutInit(); 

`; 


layoutJS = layoutRenderer;

/*

    // Parse the layoutAST string into an AST
    const layoutRendererAST = parse(layoutRenderer, {
      ecmaVersion: 'latest',
      sourceType: 'module'
    });

  // get ast object of const 

  newJsAST.body.push(...layoutRendererAST.body);
*/

  const targetDir = path.dirname(filePath); // This will give the directory containing the file
  const routeDirName = path.basename(targetDir); // This will give the last directory name (e.g., "admin")


  const newFileName = path.join(targetDir, '@layout.js'); // Saves in the same directory as the page.js file

// Write the layoutRenderer content into the new file
fs.writeFile(newFileName, layoutRenderer, (err) => {
  if (err) {
    console.error('Error writing layout file:', err);
  } else {
   // console.log(`Layout JS file written successfully to ${newFileName}`);
  }
});

  


};



  //newJsAST = wrapCodeInInit(newJsAST);
  //newJsAST.__wrapped = true; // Mark as wrapped
}


  //const jsCode = escodegen.generate(newJsAST);
//const jsCode = prettier.format(newJsAST, {  parser: "babel", });






//return; 

/*
if (newJsAST && newJsAST.body && newJsAST.body.length > 0) {

    console.log(filePath,newJsAST);

  const { importsAST, jsCodeAST } = hoistImports(newJsAST);

 // console.log(filePath,importsAST);

  // Generate code from AST
  jsCode = escodegen.generate(jsCodeAST);
  imports = escodegen.generate(importsAST);
}

*/

//console.log(JSON.stringify(newJsAST,null,2));



//const jsCode = generate.default(newJsAST).code;
//console.log(jsCode);

//console.log("AST",JSON.stringify(newHTMLAST,null,2));
let newHTMLASTFormatted; 

    if(!Array.isArray(newHTMLAST))  {
    newHTMLASTFormatted = [newHTMLAST]; 

    } else {

    newHTMLASTFormatted = newHTMLAST; 


    }


  const parsedHTML = customHtmlParser(newHTMLASTFormatted);


  //console.log("HTML",JSON.stringify(parsedHTML,null,2));


    await writeCodeToFile(jsCode, cssCode, parsedHTML);

  // --------------------
  // Write Transformed Code to File
  // --------------------
  async function writeCodeToFile(jsCode, cssCode, parsedHTML) {
  const routeName = filePath.split("/").slice(-2, -1)[0];
  const jsFileName = `${routeName}.js`;
  const jsFilePath = filePath.replace(/\@page\.(resolved|smq)\.ast$/, jsFileName);

  const cssFileName = `${routeName}.css`;
  const cssFilePath = filePath.replace(/\@page\.(resolved|smq)\.ast$/, cssFileName);

  // Ensure parsedHTML is a string (even if empty)
  parsedHTML = parsedHTML || "";

    //console.log("CHK",jsCode);


  jsCode = jsCode + `\nconsole.log(Router);`;


  //console.log(routeLayout);
  /*
   if (imports) {
    imports = `import Router from '/build/semantq/router.js';\n` + imports; 
   } else {

    imports = `import Router from '/build/semantq/router.js';\n`; 


   }
*/
  



  




  // Add <script> tag to HTML if jsCode exists
  if (jsCode) {
    parsedHTML += `\n<script src="./${jsFileName}" type="module" defer></script>`;
  }

  // Add CSS import to jsCode if both jsCode and cssCode exist
  if (cssCode && jsCode) {
    imports = `${imports} \n import './${cssFileName}';`;
  }

  // Add <link> tag to HTML if cssCode exists but jsCode does not
  if (cssCode && !jsCode) {
    parsedHTML = `<link rel="stylesheet" href="./${cssFileName}">\n${parsedHTML}`;
  }


  // insert JS Dummy Consoles 
  //console.log("HERE",jsCode);
  


/*
  if (routeLayout) {
  jsCode = jsCode + `\nconsole.log(layoutInit);`;
  }
*/
  // 
let updatedJsCode;


  if (routeLayout) {

updatedJsCode = `
${imports}

async function layoutJS() {
  console.log("Layout script started");

  ${layoutJS}
}

async function pageJS() {
  
  ${jsCode}
}

async function main() {
  try {
    await new Promise((resolve) => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
      } else {
        resolve();
      }
    });

    console.log("DOM is ready");

    await layoutJS();

    await pageJS();
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main();`

} else {

updatedJsCode = `
${imports}
async function pageJS() {
  ${jsCode}
}

async function main() {
  try {
    await new Promise((resolve) => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
      } else {
        resolve();
      }
    });

    console.log("DOM is ready");

    await pageJS();
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main();`

}


  // Format jsCode if it exists
  let formattedJsCode = "";
  if (updatedJsCode) {
    try {
      formattedJsCode = await prettier.format(updatedJsCode, { parser: "babel" });
    } catch (err) {
      console.error("Error formatting JS code:", err);
    }
  }

//console.log(updatedJsCode);


const config = await import('../../../semantq.config.js');
const brand = config.default.brand;
const pageTitle = config.default.pageTitle;
const metaDescription = config.default.metaDescription;


  parsedHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> ${pageTitle} </title>
    <meta name="description" content="${metaDescription}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="${brand}">
</head>
<body>

${parsedHTML}
</body>
</html>`; 

  // Format parsedHTML if it exists
  let formattedHTML = "";
  if (parsedHTML) {
    try {
      formattedHTML = await prettier.format(parsedHTML, { parser: "html" });
    } catch (err) {
      console.error("Error formatting HTML:", err);
    }
  }

  // Write JS file if jsCode exists
  if (formattedJsCode) {
    try {
      await fs.promises.writeFile(jsFilePath, formattedJsCode);
      //console.log(`JS file written: ${jsFilePath}`);
    } catch (err) {
      console.error("Error writing JS file:", err);
    }
  }

  // Write CSS file if cssCode exists
  if (cssCode) {
    try {
      await fs.promises.writeFile(cssFilePath, cssCode);
      //console.log(`CSS file written: ${cssFilePath}`);
    } catch (err) {
      console.error("Error writing CSS file:", err);
    }
  }

  // Write HTML file if parsedHTML exists
  if (parsedHTML) {
    const newFilePath = filePath.replace(/\@page\.(resolved|smq)\.ast$/, "index.html");
    try {
      await fs.promises.unlink(newFilePath).catch((err) => {
        if (err.code !== "ENOENT") console.error("Error deleting old HTML file:", err);
      });
      await fs.promises.writeFile(newFilePath, formattedHTML);
      //console.log(`HTML file written: ${newFilePath}`);
    } catch (err) {
      console.error("Error writing HTML file:", err);
    }
  }
}



}
