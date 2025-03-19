"use strict";

import path from 'path';
import fs from 'fs/promises';
import fse from 'fs-extra';
import config from '../../semantq.config.js';


const rootDir = process.cwd();

// Construct paths to key source and dest directories
const src = path.join(rootDir, 'src');
const dest = path.join(rootDir, 'build');
const sourceDir = path.join(rootDir, 'src/routes');
const destDir = path.join(rootDir, 'build/routes');
const destDirBase = path.join(rootDir, 'build');
const componentsSrc = path.join(rootDir, 'src/components');
const componentsDest = path.join(rootDir, 'build/components');

// Clean up - empty the target build directory to ensure clean build
async function cleanupDirectory(directory) {
  try {
    const dirExists = await fse.pathExists(directory);
    if (!dirExists) return;

    const files = await fse.readdir(directory);
    for (const file of files) {
      const filePath = path.join(directory, file);
      await fse.remove(filePath);
    }
  } catch (err) {
    console.error('Error cleaning directory:', err);
  }
}


async function moveFilesToBuild() {
  try {
    // Define the source and destination paths for index.html
    const srcIndexHtml = path.join(rootDir, 'index.html');
    const destIndexHtml = path.join(rootDir, 'public', 'index.html');

    // Ensure the destination directory exists
    await fse.ensureDir(path.join(rootDir, 'public'));

    // Copy index.html from the root to the public directory
    await fse.copy(srcIndexHtml, destIndexHtml);

    console.log(`Copied index.html to ${path.join(rootDir, 'public')}`);
  } catch (err) {
    console.error('Error moving index.html:', err);
  }
}


// Compile custom tags
async function compileCustomTags(sourceDir) {
  try {
    const tagCompiler = await import('./compileCustomTags.js');
    await tagCompiler.compileSMQFiles(sourceDir);
  } catch (error) {
    throw error;
  }
}

// Compile custom tags
async function compileLayoutCustomTags(sourceDir) {
  try {
    const tagCompiler = await import('./compileLayoutCustomTags.js');
    await tagCompiler.compileSMQFiles(sourceDir);
  } catch (error) {
    throw error;
  }
}

// Parse components
async function componentParser(destDir) {
  try {
    const validate = await import('./componentParser.js');
    await validate.compileSMQFiles(destDir);
  } catch (error) {
    throw error;
  }
}

// Parse components
async function layoutComponentParser(destDir) {
  try {
    const validate = await import('./layoutComponentParser.js');
    await validate.compileSMQFiles(destDir);
  } catch (error) {
    throw error;
  }
}

// Transform text nodes
async function transformTextNodes(destDir) {
  try {
    const regularised = await import('./transformTextNodes.js');
    await regularised.init(destDir);
  } catch (error) {
    throw error;
  }
}


// Resolve imports
async function layoutImportsResolution(destDir) {
  try {
    const resolve = await import('./resolve_layout_imports.js');
    await resolve.importsResolver(destDir);
  } catch (error) {
    throw error;
  }
}

// Resolve slots
async function layoutSlotsResolution(destDir) {
  try {
    const slotResolver = await import('./LayoutSlotResolver.js');
    await slotResolver.processMergedFiles(destDir);
  } catch (error) {
    throw error;
  }
}











// Resolve imports
async function importsResolution(destDir) {
  try {
    const resolve = await import('./resolve_imports.js');
    await resolve.importsResolver(destDir);
  } catch (error) {
    throw error;
  }
}

// Resolve slots
async function slotsResolution(destDir) {
  try {
    const slotResolver = await import('./slotResolver.js');
    await slotResolver.processMergedFiles(destDir);
  } catch (error) {
    throw error;
  }
}



// Transform components
async function transformer(destDir) {
  try {
    const trans = await import('./transformer.js');
    await trans.transformSMQFiles(destDir);
  } catch (error) {
    throw error;
  }
}

// Generate routes and map all routing related files
async function routesGenerator(sourceDir, destDir, src, dest) {
  try {
    // Generate file-based routes
    const routesModule = await import('./fileBasedRouteGenerator.js');
    await routesModule.generateFileBasedRoutes(destDir);

    // Copy routes.js from sourceDir to destDir
    const sourceRoutesFile = path.join(sourceDir, 'routes.js');
    const destRoutesFile = path.join(destDir, 'routes.js');
    await fse.copy(sourceRoutesFile, destRoutesFile);

    // Copy router.js from src/semantq to destDir/semantq
    const sourceRouterFile = path.join(src, 'semantq', 'router.js');
    const destRouterFile = path.join(dest, 'semantq', 'router.js');

    // Ensure the destination directory exists
    await fse.ensureDir(path.dirname(destRouterFile));

    // Copy the file
    await fse.copy(sourceRouterFile, destRouterFile);
  } catch (error) {
    throw error;
  }
}




async function sitemapGenerator() {
  try {
    // Dynamically import the sitemapGenerator module
    const sitemapModule = await import('./sitemapGenerator.js');

    // Access the default export (generateSitemap function)
    const generateSitemap = sitemapModule.default;

    // Call the function
    await generateSitemap();
  } catch (err) {
    console.error('Error during sitemap generation:', err);
  }
}




// Main function to execute the pipeline sequentially
async function main(sourceDir, destDir, destDirBase) {
  try {
    // Step 0: Clean up the build directory
    await cleanupDirectory(destDirBase);
    //await moveFilesToBuild(destDirBase);


    // Step 1: Compile custom tags
    await compileCustomTags(sourceDir);
    await compileCustomTags(componentsSrc);
    await compileLayoutCustomTags(sourceDir);


    // Step 2: Parse components
    await componentParser(destDir);
    await componentParser(componentsDest);
    await layoutComponentParser(destDir);




    // Step 3: Transform text nodes
    await transformTextNodes(destDir);
    await transformTextNodes(componentsDest);



    // Step 4: Resolve imports and slots
   await importsResolution(componentsDest);
   await slotsResolution(componentsDest);


  /* RESOLVE LAYOUT FIELS HERE */


    await layoutImportsResolution(destDir);
    await layoutSlotsResolution(destDir);

    /* END OF DEALING WITH LAYOUTS */



    await importsResolution(destDir);
    await slotsResolution(destDir);



    // Step 5: Transform components
    await transformer(destDir);
    await transformer(componentsDest);

    // Step 6: Generate routes
    await routesGenerator(sourceDir, destDir, src, dest);


    // Step 7: Sitemap Generator
    await sitemapGenerator();

     if (config.sitemap) {
       await sitemapGenerator();
  }

    console.log('\x1b[32mCompilation completed successfully!\x1b[0m');
  } catch (error) {
    console.error('\x1b[31mError during compilation:\x1b[0m', error);
  }
}

// Execute the main function
main(sourceDir, destDir, destDirBase);