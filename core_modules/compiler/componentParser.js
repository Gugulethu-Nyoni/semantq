import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import { parse } from 'acorn';
import postcss from 'postcss';
import escodegen from 'escodegen';
import parser from './semantq_parser.js'; 




async function readSMQHTMLFiles(directory) {
  const files = await fs.promises.readdir(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = await fs.promises.stat(filePath);

    if (stats.isDirectory()) {
      await readSMQHTMLFiles(filePath); // Recursively process subdirectories
    } else if (path.extname(file).toLowerCase() === '.html') {
      await parseComponent(filePath);
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

    let jsAST = parse(jsCode, { ecmaVersion: 2022, sourceType: "module" });
    let cssAST = postcss.parse(cssCode, { from: 'style' });
    let customAST = parser.parse(customCode);

    jsAST = removeDuplicates(jsAST);
    cssAST = removeDuplicates(cssAST);
    customAST = removeDuplicates(customAST);

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

  if (!fileName.startsWith("+page")) {
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
    console.log(`AST File written successfully: ${newFilePath}`);
  } catch (err) {
    console.error(`Error writing AST file ${newFilePath}:`, err);
  }
}