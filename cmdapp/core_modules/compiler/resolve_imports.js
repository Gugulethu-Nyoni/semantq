import fs from 'fs';
import path from 'path';
import { walk } from 'estree-walker';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Define alias resolution (match your Vite config)
const aliasMap = {
  "$components": path.resolve(__dirname, "../../src/components"),
  "$lib": path.resolve(__dirname, "../../src/lib"),  // Add more if needed
};

//console.warn("ALIAS",aliasMap.$components)



// Helper function: Recursively find all `+page.smq.ast` files
export function findAstFiles(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(findAstFiles(fullPath)); // Recursive call for subdirectories
    } else if (file.endsWith('+page.smq.ast')) {
      files.push(fullPath);
    }
  });
  return files;
}



// Helper function: Load a component file
function loadComponent(componentPath) {
  try {
    // Ensure the componentPath is an absolute path before reading
    const fullPath = path.resolve(componentPath); // This should now be absolute
    return fs.readFileSync(fullPath, 'utf-8');
  } catch (error) {
    console.error(`Error loading component ${componentPath}:`, error);
    return null;
  }
}

// Helper function: Merge components into the page
// Helper function: Merge components into the page and write the merged AST
function mergeComponents(imports, baseDir, astFile) {
  let mergedContent = '';

  for (const imp of imports) {
    let componentPath = imp.updatedSource.replace('src', 'build').replace('.smq', '.smq.ast');
    //console.log("Merging Component:", componentPath);
    const componentContent = loadComponent(componentPath);

    if (componentContent) {
      mergedContent += `\n${componentContent}`;
    }
  }

  // Now write the merged content to the new +page.merged.ast file
  const mergedFilePath = astFile.replace('.smq.ast', '.merged.ast');
  fs.writeFileSync(mergedFilePath, mergedContent, 'utf-8');
  console.log(`Merged AST written to: ${mergedFilePath}`);

  return mergedContent;
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
        if (node.type === 'ImportDeclaration') {
          const source = node.source.value; //$components/Button.smq
          let updatedSource = source; 

          if (source.startsWith('$')) {
            const firstChunk = source.split('/')[0]; // Extract the first chunk (e.g. $components)
            const alias = aliasMap[firstChunk]; // Get the alias from the alias map
            updatedSource = source.replace(firstChunk, alias); // Replace the first chunk with the alias
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
  try {
    // Step 1: Find all AST files
    const astFiles = findAstFiles(destDir);

    // Step 2: Resolve imports and merge components for each AST file
    const resolvedImports = astFiles.map((astFile) => {
      const imports = resolveImports(astFile);

      // If no imports are found, skip this file
      if (imports.length === 0) {
        console.log(`No imports found in ${astFile}. Skipping.`);
        return null; // Return null if no imports
      }

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
