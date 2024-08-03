// StateManager class
export default class StateManager {

  constructor() {
    this.subscribers = [];
  }

  // Method for setting values in local storage
setValue(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Method for getting values from local storage
getValue(key) {
    const retrievedValue = localStorage.getItem(key);

    if (retrievedValue === null) {
      return null;
    } else {
      return JSON.parse(retrievedValue);
    }
  }

  // Method for subscribing to state changes
subscribeToStateChanges(callback) {
    this.subscribers.push(callback);
  }

  // Method for triggering re-renders in components
triggerReRender(component) {
    this.subscribers.forEach((callback) => {
      callback(component);
    });
  }
}
