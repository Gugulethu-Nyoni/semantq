"use strict";

// Clear all cached modules
/*
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});
*/



import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//
const sourceDir = path.resolve(__dirname, '../src/routes');
const destDir = path.resolve(__dirname, '../build/routes');
const extension = 'smq';


// clean up - empty the target build directory to ensure clean build

async function cleanupDirectory(directory) {
  try {
    const files = await fs.readdir(directory);
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        await cleanupDirectory(filePath);
        await fs.rmdir(filePath);
        //console.log(`Removed directory: ${filePath}`);
      } else {
        await fs.unlink(filePath);
        //console.log(`Removed file: ${filePath}`);
      }
    }
    await fs.rmdir(directory);
    //console.log(`Removed directory: ${directory}`);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error cleaning directory:', err);
    } else {
      //console.log(`Directory does not exist: ${directory}`);
    }
  }
}



async function compileCustomTags() {
  try {
    //console.log("Compiling Custom Tags ...");
    const tagCompiler = await import('./compileCustomTags.js');
    //console.log("Custom tags compiled");
  } catch (error) {
    throw error;
  }
}

async function validateIfSyntax() {
  try {
    //console.log("Validating all Syntax ...");
    const ifSyntax = await import('./semantq_parser.js');
    //console.log("Done: syntax validation");
  } catch (error) {
    throw error;
  }
}

async function componentParser() {
  try {
    //console.log("Component parsing");
    const ifSyntax = await import('./componentParser.js');
    //console.log("Done: component parsing");
  } catch (error) {
    throw error;
  }
}

async function transformer() {
  try {
    //console.log("Transforming Components");
    const ifSyntax = await import('./transformer.js');
    //console.log("Done: Transforming Components");
  } catch (error) {
    throw error;
  }
}

async function main() {
  const dirPath = '/Users/gugulethu/code/semantiq/lab/theCompiler/build/routes';

  // Wait for the directory cleanup to finish before proceeding
  await cleanupDirectory(dirPath);
  
  // Run the tasks sequentially
  await compileCustomTags();
  await validateIfSyntax();  // Uncomment if needed
  await componentParser();
  await transformer();
}

main()
  .then(() => {
    console.log('\x1b[32mCompilation completed successfully!\x1b[0m');
  })
  .catch((error) => {
    console.error('\x1b[31m' + error + '\x1b[0m');
  });
