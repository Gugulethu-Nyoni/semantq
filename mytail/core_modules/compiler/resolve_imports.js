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



// Helper function: Load a component file
function loadComponent(componentPath) {
  try {
    // Ensure the componentPath is an absolute path before reading
    
    const fileName = path.basename(componentPath); // Button.resolved.ast
    const componentName = fileName.split('.')[0];
    const basicAstFileName = componentName + '.smq.ast'; 
    const astComponentPath = componentPath.replace(fileName, basicAstFileName);



    //console.log("HHHHHH",componentPath);
    const fullPath = path.resolve(componentPath); // This should now be absolute
    
    try {
    return fs.readFileSync(fullPath, 'utf-8');
    } catch (error) {
    if (error.code === 'ENOENT') {
    // File not found, attempt to read the alternative file path
    const alternativeFullPath = path.resolve(astComponentPath);
    return fs.readFileSync(alternativeFullPath, 'utf-8');
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
  try {
    // Read the main AST
    const mainAstContent = fs.readFileSync(astFile, 'utf-8');
    const mainAst = JSON.parse(mainAstContent);

    // Detect if this is a page (has customAST) or a component
    const isPage = !!mainAst.customAST; // Pages have 'customAST'

    // Component key dynamically determined
    const componentKey = isPage
      ? 'customAST'
      : path.basename(astFile, '.smq.ast').split('.')[0].toLowerCase();

    const componentName = path.basename(astFile, '.smq.ast').split('.')[0];

    // Dynamic AST keys for components
    const jsKey = isPage ? 'jsAST' : `jsAST_${componentName}`;
    const cssKey = isPage ? 'cssAST' : `cssAST_${componentName}`;

    // Initialize merged AST with dynamic keys
    let mergedAst = {
      [jsKey]: {
        type: 'JavaScript',
        content: {
          type: 'Program',
          body: mainAst[jsKey]?.content?.body || [], // Preserve JS body
          sourceType: 'module',
        },
      },
      [cssKey]: {
        type: 'CSS',
        content: mainAst[cssKey]?.content || { nodes: [] }, // Preserve CSS content
      },
      [componentKey]: {
        type: 'Custom',
        content: mainAst[componentKey]?.content || [], // Preserve Custom AST
      },
    };

    // Track merged components to avoid duplication
    const mergedComponents = new Set();

    // Helper function to check if a customAST node is a duplicate
    const isCustomASTNodeDuplicate = (node, mergedNodes) => {
      return mergedNodes.some(
        (existingNode) => JSON.stringify(existingNode) === JSON.stringify(node)
      );
    };

    // Merge component ASTs
    for (const imp of imports) {
      const componentName = path.basename(astFile, '.smq.ast').split('.')[0];
      const fileExtension = componentName === '+page' ? '.resolved.ast' : '.smq.ast';
      const componentPath = imp.updatedSource
        .replace('src', 'build')
        .replace('.smq', fileExtension);

        //console.log("PATH",componentPath);

      const componentContent = loadComponent(componentPath);

      if (componentContent && !mergedComponents.has(componentPath)) {
        try {
          const componentAst = JSON.parse(componentContent);

          // Determine dynamic component keys
          const componentName = path.basename(componentPath, fileExtension).toLowerCase();
          const componentHtmlKey = componentAst.customAST ? 'customAST' : componentName;
          const componentJsKey = `jsAST_${componentName}`;
          const componentCssKey = `cssAST_${componentName}`;

          // Merge component JS
          if (componentAst[componentJsKey]?.content?.body) {
            mergedAst[jsKey].content.body.push(...componentAst[componentJsKey].content.body);
          }

          // Merge component CSS
          if (componentAst[componentCssKey]?.content?.nodes) {
            mergedAst[cssKey].content.nodes.push(...componentAst[componentCssKey].content.nodes);
          }

          // Merge component HTML
          if (componentAst[componentHtmlKey]?.content) {
            if (!mergedAst[componentHtmlKey]) {
              mergedAst[componentHtmlKey] = { type: 'HTML', content: [] };
            }
            for (const customNode of componentAst[componentHtmlKey].content) {
              if (!isCustomASTNodeDuplicate(customNode, mergedAst[componentHtmlKey].content)) {
                mergedAst[componentHtmlKey].content.push(customNode);
              }
            }
          }

          // Mark this component as merged
          mergedComponents.add(componentPath);
        } catch (parseError) {
          console.error(`Error parsing AST of ${componentPath}:`, parseError);
        }
      }
    }

    // Write the correctly formatted merged AST
    const mergedFilePath = astFile.replace('.smq.ast', '.merged.ast');
    fs.writeFileSync(mergedFilePath, JSON.stringify(mergedAst, null, 2), 'utf-8');
    //console.log(`Merged AST written to: ${mergedFilePath}`);

    return mergedAst;
  } catch (error) {
    console.error(`Error merging components into ${astFile}:`, error);
    return null;
  }
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
