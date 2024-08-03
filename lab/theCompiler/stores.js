// stores.js
export class Store {
  constructor(initialValue) {
    this.value = initialValue;
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  unsubscribe(callback) {
    const index = this.subscribers.indexOf(callback);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
    }
  }

  update(value) {
    this.value = value;
    this.notifySubscribers();
  }

  notifySubscribers(
) {
    this.subscribers.forEach(callback => callback(this.value));
  }
}
