const bindingData = {};

// Define a Proxy to intercept property access and assignment
const reactiveBindingData = new Proxy(bindingData, {
    get: function(target, property) {
        console.log('Getter called');
        return target[property];
    },
    set: function(target, property, value) {
        console.log('Setter called');
        target[property] = value;
        window[property] = value;
        updateElements();
        return true;
    }
});

function updateElements() {
    const elements = document.querySelectorAll('[data-bind]');
    elements.forEach(element => {
        const key = element.getAttribute('data-bind');
        const elementType = element.tagName.toLowerCase();

        // Update input or textarea value
        if (elementType === 'input' || elementType === 'textarea') {

            if (reactiveBindingData[key] !== undefined) {
    // Remove single quotes if they exist in the value
    const valueWithoutQuotes = reactiveBindingData[key];//.replace(/['"]/g, '');
    element.value = valueWithoutQuotes;
}

            //alert();
        }

        // Update other elements' text content

        if (reactiveBindingData[key] !== undefined) {
    // Remove single quotes if they exist in the value
    const valueWithoutQuotes = reactiveBindingData[key];//.replace(/['"]/g, '');
    element.innerText = valueWithoutQuotes;
}


    });
}





document.addEventListener('input', (event) => {
    const element = event.target;
    const key = element.getAttribute('data-bind');

    if (key) {
        reactiveBindingData[key] = element.value;
    }
});



// handle form submission

document.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const form = event.target; // Get the form element
    const formData = new FormData(form); // Create a FormData object from the form

    // Iterate over the form input elements
    for (const [key, value] of formData.entries()) {
        // Check if the input element has a data-bind attribute
        if (form[key] && form[key].getAttribute('data-bind')) {
            const bindKey = form[key].getAttribute('data-bind');
            // Update the value in the reactiveBindingData object
            reactiveBindingData[bindKey] = value;
        }
    }

    // Now you can access the form values reactively from reactiveBindingData
    // For example:
    console.log('Form data submitted:', reactiveBindingData);
});







// Run the initial update
updateElements();





/* EXPERIMENTAL */

/*
$: {
    // Reactive statement to update input and textarea values
    const elements = document.querySelectorAll('[data-bind]');
    elements.forEach(element => {
        const key = element.getAttribute('data-bind');
        const elementType = element.tagName.toLowerCase();

        if (elementType === 'input' || elementType === 'textarea') {
            if (reactiveBindingData[key] !== undefined) {
                element.value = reactiveBindingData[key];
            }
        }

        // Update other elements' text content
        if (reactiveBindingData[key] !== undefined) {
            element.innerText = reactiveBindingData[key];
        }
    });
}


*/














// Add initial values to bindingData

/*
reactiveBindingData.input1 = 'Hddddi';
reactiveBindingData.input2 = 'inputddddd2';
reactiveBindingData.paragraph1 = 'Joddddhn';
reactiveBindingData.paragraph2 = 'Para2';
*/










function getObjectDefiners() {
    // Get all script tags in the document
    const scriptTags = Array.from(document.querySelectorAll('script'));


    //console.log(scriptTags);
    //alert('here');

    // Array to store variable names
    const letVariables = [];

    // Iterate over script tags and extract variable names
    for (const scriptTag of scriptTags) {

    if (scriptTag.hasAttribute('src')) {
    // Skip to the next iteration if the condition is met
    continue;
  }

        //alert('good script');

        const scriptContent = scriptTag.textContent;

       // console.log(scriptContent);

        // Use a more robust parser to extract variable names
        const variables = extractVariables(scriptContent);
        letVariables.push(...variables);


    }

    console.log('let variables:', letVariables);

    // Search for variables in the HTML body
    const body = document.querySelector('body');
    searchVariables(body, letVariables);


}



function extractVariables(scriptContent) {
  const regex = /let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(".*?"|'.*?')(?=[;,])/g;
    const matches = [...scriptContent.matchAll(regex)];
    const variables = matches.map(match => {
        const [, name, value] = match;
        return { name: name.trim(), value: value.trim().replace(/['"]/g, '') };
    });
    return variables;
}



function searchVariables(node, letVariables) {
    if (node.nodeType === Node.TEXT_NODE) {
        let content = node.textContent;
        letVariables.forEach(variableObj => {
            const regex = new RegExp(`\\{${variableObj.name}\\}`, 'g');
            const matches = content.match(regex);
            if (matches) {
                reactiveBindingData[variableObj.name] = ''; // Initialize with empty value

                // For each match, assign value to reactiveBindingData using inputKey and inputValue
                matches.forEach(() => {
                    reactiveBindingData[variableObj.name] = reactiveBindingData[variableObj.name] + ' ' + variableObj.value;

                    // update {variable} in the DOM

            content = content.replace(regex, match => {
                const value = variableObj.value;
                // Check if the value is surrounded by quotes
                if (typeof value === 'string' && (value.startsWith("'") || value.startsWith('"')) && (value.endsWith("'") || value.endsWith('"'))) {
                    // Remove the quotes
                    return value.slice(1, -1);
                }
                // Return the value as is
                return value;
            });
                        
              });

                node.textContent = content;

                console.log(`Found ${matches.length} occurrences of key ${variableObj.name}:`, matches);
            } else {
                // console.log(`No occurrences of ${variableObj.name} found.`);
            }
        });
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
        node.childNodes.forEach(child => searchVariables(child, letVariables));
    }
}

// Call the function to start the process
getObjectDefiners();


function testBinder(){

    alert('binder in scope');
}

//testBinder();