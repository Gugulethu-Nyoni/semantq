class SlotResolver {
  constructor(ast) {
    this.ast = ast; // The merged AST from +page.merged.ast
  }

  // Resolve default slots
  resolveDefaultSlots() {
    const defaultSlots = this.ast.content.filter(node => node.type === 'slot' && !node.name);
    defaultSlots.forEach(slot => {
      // Replace default slots with their fallback content or an empty node
      slot.children = slot.fallback || [];
    });
  }

  // Resolve named slots
  resolveNamedSlots() {
    const namedSlots = this.ast.content.filter(node => node.type === 'slot' && node.name);
    namedSlots.forEach(slot => {
      // Find matching content for the named slot
      const matchingContent = this.ast.content.find(
        node => node.type === 'template' && node.slot === slot.name
      );
      if (matchingContent) {
        // Replace the slot with the matching content
        slot.children = matchingContent.children;
      } else {
        // Use fallback content if no matching content is found
        slot.children = slot.fallback || [];
      }
    });
  }

  // Resolve fallback slots
  resolveFallbackSlots() {
    const slots = this.ast.content.filter(node => node.type === 'slot');
    slots.forEach(slot => {
      if (!slot.children.length && slot.fallback) {
        // Use fallback content if no children are provided
        slot.children = slot.fallback;
      }
    });
  }

  // Resolve scoped slots
  resolveScopedSlots() {
    const scopedSlots = this.ast.content.filter(node => node.type === 'slot' && node.scoped);
    scopedSlots.forEach(slot => {
      // Pass props to the slot's children
      slot.children = slot.children.map(child => ({
        ...child,
        props: { ...child.props, ...slot.scopedProps },
      }));
    });
  }

  // Resolve component props
  resolveComponentProps() {
    const components = this.ast.content.filter(node => node.type === 'component');
    components.forEach(component => {
      // Handle `let:propName` syntax for passing props
      if (component.props) {
        component.children = component.children.map(child => ({
          ...child,
          props: { ...child.props, ...component.props },
        }));
      }
    });
  }

  // Resolve nested slots
  resolveNestedSlots() {
    const resolveNested = (node) => {
      if (node.children) {
        node.children.forEach(child => {
          if (child.type === 'slot') {
            // Resolve nested slots recursively
            this.resolveDefaultSlots();
            this.resolveNamedSlots();
            this.resolveFallbackSlots();
            this.resolveScopedSlots();
          }
          resolveNested(child); // Recursively resolve nested children
        });
      }
    };
    resolveNested(this.ast);
  }

  // Resolve dynamic slot injection
  resolveDynamicSlots() {
    const dynamicSlots = this.ast.content.filter(node => node.type === 'slot' && node.dynamic);
    dynamicSlots.forEach(slot => {
      // Dynamically inject content into the slot
      if (slot.dynamicContent) {
        slot.children = slot.dynamicContent;
      }
    });
  }

  // Generate HTML from the resolved AST
  generateHTML() {
    const traverse = (node) => {
  if (node.type === 'component') {
    return `
      <div class="component" data-component="${node.props?.title || 'UnnamedComponent'}">
        ${(node.children || []).map(traverse).join('')}
      </div>
    `;
  } else if (node.type === 'slot') {
    // Replace slot with resolved content, ensuring children exist
    return (node.children || []).map(traverse).join('');
  } else if (node.type === 'text') {
    return node.content;
  } else if (node.type === 'template') {
    return '';
  }
  return '';
};

    return this.ast.content.map(traverse).join('');
  }

  // Generate scoped CSS for the component
 generateCSS(componentName) {
  const scope = `component-${componentName}`;
  return `
    <style>
      .${scope} {
        /* Add global styles for the component */
      }
      .${scope} .header {
        /* Styles for the header slot */
      }
      .${scope} .footer {
        /* Styles for the footer slot */
      }
    </style>
  `;
}


  // Generate scoped JavaScript for the component
  generateJS(componentName) {
  const scope = `component-${componentName}`;
  return `
    <script>
      (function() {
        const component = document.querySelector('[data-component="${componentName}"]');
        if (component) {
          console.log('${componentName} component loaded');
        }
      })();
    </script>
  `;
}


  // Main resolve method
  resolve() {
    this.resolveDefaultSlots();
    this.resolveNamedSlots();
    this.resolveFallbackSlots();
    this.resolveScopedSlots();
    this.resolveComponentProps();
    this.resolveNestedSlots();
    this.resolveDynamicSlots();

    // Generate final AST with resolved HTML, CSS, and JS
    const componentName = this.ast.content.find(node => node.type === 'component')?.props?.title || 'UnnamedComponent';
    const html = this.generateHTML();
    const css = this.generateCSS(componentName);
    const js = this.generateJS(componentName);

    return {
      html,
      css,
      js,
    };
  }
}






// Example AST
const ast = {
  content: [
    {
      type: 'component',
      props: { title: 'My Component' },
      children: [
        {
          type: 'slot',
          name: 'header',
          fallback: [{ type: 'text', content: 'Default Header' }],
        },
        {
          type: 'slot',
          fallback: [{ type: 'text', content: 'Default Content' }],
        },
        {
          type: 'slot',
          name: 'footer',
          scoped: true,
          scopedProps: { year: 2023 },
          fallback: [{ type: 'text', content: 'Default Footer' }],
        },
      ],
    },
    {
      type: 'template',
      slot: 'header',
      children: [{ type: 'text', content: 'Custom Header' }],
    },
    {
      type: 'template',
      slot: 'footer',
      children: [{ type: 'text', content: 'Custom Footer' }],
    },
  ],
};

// Resolve slots and generate final AST
const resolver = new SlotResolver(ast);
const resolvedAST = resolver.resolve();

console.log('Resolved JS:', resolvedAST.js);
console.log('Resolved CSS:', resolvedAST.css);
console.log('Resolved HTML:', resolvedAST.html);

