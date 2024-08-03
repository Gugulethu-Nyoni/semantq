function theFormState () {
  
    const storageKey = "smqState";
    let formState = {};

    document.addEventListener('submit', (event) => {
            event.preventDefault();

            alert('form submitted');

            /* MAIN CODE */

        const elements = event.target.querySelectorAll('[data-bind]');
            elements.forEach(element => {
              const key = element.getAttribute('data-bind');
              const elementType = element.tagName.toLowerCase();

              // Get the value from local storage or the element itself
        let value = (elementType === 'input' || elementType === 'textarea') ? element.value : element.innerText;
              const storedValue = JSON.parse(localStorage.getItem(storageKey));
              if (storedValue && storedValue[key] && storedValue[key][0].newState) {
                value = storedValue[key][0].newState;
              }

              // Store the key-value pair in formState
            if (!formState.hasOwnProperty(key)) {
              formState[key] = {};
            }
            formState[key] = value;


        
            });

            return formState;

            //console.log(this.formState);
            /* END MAIN CODE */



          });
}


  

  

//theFormState();
