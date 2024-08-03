// store.js

export const globalStore = {
  state: {},
  subscribers: {},

  set(key, value) {
    this.state[key] = value;
    this.notifySubscribers(key, value);
    // Dispatch custom event for state change
    const event = new CustomEvent('globalStateChange', { detail: { key, value } });
    document.dispatchEvent(event);
  },

  get(key) {
    return this.state[key];
  },

  subscribe(key, callback) {
    if (!this.subscribers[key]) {
      this.subscribers[key] = [];
    }
    this.subscribers[key].push(callback);
  },

  notifySubscribers(key, value) {
    const callbacks = this.subscribers[key];
    if (callbacks) {
      callbacks.forEach(callback => callback(value));
    }
  }
};

//export default globalStore;
