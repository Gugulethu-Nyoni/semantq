import fs from 'fs';
import path from 'path';

class SlotResolver {
  constructor(ast) {
    this.ast = ast; // The merged AST from +page.merged.ast
    this.jsAST = ast.jsAST || { type: 'JavaScript', content: [] }; // Initialize JS AST
    this.cssAST = ast.cssAST || { type: 'CSS', content: {} }; // Initialize CSS AST
    this.customAST = ast.customAST || { type: 'Custom', content: [] }; // Initialize custom AST
    this.importedComponents = this.extractImportedComponents(); // Extract imported components
  }

  // Helper function to safely get custom content
  getCustomContent() {
    return this.customAST.content || [];
  }

  // Helper function to safely get JS content
  getJSContent() {
    return this.jsAST.content || [];
  }

  // Helper function to safely get CSS content
  getCSSContent() {
    return this.cssAST.content || {};
  }

  // Extract imported components from the jsAST
  extractImportedComponents() {
    const importedComponents = {};
    const jsContent = this.getJSContent();

    if (jsContent.body) {
      jsContent.body.forEach(node => {
        if (node.type === 'ImportDeclaration') {
          const componentName = node.specifiers[0].local.name; // e.g., "Header"
          const componentPath = node.source.value; // e.g., "$components/Header.smq"
          importedComponents[componentName] = componentPath;
        }
      });
    }

    return importedComponents;
  }

  // Merge JS content from a slot into the main JS AST
  mergeJSContent(slotJSContent) {
    if (slotJSContent && slotJSContent.type === 'JavaScript' && Array.isArray(slotJSContent.content)) {
      this.jsAST.content = this.jsAST.content.concat(slotJSContent.content);
    } else {
      console.warn('slotJSContent is not valid or has no JavaScript content');
    }
  }

  // Merge CSS content from a slot into the main CSS AST
  mergeCSSContent(slotCSSContent) {
    if (slotCSSContent && slotCSSContent.type === 'CSS') {
      this.cssAST.content = {
        ...this.cssAST.content,
        ...slotCSSContent.content,
      };
    }
  }

  // Resolve default slots (no name specified)
  resolveDefaultSlots() {
    const content = this.getCustomContent();

    // Flatten all nodes and extract slots without a name (default slots)
    const defaultSlots = content.flatMap(node =>
      this.extractSlots(node).filter(slot => !slot.name) // Default slots have no name
    );

    // For each default slot, resolve its content and merge JS & CSS
    defaultSlots.forEach(slot => {
      slot.children = slot.fallback || []; // Fallback if no content is available

      // Merge slot-specific JS and CSS into the main ASTs
      if (slot.jsAST) {
        this.mergeJSContent(slot.jsAST);  // Merge JS content from the slot
      }
      if (slot.cssAST) {
        this.mergeCSSContent(slot.cssAST); // Merge CSS content from the slot
      }
    });
  }

  // Map imported components to their custom syntax in the HTML
  mapImportedComponents() {
    const content = this.getCustomContent();

    content.forEach(node => {
      if (node.html && node.html.children) {
        this.mapComponentsInNode(node.html.children);
      }
    });
  }

  // Recursively map imported components in a node's children
  mapComponentsInNode(children) {
    children.forEach(child => {
      if (child.type === 'Element' && this.importedComponents[child.name]) {
        // Replace the custom syntax with the resolved component
        child.name = this.importedComponents[child.name].split('/').pop().replace('.smq', ''); // e.g., "Header"
      }

      // Recursively process child nodes
      if (child.children) {
        this.mapComponentsInNode(child.children);
      }
    });
  }

  // Helper function to extract slots from a node
  extractSlots(node) {
    if (node.type === 'Element' && node.name === 'slot') {
      return [node]; // Return the slot node if it's a slot element
    }
    // Recursively search for slot nodes within children of the node
    return node.children ? node.children.flatMap(this.extractSlots.bind(this)) : [];
  }

  // Resolve all slots (including dynamic ones and nested)
  resolve() {
    this.resolveDefaultSlots(); // Resolve default slots
    this.mapImportedComponents(); // Map imported components to their custom syntax

    // Return the resolved AST structure
    return {
      jsAST: this.jsAST, // Updated JS AST
      cssAST: this.cssAST, // Updated CSS AST
      customAST: {
        type: 'Custom',
        content: this.getCustomContent(), // The processed custom AST content
      },
    };
  }
}






// Helper function to remove component references (to clean the AST)
function removeComponentReferences(ast) {
  const newAst = JSON.parse(JSON.stringify(ast)); // Deep clone the AST

  newAst.body = newAst.body.filter(node => {
    if (node.type === 'ImportDeclaration') {
      // Keep import declarations that don't reference $components
      return !node.source.value.startsWith('$components');
    } else if (node.type === 'CallExpression' || node.type === 'ExpressionStatement') {
      // Remove call expressions or expression statements that reference $components
      return !node.expression.callee.object.name.startsWith('$components');
    }
    return true;
  });

  return newAst;
}

// Function to traverse the directory and find all +page.merged.ast files
export function traverseMergedFiles(dir) {
  let files = [];

  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(traverseMergedFiles(fullPath)); // Recursive call for subdirectories
    } else if (file.endsWith('.merged.ast')) {
      files.push(fullPath); // Add merged AST files
    }
  });

  return files;
}

// Function to process files and generate resolved AST
export function processMergedFiles(dir) {
  const files = traverseMergedFiles(dir); // Find all merged AST files

  files.forEach(file => {
    const ast = JSON.parse(fs.readFileSync(file, 'utf-8'));

      console.log("*****Slots Resolution", file);


    // Instantiate SlotResolver and resolve the AST
    const resolver = new SlotResolver(ast);
    const resolvedAST = resolver.resolve(); // Resolve the AST

    console.log("LA",resolver.customAST);

    const resolvedJsAst = removeComponentReferences(resolvedAST.jsAST.content);

    // Create the structure for +page.resolved.ast
    const resolvedASTStructure = {
      jsAST: {
        type: 'JavaScript',
        content: resolvedJsAst, // Include resolved JS AST
      },
      cssAST: {
        type: 'CSS',
        content: resolvedAST.cssAST.content, // Include resolved CSS AST
      },
      customAST: {
        type: 'Custom',
        content: resolvedAST.customAST.content, // Include resolved custom AST
      },
    };

    // Write the resolved AST file
    const outputPath = file.replace('.merged.ast', '.resolved.ast');
    fs.writeFileSync(outputPath, JSON.stringify(resolvedASTStructure, null, 2), 'utf-8');
    console.log('Consolidated AST written to:', outputPath);
  });
}

// Example usage
// const dir = './build/routes';
// const importedComponents = { Header: 'Header', Footer: 'Footer' }; // Example of dynamic component imports
// processMergedFiles(dir, importedComponents);
