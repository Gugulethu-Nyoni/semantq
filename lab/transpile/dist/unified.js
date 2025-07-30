
import { $state, $derived, state, $effect } from './state/index.js';


export default function renderComponent() {
  // Component-level reactive state and functions from @script block
const tempC = $state(0);
const displayC = $derived(() => (isNaN(tempC.value) ? "" : tempC.value.toFixed(2)));
const displayF = $derived(() => (isNaN(tempC.value) ? "" : (((tempC.value * 9) / 5) + 32).toFixed(2)));
function updateCelsius(e) {
const value = parseFloat(e.target.value);
  (tempC.value = (isNaN(value) ? null : value));
}
function updateFahrenheit(e) {
const value = parseFloat(e.target.value);
  (tempC.value = (isNaN(value) ? null : (((value - 32) * 5) / 9)));
}


  // Root fragment for the component's DOM
  const rootEl_0 = document.createDocumentFragment();
  const cleanupFunctions = [];

  // Inject CSS if applicable

const __style_el = document.createElement('style');
__style_el.textContent = `h1 { color: green; }`;
document.head.appendChild(__style_el);
cleanupFunctions.push(() => __style_el.remove()); // Cleanup style tag on component destroy


  // The HTML/template body is already generated using the correct parent variable name
  const div_1 = document.createElement('div');
  const input_2 = document.createElement('input');
  input_2.setAttribute('type', "number");
  cleanupFunctions.push($effect(() => {
    input_2.setAttribute('value', `${displayC.value}`);
  }));
  cleanupFunctions.push($effect(() => {
            input_2.addEventListener('input', updateCelsius);
            return () => input_2.removeEventListener('input', updateCelsius); // Cleanup
        }));
  div_1.appendChild(input_2);

  const text_3 = document.createTextNode("Celsius");
  div_1.appendChild(text_3);
  rootEl_0.appendChild(div_1);

  const div_4 = document.createElement('div');
  const input_5 = document.createElement('input');
  input_5.setAttribute('type', "number");
  cleanupFunctions.push($effect(() => {
    input_5.setAttribute('value', `${displayF.value}`);
  }));
  cleanupFunctions.push($effect(() => {
            input_5.addEventListener('input', updateFahrenheit);
            return () => input_5.removeEventListener('input', updateFahrenheit); // Cleanup
        }));
  div_4.appendChild(input_5);

  const text_6 = document.createTextNode("Fahrenheit");
  div_4.appendChild(text_6);
  rootEl_0.appendChild(div_4);


  // Return the root DOM fragment and a destroy method
  return {
    root: rootEl_0,
    destroy: () => {
      cleanupFunctions.forEach(fn => fn());
      // Any other component-specific teardown
    }
  };
}
