//fileBasedRouteGenerator.js
import * as fs from 'fs';
import * as path from 'path';
//import fse from 'fs-extra';



export function generateFileBasedRoutes(basePath) {
  const routesPath = basePath;
  const fileBasedRoutes = {};

  try {
    traverseDirectory(routesPath, '', fileBasedRoutes);
    writeRoutesToFile(basePath, fileBasedRoutes);
  } catch (err) {
    console.error('Error reading directory:', err);
  }
}

function traverseDirectory(directoryPath, relativePath, fileBasedRoutes) {

// Add routes for the home page ("/") and "home" ("/")
    fileBasedRoutes['/'] = '/';
    fileBasedRoutes['home'] = '/';

  //  writeRoutesToFile(basePath, fileBasedRoutes);


  const files = fs.readdirSync(directoryPath);
  files.forEach(file => {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      const newRelativePath = path.join(relativePath, file);
      fileBasedRoutes[newRelativePath] = newRelativePath;
      traverseDirectory(filePath, newRelativePath, fileBasedRoutes);
    }
  });
}

function writeRoutesToFile(basePath, fileBasedRoutes) {
  const filePath = path.join(basePath, 'fileBasedRoutes.json');
  const json = JSON.stringify(fileBasedRoutes, null, 2);

  fs.writeFileSync(filePath, json);
}

//const rootDir = process.cwd();
//const basePath = path.join(rootDir, 'build/routes');

//generateFileBasedRoutes(basePath);
