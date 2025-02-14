import fs from 'fs';
import path from 'path';
import { walk } from 'estree-walker';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Define alias resolution (match your Vite config)
const aliasMap = {
  "$components": path.resolve(__dirname, "../../src/components"),
  "$global": path.resolve(__dirname, "../../src/components/global"),
  "$lib": path.resolve(__dirname, "../../src/lib"),  
};

//console.warn("ALIAS",aliasMap.$components)



// Helper function: Recursively find all `.ast` files
export function findAstFiles(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(findAstFiles(fullPath)); // Recursive call for subdirectories
    } 
    else if (file.endsWith('.ast')) {
      files.push(fullPath);
    }
  });
  return files;
}



function fileExists(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}


// Helper function: Load a component file
// Helper function: Load a component file
function loadComponent(componentPath) {
  try {
    // Ensure the componentPath is an absolute path before reading
    const fileName = path.basename(componentPath); // Button.resolved.ast
    const componentName = fileName.split('.')[0];
    const basicAstFileName = componentName + '.smq.ast';
    const astComponentPath = componentPath.replace(fileName, basicAstFileName);

    const fullPath = path.resolve(componentPath); // This should now be absolute

    try {
      const fileContent = fs.readFileSync(fullPath, 'utf-8');
      return JSON.parse(fileContent); // Parse the stringified JSON into an object
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File not found, attempt to read the alternative file path
        const alternativeFullPath = path.resolve(astComponentPath);
        const fileContent = fs.readFileSync(alternativeFullPath, 'utf-8');
        return JSON.parse(fileContent); // Parse the stringified JSON into an object
      } else {
        // Re-throw the error if it's not a file not found error
        throw error;
      }
    }
  } catch (error) {
    console.error(`Error loading component ${componentPath}:`, error);
    return null;
  }
}









function mergeComponents(imports, baseDir, astFile) {
    const mainAst = JSON.parse(fs.readFileSync(astFile, 'utf-8'));
    let resourceName = path.basename(astFile, '.smq.ast').split('.')[0];
    const isPage = resourceName === '+page';
    const fileExtension = '.smq.ast';

    // Keys for accessing ASTs based on whether it's a page or a component
    const jsKey = isPage ? 'jsAST' : `jsAST_${resourceName}`;
    const cssKey = isPage ? 'cssAST' : `cssAST_${resourceName}`;
    const htmlKey = isPage ? 'customAST' : resourceName.toLowerCase();

    // Main AST objects for either +page or Component
    const mainJSAST = mainAst[jsKey] || { content: { body: [] } };
    const mainCSSAST = mainAst[cssKey] || { content: { nodes: [] } };
    const mainHtmlAST = mainAst[htmlKey] || { content: [] };

    // Object to hold merged AST
    let mergedAST = {
        jsAST: mainJSAST,
        cssAST: mainCSSAST,
        [htmlKey]: mainHtmlAST,
    };

    // Extract imported components' ASTs and merge them
    for (const imp of imports) {
        let componentPath = imp.updatedSource
            .replace('src', 'build')
            .replace('.smq', fileExtension);

        const resolvedComponentPath = componentPath.replace('smq','resolved'); 
        const componentName = imp.specifiers[0]; // e.g. Counter
        let componentAST; 

        if (fileExists(resolvedComponentPath)) {
        //console.log("Resolved component found, loading from:", resolvedComponentPath);
        componentAST = JSON.parse(fs.readFileSync(resolvedComponentPath, 'utf-8'));
        } else {
          //console.log("Resolved component not found, loading from:", componentPath);
          componentAST = JSON.parse(fs.readFileSync(componentPath, 'utf-8'));
       }

        const importJsKey = `jsAST_${componentName}`;
        const importCssKey = `cssAST_${componentName}`;
        const importHtmlKey = componentName.toLowerCase();

        const componentJSAST = componentAST[importJsKey] || { content: { body: [] } };
        const componentCSSAST = componentAST[importCssKey] || { content: { nodes: [] } };
        const componentHtmlAST = componentAST[importHtmlKey] || { content: [] };

        // Merging JS AST
        const componentJSBody = componentJSAST.content.body;
        mergedAST.jsAST = {
            ...mergedAST.jsAST,  // Spread the root structure of mainJSAST
            content: {
                ...mergedAST.jsAST.content,  // Keep the content structure intact
                body: [...mergedAST.jsAST.content.body, ...componentJSBody]  // Merge the body
            }
        };

        // Merging CSS AST
        const componentCSSNodes = componentCSSAST?.content?.nodes || [];
        mergedAST.cssAST = {
            ...mergedAST.cssAST,  // Spread the root structure of mainCSSAST
            content: {
                ...mergedAST.cssAST.content, // Keep the content structure intact
                nodes: [...mergedAST.cssAST.content.nodes, ...componentCSSNodes]  // Merge the nodes
            }
        };

        // Merging HTML AST
        /*
        mergedAST.customAST = {
            ...mergedAST.customAST,  // Spread the root structure of mainHtmlAST
            content: [
                ...mergedAST.customAST.content,
                { [importHtmlKey]: componentHtmlAST.content }  // Merge the component HTML AST under its key
            ]
        };
        */

        mergedAST = {
        ...mergedAST,  // Keep existing properties
        [importHtmlKey]: componentHtmlAST.content  // Add component HTML AST at the top level
          };




    }

/*
    const finalMergedAST = {
    [jsKey]: mergedAST.jsAST,  // Merged JS AST
    [cssKey]: mergedAST.cssAST, // Merged CSS AST
    ...mergedAST  // Spread all properties, including dynamically added component ASTs
};
*/

    // Construct the new file name: resourceName + ".merged.ast"
    const newFileName = path.join(path.dirname(astFile), `${resourceName}.merged.ast`);

    // Write the merged ASTs to the new file
    //console.log(newFileName,JSON.stringify(mergedAST,null,2));
    fs.writeFileSync(newFileName, JSON.stringify(mergedAST, null, 2), 'utf-8');
    //console.log(`Merged AST written to: ${newFileName}`);
}










// Helper function: Parse AST and resolve imports
function resolveImports(astFilePath) {
  try {
    // Read the AST file
    const astContent = fs.readFileSync(astFilePath, 'utf-8');
    const ast = JSON.parse(astContent);

    // Resolve imports from the AST
    const imports = [];
    walk(ast, {
      enter(node) {
        if (node.type === 'ImportDeclaration' && node.source.value.startsWith('$')) {
          const source = node.source.value; //$components/Button.smq
          let updatedSource = source; 

          if (source.startsWith('$')) {
            const firstChunk = source.split('/')[0]; // Extract the first chunk (e.g. $components)
            const alias = aliasMap[firstChunk]; // Get the alias from the alias map
            updatedSource = source.replace(firstChunk, alias); // Replace the first chunk with the alias
            //console.log(updatedSource);

          }
          const specifiers = node.specifiers.map((s) => s.local.name);
          imports.push({ updatedSource, specifiers });
        }
      },
    });

    return imports;
  } catch (error) {
    console.error(`Error resolving imports for ${astFilePath}:`, error);
    return [];
  }
}



// Main function: Resolve imports and merge components
export async function importsResolver(destDir) {

  //console.log("INNNN?");
  try {
    // Step 1: Find all AST files
    const astFiles = findAstFiles(destDir);

    // Step 2: Resolve imports and merge components for each AST file
    const resolvedImports = astFiles.map((astFile) => {
      const imports = resolveImports(astFile);

      // If no imports are found, skip this file
      if (imports.length === 0) {
        //console.log(`No imports found in ${astFile}. Skipping.`);
        return null; // Return null if no imports
      }

      //console.log(imports);

      const baseDir = path.dirname(astFile);

      //console.log("SEEEEEE 2",imports);

      // Merge components into the page and write to +page.merged.ast
      const mergedContent = mergeComponents(imports, baseDir, astFile);

      return { astFile, imports, mergedContent };
    }).filter(item => item !== null); // Remove null entries (files without imports)

    return resolvedImports;
  } catch (error) {
    console.error('Error in importsResolver:', error);
    throw error;
  }
}
