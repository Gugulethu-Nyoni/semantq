
    // Function to create the component markup
    function createComponentMarkup() {
      console.log("In Start ");
let heading='This Heading';


const queryString = window.location.search;
if (queryString) {
const urlParams = new URLSearchParams(queryString);
const product = urlParams.get('product')
//console.log(product);

alert(product);
//console.log(product);

}
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
      componentContainer.innerHTML = `<p> Start Here </p>
<span data-bind="heading">This Heading</span>
<br>
<input type="text" data-bind="heading" placeholder="Enter Heading" value="This Heading">`;
  