"use strict";
import fs from 'fs';
import path from 'path';
import elementWalker from './utils/elementWalker.js';


class TransformTextNodes {
  constructor (subRootNodeChildren)
  {
    this.subRootNodeChildren = subRootNodeChildren; 
    this.transformTextNodes();

  }
  transformTextNodes() {
    if (!this.subRootNodeChildren || !this.subRootNodeChildren.children || !Array.isArray(this.subRootNodeChildren.children[0])) {
      return;
    }

    for (let i = 0; i < this.subRootNodeChildren.children[0].length; i++) {
      const node = this.subRootNodeChildren.children[0][i];
      const newLines = '\n\n\n\n';
      const whiteSpaces = ' ';

      if (node.type === 'Text' && node.raw !== newLines && node.raw !== whiteSpaces) {
        this.subRootNodeChildren.children[0][i] = this.createTextNode(node);
        return this.subRootNodeChildren; 
      }
    }
  }



  createTextNode(node) {
    return {
      start: node.start,
      end: node.end,
      type: "Element",
      name: "span",
      attributes: [],
      children: [
        {
          start: node.start,
          end: node.end,
          type: "Text",
          raw: node.raw,
          data: node.data
        }
      ]
    };
  }
}


/// loop through files 
// for each files 


// Helper function: Recursively find all `.ast` files
function findAstFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(findAstFiles(fullPath)); // Recursive call for subdirectories
    } else if (item.endsWith('.ast')) {
      files.push(fullPath);

    }
  });

  return files;
}

// Helper function: Read and parse AST file
function readAstFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading or parsing file ${filePath}:`, error);
    return null;
  }
}

// Helper function: Write updated AST back to file
function writeAstFile(filePath, ast) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(ast, null, 2));
    console.log(`Successfully updated file: ${filePath}`);
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
  }
}

// Helper function: Determine if the file is a page or component
function getFileMetadata(fileName) {
  const baseName = fileName.replace('.smq.ast', '');
  const isPage = baseName === '+page';
  const isComponent = !isPage;
  const componentName = isComponent ? baseName : null;
  const htmlAstKey = isPage ? 'customAST' : componentName.toLowerCase();

  return { isPage, isComponent, componentName, htmlAstKey };
}

// Main function: Regularise AST files
function regularise(files) {
  files.forEach(file => {
    const fileName = path.basename(file);
    const { isPage, isComponent, componentName, htmlAstKey } = getFileMetadata(fileName);

    // Read the AST file
    const astBlocks = readAstFile(file);
    if (!astBlocks) return; // Skip if file reading failed

    // Get the target AST block
    const ast = astBlocks[htmlAstKey];
    //console.log(JSON.stringify(ast,null,2));
    

    if (!ast) {
      console.error(`No AST block found for key: ${htmlAstKey} in file: ${file}`);
      return;
    }

    // Perform transformations
    const targetNode = elementWalker(ast, 'name', 'customSyntax');
    //console.log("HERE",targetNode);
    if (!targetNode) {
      console.error(`Target node not found in file: ${file}`);
      return;
    }

    const transformTextNodes = new TransformTextNodes(targetNode);
    //console.log("Compiler Text Fixer:", JSON.stringify(transformTextNodes, null, 2));

    // Update the AST with the transformed node
    // Assuming `transformTextNodes` modifies `targetNode` in place
    astBlocks[htmlAstKey] = ast;

    // Write the updated AST back to the file
    writeAstFile(file, astBlocks);
  });
}

// Entry point
export function init(destDir) {
  const files = findAstFiles(destDir);
  regularise(files);
}