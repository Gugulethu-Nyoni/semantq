
    // Function to create the component markup
    function createComponentMarkup() {
      import supabase from '../../../../supabase.js'; 

// Inside your component code
const dataId = document.getElementById('dynamicComponentPlaceholder').getAttribute('data-resource-id');
const span = document.getElementById('userId');
span.innerText=dataId;

if (dataId) {

//alert("user id:" +dataId);
    // Handle cases where dataId is provided
} else {
    // Handle cases where dataId is not provided
}


//alert("Shipped ID:"+componentDataId);

const userId=componentDataId;

async function getUser(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, email')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('An error occurred:', error);
    return null;
  }

console.log(data);
  return data;
}

getUser(userId);


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
      


    `;
    document.head.appendChild(style);

    // Add encapsulated HTML
      const container = document.createElement('div');
      container.id = 'componentContainer';
      document.body.appendChild(container);
      componentContainer.innerHTML = `<h1> We display Profile data here  </h1>
<div>
Native JS Data: User ID: <span id="userId"> </span> <br>
Semantiq Reactivity: <span data-bind="componentDataId"> </span> 

<h3> Test Reactivity </h3>
<input type="number" value="" data-bind="componentDataId" placeholder="Change ID">

</div>`;
  