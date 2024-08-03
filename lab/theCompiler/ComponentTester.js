// ComponentTester.js
import { globalCount } from './global-store.js';
import { MyComponent } from './MyComponent.js';

it('should update the global count when creating MyComponent', () => {
  expect(globalCount.value).toBe(0);

  // Create an instance of MyComponent
const myComponent = new MyComponent();

  // Wait for the next event loop tick to ensure the UI update has been triggered
await new Promise(resolve => setImmediate(resolve));

  // Verify that the global count has been updated
expect(globalCount.value).toBe(1);

  // Verify that MyComponent can read the updated global count
expect(myComponent.globalCount).toBe(1);

  // Update the global count through MyComponent
myComponent.incrementGlobalCount();

  // Wait for the next event loop tick to ensure the UI update has been triggered
await new Promise(resolve => setImmediate(resolve));

  // Verify that the global count has been updated again
expect(globalCount.value).toBe(2);

  // Verify that MyComponent can read the updated global count
expect(myComponent.globalCount).toBe(2);
});
