import fs from 'fs';
import path from 'path';
import * as acorn from 'acorn';
import { walk } from 'estree-walker';

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
          const source = node.source.value;
          const specifiers = node.specifiers.map((s) => s.local.name);
          imports.push({ source, specifiers });
        }
      },
    });

    return imports;
  } catch (error) {
    console.error(`Error resolving imports for ${astFilePath}:`, error);
    return [];
  }
}

// Main function: Resolve imports for all AST files in the directory
export async function importsResolver(destDir) {
  try {
    // Step 1: Find all AST files
    const astFiles = findAstFiles(destDir);
    console.log('Found AST files:', astFiles);

    // Step 2: Resolve imports for each AST file
    const resolvedImports = astFiles.map((astFile) => {
      const imports = resolveImports(astFile);
      return { astFile, imports };
    });

    // Log the resolved imports
    console.log('Resolved imports:', JSON.stringify(resolvedImports, null, 2));
    return resolvedImports;
  } catch (error) {
    console.error('Error in importsResolver:', error);
    throw error;
  }
}