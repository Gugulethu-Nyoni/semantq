"use strict";

import path from 'path';
//import { fileURLToPath } from 'url';
import fs from 'fs/promises'; 
import fse from 'fs-extra';


const rootDir = process.cwd();

//console.log("HERE",rootDir);

// Construct paths to key source and dest directories 
const sourceDir = path.join(rootDir, 'src/routes');
const destDir = path.join(rootDir, 'build/routes');
const destDirBase = path.join(rootDir, 'build');
const componentsSrc = path.join(rootDir, 'src/components');
const componentsDest = path.join(rootDir, 'build/components');


// clean up - empty the target build directory to ensure clean build

/*
async function cleanupDirectory(directory) {
  console.log("Cleaning out build dir:", directory);

  try {
    // Use fse.rm with recursive and force options to delete the directory and its contents
    await fse.rm(directory, { recursive: true, force: true });
    console.log(`Successfully removed directory: ${directory}`);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error cleaning directory:', err);
    } else {
      console.log(`Directory does not exist: ${directory}`);
    }
  }
}
*/


async function cleanupDirectory(directory) {
  //console.log("Cleaning out build dir:", directory);

  try {
    // Check if the directory exists
    const dirExists = await fse.pathExists(directory);
    if (!dirExists) {
      //console.log(`Directory does not exist: ${directory}`);
      return;
    }

    // Read the contents of the directory
    const files = await fse.readdir(directory);

    // Delete each file or subdirectory
    for (const file of files) {
      const filePath = path.join(directory, file);
      await fse.remove(filePath); // fs.remove deletes files and directories recursively
      //console.log(`Removed: ${filePath}`);
    }

    //console.log(`Successfully cleaned directory: ${directory}`);
  } catch (err) {
    console.error('Error cleaning directory:', err);
  }
}




async function compileCustomTags(sourceDir) {
  try {
    //console.log("Passed", sourceDir);
    //console.log("Compiling Custom Tags ...");
    const tagCompiler = await import('./compileCustomTags.js');
    tagCompiler.compileSMQFiles(sourceDir);
    //console.log("Custom tags compiled");
  } catch (error) {
    throw error;
  }
}

/*
async function validateIfSyntax() {
  try {
    //console.log("Validating all Syntax ...");
    const ifSyntax = await import('./semantq_parser.js');
    //console.log("Done: syntax validation");
  } catch (error) {
    throw error;
  }
}
*/

async function componentParser(destDir) {
  try {
    //console.log("Component parsing");
    const validate = await import('./componentParser.js');
    validate.compileSMQFiles(destDir)// = await import('./componentParser.js');
    //console.log("Done: component parsing");
  } catch (error) {
    throw error;
  }
}



async function importsResolution(destDir) {
  try {
    //console.log("Component parsing");
    const resolve = await import('./resolve_imports.js');
    const res = resolve.importsResolver(destDir);
    //console.log("Resolved", res);
  } catch (error) {
    throw error;
  }
}



async function slotsResolution(destDir) {
  try {
    //console.log("Slots Resolution");
    const slotResolver = await import('./slotResolver.js');
    const slotResolved = slotResolver.processMergedFiles(destDir);
    //console.log("Resolved", res);
  } catch (error) {
    throw error;
  }
}




async function transformer(destDir) {
  try {
    console.log("Transforming Components");
    const trans = await import('./transformer.js');
    trans.transformSMQFiles(destDir); 
    //console.log("Done: Transforming Components");
  } catch (error) {
    throw error;
  }
}



async function routesGenerator(sourceDir,destDir) {
  try {
    //console.log('Generating route based files');
    // Dynamic import of the bundler module
    const routesModule = await import('./fileBasedRouteGenerator.js');
    // Traverse the directory and generate routes
    routesModule.generateFileBasedRoutes(destDir);
    //console.log('Route generation completed');
   // Copy routes.json from sourceDir to destDir
    const sourceRoutesFile = path.join(sourceDir, 'routes.json');
    const destRoutesFile = path.join(destDir, 'routes.json');

    await fse.copy(sourceRoutesFile, destRoutesFile);
   // console.log(`Copied routes.json from ${sourceDir} to ${destDir}`);


  } catch (error) {
    throw error; // Re-throw the error for the caller to handle
  }
}

async function main(sourceDir,destDir, destDirBase) {
  //const dirPath = '/Users/gugulethu/code/semantiq/lab/theCompiler/build/routes';

  // Wait for the directory cleanup to finish before proceeding
  await cleanupDirectory(destDirBase);
  // Run the tasks sequentially
  await compileCustomTags(sourceDir); // routes
  await compileCustomTags(componentsSrc); // components

  //await validateIfSyntax();  // Uncomment if needed

  // generate page and components ASTs
  await componentParser(destDir);
  await componentParser(componentsDest);

/// resolve component imports and slots 
// so that when we resolve page imports these are sorted
   await importsResolution(componentsDest);
   await slotsResolution(componentsDest);

  //await importsResolution(destDir);
  //await slotsResolution(destDir);



  //await transformer(destDir);
  await transformer(componentsDest);

  await routesGenerator(sourceDir,destDir);

}

main(sourceDir,destDir, destDirBase)
  .then(() => {
    console.log('\x1b[32mCompilation completed successfully!\x1b[0m');
  })
  .catch((error) => {
    console.error('\x1b[31m' + error + '\x1b[0m');
  });
