
    // Function to create the component markup
    function createComponentMarkup() {
      console.log("in Docs");
    }

    // Immediately-invoked function expression (IIFE) to execute the createComponentMarkup function
    (function() {
      createComponentMarkup();
    })();
  
    // Add encapsulated styles
    const style = document.createElement('style');
    style.textContent = `
      
p {font-family:}

    `;
    document.head.appendChild(style);

    // Add encapsulated HTML
      const container = document.createElement('div');
      container.id = 'componentContainer';
      document.body.appendChild(container);
      componentContainer.innerHTML = `<p> This the official documentation of Semantq! </p>`;
  