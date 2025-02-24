"use strict";
import fs from 'fs/promises'; // Use fs.promises for async file operations
import path from 'path';
import elementWalker from './utils/elementWalker.js';

class TransformTextNodes {
  constructor(subRootNodeChildren) {
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

// Helper function: Recursively find all `.ast` files
async function findAstFiles(dir) {
  let files = [];
  const items = await fs.readdir(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = await fs.stat(fullPath);

    if (stats.isDirectory()) {
      const subDirFiles = await findAstFiles(fullPath); // Recursive call for subdirectories
      files = files.concat(subDirFiles);
    } else if (item.endsWith('.ast')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Helper function: Read and parse AST file
async function readAstFile(filePath) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading or parsing file ${filePath}:`, error);
    return null;
  }
}

// Helper function: Write updated AST back to file
async function writeAstFile(filePath, ast) {
  try {
    await fs.writeFile(filePath, JSON.stringify(ast, null, 2));
    //console.log(`Successfully updated file: ${filePath}`);
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
  }
}

// Helper function: Determine if the file is a page or component
function getFileMetadata(fileName) {
  const baseName = fileName.replace('.smq.ast', '');
  const isPage = baseName === '+page';
  const isLayout = baseName === '+layout';
  const isComponent = !isPage;
  const componentName = isComponent ? baseName : null;
  let htmlAstKey;  //= isPage ? 'customAST' : componentName.toLowerCase();

  if (isPage || isLayout) {
  htmlAstKey ='customAST';
  } else {
  htmlAstKey = componentName.toLowerCase(); 
  }

  return { isPage, isLayout, isComponent, componentName, htmlAstKey };
}

// Main function: Regularise AST files
async function regularise(files) {
  for (const file of files) {
    const fileName = path.basename(file);
    const { isPage, isLayout, isComponent, componentName, htmlAstKey } = getFileMetadata(fileName);

    // Read the AST file
    const astBlocks = await readAstFile(file);
    if (!astBlocks) continue; // Skip if file reading failed

    // Get the target AST block
    const ast = astBlocks[htmlAstKey];
    if (!ast) {
      console.error(`No AST block found for key: ${htmlAstKey} in file: ${file}`);
      continue;
    }

    // Perform transformations
    const targetNode = elementWalker(ast, 'name', 'customSyntax');
    if (!targetNode) {
      console.error(`Target node not found in file: ${file}`);
      continue;
    }

    const transformTextNodes = new TransformTextNodes(targetNode);

    // Update the AST with the transformed node
    astBlocks[htmlAstKey] = ast;

    // Write the updated AST back to the file
    await writeAstFile(file, astBlocks);
  }
}

// Entry point
export async function init(destDir) {
  const files = await findAstFiles(destDir);
  await regularise(files);
}