
    // Function to create the component markup
    function createComponentMarkup() {
      let counter = 0; 


function incrementer () {
  
  counter ++; 
}
    }

    // Immediately-invoked function expression (IIFE) to execute the createComponentMarkup function
    (function() {
      createComponentMarkup();
    })();
  
    // Add encapsulated styles
    const style = document.createElement('style');
    style.textContent = `
      
.the-button {
  display: inline-block;
  padding: 1em 2em;
  font-weight: bold;
  color: #fff;
  background-color: #ff69b4; /* Pink */
border: none;
  border-radius: 0.3em;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out; /* Transition effect */
}

.the-button:hover {
  background-color: #4fc3f7; /* Blue */
}

span {
  color: red;
  font-weight: bolder;
}

    `;
    document.head.appendChild(style);

    // Add encapsulated HTML
      const container = document.createElement('div');
      container.id = 'componentContainer';
      document.body.appendChild(container);
      componentContainer.innerHTML = `<div class="the-button"> I have been clicked <span data-bind="counter">0</span> 



</div>`;
  