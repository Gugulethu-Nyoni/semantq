

## HTML Attribute Formats

This document outlines the various attribute formats supported within Semantq Custom Syntax elements. The first section covers standard HTML attribute types, which are fully supported and form the foundation for extended custom behavior in Semantq.


### 1. Standard Key-Value Attributes

```html
<input id="username" type="text" value="John" />
```

* Format: `key="value"`
* Quotes can be single (`'`) or double (`"`)
* Values may sometimes be unquoted (not recommended)

### 2. Boolean Attributes

```html
<input type="checkbox" checked />
<input disabled />
```

* Only the presence of the attribute matters
* Examples: `checked`, `disabled`, `readonly`, `required`, `autofocus`

### 3. Data Attributes

```html
<div data-user-id="42" data-role="admin"></div>
```

* Format: `data-*="value"`
* Used for embedding custom data
* Accessed via JavaScript: `element.dataset.userId`

### 4. Event Handler Attributes

```html
<button onclick="alert('Hello')">Click me</button>
```

* Format: `on*="JavaScript code"`
* Examples: `onclick`, `onmouseover`, `oninput`

### 5. Empty / Omitted Attributes

```html
<option selected>Option</option>
<track default />
```

* Used like boolean attributes, typically imply default states
* Presence alone activates the attribute

### 6. Style Attribute

```html
<div style="color: red; font-weight: bold;"></div>
```

* Inline CSS as a string of style declarations

### 7. ARIA (Accessible Rich Internet Applications) Attributes

```html
<button aria-label="Close" aria-hidden="true"></button>
```

* Format: `aria-*="value"`
* Used to improve accessibility for assistive technologies

### 8. Namespaced Attributes (XML/SVG)

```html
<svg xmlns:xlink="http://www.w3.org/1999/xlink"></svg>
```

* Format: `namespace:attribute`
* Common in SVG or XML-based elements

### 9. Multiple Value Attributes

```html
<div class="container dark-mode responsive"></div>
<input type="text" autocomplete="on off" />
```

* Some attributes accept a space- or comma-separated list of values

### 10. Script-like or Structured Attributes

```html
<iframe srcdoc="<p>Hello</p>"></iframe>
<script integrity="sha384-..."></script>
<input pattern="[A-Za-z]{3,}" />
```

* Values may contain code, structured data, or regex


### Summary Table

| Format                   | Example                   | Description                    |
| ------------------------ | ------------------------- | ------------------------------ |
| `key="value"`            | `id="myId"`               | Most common format             |
| `key='value'`            | `name='user'`             | Also valid                     |
| `key=value`              | `width=100`               | Valid if value is safe         |
| Boolean (key only)       | `disabled`, `checked`     | Treated as true if present     |
| Data attributes          | `data-id="123"`           | Custom user-defined data       |
| ARIA attributes          | `aria-hidden="true"`      | Accessibility attributes       |
| Event handler attributes | `onclick="doSomething()"` | JavaScript events              |
| Style attributes         | `style="color:red;"`      | Inline CSS                     |
| Namespaced attributes    | `xlink:href="..."`        | Used in SVG/XML                |
| Multiple values          | `class="a b c"`           | List of space-separated values |
| Empty / present-only     | `<option selected>`       | Presence implies true          |




###  Special Semantq Custom Attributes

In addition to standard HTML attributes, Semantq provides a set of custom attributes to enable reactive and dynamic behavior directly within your HTML. These attributes follow a specific syntax that the Semantq transpiler uses to generate the necessary JavaScript code.



#### `bind:` Two-Way Binding

The `bind:` prefix is used for **two-way data binding**. This links an element's property (like `value` or `checked`) to a reactive state variable. Any change to the element's value automatically updates the state variable, and any change to the state variable updates the element.

  * **Custom Syntax Example:**

    ```html
    <input type="text" bind:value={name} />
    ```

  * **Explanation:** This example binds the `value` property of the `<input>` element to a reactive state variable named `name`.



#### `@` Event Handlers

The `@` prefix is used to declare **event handlers**. It associates a JavaScript function or expression with a specific DOM event on an element. The function is invoked whenever that event is triggered.

  * **Custom Syntax Example:**

    ```html
    <button @click={sayHello}>Click Me</button>
    ```

  * **Explanation:** This associates the `click` event of the `<button>` with the `sayHello` function. When the button is clicked, the `sayHello` function will be executed.



#### `{}` Dynamic Attributes

The curly braces (`{}`) syntax can be used on any HTML attribute to make its value **dynamic and reactive**. This is for one-way data flow, where the attribute's value is derived from a reactive expression.

  * **Custom Syntax Example:**

    ```html
    <input value={fahrenheit.value} />
    ```

  * **Explanation:** This sets the `value` attribute of the `<input>` to the current value of the `fahrenheit.value` expression. If `fahrenheit.value` changes, the `input` element's value will be automatically updated.



#### Boolean Attributes (`{}`)

You can use the curly braces with a reactive variable to control the presence of a **boolean attribute**. If the variable evaluates to `true`, the attribute will be added to the element; otherwise, it will be removed.

  * **Custom Syntax Example:**

    ```html
    <button {disabled}>Submit</button>
    ```

  * **Explanation:** The `disabled` attribute will be present on the `<button>` element if the reactive variable `disabled` is `true`. If `disabled` is `false`, the attribute will be removed, enabling the button.


Of course. I'll update the README section to be more comprehensive, incorporating the specific node names, descriptions, and examples from your provided list. This revised version will be clearer and more aligned with the technical details of the Semantq parser.

***

### Special Semantq Custom Attributes Table


| Attribute Type | Custom Syntax Example | Node Name | Description |
| :--- | :--- | :--- | :--- |
| **Event Handler** | `<button @click={handler}>` | `EventHandler` | Handles DOM events with the **`@`** prefix. The associated function or expression is invoked when the event occurs. |
| **Two-Way Binding** | `<input bind:value={variable}>` | `TwoWayBindingAttribute` | Creates **two-way data binding** with the **`bind:`** prefix, linking an element's property to a reactive state variable. |
| **Dynamic Attribute** | `<input value={variable}>` | `MustacheAttribute` | A **one-way dynamic attribute** where the value is set by a reactive JavaScript expression inside **`{}`** curly braces. |
| **Boolean Identifier** | `<button {disabled}>` | `MustacheAttribute` | A special case for dynamic boolean attributes, where the attribute is present or absent based on the truthiness of a reactive variable. |
| **Key-Value** | `<input type="number">` | `KeyValueAttribute` | Standard static HTML attributes with a key-value pair. |
| **Boolean** | `<input type="checkbox" checked>` | `BooleanAttribute` | A standalone boolean attribute that doesn't have a value. |

***

### Additional Notes

* **Self-Closing Tags**: All attributes can be used on self-closing tags, such as `<input type="text" @click={handler} />`.
* **Dynamic Expressions**: The curly braces can contain complex JavaScript expressions, not just single variables. For example, `class={isActive ? 'active' : 'inactive'}` or `value={counter + 1}` are both valid.
* **Modifiers**: Event handlers can include modifiers for advanced behavior, such as `@click.prevent` to prevent the default browser action.
