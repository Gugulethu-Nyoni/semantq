# Semantq Grammar Documentation

Semantq is a lightweight, expressive grammar and declarative syntax for writing Semantq JS Framework components with dynamic capabilities. It supports standard HTML elements, logic blocks, event handlers, and custom attributes. This documentation outlines the syntax and features supported by the Semantq grammar.

---

## Table of Contents
1. [Introduction](#introduction)
2. [Existing Syntax Blocks](#existing-syntax-blocks)
   - [HTML Elements](#html-elements)
   - [Dynamic Content](#dynamic-content)
   - [Event Handlers](#event-handlers)
   - [Slot Prop Attributes](#slot-prop-attributes)
3. [Syntax Blocks to Be Added](#syntax-blocks-to-be-added)
   - [Logic Blocks](#logic-blocks)
   - [Async/Await Support](#asyncawait-support)
   - [Keyed Lists](#keyed-lists)
   - [Async Blocks with Fallbacks](#async-blocks-with-fallbacks)
4. [Examples](#examples)
5. [Grammar Rules](#grammar-rules)
6. [Usage](#usage)
7. [License](#license)

---

## Introduction

Semantq simplifies templating and dynamic HTML generation with:
- Standard HTML elements
- Self-closing tags
- Mustache syntax for data binding
- Event handlers and function calls with parameters
- Slot-based scoped props

This makes it ideal for creating structured, dynamic content efficiently.

---


# Component Structure in SemantQ

A component in Semantq is composed of **JavaScript**, **CSS**, and **HTML**. All of these are optional, meaning you can include only what your component needs.

---

## JavaScript Tags

In Semantq, JavaScript code is enclosed within `@script` and `@end` tags. These tags act as markers for the beginning and end of the script block.

### Example: `Card.smq` or `+page.smq`

```semantq
@script
console.log("Hello World");
@end
```

---

## CSS Tags

Similarly, CSS styles are enclosed within `@style` and `@end` tags. These tags define the start and end of the style block.

### Example: `Card.smq` or `+page.smq`

```semantq
@style
h1 { color: red; }
@end
```

---

## HTML Tag (Optional)

The HTML content is marked with the `@html` tag. This tag is optional but helps provide structure and clarity to your component by explicitly indicating where the HTML begins.

### Example: `Card.smq` or `+page.smq`

```Semantq
@html
<h1>Hello World</h1>
```

---

## Using Regular HTML Tags

You are also free to use standard HTML `<script>` and `<style>` tags if you prefer. This approach is fully supported in Semantq.

### Example:

```html
<script>
  console.log("Hello World");
</script>

<style>
  h1 { color: red; }
</style>

<h1>Hello World</h1>
```

---

## Important Notes

1. **Consistency is Key**:
   - Avoid mixing syntax styles within the same component. Choose one approach and stick with it.
   - For example, **do not** combine `@script` with `<script>` tags in the same component:

   ```semantq
   @script
   console.log("Hello World");
   <script> // This is invalid!
   ```

2. **Optional HTML Marker**:
   - The `html:` marker is optional but recommended for better readability and structure.

3. **Flexibility**:
   - You can include only the parts your component needs (e.g., just HTML, or HTML + CSS, or all three).

---

## Full Example

Here’s a complete example of a Semantq component using the custom syntax:

```Semantq
@script
console.log("Component script loaded!");
@end
```

```Semantq
@style
h1 {
  color: blue;
  font-family: Arial, sans-serif;
}
@end
```

```Semantq
@html
<h1>Welcome to Semantq</h1>
<p>This is a sample component.</p>
```

## Example Project Structure

Here’s an example of how a Semantq project is organized:


```bash
src/
├── components/            # Shared components (available for import)
│   ├── global/            # Default Semantq-provided components
│   │   ├── Theme.smq      # Theme handling (light/dark modes, etc.)
│   │   ├── Button.smq     # Semantq-provided button component
│   │   ├── Modal.smq      # Semantq-provided modal component
│   ├── Card.smq           # Custom reusable Card component
│   ├── Header.smq         # Custom reusable Header component
│   ├── Footer.smq         # Custom reusable Footer component
│   ├── Sidebar.smq        # Custom reusable Sidebar component (optional)
├── routes/                # Application pages & layouts
│   ├── home/              # Home page route
│   │   ├── +page.smq      # Home page content
│   │   ├── +layout.smq    # (Optional) Custom layout for Home
│   ├── about/             # About page route
│   │   ├── +page.smq      # About page content
│   ├── dashboard/         # Dashboard page route
│   │   ├── +page.smq      # Dashboard page content
│   │   ├── +layout.smq    # (Optional) Custom layout for Dashboard
│   ├── contact/           # Contact page route
│   │   ├── +page.smq      # Contact page content
```


## Existing Syntax Blocks

### HTML Elements

#### Open and Close Tags
Semantq supports standard HTML open and close tags. For example:

```html
<div>
  <p>This is a paragraph inside a div.</p>
</div>
```

#### Self-Closing Tags
Self-closing HTML elements are also supported. For example:

```html
<input type="text" value="Hello World" />
<hr/>
<img src="image.jpg" alt="An image" />
```

---

### Dynamic Content

#### Mustache Syntax
Dynamic content is embedded in templates using mustache syntax (`{...}`). This allows you to inject variables or expressions directly into the HTML.

```html
<p>This is some sample content: {counter} - there we go!</p>
```

#### Ternary Operator
The ternary operator (`? :`) is supported for conditional rendering within mustache syntax.

```html
<button>Clicked: {counter} {counter > 1 ? 'times' : 'time'}</button>
```

---

### Event Handlers
Event handlers are defined using the `@` symbol followed by the event name. The handler is specified using mustache syntax (`{...}`).

#### Syntax
```html
<element @event={handler}>
```

#### Example
```html
<input type="text" @click={rejuice} value={counter} disabled />
```

---

### Slot Prop Attributes
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

## Syntax Blocks to Be Added

### Logic Blocks

#### Conditional Blocks (`@if`)
Semantq supports conditional logic using the `@if` block.

```html
{@if user.loggedIn}
  <p>Welcome back, {user.name}!</p>
{@else}
  <p>Please log in.</p>
{@endif}
```

#### Loops (`@for`)
Semantq introduces a loop syntax for rendering lists.

```html
<ul>
  {@for item in items}
    <li>{item.name}</li>
  {@endfor}
</ul>
```

#### Combining Logic Blocks
You can combine logic blocks for more complex scenarios.

```html
{@if items.length > 0}
  <ul>
    {@for item in items}
      <li>{item.name}</li>
    {@endfor}
  </ul>
{@else}
  <p>No items found.</p>
{@endif}
```

---

### Async/Await Support
Semantq makes it easy to handle asynchronous operations directly in templates.

```html
{@await fetchData()}
  <p>Loading...</p>
{@then data}
  <p>{data}</p>
{@catch error}
  <p>Error: {error.message}</p>
{@endawait}
```

---

### Keyed Lists
For performance optimization, Semantq offers a `key` attribute for lists.

```html
<ul>
  {@for item in items key="id"}
    <li>{item.name}</li>
  {@endfor}
</ul>
```

---

### Async Blocks with Fallbacks
For async blocks, you can provide a fallback UI while waiting for data.

```html
{@await fetchData()}
  <p>Loading...</p>
{@then data}
  <p>{data}</p>
{@catch error}
  <p>Error: {error.message}</p>
{@else}
  <p>No data available.</p>
{@endawait}
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
  {@if isAdmin > 2}
    <p>Clicked: {counter > 1 ? 'times' : 'time'}</p>
  {@endif}

  <input type="text" @click={rejuice} value={counter} disabled />
</div>
```

### Example 3: Slot Prop Attributes
```html
<div let:name let:age>
  <p>Name: {name} Age: {age}</p>
</div>
```

---

## Grammar Rules
The grammar is defined using Peggy.js and supports the following constructs:
- **HTML Elements**: Open/close tags and self-closing tags.
- **Logic Blocks**: Conditional rendering with `@if` and loops with `@for`.
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
    {@if showButton}
      <button @click={handleClick}>Click Me</button>
    {@endif}
  </div>
`;

const result = parser.parse(template);
console.log(result);
```

---

### Semantq Syntax Philosophy:

Consistency, intuition, flexibility, elegance and efficiency. 

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

