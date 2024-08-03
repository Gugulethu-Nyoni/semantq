class GlobalState {
  constructor() {
    this.data = {};
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    localStorage.setItem(key, JSON.stringify(value));
  }
}

// Create and export a single instance of GlobalState
export const globalState = new GlobalState();
