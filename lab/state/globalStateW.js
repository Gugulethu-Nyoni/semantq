// globalStateW.js

import WritableStore from './writableStore.js';

// Create a writable store for the global state
const globalStateStore = new WritableStore({});

export function setGlobalState(newState) {
    globalStateStore.set(newState);
}

export function getGlobalState() {
    return globalStateStore.value;
}

export function subscribeToGlobalState(listener) {
    return globalStateStore.subscribe(listener);
}
