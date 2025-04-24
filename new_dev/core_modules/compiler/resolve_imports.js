import fs from 'fs';
import path from 'path';
import { walk } from 'estree-walker';
import { fileURLToPath } from 'url';
import config from '../../semantq.config.js';

const { components, globalComponents } = config;
const actualComponentsPath = components['$components'];
const actualGlobalComponentsPath = globalComponents['$global'];






// Helper function: Recursively find all `.ast` files
export function findAstFiles(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(findAstFiles(fullPath)); // Recursive call for subdirectories
    } 
    else if (file.endsWith('.ast')) {
      if (file !== '@layout.smq.ast') {
      files.push(fullPath);
    }
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
    const isPage = resourceName === '@page';
    const fileExtension = '.smq.ast';

    // Keys for accessing ASTs based on whether it's a page or a component
    const jsKey = isPage ? 'jsAST' : `jsAST_${resourceName}`;
    const cssKey = isPage ? 'cssAST' : `cssAST_${resourceName}`;
    const htmlKey = isPage ? 'customAST' : resourceName.toLowerCase();

    // Main AST objects for either @page or component
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

        const resolvedComponentPath = componentPath.replace('smq', 'resolved');
        const componentName = imp.specifiers[0]; // e.g., Counter
        let componentAST;
        let isResolved = false;

        if (fileExists(resolvedComponentPath)) {
            componentAST = JSON.parse(fs.readFileSync(resolvedComponentPath, 'utf-8'));
            isResolved = true;
        } else {
            componentAST = JSON.parse(fs.readFileSync(componentPath, 'utf-8'));
        }


        // Determine keys for accessing component ASTs
        const importJsKey = isResolved ? 'jsAST' : `jsAST_${componentName}`;
        const importCssKey = isResolved ? 'cssAST' : `cssAST_${componentName}`;
        const importHtmlKey = componentName.toLowerCase();

        const componentJSAST = componentAST[importJsKey] || { content: { body: [] } };
        const componentCSSAST = componentAST[importCssKey] || { content: { nodes: [] } };
        const componentHtmlAST = componentAST[importHtmlKey] || { content: [] };

        //console.log("HERE",componentHtmlAST.content[0].html.children[0].children[0][0]);



        // Merge JS AST
        mergedAST.jsAST = {
            ...mergedAST.jsAST,
            content: {
                ...mergedAST.jsAST.content,
                body: [...mergedAST.jsAST.content.body, ...componentJSAST.content.body],
            },
        };

        // Merge CSS AST
        mergedAST.cssAST = {
            ...mergedAST.cssAST,
            content: {
                ...mergedAST.cssAST.content,
                nodes: [...mergedAST.cssAST.content.nodes, ...componentCSSAST.content.nodes],
            },
        };

        // Merge HTML AST
        mergedAST = {
            ...mergedAST,
            [importHtmlKey]: componentHtmlAST.content[0].html.children[0].children[0],
        };
    }

            //console.log("HERE",componentHtmlAST.content);


    // Write the merged AST to a new file
    const newFileName = path.join(path.dirname(astFile), `${resourceName}.merged.ast`);
            //console.log("file",newFileName);

    fs.writeFileSync(newFileName, JSON.stringify(mergedAST, null, 2), 'utf-8');
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
          let source = node.source.value; //$global/SemantqNav.smq
         
          if (source.includes('$global')) {
           source = source.replace('$global', actualGlobalComponentsPath); 
            //console.log("NT",source);

          } 

          if (source.includes('$components')) {
           source = source.replace('$components', actualComponentsPath); 

          } 

          // check if a .smq extension exists

          let fileName = path.basename(source);

          if (!fileName.endsWith('.smq')) {
            source = source + '.smq';
          }


          //console.log("NT",source);

          let updatedSource = source; 

          
          const specifiers = node.specifiers.map((s) => s.local.name);
          imports.push({ updatedSource, specifiers });
        }
      },
    });

    //console.log(imports);

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

      //console.log("HERE NOW",imports);

      const baseDir = path.dirname(astFile);

      //console.log("SEEEEEE 2",imports);

      // Merge components into the page and write to @page.merged.ast
      const mergedContent = mergeComponents(imports, baseDir, astFile);

      return { astFile, imports, mergedContent };
    }).filter(item => item !== null); // Remove null entries (files without imports)

    return resolvedImports;
  } catch (error) {
    console.error('Error in importsResolver:', error);
    throw error;
  }
}
