export default class StateOfState {
    constructor(storageKey) {
        this.storageKey = "smqState";
        this.bindingData = {};
        this.subscribers = {};
        this.letVariables = [];
        //this.getObjectDefiners();

        this.reactiveBindingData = new Proxy(this.bindingData, {
            get: (target, property) => {
                console.log('Getter called');
                return target[property];
            },
            set: (target, property, value) => {
                console.log('Setter called');
                target[property] = value;
                window[property] = value;
                this.saveStateToStorage(this.storageKey); // Call the saveStateToStorage function
                //this.notifySubscribers(property, value); // Notify subscribers                this.updateElements();
                //this.registerVariables();
                return true;
            }
        });
        this.setupStorageListener();
        this.setupEventListeners();
        //this.updateElements();
        //this.getObjectDefiners();
        //this.registerVariables();
    }


    registerVariables() {
    this.letVariables.forEach(variable => {
        const { name, value } = variable;
        this.reactiveBindingData[name] = value;
        this.subscribe(name, null, newValue => {
            this.reactiveBindingData[name] = newValue;
        });
    });

}



  subscribe(key, element, callback) {
    // Check if the key already exists in subscribers, if not, initialize it as an empty array
    if (!this.subscribers[key]) {
        this.subscribers[key] = [];
    } else {
        console.log(`Subscribers for key '${key}' before subscribing:`, this.subscribers[key]);
        // If the key already exists, trigger the callback with the current value from local storage
        const storedValue = JSON.parse(localStorage.getItem(this.storageKey));
        if (storedValue && storedValue[key] !== undefined) {
            callback(storedValue[key]);
        }
    }
    // Push the element and its callback function to the subscribers array for the key
    this.subscribers[key].push(callback);
    console.log(`Subscribers for key '${key}' after subscribing:`, this.subscribers[key]);

}




    // Method to unsubscribe an element from a data-bind attribute
unsubscribe(key, callback) {
    // Check if the key exists in subscribers
    if (this.subscribers[key]) {
        // Filter out the callback function from the subscribers array for the key
        this.subscribers[key] = this.subscribers[key].filter(subscriber => subscriber !== callback);
    }
}



notifySubscribers(property, value) {
        const subscribers = this.subscribers[property];
        if (subscribers) {
            subscribers.forEach(callback => callback(value));
        }

        //this.updateElements();
    }





    // Method to save state to storage
    saveStateToStorage() {
        const theStorageKey="smqState";
        console.log("subscribers"+ JSON.stringify(this.subscribers,null,2));
        localStorage.setItem(theStorageKey, JSON.stringify(this.reactiveBindingData));
    }



updateElements() {
    const elements = document.querySelectorAll('[data-bind]');
    elements.forEach(element => {
        const key = element.getAttribute('data-bind');
        const elementType = element.tagName.toLowerCase();

        // Retrieve value from local storage
        const storedValue = JSON.parse(localStorage.getItem(this.storageKey));

        // Update input or textarea value
        if (elementType === 'input' || elementType === 'textarea') {
            if (storedValue && storedValue[key] !== undefined) {
                // Update input value from local storage
                element.value = storedValue[key];
            }
        }

        // Update other elements' text content
        if (storedValue && storedValue[key] !== undefined) {
            // Update element text content from local storage
            element.innerText = storedValue[key];
        }

        // Check if there are subscribers for this key and trigger their callbacks
        const subscribers = this.subscribers[key];
        if (subscribers) {
            subscribers.forEach(callback => callback(storedValue[key]));
        }
    });
}

/*
    // Method to update elements based on global state from local storage
    updateElements() {
        const elements = document.querySelectorAll('[data-bind]');
        elements.forEach(element => {
            const key = element.getAttribute('data-bind');
            const elementType = element.tagName.toLowerCase();

            // Retrieve value from local storage
            const storedValue = JSON.parse(localStorage.getItem(this.storageKey));

            // Update input or textarea value
            if (elementType === 'input' || elementType === 'textarea') {
                if (storedValue && storedValue[key] !== undefined) {
                    // Update input value from local storage
                    element.value = storedValue[key];
                }
            }

            // Update other elements' text content
            if (storedValue && storedValue[key] !== undefined) {
                // Update element text content from local storage
                element.innerText = storedValue[key];
            }
        });
    }

*/




    // Method to setup listener for storage change events
    setupStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === this.storageKey) {
                const newState = JSON.parse(event.newValue);
                this.setState(newState);
            }
        });
    }

    // Method to setup input event listeners
    setupEventListeners() {
        document.addEventListener('input', (event) => {
            const element = event.target;
            const key = element.getAttribute('data-bind');
            if (key) {
                this.reactiveBindingData[key] = element.value;
            }
        });

        document.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission behavior
            const form = event.target; // Get the form element
            const formData = new FormData(form); // Create a FormData object from the form
            for (const [key, value] of formData.entries()) {
                if (form[key] && form[key].getAttribute('data-bind')) {
                    const bindKey = form[key].getAttribute('data-bind');
                    this.reactiveBindingData[bindKey] = value;
                }
            }
            console.log('Form data submitted:', this.reactiveBindingData);
        });
    }


getObjectDefiners() {
    console.log('definer called');

  const scriptTags = document.querySelectorAll('script');
  //const variables = [];

  for (let script of scriptTags) {
    if (script.hasAttribute('src')) {
      continue;
    }

    const scriptContent = script.textContent;
    const regex = /let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(".*?"|'.*?'|\d+|true|false|null)(?=[;,])/gm;
    const matches = scriptContent.matchAll(regex);

    for (let match of matches) {
      const [, name, value] = match;
      const trimmedValue = value.trim().replace(/['"]/g, '');
      this.letVariables.push({ name: name.trim(), value: trimmedValue });
    }
  }

  console.log("let variables?::" + JSON.stringify(this.letVariables,null,2));
  
  this.letVariables.forEach(variable => {
        const { name, value } = variable;
        this.reactiveBindingData[name] = value; // Assign each variable to the reactiveBindingData proxy

        // Retrieve the current value from reactiveBindingData
        const currentValue = this.reactiveBindingData[name];

        // Notify subscribers with the current value
        this.notifySubscribers(name, currentValue);

        // Register a subscriber for each variable
        this.subscribe(name, null, newValue => {
            this.reactiveBindingData[name] = newValue; // Update the value in the reactiveBindingData proxy when it changes
        });
    });

this.updateElements();

  //this.registerVariables();
  //return this.letVariables;

}

// Usage
//const extractedVariables = extractLetVariables();
//console.log(extractedVariables);


/*
    // Method to extract variable names from script tags in the document
    getObjectDefiners() {
        const scriptTags = Array.from(document.querySelectorAll('script'));
        for (const scriptTag of scriptTags) {
            if (scriptTag.hasAttribute('src')) {
                continue;
            }
            const scriptContent = scriptTag.textContent;
            const variables = this.extractVariables(scriptContent);
            this.letVariables.push(...variables);
        }
        console.log('let variables:', this.letVariables);
        const body = document.querySelector('body');
        this.searchVariables(body, this.letVariables);
    }

    // Method to extract variables from script content
    extractVariables(scriptContent) {
        const regex = /let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(".*?"|'.*?')(?=[;,])/g;
        const matches = [...scriptContent.matchAll(regex)];
        const variables = matches.map(match => {
            const [, name, value] = match;
            return { name: name.trim(), value: value.trim().replace(/['"]/g, '') };
        });
        return variables;
    }

*/

}

const myInstance = new StateOfState();
// Call the method from outside the class
myInstance.getObjectDefiners(); // Output: Hello from MyClass!
