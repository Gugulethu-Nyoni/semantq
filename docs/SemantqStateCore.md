# Semantq State Management Library Documentation

@semantq/state is a powerful light weight state management solution designed for use with the Semantq JS Framework, although it can easily be adapted for vanilla JavaScript applications or integrated with other frameworks. It enables developers to create reactive user interfaces with minimal code, leveraging Semantq’s declarative syntax.

## Table of Contents

- [General Philosophy](#general-philosophy)
- [Installation and Setup](#installation-and-setup)
- [Using Reactive States](#using-reactive-states)
- [Derived States](#derived-states)
- [Handling Input Elements](#handling-input-elements)
  - [Text Input Binding](#text-input-binding)
  - [Checkbox Binding](#checkbox-binding)
  - [Radio Button Binding](#radio-button-binding)
  - [Select and Multi-Select Inputs](#handling-select-and-multi-select-inputs)
- [Managing Tab Indexes](#managing-tab-indexes)
- [Effects](#effects)
- [Conclusion](#conclusion)


## General Philosophy

Semantq philosophy is that state is a stream and not a snapshot. 


### Key Features:
- **Reactive State:** Values are automatically updated in the UI when their state changes.
- **Declarative Syntax:** Use custom shorthand syntax for binding data and handling events.
- **Component-Based:** State is scoped to individual components, allowing for modular, reusable code.


## Installation and Setup

To use the state management system in your project, you first need to install it from npm:

```bash
npm install @semantq/state
```

Once installed, you can import the necessary functions into your Semantq components.

```html
@script
  import { $state, $derived, $effect, bind } from '@semantq/state';
@end
```


## Using Reactive States

In Semantq, you can define reactive states using the `$state` function. Once a state is defined, any bound element in the HTML will automatically update when the state changes.

### Example: Reactive Count State

```html
@script
  let count = $state(0);
  function increment() {
    count.value++;
  }
@end

@html
  <p @bind={count}></p>
  <button @click={increment}> + </button>
```

In this example:
- The `count` state is initialized with a value of `0`.
- The `increment` function updates the value of `count` when the button is clicked.
- The `@bind={count}` directive ensures the `<p>` text element automatically updates when `count` changes.


## Derived States

Derived states allow you to create computed values based on other reactive states.

### Example: Derived Double of Count

```html
@script
  let count = $state(0);
  const doubled = $derived(() => count.value * 2);
@end

@html
  <p @bind={doubled}></p>
  <button @click={() => count.value++ }> + </button>
```

Here:
- `doubled` is a derived state based on `count`.
- It automatically updates whenever `count` changes, and binds to the `<p>` tag for display.

## Handling Input Elements

You can easily bind different types of inputs to reactive states. This works for all types of inputs: text, number, checkbox, radio buttons, and select elements.

### Example: Text Input Binding

```html
@script
  let textInput = $state("");
@end

@html
  <input @bind={textInput} type="text" />
  <p @bind={textInput}></p>
```

In this example:
- The value of the `<input>` is bound to the `textInput` state.
- Any changes to the input field will automatically update the `textInput` state, and vice versa.

### Example: Checkbox Binding

```html
@script
  let isChecked = $state(false);
@end

@html
  <label>
    <input @bind={isChecked} type="checkbox" />
    Check me
  </label>
  <p @bind={isChecked}></p>
```

This binds the checkbox’s checked state to the `isChecked` reactive state.

### Example: Radio Button Binding

```html
@script
  let selectedOption = $state("option1");
@end

@html
  <label>
    <input @bind={selectedOption} type="radio" value="option1" /> Option 1
  </label>
  <label>
    <input @bind={selectedOption} type="radio" value="option2" /> Option 2
  </label>
  <p @bind={selectedOption}></p>
```

In this case:
- The radio buttons are bound to the `selectedOption` state, and the selected option will be reflected in the `<p>` tag.



## Handling Select and Multi-Select Inputs

You can bind `<select>` and `<select multiple>` elements to reactive states, allowing for easy management of user selections.

### Example: Single Select Binding

```html
@script
  let selectedOption = $state("one");
@end

@html
  <select @bind={selectedOption}>
    <option value="one">One</option>
    <option value="two">Two</option>
    <option value="three">Three</option>
  </select>
  <p @bind={selectedOption}></p>
```

### Example: Multi-Select Binding

```html
@script
  let multiSelect = $state(["apple"]);
@html
  <select @bind={multiSelect} multiple size="3">
    <option value="apple" selected>Apple</option>
    <option value="banana">Banana</option>
    <option value="cherry">Cherry</option>
  </select>
  <p @bind={multiSelect}></p>
```

In these examples:
- The selected value(s) from the `<select>` element will automatically bind to the respective state (`selectedOption` or `multiSelect`).



## Managing Tab Indexes

You can bind the `tabindex` attribute to a reactive state, enabling dynamic focus control.

### Example: Dynamic Tab Index

```html
@script
  let tabbed = $state(0);
@html
  <input @bind={tabbed} tabindex />
  <button @click={() => tabbed.value++ }>Toggle Tab Index</button>
```

This example:
- Changes the `tabindex` of the input element based on the value of the `tabbed` state.




## Range Input Binding

Bind a range slider to a reactive state and display the value as text.

### Example

```html
<label>
    Volume: <span @text={volume} @format={(val) => val }></span>
  </label>
  <input type="range" min="0" max="100" @bind={volume} />
```

```js
@script
  let volume = $state(50);
@end
```

### Notes
- `bind()` syncs the range's value with state.
- `bindText()` reflects changes in real-time with optional formatting.
- Works with `type="range"` inputs the same way as text/number inputs.


## Class Binding

Toggle a CSS class dynamically based on a reactive boolean state.

### Example

```html
 <input type="checkbox" @bind={isActive} /> Toggle Active

  <div id="status-box" @class:active={isActive}>
    This box changes style when active
  </div>

  <style>
    .active {
      background-color: #4caf50;
      color: white;
      font-weight: bold;
      border: 2px solid #388e3c;
    }
  </style>
```

```js
@script
const isActive = $state(false);
@end
```

### Notes
- `bindClass()` adds/removes the specified class (`'active'` in this case) based on truthiness of the bound state.
- You can combine this with custom styles to change UI appearance reactively.
- Use multiple `bindClass()` calls if you want to toggle multiple classes independently.


## Effects

Effects allow you to run side effects based on state changes. They are ideal for scenarios like logging or executing other tasks when a state updates.

### Example: Logging Form Field Changes

```html
@script
  let username = $state("");
  $effect(() => {
    console.log("Username changed:", username.value);
  });
@end
@html
  <input @bind={username} type="text" placeholder="Enter username" />
  <p @bind={username}></p>
```

In this example:
- The `$effect` will log the value of `username` every time it changes. This is particularly useful in cases where you want to track form field changes, such as saving user input as they type or validating data in real time.



## Conclusion

With the Semantq state management library, you can easily manage reactive state in your applications with minimal boilerplate. By leveraging the declarative syntax and state bindings, you can ensure that your UI stays in sync with your application’s state.

This system is simple yet powerful, enabling you to handle various input types, dynamic attributes, and side effects with ease, all while staying within the capabilities of the current library.

## **License**

Semantq is open-source software licensed under the **MIT License**.

## Semantq Main Documentation: [Semantq](https://github.com/Gugulethu-Nyoni/semantq).
