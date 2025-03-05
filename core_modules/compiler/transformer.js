"use strict";

import fs from 'fs';
import path from 'path';
import postcss from 'postcss';

/**
 * Convert CSS AST to CSS string.
 * @param {Object} cssAST - The CSS AST object.
 * @returns {String} - The CSS string.
 */
function convertCssASTToString(cssAST) {
  if (!cssAST || !cssAST.content || !Array.isArray(cssAST.content.nodes)) {
    console.error('Invalid CSS AST object:', cssAST);
    return '';
  }

  let cssString = '';

  cssAST.content.nodes.forEach(rule => {
    if (rule.type === "rule" && rule.selector && Array.isArray(rule.nodes)) {
      // Process normal CSS rules
      cssString += `${rule.selector} {\n`;

      rule.nodes.forEach(decl => {
        if (decl.type === "decl" && decl.prop && decl.value) {
          cssString += `  ${decl.prop}: ${decl.value};\n`;
        }
      });

      cssString += `}\n`;

    } else if (rule.type === "atrule" && rule.name === "keyframes") {
      // Process @keyframes blocks
      cssString += `@keyframes ${rule.params} {\n`;

      rule.nodes.forEach(frame => {
        if (frame.type === "rule" && Array.isArray(frame.nodes)) {
          cssString += `  ${frame.selector} {\n`;

          frame.nodes.forEach(decl => {
            if (decl.type === "decl" && decl.prop && decl.value) {
              cssString += `    ${decl.prop}: ${decl.value};\n`;
            }
          });

          cssString += `  }\n`;
        }
      });

      cssString += `}\n`;
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
    //console.log("ALL Files", files);

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
          const resolvedASTPath = path.join(directory, '+page.resolved.ast');
          const smqASTPath = path.join(directory, '+page.smq.ast');
          //const layoutSmqASTPath = path.join(directory, '+layout.smq.ast');
          //const layoutResolvedASTPath = path.join(directory, '+layout.resolved.ast');

          // Check for +page.resolved.ast first
          // || fileName === '+layout.smq.ast' || fileName === '+layout.resolved.ast'
          if (fileName === '+page.resolved.ast' || fileName === '+page.smq.ast') {
            
            let fileToRead = null;

            if (fs.existsSync(resolvedASTPath)) {
              fileToRead = resolvedASTPath;
            } 

            if (fs.existsSync(smqASTPath)) {
              fileToRead = smqASTPath;
            }

            /*

            if (fs.existsSync(layoutSmqASTPath)) {
              fileToRead = layoutSmqASTPath;
            }

            if (fs.existsSync(layoutResolvedASTPath)) {
              fileToRead = layoutResolvedASTPath;
            }
            */




            if (fileToRead) {
              fs.readFile(fileToRead, 'utf8', async (err, data) => {
                if (err) {
                  console.error('Error reading file:', err);
                  return;
                }

                try {
                  const astObject = JSON.parse(data);
                  const jsAST = astObject.jsAST;
                  //console.log("HERE1",JSON.stringify(jsAST,null,2));
                  const cssASTObject = astObject.cssAST;

                  let cssAST = '';
                  if (cssASTObject && cssASTObject.content && Array.isArray(cssASTObject.content.nodes) && cssASTObject.content.nodes.length > 0) {
                    
                     console.log(JSON.stringify(cssASTObject,null,2));
                    cssAST = convertCssASTToString(cssASTObject);

                    //console.log("FINAL CSS",JSON.stringify(cssAST,null,2))
                  }

                  const customSyntaxAST = astObject.customAST.content;
                  const customSyntaxObject = customSyntaxAST[0];

                  // Dynamically import the module and apply transformations
                  try {
                    if (jsAST.content.body.length > 0 || customSyntaxAST[0].html.children[0].children[0].length > 0) {
                      //console.log(jsAST.content.body);
                      const fileName = path.basename(filePath);
                      // exclude transformation of layout ast files for now
                      if (fileName.includes('+page')) {
                      const atomiqueModule = await import('./static_analysis/anatomique.js');
                      const transformASTs = atomiqueModule.default; // If using default export
                      //console.log(JSON.stringify(cssAST,null,2));
                      await transformASTs(jsAST.content, cssAST, customSyntaxAST, filePath);
                    }

                    } else {
                      console.log(`Transformer not run for ${filePath} - Either JS or HTML not found`);
                    }
                  } catch (importErr) {
                    console.error('Error importing module:', importErr);
                  }
                } catch (parseErr) {
                  console.error('Error parsing JSON:', parseErr);
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

/*
export function transformSMQFiles(destDir) {
  //const directory = '../../build/routes'; // src directory
  return readSMQHTMLFiles(destDir);
}
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
    } else if (file.startsWith('+page.') && file.endsWith('.resolved.ast')) {
      hasPageResolved = true;
    } else if (file.startsWith('+layout.') && file.endsWith('.resolved.ast')) {
      hasLayoutResolved = true;
    }
  });

  // Second pass: Delete unnecessary files
  files.forEach(file => {
    const filePath = path.join(dir, file);

    if (!fs.statSync(filePath).isDirectory()) {
      if (file.startsWith('+page.')) {
        if (hasPageResolved && file !== '+page.resolved.ast') {
          // Delete all +page.* files except +page.resolved.ast
          fs.unlinkSync(filePath);
        } else if (!hasPageResolved && !file.endsWith('.smq.ast')) {
          // Delete all +page.* files except +page.smq.ast
          fs.unlinkSync(filePath);
        }
      } else if (file.startsWith('+layout.')) {
        if (hasLayoutResolved && file !== '+layout.resolved.ast') {
          // Delete all +layout.* files except +layout.resolved.ast
          fs.unlinkSync(filePath);
        } else if (!hasLayoutResolved && !file.endsWith('.smq.ast')) {
          // Delete all +layout.* files except +layout.smq.ast
          fs.unlinkSync(filePath);
        }
      }
    }
  });
}



//transformSMQFiles();