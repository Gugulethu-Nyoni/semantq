# Semantq Grammar Documentation

Semantq is a lightweight, expressive grammar and declarative syntax for writing Semantq JS Framework components with dynamic capabilities. It supports standard HTML elements, logic blocks, event handlers, and custom attributes. This is the documentation of the syntax and features supported by the Semantq grammar.

---

## Table of Contents
1. [HTML Elements](#html-elements)
   - [Open and Close Tags](#open-and-close-tags)
   - [Self-Closing Tags](#self-closing-tags)
2. [Logic Blocks](#logic-blocks)
   - [Conditional Blocks (`@if`)](#conditional-blocks)
3. [Event Handlers](#event-handlers)
4. [Dynamic Content](#dynamic-content)
   - [Mustache Syntax](#mustache-syntax)
   - [Ternary Operator](#ternary-operator)
5. [Slot Prop Attributes](#slot-prop-attributes)
6. [Examples](#examples)
7. [Grammar Rules](#grammar-rules)
8. [Usage](#usage)
9. [License](#license)

---

## HTML Elements

### Open and Close Tags
Semantq supports standard HTML open and close tags. For example:

```html
<div>
  <p>This is a paragraph inside a div.</p>
</div>
```

### Self-Closing Tags
Self-closing HTML elements are also supported. For example:

```html
<input type="text" value="Hello World" />
<hr/>
<img src="image.jpg" alt="An image" />
```

---

## Logic Blocks

### Conditional Blocks
Semantq supports conditional logic using the `@if` block. The syntax is as follows:

```html
@if(condition)
  <!-- Content to render if the condition is true -->
@endif
```

#### Example
```html
<div>
  @if(isAdmin > 2)
    <p>Clicked: {counter > 1 ? 'times' : 'time'}</p>
  @endif
</div>
```

- The `condition` is a JavaScript-like expression.
- The content inside the block is rendered only if the condition evaluates to `true`.

---

## Event Handlers
Event handlers are defined using the `@` symbol followed by the event name. The handler is specified using mustache syntax (`{...}`).

#### Syntax
```html
<element @event={handler}>
```

#### Example
```html
<input type="text" @click={rejuice} value={counter} disabled />
```

- `@click` is the event handler for the `click` event.
- `{rejuice}` is the function or expression to execute when the event is triggered.

---

## Dynamic Content

### Mustache Syntax
Dynamic content is embedded in templates using mustache syntax (`{...}`). This allows you to inject variables or expressions directly into the HTML.

#### Example
```html
<p>This is some sample content: {counter} - there we go!</p>
```

### Ternary Operator
The ternary operator (`? :`) is supported for conditional rendering within mustache syntax.

#### Example
```html
<button>Clicked: {counter} {counter > 1 ? 'times' : 'time'}</button>
```

- If `counter > 1`, the output will be `times`.
- Otherwise, the output will be `time`.

---

## Slot Prop Attributes
Slot prop attributes are used to pass data to slots in custom components. The syntax is `let:propName`.

#### Syntax
```html
<element let:propName>
```

#### Example
```html
<div let:age>
  <p>Age: {age}</p>
</div>
```

---

## Examples

### Example 1: Basic HTML with Dynamic Content
```html
<body>
  <header>
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section>
      <h1>Welcome to my page!</h1>
      <p>This is some sample content: {counter} - there we go!</p>
    </section>
  </main>

  <footer>
    <p>&copy; 2024 My Page</p>
  </footer>
</body>
```

### Example 2: Conditional Logic and Event Handlers
```html
<div>
  @if(isAdmin > 2)
    <p>Clicked: {counter > 1 ? 'times' : 'time'}</p>
  @endif

  <input type="text" @click={rejuice} value={counter} disabled />
</div>
```

### Example 3: Slot Prop Attributes
```html
<div let:age>
  <p>Age: {age}</p>
</div>
```

---

## Grammar Rules
The grammar is defined using Peggy.js and supports the following constructs:
- **HTML Elements**: Open/close tags and self-closing tags.
- **Logic Blocks**: Conditional rendering with `@if`.
- **Event Handlers**: Event binding with `@event={handler}`.
- **Dynamic Content**: Mustache syntax (`{...}`) and ternary operators.
- **Slot Prop Attributes**: `let:propName` syntax for passing data to slots.

---

## Usage
To use the Semantq grammar, include the Peggy.js parser in your project and parse templates using the provided grammar rules.

```javascript
import parser from './semantq-grammar.js';
const template = `
  <div>
    <p>{message}</p>
    @if(showButton)
      <button @click={handleClick}>Click Me</button>
    @endif
  </div>
`;

const result = parser.parse(template);
console.log(result);
```

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

