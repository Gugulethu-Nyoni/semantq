// src/runtime/dom-helpers.js

/**
 * Inserts a new DOM node after a reference node.
 * @param {Node} newNode - The node to insert.
 * @param {Node} referenceNode - The node after which to insert the newNode.
 */
export function insertAfter(newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    } else {
        console.warn("insertAfter: referenceNode or its parent is null/undefined. Cannot insert node.", newNode, referenceNode);
    }
}

/**
 * Removes a DOM node from its parent.
 * @param {Node} node - The node to remove.
 */
export function removeNode(node) {
    if (node && node.parentNode) {
        node.parentNode.removeChild(node);
    }
}

/**
 * Removes all sibling nodes between a start and an end anchor.
 * This is useful for clearing dynamically rendered blocks.
 * @param {Node} startAnchor - The node *before* the content to remove.
 * @param {Node} endAnchor - The node *after* the content to remove.
 */
export function clearNodesBetween(startAnchor, endAnchor) {
    if (!startAnchor || !endAnchor || !startAnchor.parentNode || startAnchor.parentNode !== endAnchor.parentNode) {
        console.warn("clearNodesBetween: Invalid anchors provided. Cannot clear nodes.");
        return;
    }

    let currentNode = startAnchor.nextSibling;
    while (currentNode && currentNode !== endAnchor) {
        const next = currentNode.nextSibling;
        currentNode.parentNode.removeChild(currentNode);
        currentNode = next;
    }
}

/**
 * Performs a basic keyed reconciliation for a list of children managed after a start anchor.
 * This function is designed to be called within an $effect.
 * It focuses on adding, removing, and reordering nodes without a full parent clear.
 *
 * @param {Node} startAnchor - The anchor node marking the start of the managed list.
 * All children will be managed immediately after this node.
 * @param {Array<any>} newItems - The array of data items for the new state.
 * @param {Map<any, {node: Node, cleanup: Function | null}>} oldMap - A Map tracking previous keys to their corresponding DOM nodes and cleanups.
 * @param {function(any, number): {node: Node, cleanup: Function | null}} createChildFn - A function that takes an item and index, and returns an object { node: DOM Node, cleanup: Function }.
 * @param {function(any, number): any} getKeyFn - A function to extract a unique key from an item and its index.
 * @returns {Map<any, {node: Node, cleanup: Function | null}>} The updated map of keys to nodes/cleanups.
 */
export function reconcileChildren(startAnchor, newItems, oldMap, createChildFn, getKeyFn) {
    const parentNode = startAnchor.parentNode;
    if (!parentNode) {
        console.warn("reconcileChildren: startAnchor has no parent. Cannot reconcile children.");
        return oldMap;
    }

    const newMap = new Map();
    const fragment = document.createDocumentFragment(); // Use a fragment for efficient appending and reordering

    // Phase 1: Create/Reuse nodes and build the fragment in the desired new order
    newItems.forEach((item, index) => {
        const key = getKeyFn(item, index);
        let entry = oldMap.get(key);

        if (entry) {
            // Item exists: reuse existing node and ensure it's added to the fragment
            newMap.set(key, entry);
            fragment.appendChild(entry.node);
        } else {
            // New item: create DOM and run inner reactivity
            const { node: newNode, cleanup } = createChildFn(item, index);
            if (!newNode) {
                console.warn("createChildFn did not return a node for key:", key, item);
                return;
            }
            newMap.set(key, { node: newNode, cleanup });
            fragment.appendChild(newNode);
        }
    });

    // Phase 2: Remove old nodes that are no longer present in newItems
    oldMap.forEach((entry, key) => {
        if (!newMap.has(key)) { // If not in newMap, it's a node to be removed
            removeNode(entry.node);
            if (entry.cleanup) {
                entry.cleanup(); // Run cleanup for the removed item's internal effects
            }
        }
    });

    // Phase 3: Insert the correctly ordered fragment after the startAnchor
    // This efficiently adds new nodes and reorders existing ones in the live DOM.
    // It avoids removing all children of parentNode first.
    insertAfter(fragment, startAnchor);


    return newMap; // Return the updated map for the next reconciliation cycle
}