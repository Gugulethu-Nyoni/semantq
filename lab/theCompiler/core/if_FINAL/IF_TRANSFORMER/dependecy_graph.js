/*
dependency graph


1. check variables declared / used in the html 

e.g. Clicked: {counter}


2. variables must be declared in js 
e.g.

let counter; or let counter=0;

3. variables must be affected by functions in the js or in html / custom syntax 


4. variables must be in functions that have events attached to them 

e.g.

<button @click={increment}> Click Me </button> 

*/


// 5. Function calls and dependencies

function increment(counter) {
  return counter + 1;
}

function updateCounter() {
  const newCounter = increment(counter);
  renderCounter(newCounter);
}

// Dependency: increment → updateCounter → renderCounter


// 6. Variable relationships

let counter = 0;
let doubleCounter = counter * 2;

// Relationship: counter → doubleCounter

// 7. Event propagation


// <button @click={handleClick}>Click Me</button>

function handleClick() {
  incrementCounter();
  updateUI();
}

// Event propagation: handleClick → incrementCounter → updateUI



// 8. Conditional statements

if (counter >= 10) {
  alert("Counter reached 10!");
  resetCounter();
}

// Conditional dependency: counter → alert → resetCounter


// 9. Loops and iterations


for (let i = 0; i < 5; i++) {
  incrementCounter();
}

// Loop dependency: incrementCounter (5 times)


// 10. External dependencies

import { httpClient } from 'external-library';

function fetchData() {
  httpClient.get('/data').then((response) => {
    updateUI(response.data);
  });
}

// External dependency: httpClient (from external-library) → fetchData → updateUI













