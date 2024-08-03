// writableStore.js

export class WritableStore {
    constructor(initialValue) {
        this.value = initialValue;
        this.listeners = [];
    }

    set(newValue) {
        if (this.value !== newValue) {
            this.value = newValue;
            this.notifyListeners(newValue);
        }
    }

    subscribe(listener) {
        this.listeners.push(listener);
        // Return a function to unsubscribe the listener
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners(value) {
        this.listeners.forEach(listener => listener(value));
    }
}

export default WritableStore;
