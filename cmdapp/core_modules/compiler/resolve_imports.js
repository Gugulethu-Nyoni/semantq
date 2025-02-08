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
    } else if (file.endsWith('.ast')) {
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



// Helper function: Merge components into the page and write the merged AST
function mergeComponents(imports, baseDir, astFile) {
  try {
    // Read the main AST
    const mainAstContent = fs.readFileSync(astFile, 'utf-8');
    const mainAst = JSON.parse(mainAstContent);

    // Debug: Check if mainAst is correctly parsed
    console.log(`Parsing main AST from: ${astFile}`);
    //console.log("Main AST structure:", JSON.stringify(mainAst, null, 2));

    // Ensure mainAst has jsAST, cssAST, and customAST with valid content
    if (!mainAst.jsAST || !mainAst.jsAST.content || !Array.isArray(mainAst.jsAST.content.body)) {
      console.error(`Invalid or missing jsAST in ${astFile}:`, mainAst.jsAST);
      return null;
    }
    if (!mainAst.cssAST || !mainAst.cssAST.content || !Array.isArray(mainAst.cssAST.content.nodes)) {
      console.error(`Invalid or missing cssAST in ${astFile}:`, mainAst.cssAST);
      return null;
    }
    if (!mainAst.customAST || !Array.isArray(mainAst.customAST.content)) {
      console.error(`Invalid or missing customAST in ${astFile}:`, mainAst.customAST);
      return null;
    }

    // Initialize merged AST with jsAST, cssAST, and customAST
    let mergedAst = {
      jsAST: {
        type: 'JavaScript',
        content: {
          type: 'Program',
          body: [...mainAst.jsAST.content.body], // Preserve the main jsAST body
          sourceType: 'module',
        },
      },
      cssAST: {
        type: 'CSS',
        content: { ...mainAst.cssAST.content }, // Preserve the CSS AST content
      },
      customAST: {
        type: 'Custom',
        content: [...mainAst.customAST.content], // Preserve the Custom AST content
      },
    };

    // Loop through imports and merge their AST bodies
    for (const imp of imports) {
      let componentPath = imp.updatedSource.replace('src', 'build').replace('.smq', '.smq.ast');
      const componentContent = loadComponent(componentPath);

      if (componentContent) {
        try {
          const componentAst = JSON.parse(componentContent);
          
          // Debug: Check structure of imported component AST
          console.log(`Parsing component AST from: ${componentPath}`);
          //console.log("Component AST structure:", JSON.stringify(componentAst, null, 2));

          // Merge jsAST, cssAST, and customAST bodies if present
          if (componentAst.jsAST && componentAst.jsAST.content && Array.isArray(componentAst.jsAST.content.body)) {
            mergedAst.jsAST.content.body.push(...componentAst.jsAST.content.body);
          }
          if (componentAst.cssAST && componentAst.cssAST.content && Array.isArray(componentAst.cssAST.content.nodes)) {
            mergedAst.cssAST.content.nodes.push(...componentAst.cssAST.content.nodes);
          }
          if (componentAst.customAST && Array.isArray(componentAst.customAST.content)) {
            mergedAst.customAST.content.push(...componentAst.customAST.content);
          }

        } catch (parseError) {
          console.error(`Error parsing AST of ${componentPath}:`, parseError);
        }
      }
    }

    // Write the correctly formatted merged AST
    const mergedFilePath = astFile.replace('.smq.ast', '.merged.ast');
    fs.writeFileSync(mergedFilePath, JSON.stringify(mergedAst, null, 2), 'utf-8');
    console.log(`Merged AST written to: ${mergedFilePath}`);

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

  console.log("INNNN?");
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
