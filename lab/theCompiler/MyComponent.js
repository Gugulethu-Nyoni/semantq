// MyComponent.js
import { globalCount } from './global-store.js';

const MyComponent = () => {
  const unsubscribe = globalCount.subscribe(value => {
    // Update the UI reactively when the store value changes
    console.log('Global count updated:', value);
  });

  // Update the store value using the set method
  globalCount.update(globalCount.value + 2);

  // ...
};

// Create and mount the component
function mount(component) {
  // Render the component
  component();

  // Return the unmount function
  return () => {
    console.log('MyComponent unmounted');
  };
}

// Create and unmount the component
function unmount(unmountFn) {
  // Unmount the component
  unmountFn();
}

// Usage example
const myComponent = () => {
  // MyComponent code goes here
};
const unmountFn = mount(myComponent);

// Test reading global state
console.log('Initial global count:', globalCount.value);

// Update global state outside of the component
globalCount.update(globalCount.value + 3);

// Test reading updated global state
console.log('Updated global count:', globalCount.value);

// Unmount the component
unmount(unmountFn);

// Update global state after component is unmounted
globalCount.update(globalCount.value + 1);
