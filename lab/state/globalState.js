// globalState.js

export class GlobalState {
    constructor(storageKey) {
        this.storageKey = storageKey;
        this.state = this.loadStateFromStorage();
        this.subscribers = {};
        this.setupStorageListener();
    }

    // Method to set a value in the global state
    set(key, value) {
        this.state[key] = value;
        this.saveStateToStorage();
        this.notifySubscribers(key, value);
    }

    // Method to get a value from the global state
    get(key) {
        return this.state[key];
    }

    // Method to subscribe to changes in the global state
    subscribe(key, callback) {
        if (!this.subscribers[key]) {
            this.subscribers[key] = [];
        }
        this.subscribers[key].push(callback);
    }

    // Method to notify subscribers of changes in the global state
    notifySubscribers(key, value) {
        const callbacks = this.subscribers[key];
        if (callbacks) {
            callbacks.forEach(callback => callback(value));
        }
    }

    // Method to load state from storage
    loadStateFromStorage() {
        const storedState = localStorage.getItem(this.storageKey);
        return storedState ? JSON.parse(storedState) : {};
    }

    // Method to save state to storage
    saveStateToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    }

    // Method to setup listener for storage change events
    setupStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === this.storageKey) {
                const newState = JSON.parse(event.newValue);
                Object.assign(this.state, newState);
                this.notifySubscribers('storageChange', newState);
            }
        });
    }
}

// Create a single instance of GlobalState and attach it to the window object
const globalState = new GlobalState('myGlobalState');

// Export the globalState instance for use in other modules
export default globalState;
