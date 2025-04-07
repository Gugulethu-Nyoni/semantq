import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import { parse } from 'acorn';
import postcss from 'postcss';
import escodegen from 'escodegen';
import parser from './semantq_parser.js'; 
//import esprima from 'esprima';




async function readSMQHTMLFiles(directory) {
  const files = await fs.promises.readdir(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = await fs.promises.stat(filePath);

    if (stats.isDirectory()) {
      await readSMQHTMLFiles(filePath); // Recursively process subdirectories
    } else if (file === '+layout.smq.html') {
      //console.log("Here",file);
      await parseComponent(filePath);
    }
  }
}



async function parseComponent(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    //const jsCode = $('script').html() || '';
    //let jsAST = parse(jsCode, { ecmaVersion: 'latest', sourceType: "module" });
    // Regular expression to extract JavaScript code inside <script> tags
    const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
    let jsCode = '';
    let match;

    // Extract all JavaScript code from <script> tags
    while ((match = scriptRegex.exec(code)) !== null) {
      jsCode += match[1].trim() + '\n'; // Add a newline between multiple script blocks
    }

    // Remove all <script> tags and their content from the file
    const htmlContent = code.replace(/<script>[\s\S]*?<\/script>/g, '');

    jsCode = jsCode.trim();
    let jsAST = parse(jsCode, { ecmaVersion: 'latest', sourceType: "module" });
    //console.log(htmlContent);
    const updatedHTML = `<customSyntax> ${htmlContent.trim()} </customSyntax>`;
    //console.log(updatedHTML);
    const customAST = parser.parse(updatedHTML);
    /* LET'S LEAN UP JS AST CODE HERE */

function cleanJSAST(node) {
    if (!node || typeof node !== 'object') return node;

    // Handle CallExpression argument null issue
    if (node.type === 'CallExpression' && node.arguments === null) {
        node.arguments = [];
    }

    // Handle null params in FunctionExpression, ArrowFunctionExpression, and MethodDefinition
    if ((node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') && node.params === null) {
        node.params = [];
    }

    if (node.type === 'MethodDefinition' && node.value && node.value.type === 'FunctionExpression' && node.value.params === null) {
        node.value.params = [];
    }

    // Recursively clean child nodes
    for (const key in node) {
        if (node.hasOwnProperty(key)) {
            const value = node[key];

            if (Array.isArray(value)) {
                node[key] = value.filter(Boolean).map(cleanJSAST);
            } else if (typeof value === 'object' && value !== null) {
                cleanJSAST(value);
            }
        }
    }

    return node;
}


jsAST = cleanJSAST(jsAST);

//console.log(JSON.stringify(jsAST, null, 2));

    /* CLEAN UP JS AST CODE END */

    const newFilePath = filePath.replace('.html', '.ast');
    await writeToFile({ jsAST, customAST, newFilePath });
  } catch (err) {
    console.error(`Error processing file ${filePath}:`, err);
  }
}



// Function to remove duplicates from AST structures
function removeDuplicates(ast) {
  const seen = new Set();
  function traverse(node) {
    if (!node || typeof node !== 'object') return node;

    const key = JSON.stringify(node);
    if (seen.has(key)) return null; // Remove duplicate nodes

    seen.add(key);
    if (Array.isArray(node)) {
      return node.map(traverse).filter(Boolean);
    } else {
      return Object.fromEntries(
        Object.entries(node).map(([k, v]) => [k, traverse(v)])
      );
    }
  }
  return traverse(ast);
}







// Main function
export async function compileSMQFiles(destDir) {
  await readSMQHTMLFiles(destDir);
}

// Compile .smq files
//compileSMQFiles();


async function writeToFile(astObjects) {
  const fileName = path.basename(astObjects.newFilePath, '.ast');

  let htmlKey = "customAST"; // Default for pages
  let jsKey = "jsAST";

  const astObject = {
    [jsKey]: { type: 'JavaScript', content: astObjects.jsAST },
    [htmlKey]: { type: 'HTML', content: astObjects.customAST },
  };

  const jsonString = JSON.stringify(astObject, null, 2);
  const newFilePath = astObjects.newFilePath;

  try {
    // Delete the file if it exists
    await fs.promises.unlink(newFilePath).catch((err) => {
      if (err.code !== 'ENOENT') throw err; // Ignore "file not found" errors
    });

    // Write the new file
    await fs.promises.writeFile(newFilePath, jsonString);
    //console.log(`AST File written successfully: ${newFilePath}`);
  } catch (err) {
    console.error(`Error writing AST file ${newFilePath}:`, err);
  }
}