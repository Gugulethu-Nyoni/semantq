## Interpolations

Interpolations inject dynamic values directly into the text content of elements.

### Overview Table: Interpolation Syntax

| Use Case          | Syntax                          | Description                           |
| ----------------- | ------------------------------- | ------------------------------------- |
| Variable Display  | `{username}`                    | Displays value of a reactive variable |
| Expression        | `{count + 1}`                   | Embeds live-calculated expressions    |
| Ternary Condition | `{isAdmin ? 'Admin' : 'Guest'}` | Simple inline logic rendering         |

###  Basic Interpolation

```html
<h1>Welcome, {username}</h1>
```

* Automatically updates when `username.value` changes.


### Expressions

```html
<p>Next Count: {count + 1}</p>
```

* Any valid JavaScript expression can be interpolated.
* Use this to perform calculations inline.

###  Ternary Logic

```html
<p>{isAdmin ? 'Welcome Admin' : 'Welcome Guest'}</p>
```

* Simple decision-making for text content.


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
