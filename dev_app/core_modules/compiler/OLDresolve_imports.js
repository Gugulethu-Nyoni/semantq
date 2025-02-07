import acorn from 'acorn';
import { walk } from 'estree-walker';
import fs from 'fs';
import path from 'path';

// Set the root directory to process
const destDir = path.resolve('src/build/routes');

// Helper function: Recursively find all `+page.smq.ast` files
function findAstFiles(dir) {
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

// Helper function: Parse a file and extract imports
function extractImports(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');
  const ast = acorn.parse(code, { sourceType: 'module', ecmaVersion: 'latest' });

  let imports = [];
  walk(ast, {
    enter(node) {
      if (node.type === 'ImportDeclaration') {
        imports.push({ source: node.source.value, specifiers: node.specifiers.map(s => s.local.name) });
      }
    },
  });

  return { filePath, code, imports, ast };
}

// Function: Load and merge components dynamically
function resolveImports({ filePath, code, imports }) {
  let mergedCode = code;

  for (const imp of imports) {
    const componentPath = path.resolve(path.dirname(filePath), imp.source);
    if (fs.existsSync(componentPath)) {
      const componentCode = fs.readFileSync(componentPath, 'utf-8');
      mergedCode += `\n${componentCode}`;
    } else {
      console.warn(`Warning: Component file not found -> ${componentPath}`);
    }
  }

  return mergedCode;
}



// Function: Process and transform component tags
function transformComponents(mergedCode) {
  return mergedCode.replace(/<(\w+)([^>]*)>([\s\S]*?)<\/\1>/g, (match, tag, attrs, content) => {
    return `
      <div class="${tag.toLowerCase()}">
        ${content.trim()}
        <script>
          const props = ${JSON.stringify(parseAttributes(attrs))};
          const slots = { default: ${JSON.stringify(content.trim())} };
          console.log('Rendering ${tag} with props:', props, 'and slots:', slots);
        </script>
      </div>
    `;
  });
}

// Helper function: Parse component attributes into key-value pairs
function parseAttributes(attrs) {
  let props = {};
  attrs.replace(/(\w+)=["']([^"']*)["']/g, (_, key, value) => {
    props[key] = value;
    return '';
  });
  return props;
}

// Main execution: Process all `+page.smq.ast` files
const astFiles = findAstFiles(destDir);
let finalMergedCode = '';

for (const file of astFiles) {
  const parsed = extractImports(file);
  const mergedCode = resolveImports(parsed);
  const transformedCode = transformComponents(mergedCode);
  finalMergedCode += `\n<!-- Processed from: ${file} -->\n${transformedCode}`;
}

// Output final merged file
const outputPath = path.resolve('dist/merged-page.ast');
fs.writeFileSync(outputPath, finalMergedCode, 'utf-8');
console.log('Final merged AST written to:', outputPath);
