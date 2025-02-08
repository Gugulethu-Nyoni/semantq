import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import { parse } from 'acorn';
import postcss from 'postcss';
import escodegen from 'escodegen';
import parser from './semantq_parser.js'; 




function readSMQHTMLFiles(directory) {

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
        } else if (path.extname(file).toLowerCase() === '.html') {
         // console.log(`Found html file: ${filePath}`);

         const parsedBlocks = parseComponent(filePath);

         //console.log(parsedBlocks);

        }
      });
    });
  });
}




function parseComponent(filePath) {
  try {
    // Read the file synchronously
    const code = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(code);

    // Extract JavaScript, CSS, and custom syntax
    const jsCode = $('script').html() || '';
    let cssCode = $('style').html() || '';

    // Fix CSS object issue
    if (cssCode.trim() === '[object Object]') {
      cssCode = '';
    }

    // Extract customSyntax content
    const startMarker = '<customSyntax>';
    const endMarker = '</customSyntax>';
    const startIndex = code.indexOf(startMarker);
    const endIndex = code.indexOf(endMarker, startIndex);

    let customCode = '';
    if (startIndex !== -1 && endIndex !== -1) {
      customCode = code.substring(startIndex, endIndex + endMarker.length).trim();
    }

    // Parse JavaScript with Acorn
    let jsAST = parse(jsCode, { ecmaVersion: 2022, sourceType: "module" });

    // Parse CSS with PostCSS
    let cssAST = postcss.parse(cssCode, { from: 'style' });

    // Parse custom syntax
    let customAST = parser.parse(customCode);

    // Remove duplicate nodes
    jsAST = removeDuplicates(jsAST);
    cssAST = removeDuplicates(cssAST);
    customAST = removeDuplicates(customAST);

    // Define new AST file path
    const newFilePath = filePath.replace('.html', '.ast');

    // Write to file
    writeToFile({ jsAST, cssAST, customAST, newFilePath });

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
export function compileSMQFiles(destDir) {
    //const directory = '../../build/routes'; // dest directory
  return  readSMQHTMLFiles(destDir);
}

// Compile .smq files
//compileSMQFiles();


function writeToFile(astObjects){

//console.log(astObjects); return;

// Creating new objects with the same structure
const jsAST = { type: 'JavaScript', content: astObjects.jsAST };
const cssAST = { type: 'CSS', content: astObjects.cssAST };
const customAST = { type: 'Custom', content: astObjects.customAST };


  const astObject= {
jsAST,
cssAST,
customAST,

  }

const jsonString = JSON.stringify(astObject, null, 2);

const newFilePath = astObjects.newFilePath; 



    fs.unlink(newFilePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error(err);
    } else {
      fs.writeFile(newFilePath, jsonString, (err) => {
        if (err) {
          console.error(err);
        } else {
          //console.log('Ast File written successfully');
        }
      });
    }
  });


}