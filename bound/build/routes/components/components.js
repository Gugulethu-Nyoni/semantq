
    // Function to create the component markup
    function createComponentMarkup() {
      class ButtonComponent extends HTMLElement {
  constructor(methods, options) {
    super();
    this.methods = methods;
    this.options = options;
    console.log("Within");
    console.log(this.methods);
    console.log("Options: " + JSON.stringify(this.options, null, 2));
    this.methods.test();
    this.renderButtonComponent();
  }

  renderButtonComponent() {
  // Create the button element
  const buttonTemplate = document.createElement('template');
  buttonTemplate.innerHTML = `<button class="${this.options.size ? this.options.size : ''} ${this.options.class ? this.options.class : ''}" id="${this.options.id ? this.options.id : ''}">${this.options.text ? this.options.text : ''}</button>`;
  const buttonClone = buttonTemplate.content.cloneNode(true);
  const button = buttonClone.querySelector('button');

  // Attach event listeners
  for (const event in this.options.events) {
    if (this.options.events.hasOwnProperty(event) && this.methods.hasOwnProperty(this.options.events[event])) {
      const handlerName = this.options.events[event];
      const handler = this.methods[handlerName];
      button.addEventListener(event, handler);
    }
  }

  // Append the button to the component
  this.appendChild(buttonClone);
}





}

customElements.define('button-component', ButtonComponent);

const methods = {
  handleClick: () => {
    alert('Clicked');
  },
  handleHover: () => {
    console.log('Hovered');
  },
  test: () => {
    alert("Works");
  }
};

const options = {
  size: 'btn-lg',
  class: 'btn btn-warning rounded-md',
  id: 'my-cta-btn',
  text: 'Click Me',
  events: {
    click: 'handleClick',
    mouseover: 'handleHover'
  }
};

const buttonComponent = new ButtonComponent(methods, options);

document.body.appendChild(buttonComponent);
    }

    // Immediately-invoked function expression (IIFE) to execute the createComponentMarkup function
    (function() {
      createComponentMarkup();
    })();
  
    // Add encapsulated styles
    const style = document.createElement('style');
    style.textContent = `
      
.smq-button {
  color: var(--primary-color);
  background-color: var(--secondary-color);
  border-color: var(--tertiary-color);

  /* Additional button styles */
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 1rem;
  border-width: 2px;
  border-style: solid;
  cursor: pointer;
  width: 100%; /* added width: 100% to make it responsive */
  max-width: 200px; /* added max-width to limit the width on larger screens */
}

.smq-button:hover {
  background-color: var(--primary-color);
  color: var(--secondary-color);
}

.btn-lg {
  width: 80%;
  max-width: 300px; /* added max-width to limit the width on larger screens */
}

/* Media queries for responsiveness */
@media (max-width: 768px) {
  .smq-button {
    font-size: 0.8rem;
    padding: 0.3rem 0.7rem;
  }
  .btn-lg {
    width: 60%;
  }
}

@media (max-width: 480px) {
  .smq-button {
    font-size: 0.6rem;
    padding: 0.2rem 0.5rem;
  }
  .btn-lg {
    width: 40%;
  }
}

    `;
    document.head.appendChild(style);

    // Add encapsulated HTML
      const container = document.createElement('div');
      container.id = 'componentContainer';
      document.body.appendChild(container);
      componentContainer.innerHTML = `<br>
<button-component>

<br> 

<a class="btn btn-primary rounded-sm">My Button with Small Rounded Corners</a>
<a class="btn btn-primary rounded-lg">My Button with Large Rounded Corners</a>
</button-component>`;
  