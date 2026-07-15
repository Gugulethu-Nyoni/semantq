"use strict";

import fs from 'fs';
import path from 'path';
import postcss from 'postcss';

/**
 * Convert CSS AST to CSS string.
 * @param {Object} cssAST - The CSS AST object.
 * @returns {String} - The CSS string.
 */
function convertCssASTToString(cssAST, indentLevel = 0) {
  if (!cssAST || !cssAST.content || !Array.isArray(cssAST.content.nodes)) {
    console.error('Invalid CSS AST object:', cssAST);
    return '';
  }

  let cssString = '';
  const indent = '  '.repeat(indentLevel);

  cssAST.content.nodes.forEach(node => {
    switch (node.type) {
      case 'rule':
        if (node.selector && Array.isArray(node.nodes)) {
          cssString += `${indent}${node.selector} {\n`;
          node.nodes.forEach(decl => {
            if (decl.type === 'decl' && decl.prop && decl.value) {
              cssString += `${indent}  ${decl.prop}: ${decl.value};\n`;
            }
          });
          cssString += `${indent}}\n\n`;
        }
        break;

      case 'atrule':
        if (node.name && Array.isArray(node.nodes)) {
          cssString += `${indent}@${node.name} ${node.params || ''} {\n`;
          cssString += convertCssASTToString({ content: { nodes: node.nodes } }, indentLevel + 1);
          cssString += `${indent}}\n\n`;
        }
        break;

      case 'comment':
        if (node.text) {
          cssString += `${indent}/* ${node.text} */\n\n`;
        }
        break;

      default:
        console.warn(`Unsupported node type: ${node.type}`);
        break;
    }
  });

  return cssString;
}

// Cache the transformer module to avoid repeated imports
let transformASTs;

async function getTransformer() {
  if (!transformASTs) {
    const module = await import('./static_analysis/index.js');
    transformASTs = module.default;
  }
  return transformASTs;
}

/**
 * Read and process files in a directory recursively.
 * @param {String} directory - The directory path.
 */
async function readSMQHTMLFiles(directory) {
  try {
    const entries = await fs.promises.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const filePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        await readSMQHTMLFiles(filePath);
        continue;
      }

      const fileName = entry.name.toLowerCase();
      const resolvedASTPath = path.join(directory, '@page.resolved.ast');
      const smqASTPath = path.join(directory, '@page.smq.ast');

      if (fileName === '@page.resolved.ast' || fileName === '@page.smq.ast') {
        let fileToRead = null;

        // Use sync existsSync to match the file's existing style
        if (fs.existsSync(resolvedASTPath)) {
          fileToRead = resolvedASTPath;
        } else if (fs.existsSync(smqASTPath)) {
          fileToRead = smqASTPath;
        }

        if (fileToRead) {
          try {
            const data = await fs.promises.readFile(fileToRead, 'utf8');
            const astObject = JSON.parse(data);
            const jsAST = astObject.jsAST;
            const cssASTObject = astObject.cssAST;

            let cssAST = '';
            if (cssASTObject && cssASTObject.content && Array.isArray(cssASTObject.content.nodes) && cssASTObject.content.nodes.length > 0) {
              cssAST = convertCssASTToString(cssASTObject);
            }

            const customSyntaxContainer = astObject.customAST.content;
            let htmlChildrenForTransformer = [];

            if (customSyntaxContainer?.html?.children?.length > 0) {
              const customSyntaxElement = customSyntaxContainer.html.children[0];
              if (customSyntaxElement && customSyntaxElement.name === 'customSyntax' && Array.isArray(customSyntaxElement.children)) {
                htmlChildrenForTransformer = customSyntaxElement.children;
              } else {
                console.warn(`File: ${filePath} - Expected 'customSyntax' element as the first child of HTML fragment, but found:`, customSyntaxElement);
              }
            }

            if (jsAST?.content?.body?.length > 0 || htmlChildrenForTransformer.length > 0) {
              const currentFileName = path.basename(filePath);
              if (currentFileName.includes('@page')) {
                const transformer = await getTransformer();
                await transformer(jsAST.content, cssAST, customSyntaxContainer.html, filePath);
              }
            } else {
              console.log(`Transformer not run for ${filePath} - Either JS or HTML content not found`);
            }
          } catch (parseErr) {
            console.error(`Error parsing JSON for ${filePath}:`, parseErr);
          }
        } else {
          console.log(`No valid AST file found for ${filePath}`);
        }
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err);
    throw err;
  }
}

/**
 * Clean up unnecessary AST files after transformation.
 * @param {string} dir - The directory to process.
 */
function processDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);

    let hasPageResolved = false;
    let hasLayoutResolved = false;

    // First pass: Check if resolved.ast files exist
    files.forEach(file => {
      const filePath = path.join(dir, file);

      try {
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          processDirectory(filePath);
        } else if (file.startsWith('@page.') && file.endsWith('.resolved.ast')) {
          hasPageResolved = true;
        } else if (file.startsWith('@layout.') && file.endsWith('.resolved.ast')) {
          hasLayoutResolved = true;
        }
      } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
      }
    });

    // Second pass: Delete unnecessary files
    files.forEach(file => {
      const filePath = path.join(dir, file);

      try {
        const stats = fs.statSync(filePath);
        if (!stats.isDirectory()) {
          if (file.startsWith('@page.')) {
            if (hasPageResolved && file !== '@page.resolved.ast') {
              fs.unlinkSync(filePath);
            } else if (!hasPageResolved && !file.endsWith('.smq.ast')) {
              fs.unlinkSync(filePath);
            }
          } else if (file.startsWith('@layout.')) {
            if (hasLayoutResolved && file !== '@layout.resolved.ast') {
              fs.unlinkSync(filePath);
            } else if (!hasLayoutResolved && !file.endsWith('.smq.ast')) {
              fs.unlinkSync(filePath);
            }
          }
        }
      } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
      }
    });
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err);
  }
}

/**
 * Start the transformation process.
 */
export async function transformSMQFiles(destDir) {
  processDirectory(destDir);
  await readSMQHTMLFiles(destDir);
}