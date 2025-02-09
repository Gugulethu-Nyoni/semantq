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

  return cssAST.content.nodes.map(node => {
    if (node.type === 'rule') {
      const selector = node.selectors ? node.selectors.join(', ') : '';
      const declarations = node.nodes
        ? node.nodes.filter(decl => decl.type === 'decl')
          .map(decl => `${decl.prop}: ${decl.value};`)
          .join('\n')
        : '';
      return `${selector} {\n${declarations}\n}`;
    }
    // Handle other node types if necessary
    return '';
  }).join('\n');
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
        } else if (file.toLowerCase().endsWith('.resolved.ast')) {

            console.log("ISINDE THERE****", file);

          fs.readFile(filePath, 'utf8', async (err, data) => {
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

              //console.log("CSS Output:", cssAST);

              const customSyntaxAST = astObject.customAST.content;
              const customSyntaxObject = customSyntaxAST[0];

              // Dynamically import the module and apply transformations
              try {
                if (jsAST.content.body.length > 0 && customSyntaxAST[0].html.children[0].children[0].length > 0) {
                  const atomiqueModule = await import('./static_analysis/anatomique.js');
                  const transformASTs = atomiqueModule.default; // If using default export
                  await transformASTs(jsAST.content, cssAST, customSyntaxAST, filePath);
                } else {
                  //console.log(`Transformer not run for ${filePath} - Either JS or HTML not found`);
                }
              } catch (importErr) {
                console.error('Error importing module:', importErr);
              }
            } catch (parseErr) {
              console.error('Error parsing JSON:', parseErr);
            }
          });
        }
      });
    });
  });
}

/**
 * Start the transformation process.
 */
export function transformSMQFiles(destDir) {
  return readSMQHTMLFiles(destDir);
}

//transformSMQFiles();
