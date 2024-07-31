
    // Function to create the component markup
    function createComponentMarkup() {
      //alert('Contacts Page Working');
let counter = 0;

/*
 function alerter() {
  counter ++;
   document.getElementById('button').innerHTML = `Clicked <span data-bind="counter"> ${counter} </span> times.`;
    alert("Js is working");
  }
*/  

document.addEventListener('click', function(event) {
  if (event.target.id === 'myButton') {
   
counter ++;
   document.getElementById('myButton').innerHTML = `Clicked <span data-bind="counter"> ${counter} </span> times.`;
    //alert("Js is working");


  }
});
    }

    // Immediately-invoked function expression (IIFE) to execute the createComponentMarkup function
    (function() {
      createComponentMarkup();
    })();
  
    // Add encapsulated styles
    const style = document.createElement('style');
    style.textContent = `
      
#myButton {
	background-color: blue;
	padding: 8px;
	border-radius: 25px;
	color: #fff;

}

.mainer {
	width: 100%;
	display: grid;
	place-items: center;

}

    `;
    document.head.appendChild(style);

    // Add encapsulated HTML
      const container = document.createElement('div');
      container.id = 'componentContainer';
      document.body.appendChild(container);
      componentContainer.innerHTML = `<div class="mainer">

<button id="myButton" data-bind="counter">0</button> <br>


<form>
<input type="number" data-bind="counter" placeholder="Enter number" value="0">
</form>


<p>
Reactive counter: <span data-bind="counter">0</span> 

</p></div>`;
  