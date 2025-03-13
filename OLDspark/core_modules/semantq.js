
/* GLOBAL STATE MANAGER */

export default class StateOfState {

  constructor() {
    this.letVariables = [];
    this.subscribers = {};
    this.storageKey="smqState";




/* STATE INITIATOR */

const scriptTags = document.querySelectorAll('script');

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

    

    this.letVariables.forEach(variable => {
    this.subscribe(variable.name, variable.value, function(value) {
        // update all subscribed elements by virtue of data-bind
        const allSubscribedElements = document.querySelectorAll('data-bind');
        allSubscribedElements.forEach(element => {
            element.value = newState;
        });
    });
});


this.saveStateToStorage();

   
    console.log("letVariables:"+JSON.stringify(this.letVariables, null, 2));
    console.log("Subscribers:"+JSON.stringify(this.subscribers, null, 2));

/* END STATE INITATOR */











/* EVENT LISTENER */

document.addEventListener('input',(event) => {

    //alert("listening...");
    
    const target = event.target;

    if (target.matches('[data-bind]')) {
      const name = target.getAttribute('data-bind');
      const value = target.value;

      // Check if the variable already exists
const variableFound = this.letVariables.some(variable => variable.name === name);

// If found, update its value; otherwise, create a new one
if (variableFound) {
    this.letVariables.find(variable => variable.name === name).value = value;
} else {
    this.letVariables.push({ name: name, value: value });
}

  

// update or create localstorage 

  // Parse the JSON string from local storage
const storedData = localStorage.getItem(this.storageKey);
const data = storedData ? JSON.parse(storedData) : {};

// Define the key and value you want to update or add
const key = name;
const newValue = value; // New value for the key

// Check if the key already exists in the data object
if (data.hasOwnProperty(key)) {
    // Update the existing item
    data[key][0].newState = newValue;
} else {
    // Add a new item for the key
    data[key] = [{ newState: newValue }];
}

// Save the updated data object back to local storage
localStorage.setItem(this.storageKey, JSON.stringify(data));



// UPDATE SUBSCRIBERS 

if (this.subscribers.hasOwnProperty(key)) {
        // Update the existing entry with the new state
        this.subscribers[key][0].newState = value;
    } else {
        // Add a new entry with the key and new state
        this.subscribers[key] = [{ newState: value }];
    }

console.log("Updated subs:"+JSON.stringify(this.subscribers,null,2));





/* LIVE RE-RENDERING */

// Listen for changes in localStorage
//window.addEventListener('storage', (event) => {
 // if (event.key === this.storageKey) {



const elements = document.querySelectorAll('[data-bind]');
    elements.forEach(element => {
      const key = element.getAttribute('data-bind');
      const elementType = element.tagName.toLowerCase();

      // Retrieve value from local storage
      const storedValue = JSON.parse(localStorage.getItem(this.storageKey));
      
      //console.log("StorageData:"+ JSON.stringify(storedValue,null,2));


      // Update input or textarea value
      if (elementType === 'input' || elementType === 'textarea') {
        if (storedValue && storedValue[key][0].newState !== undefined) {
          // Update input value from local storage
          element.value = storedValue[key][0].newState;
        }
      }

      // Update other elements' text content
      if (storedValue && storedValue[key][0].newState !== undefined) {
        // Update element text content from local storage
        element.innerText = storedValue[key][0].newState;
      }
    });


// }
//});


/* END LIVE RE-RENDERING */

  }
  });



this.updateElements();

/* END EVENT LISTERNER */




//CONSTRUCTOR WRAPPER
  }




  updateElements() {
    const elements = document.querySelectorAll('[data-bind]');
    elements.forEach(element => {
      const key = element.getAttribute('data-bind');
      const elementType = element.tagName.toLowerCase();

      // Retrieve value from local storage
      const storedValue = JSON.parse(localStorage.getItem(this.storageKey));
      
      //console.log("StorageData:"+ JSON.stringify(storedValue,null,2));


      // Update input or textarea value
      if (elementType === 'input' || elementType === 'textarea') {
        if (storedValue && storedValue[key][0].newState !== undefined) {
          // Update input value from local storage
          element.value = storedValue[key][0].newState;
        }
      }

      // Update other elements' text content
      if (storedValue && storedValue[key][0].newState !== undefined) {
        // Update element text content from local storage
        element.innerText = storedValue[key][0].newState;
      }
    });
  }




  
subscribe(key, newState, callback) {
    if (!this.subscribers[key]) {
        this.subscribers[key] = []; // Initialize as an array if not exists
    }
    this.subscribers[key].push({ newState, callback }); // Push subscriber object to the array
}


saveStateToStorage (){

    localStorage.setItem(this.storageKey,JSON.stringify(this.subscribers,null,2));
}






//class wrapper nothing below
}

// Call the method from outside the class
const theState = new StateOfState();



// Event listener for 'storage' event
window.addEventListener('storage', () => {
  const elements = document.querySelectorAll('[data-bind]');
  elements.forEach(element => {
    const key = element.getAttribute('data-bind');
    const elementType = element.tagName.toLowerCase();

    // Retrieve value from local storage
    const storedValue = JSON.parse(localStorage.getItem(theState.storageKey));

    // Update input or textarea value
    if (elementType === 'input' || elementType === 'textarea') {
      if (storedValue && storedValue[key] && storedValue[key][0].newState !== undefined) {
        // Update input value from local storage
        element.value = storedValue[key][0].newState;
      }
    }

    // Update other elements' text content
    if (storedValue && storedValue[key] && storedValue[key][0].newState !== undefined) {
      // Update element text content from local storage
      element.innerText = storedValue[key][0].newState;
    }
  });
});



/* END GLOBAL STATE MANAGER */

// hljs.highlightAll();


