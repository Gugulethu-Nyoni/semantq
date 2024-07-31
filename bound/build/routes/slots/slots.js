
    // Function to create the component markup
    function createComponentMarkup() {
      // Function to setup dynamic custom elements
export function setupCustomElements() {
  // Function to register a custom element dynamically
  function registerCustomElement(tagName, content) {
    customElements.define(tagName, class extends HTMLElement {
      constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        
        // Parse content to extract CSS, attributes, and children
        const { css, slots } = parseContent(content);
        
        // Add CSS styles to shadow DOM
        const style = document.createElement('style');
        style.textContent = css;
        shadowRoot.appendChild(style);
        
        // Create the main container for the custom element
        const container = document.createElement('div');
        
        // Apply slots to container
        slots.forEach(slot => {
          const slotElement = document.createElement('slot');
          slotElement.setAttribute('name', slot.name);
          container.appendChild(slotElement);
        });
        
        // Append container to shadow DOM
        shadowRoot.appendChild(container);
      }
    });
  }
  
  // Function to parse content and extract CSS styles and slots
  function parseContent(content) {
    // Parse CSS styles
    const styleMatch = content.match(/<style>([\s\S]*)<\/style>/i);
    const css = styleMatch ? styleMatch[1].trim() : '';
    
    // Parse slots
    const slotMatches = content.matchAll(/<slot name="([^"]+)"><\/slot>/gi);
    const slots = Array.from(slotMatches, match => ({ name: match[1] }));
    
    return { css, slots };
  }
  
  // Example of dynamically registering custom elements
  // This is where you can dynamically handle any custom element syntax
  
  // Example usage:
  
  // Registering a parent custom element
  registerCustomElement('parent-element', `
    <style>
      /* CSS styles for parent-element */
      :host {
        display: block;
        border: 1px solid #ccc;
        padding: 1rem;
        border-radius: 4px;
        background-color: blue;

      }
      h1 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: red;
      }
      p {
        font-size: 1rem;
        line-height: 1.4;
        color: green;

      }
    </style>
    <div>
      <slot name="name"></slot>
      <slot name="age"></slot>
    </div>
  `);
}

// Setup custom elements when module is imported
setupCustomElements();
    }

    // Immediately-invoked function expression (IIFE) to execute the createComponentMarkup function
    (function() {
      createComponentMarkup();
    })();
  
    // Add encapsulated styles
    const style = document.createElement('style');
    style.textContent = `
      


    `;
    document.head.appendChild(style);

    // Add encapsulated HTML
      const container = document.createElement('div');
      container.id = 'componentContainer';
      document.body.appendChild(container);
      componentContainer.innerHTML = `<parent-element>
    <h1 slot="name">Hello, John Doe!</h1>
    <p slot="age">You are 30 years old.</p>
  </parent-element>`;
  