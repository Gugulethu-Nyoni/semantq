import fs from 'fs';
import path from 'path';

class SlotResolver {
  constructor(ast) {
    this.ast = ast; // The merged AST from +page.merged.ast
    this.jsAST = ast.jsAST || { type: 'JavaScript', content: {} }; // Initialize JS AST
    this.cssAST = ast.cssAST || { type: 'CSS', content: {} }; // Initialize CSS AST
    this.customAST = ast.customAST || { type: 'Custom', content: [] }; // Initialize custom AST
  }

  // Helper function to safely get custom content
  getCustomContent() {
    return this.customAST.content || [];
  }

  // Helper function to safely get JS content
  getJSContent() {
    return this.jsAST.content || {};
  }

  // Helper function to safely get CSS content
  getCSSContent() {
    return this.cssAST.content || {};
  }

 // Merge JS content from a slot into the main JS AST
mergeJSContent(slotJSContent) {
  //console.log("JS AST", JSON.stringify(slotJSContent, null, 2));

  // Check if slotJSContent exists and has content of type 'JavaScript'
  if (slotJSContent && slotJSContent.type === 'JavaScript' && Array.isArray(slotJSContent.content)) {
    
    // Directly merge the JS content into the main JS AST
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
        ...slotCSSContent.content, // Merge slot CSS content into the main CSS AST
      };
    }
  }

  // Resolve default slots
  resolveDefaultSlots() {
  const content = this.getCustomContent();
  const defaultSlots = content.flatMap(node =>
    this.extractSlots(node).filter(slot => !slot.name)
  );
  defaultSlots.forEach(slot => {
    slot.children = slot.fallback || [];
    if (slot.jsAST) {
      this.mergeJSContent(slot.jsAST);  // Call mergeJSContent with actual content
    }
    this.mergeCSSContent(slot.cssAST); // Merge CSS content from the slot
  });
}


  // Resolve named slots
resolveNamedSlots() {
  const content = this.getCustomContent();
  const namedSlots = content.flatMap(node =>
    this.extractSlots(node).filter(slot => slot.name)
  );
  namedSlots.forEach(slot => {
    const matchingContent = content.find(
      node => node.type === 'Element' && node.name === slot.name
    );
    if (matchingContent) {
      slot.children = matchingContent.children;

      // Ensure method is called correctly with the necessary content
      if (matchingContent.jsAST) {

        this.mergeJSContent(matchingContent.jsAST); // Merge JS content from the slot
      }

      this.mergeCSSContent(matchingContent.cssAST); // Merge CSS content from the slot
    } else {
      slot.children = slot.fallback || [];
    }
  });
}


  // Resolve fallback slots
  resolveFallbackSlots() {
    const content = this.getCustomContent();
    const slots = content.flatMap(node => this.extractSlots(node));
    slots.forEach(slot => {
      if (!slot.children.length && slot.fallback) {
        slot.children = slot.fallback;
        this.mergeJSContent(slot.fallback.jsAST); // Merge JS content from the fallback
        this.mergeCSSContent(slot.fallback.cssAST); // Merge CSS content from the fallback
      }
    });
  }

  // Resolve scoped slots
  resolveScopedSlots() {
    const content = this.getCustomContent();
    const scopedSlots = content.flatMap(node =>
      this.extractSlots(node).filter(slot => slot.scoped)
    );
    scopedSlots.forEach(slot => {
      slot.children = slot.children.map(child => ({
        ...child,
        props: { ...child.props, ...slot.scopedProps },
      }));
      this.mergeJSContent(slot.jsAST); // Merge JS content from the slot
      this.mergeCSSContent(slot.cssAST); // Merge CSS content from the slot
    });
  }

  // Resolve nested slots recursively
  resolveNestedSlots() {
    const resolveNested = (node) => {
      if (node.children) {
        node.children.forEach(child => {
          if (child.type === 'slot') {
            this.resolveDefaultSlots();
            this.resolveNamedSlots();
            this.resolveFallbackSlots();
            this.resolveScopedSlots();
          }
          resolveNested(child); // Recursively resolve nested children
        });
      }
    };
    this.getCustomContent().forEach(resolveNested); // Resolve nested slots
  }

  // Helper function to extract slots from a node
  extractSlots(node) {
    if (node.type === 'Element' && node.name === 'slot') {
      return [node]; // Return the slot node if it's a slot element
    }
    return node.children ? node.children.flatMap(this.extractSlots.bind(this)) : []; // Recursively search for slot nodes in children
  }

  // Resolve dynamic slot injection
  resolveDynamicSlots() {
    const content = this.getCustomContent();
    const dynamicSlots = content.flatMap(node =>
      this.extractSlots(node).filter(slot => slot.dynamic)
    );
    dynamicSlots.forEach(slot => {
      if (slot.dynamicContent) {
        slot.children = slot.dynamicContent;
        this.mergeJSContent(slot.dynamicContent.jsAST); // Merge JS content from the dynamic slot
        this.mergeCSSContent(slot.dynamicContent.cssAST); // Merge CSS content from the dynamic slot
      }
    });
  }

  // Main resolve method
  resolve() {
    this.resolveDefaultSlots();
    this.resolveNamedSlots();
    this.resolveFallbackSlots();
    this.resolveScopedSlots();
    this.resolveNestedSlots();
    this.resolveDynamicSlots();

    // Return resolved AST with updated JS and CSS
    return {
      jsAST: this.jsAST, // Updated JS AST
      cssAST: this.cssAST, // Updated CSS AST
      customAST: {
        type: 'Custom',
        content: this.getCustomContent() // The processed custom AST content
      }
    };
  }
}





function removeComponentReferences(ast) {
  // Create a new AST with the modified nodes
  const newAst = JSON.parse(JSON.stringify(ast)); // Deep clone the AST

  // Traverse the AST and remove nodes that reference $components
  newAst.body = newAst.body.filter(node => {
    if (node.type === 'ImportDeclaration') {
      // Keep import declarations that don't reference $components
      return !node.source.value.startsWith('$components');
    } else if (node.type === 'CallExpression' || node.type === 'ExpressionStatement') {
      // Remove call expressions or expression statements that reference $components
      return !node.expression.callee.object.name.startsWith('$components');
    }
    // Keep other node types unchanged
    return true;
  });

  return newAst;
}




// Function to traverse the directory and find all +page.merged.ast files
export function traverseMergedFiles(dir) {
  let files = [];

  // Read the directory contents
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

  // Process each file
  files.forEach(file => {
    // Read the +page.merged.ast file
    const ast = JSON.parse(fs.readFileSync(file, 'utf-8'));

    // Instantiate SlotResolver and resolve the AST
    const resolver = new SlotResolver(ast);
    const resolvedAST = resolver.resolve(); // Resolve the AST

    //console.log("NANSI", JSON.stringify(resolvedAST.jsAST.content,null,2));
    const resolvedJsAst = removeComponentReferences(resolvedAST.jsAST.content);
    //console.log(JSON.stringify(resolvedJsAst, null, 2));

    // Create the structure for +page.resolved.ast
    const resolvedASTStructure = {
      jsAST: {
        type: 'JavaScript',
        content: resolvedJsAst // Include resolved JS AST
      },
      cssAST: {
        type: 'CSS',
        content: resolvedAST.cssAST.content // Include resolved CSS AST
      },
      customAST: {
        type: 'Custom',
        content: resolvedAST.customAST.content // Include resolved custom AST
      }
    };

    // Change the output path to match the original file name but with .resolved.ast
    const outputPath = file.replace('.merged.ast', '.resolved.ast');

    // Write the consolidated +page.resolved.ast file in the same location as the original +page.merged.ast
    fs.writeFileSync(outputPath, JSON.stringify(resolvedASTStructure, null, 2), 'utf-8');

    console.log('Consolidated AST written to:', outputPath);
  });
}


//Example usage
//const dir = './build/routes';
//processMergedFiles(dir);

/*
// Resolve slots and generate final AST
const resolver = new SlotResolver(ast);
const resolvedAST = resolver.resolve();

console.log('Resolved JS:', resolvedAST.js);
console.log('Resolved CSS:', resolvedAST.css);
console.log('Resolved HTML:', resolvedAST.html);
*/

