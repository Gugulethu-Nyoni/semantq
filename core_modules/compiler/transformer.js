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
  const indent = '  '.repeat(indentLevel); // Indentation based on nesting level

  cssAST.content.nodes.forEach(node => {
    switch (node.type) {
      case 'rule':
        // Handle regular CSS rules
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
        // Handle at-rules like @media, @keyframes, etc.
        if (node.name && Array.isArray(node.nodes)) {
          cssString += `${indent}@${node.name} ${node.params || ''} {\n`;
          cssString += convertCssASTToString({ content: { nodes: node.nodes } }, indentLevel + 1);
          cssString += `${indent}}\n\n`;
        }
        break;

      case 'comment':
        // Handle CSS comments
        if (node.text) {
          cssString += `${indent}/* ${node.text} */\n\n`;
        }
        break;

      default:
        // Handle unknown node types (optional)
        console.warn(`Unsupported node type: ${node.type}`);
        break;
    }
  });

  return cssString;
}


/**
 * Read and process files in a directory recursively.
 * @param {String} directory - The directory path.
 */
async function readSMQHTMLFiles(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error stat-ing file:', err);
          return;
        }

        if (stats.isDirectory()) {
          readSMQHTMLFiles(filePath); // Recursively call on subdirectory
        } else {
          const fileName = path.basename(file).toLowerCase();
          const resolvedASTPath = path.join(directory, '@page.resolved.ast');
          const smqASTPath = path.join(directory, '@page.smq.ast');

          if (fileName === '@page.resolved.ast' || fileName === '@page.smq.ast') {
            let fileToRead = null;

            if (fs.existsSync(resolvedASTPath)) {
              fileToRead = resolvedASTPath;
            }

            if (fs.existsSync(smqASTPath)) {
              fileToRead = smqASTPath;
            }

            if (fileToRead) {
              fs.readFile(fileToRead, 'utf8', async (err, data) => {
                if (err) {
                  console.error('Error reading file:', err);
                  return;
                }

                try {
                  const astObject = JSON.parse(data);
                  const jsAST = astObject.jsAST;
                  const cssASTObject = astObject.cssAST;

                  let cssAST = '';
                  if (cssASTObject && cssASTObject.content && Array.isArray(cssASTObject.content.nodes) && cssASTObject.content.nodes.length > 0) {
                    cssAST = convertCssASTToString(cssASTObject);
                  }

                  // Corrected customAST access
                  // customSyntaxContainer holds: { html: { type: "Fragment", children: [...] } }
                  const customSyntaxContainer = astObject.customAST.content;

                  let htmlChildrenForTransformer = [];
                  if (customSyntaxContainer?.html?.children?.length > 0) {
                    // Assuming 'customSyntax' element is always the first child of the HTML fragment
                    const customSyntaxElement = customSyntaxContainer.html.children[0];
                    if (customSyntaxElement && customSyntaxElement.name === 'customSyntax' && Array.isArray(customSyntaxElement.children)) {
                      htmlChildrenForTransformer = customSyntaxElement.children; // These are your span, div, button, MustacheTag
                    } else {
                      console.warn(`File: ${filePath} - Expected 'customSyntax' element as the first child of HTML fragment, but found:`, customSyntaxElement);
                      // If 'customSyntax' isn't strictly guaranteed to be the *first* child,
                      // you might need a more robust search here (e.g., using a tree traversal utility).
                    }
                  }

                  // Dynamically import the module and apply transformations
                  try {
                    // Check if either JS AST body has content or the extracted HTML children have content
                    if (jsAST?.content?.body?.length > 0 || htmlChildrenForTransformer.length > 0) {
                      const currentFileName = path.basename(filePath);
                      // exclude transformation of layout ast files for now
                      //console.log("resolved FILES?", filePath);
                      if (currentFileName.includes('@page')) {
                        const atomiqueModule = await import('./static_analysis/index.js');
                        const transformASTs = atomiqueModule.default; // If using default export
                        
                        // Pass jsAST.content, cssAST string, and the html fragment content to the transformer
                        // The transformer will need to know how to handle these different structures.
                        // For html, you might want to pass the `html` object itself or its children.
                        // Assuming `transformASTs` expects the `html` object (Fragment type)
                         //console.log("STRUCTURE",JSON.stringify(customSyntaxContainer.html,null,2));
                        await transformASTs(jsAST.content, cssAST, customSyntaxContainer.html, filePath); 
                      }

                    } else {
                      console.log(`Transformer not run for ${filePath} - Either JS or HTML content not found`);
                    }
                  } catch (importErr) {
                    console.error(`Error importing module for ${filePath}:`, importErr);
                  }
                } catch (parseErr) {
                  console.error(`Error parsing JSON for ${filePath}:`, parseErr);
                }
              });
            } else {
              console.log(`No valid AST file found for ${filePath}`);
            }
          }
        }
      });
    });
  });
}

/**
 * Start the transformation process.
 */
export function transformSMQFiles(destDir) {
  // Recursively process the directory
  processDirectory(destDir);

  // After processing, return the result of readSMQHTMLFiles (assuming this is another function)
  return readSMQHTMLFiles(destDir);
}


function processDirectory(dir) {
  // Read the contents of the directory
  const files = fs.readdirSync(dir);

  // Track whether resolved.ast files exist for page and layout
  let hasPageResolved = false;
  let hasLayoutResolved = false;

  // First pass: Check if resolved.ast files exist
  files.forEach(file => {
    const filePath = path.join(dir, file);

    if (fs.statSync(filePath).isDirectory()) {
      // Recursively process subdirectories
      processDirectory(filePath);
    } else if (file.startsWith('@page.') && file.endsWith('.resolved.ast')) {
      hasPageResolved = true;
    } else if (file.startsWith('@layout.') && file.endsWith('.resolved.ast')) {
      hasLayoutResolved = true;
    }
  });

  // Second pass: Delete unnecessary files
  files.forEach(file => {
    const filePath = path.join(dir, file);

    if (!fs.statSync(filePath).isDirectory()) {
      if (file.startsWith('@page.')) {
        if (hasPageResolved && file !== '@page.resolved.ast') {
          // Delete all @page.* files except @page.resolved.ast
          fs.unlinkSync(filePath);
        } else if (!hasPageResolved && !file.endsWith('.smq.ast')) {
          // Delete all @page.* files except @page.smq.ast
          fs.unlinkSync(filePath);
        }
      } else if (file.startsWith('@layout.')) {
        if (hasLayoutResolved && file !== '@layout.resolved.ast') {
          // Delete all @layout.* files except @layout.resolved.ast
          fs.unlinkSync(filePath);
        } else if (!hasLayoutResolved && !file.endsWith('.smq.ast')) {
          // Delete all @layout.* files except @layout.smq.ast
          fs.unlinkSync(filePath);
        }
      }
    }
  });
}

