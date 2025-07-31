
import { $state, $derived, $effect } from './state/index.js';
import { attr, insertAfter, removeNode, clearNodesBetween } from './runtime/dom-helpers.js';


export default function renderComponent() {
    // Component-level reactive state and functions from @script block
const tripType = $state("one-way");
const startDate = $state("2025-07-28");
const returnDate = $state("2025-07-28");
const bookingMessage = $state("");
const isReturn = $derived(() => tripType.value.value === "return");
function isValidDate(str) {
    const d = new Date(str);
    return !isNaN(d.getTime());
}
const isStartValid = $derived(() => isValidDate(startDate.value.value));
const isReturnValid = $derived(() => isValidDate(returnDate.value.value));
const isReturnAfterStart = $derived(() => {
    const s = new Date(startDate.value.value);
    const r = new Date(returnDate.value.value);
    return r >= s;
});
const showInvalidStart = $derived(() => !isStartValid.value.value);
const showInvalidReturn = $derived(() => isReturn.value.value && !isReturnValid.value.value || !isReturnAfterStart.value.value);
const isSubmitDisabled = $derived(() => !isStartValid.value.value || isReturn.value.value && !isReturnValid.value.value || !isReturnAfterStart.value.value);
function handleTripType(e) {
    tripType.value = e.target.value;
}
function handleStartDate(e) {
    startDate.value = e.target.value;
}
function handleReturnDate(e) {
    returnDate.value = e.target.value;
}
function handleSubmit() {
    bookingMessage.value = tripType.value.value === "one-way" ? `You have booked a one-way flight on ${startDate.value.value}.` : `You have booked a return flight from ${startDate.value.value} to ${returnDate.value.value}`;
}


    // Root fragment for the component's DOM
    const rootEl_0 = document.createDocumentFragment();
    const cleanupFunctions = [];

    // Inject CSS if applicable

const __style_el = document.createElement('style');
__style_el.textContent = `.invalid { border: 1px solid red; }
.message { color: blue; margin-top: 1em; }`;
document.head.appendChild(__style_el);
cleanupFunctions.push(() => __style_el.remove()); // Cleanup style tag on component destroy


    // The HTML/template body is already generated using the correct parent variable name
  const div_1 = document.createElement('div');
  const select_2 = document.createElement('select');
  const eventHandler_3 = /* UNHANDLED_HTML_EXPRESSION_TYPE_MustacheAttribute */;
  select_2.addEventListener('put', eventHandler_4);
  cleanupFunctions.push(() => select_2.removeEventListener('put', eventHandler_5));
  const option_6 = document.createElement('option');
  option_6.setAttribute('value', "one-way");
  const text_7 = document.createTextNode("One-way flight");
  option_6.appendChild(text_7);
  select_2.appendChild(option_6);

  const option_8 = document.createElement('option');
  option_8.setAttribute('value', "return");
  const text_9 = document.createTextNode("Return flight");
  option_8.appendChild(text_9);
  select_2.appendChild(option_8);
  div_1.appendChild(select_2);
  rootEl_0.appendChild(div_1);

  const div_10 = document.createElement('div');
  const input_11 = document.createElement('input');
  input_11.setAttribute('type', "date");
  cleanupFunctions.push(attr(input_11, 'value', $derived(() => (startDate.value))));
  const eventHandler_12 = /* UNHANDLED_HTML_EXPRESSION_TYPE_MustacheAttribute */;
  input_11.addEventListener('put', eventHandler_13);
  cleanupFunctions.push(() => input_11.removeEventListener('put', eventHandler_14));
  cleanupFunctions.push(attr(input_11, 'class', $derived(() => (showInvalidStart.value ? "invalid" : "''"))));
  div_10.appendChild(input_11);

  const text_15 = document.createTextNode("Start Date");
  div_10.appendChild(text_15);
  rootEl_0.appendChild(div_10);

  const if_condition_derived_18 = $derived(() => isReturn.value);
  const if_start_anchor_16 = document.createTextNode('');
  const if_end_anchor_17 = document.createTextNode('');
  rootEl_0.appendChild(if_start_anchor_16);
  rootEl_0.appendChild(if_end_anchor_17);

  cleanupFunctions.push($effect(() => {
    clearNodesBetween(if_start_anchor_16, if_end_anchor_17);
    const fragment = document.createDocumentFragment();
    if (if_condition_derived_18.value) {
  const div_19 = document.createElement('div');
  const input_20 = document.createElement('input');
  input_20.setAttribute('type', "date");
  cleanupFunctions.push(attr(input_20, 'value', $derived(() => (returnDate.value))));
  const eventHandler_21 = /* UNHANDLED_HTML_EXPRESSION_TYPE_MustacheAttribute */;
  input_20.addEventListener('put', eventHandler_22);
  cleanupFunctions.push(() => input_20.removeEventListener('put', eventHandler_23));
  cleanupFunctions.push(attr(input_20, 'class', $derived(() => (showInvalidReturn.value ? "" : ""))));
  div_19.appendChild(input_20);

  const text_24 = document.createTextNode("Return Date");
  div_19.appendChild(text_24);
  fragment.appendChild(div_19);
      insertAfter(fragment, if_start_anchor_16);
    } 
  }));


  const div_25 = document.createElement('div');
  const button_26 = document.createElement('button');
  cleanupFunctions.push(attr(button_26, 'disabled', $derived(() => (isSubmitDisabled.value))));
  const eventHandler_27 = /* UNHANDLED_HTML_EXPRESSION_TYPE_MustacheAttribute */;
  button_26.addEventListener('ick', eventHandler_28);
  cleanupFunctions.push(() => button_26.removeEventListener('ick', eventHandler_29));
  const text_30 = document.createTextNode("Book Flight");
  button_26.appendChild(text_30);
  div_25.appendChild(button_26);
  rootEl_0.appendChild(div_25);

  const if_condition_derived_33 = $derived(() => bookingMessage.value);
  const if_start_anchor_31 = document.createTextNode('');
  const if_end_anchor_32 = document.createTextNode('');
  rootEl_0.appendChild(if_start_anchor_31);
  rootEl_0.appendChild(if_end_anchor_32);

  cleanupFunctions.push($effect(() => {
    clearNodesBetween(if_start_anchor_31, if_end_anchor_32);
    const fragment = document.createDocumentFragment();
    if (if_condition_derived_33.value) {
  const div_34 = document.createElement('div');
  div_34.setAttribute('class', "message");
  const text_interp_35 = document.createTextNode('');
  div_34.appendChild(text_interp_35);
  cleanupFunctions.push(state.text(text_interp_35, $derived(() => bookingMessage.value)));
  fragment.appendChild(div_34);
      insertAfter(fragment, if_start_anchor_31);
    } 
  }));



    // Return the root DOM fragment and a destroy method
    return {
        root: rootEl_0,
        destroy: () => {
            cleanupFunctions.forEach(fn => fn());
            // Any other component-specific teardown
        }
    };
}
