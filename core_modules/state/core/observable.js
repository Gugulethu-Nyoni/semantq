// src/core/observable.js
export class Observable {
  constructor() {
    this.subscribers = new Set();
  }

  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  notify(value) {
    this.subscribers.forEach(fn => fn(value));
  }
}