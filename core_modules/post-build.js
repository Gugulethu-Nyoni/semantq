"use strict";

import path from 'path';
import fs from 'fs/promises';
import fse from 'fs-extra';

const rootDir = process.cwd();

// Construct paths to key source and dest directories
const distDir = path.join(rootDir, 'dist');
const buildDir = path.join(distDir, 'build');
const componentsDir = path.join(buildDir, 'components');
const routesDir = path.join(buildDir, 'routes');

async function postBuild() {
  try {
    // 1. Delete the components directory in buildDir/components
    await fse.remove(componentsDir);
    //console.log(`Deleted ${componentsDir}`);

    // 2. Copy all files from buildDir/routes into distDir
    await fse.copy(routesDir, distDir);
    //console.log(`Copied files from ${routesDir} to ${distDir}`);

    // 3. Delete the build directory after copying
    await fse.remove(buildDir);
    //console.log(`Deleted ${buildDir}`);

    //console.log('Post-build process completed successfully.');
  } catch (error) {
    console.error('Error during post-build process:', error);
  }
}

postBuild();