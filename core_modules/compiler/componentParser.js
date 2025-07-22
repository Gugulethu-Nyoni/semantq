import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import { parse } from 'acorn';
//import { parse } from 'esprima';
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
    } else if (path.extname(file).toLowerCase() === '.html') {
            const fileName = file.replace('.smq.html', '');
            //console.log("Here",fileName);
          if (fileName !== '+layout') {
            await parseComponent(filePath);
            }

    }
  }
}



async function parseComponent(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(code);

    const jsCode = $('script').html() || '';
    let cssCode = $('style').html() || '';

    if (cssCode.trim() === '[object Object]') {
      cssCode = '';
    }

    const startMarker = '<customSyntax>';
    const endMarker = '</customSyntax>';
    const startIndex = code.indexOf(startMarker);
    const endIndex = code.indexOf(endMarker, startIndex);

    let customCode = '';
    if (startIndex !== -1 && endIndex !== -1) {
      customCode = code.substring(startIndex, endIndex + endMarker.length).trim();
    }

    let jsAST = parse(jsCode, { ecmaVersion: 2024, sourceType: "module" });
    //let jsAST = esprima.parseScript(code);

    //console.log("JS Code",jsCode);
    //let jsAST = parse(jsCode, { comment: true, loc: true });
    let cssAST = postcss.parse(cssCode, { from: 'style' });
    let customAST = parser.parse(customCode);

    jsAST = removeDuplicates(jsAST);
    cssAST = removeDuplicates(cssAST);
    customAST = removeDuplicates(customAST);

    /* LET'S LEAN UP JS AST CODE HERE */

function cleanJSAST(node) {
  if (!node || typeof node !== 'object') return node;

  // Fix Property nodes in ObjectPattern with shorthand=true and null value
  if (
    node.type === 'Property' &&
    node.shorthand === true &&
    node.value === null &&
    node.key && node.key.type === 'Identifier'
  ) {
    node.value = { ...node.key }; // Mirror the key in value
  }

  // Handle CallExpression argument null issue
  if (node.type === 'CallExpression' && node.arguments === null) {
    node.arguments = [];
  }

  // Handle NewExpression argument null issue
  if (node.type === 'NewExpression' && node.arguments === null) {
    node.arguments = [];
  }

  // Handle null params in FunctionExpression, ArrowFunctionExpression, and MethodDefinition
  if ((node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') && node.params === null) {
    node.params = [];
  }

  if (node.type === 'MethodDefinition' && node.value && node.value.type === 'FunctionExpression' && node.value.params === null) {
    node.value.params = [];
  }

  // Handle null params in FunctionDeclaration
  if (node.type === 'FunctionDeclaration' && node.params === null) {
    node.params = [];
  }

  // Handle ObjectExpression with null properties
  if (node.type === 'ObjectExpression' && node.properties === null) {
    node.properties = [];
  }

  // Handle ImportDeclaration with null specifiers
  if (node.type === 'ImportDeclaration' && node.specifiers === null) {
    node.specifiers = [];
  }
  
  // Handle ArrayExpression with null elements
  if (node.type === 'ArrayExpression' && node.elements === null) {
    node.elements = [];
  }

  // Handle Literal nodes with null values
  if (node.type === 'Literal') {
    if (node.value === null && !node.raw) {
      node.raw = 'null';
    }
    // Ensure regex literals have pattern and flags
    if (node.regex && !node.regex.pattern) {
      node.regex.pattern = '';
    }
    if (node.regex && !node.regex.flags) {
      node.regex.flags = '';
    }
  }

  // Handle TemplateElement nodes
  if (node.type === 'TemplateElement') {
    if (!node.value) {
      node.value = { raw: '', cooked: '' };
    } else if (!node.value.raw) {
      node.value.raw = '';
    }
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

//console.log("Cleaned",JSON.stringify(jsAST, null, 2));

    /* CLEAN UP JS AST CODE END */

    const newFilePath = filePath.replace('.html', '.ast');
    await writeToFile({ jsAST, cssAST, customAST, newFilePath });
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
  let cssKey = "cssAST";

  if (!fileName.startsWith("@page")) {
    const componentName = fileName.split(".")[0]; // Extract component name
    htmlKey = componentName.toLowerCase();
    jsKey = `jsAST_${componentName}`;
    cssKey = `cssAST_${componentName}`;
  }

  const astObject = {
    [jsKey]: { type: 'JavaScript', content: astObjects.jsAST },
    [cssKey]: { type: 'CSS', content: astObjects.cssAST },
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