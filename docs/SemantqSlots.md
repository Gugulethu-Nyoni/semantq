
# Component Composition: Default Slots

In Semantq, **slots** allow you to pass content from a parent component or page to a child component. This feature is highly flexible and supports **nested slots**, **fallback content**, and more.

---

## Features

1. **Pass Content from Parent to Child**:
   - A parent component or page can pass content to a child component using slots.

2. **Fallback Content**:
   - If no content is passed from the parent, the child component can provide default (fallback) content.

3. **Nested Slots**:
   - Slots can be nested within other components, allowing for complex and reusable layouts.

---

## Syntax

### Parent Component (e.g., `+page.smq`)

```javascript
import Card from '$component/Card';
```

### Usage in HTML

```html
<Card>
  Content to be passed to the slot placeholder in the actual Card.smq markup.
</Card>
```

Or, if no content is passed:

```html
<Card />
```

---

## Fallback Content in the Child Component

If no content is passed from the parent, the child component can provide **fallback content** inside the `<slot>` tag.

### Child Component (e.g., `Card.smq`)

```html
<div class="card-container">
  <slot>
    Fallback content from the child (component).
  </slot>
  <h1>This is the card container</h1>
</div>
```

---

## Nested Slots

Slots can be nested within other components, allowing you to build complex layouts.

### Example: Nested Slots

#### Parent Component (e.g., `+page.smq`)

```html
<Card>
  <Header>
    <Button>Click Me</Button>
  </Header>
</Card>
```

## Notes

For **nested slots** to work correctly, you need to ensure that your `import` statements in JavaScript are in the **correct descending order**. In the example above, the order of imports must be:

```javascript
import Card from '$component/Card';
import Header from '$component/Header';
import Button from '$component/Button';
```

### Why Order Matters
The order of imports is crucial for the proper resolution of nested components. If the imports are not in the correct order, the components may not render as expected, leading to broken layouts or missing content.

---

### Best Practices for Import Order
1. **Parent First**:
   - Always import the **parent component** (e.g., `Card`) before its **child components** (e.g., `Header`, `Button`).

2. **Logical Hierarchy**:
   - Follow the natural hierarchy of your components. For example:
     - Import `Card` first because it is the outermost container.
     - Import `Header` next because it is nested inside `Card`.
     - Import `Button` last because it is nested inside `Header`.

3. **Consistency**:
   - Maintain a consistent import order across your project to avoid confusion and ensure predictable behavior.

---

### Example: Correct Import Order

```javascript
// Correct order: Parent → Child → Grandchild
import Card from '$component/Card.smq';
import Header from '$component/Header.smq';
import Button from '$component/Button.smq';
```

---

### What Happens if the Order is Wrong?

If the import order is incorrect, the nested components may not resolve properly. For example:

```javascript
// Incorrect order: Child → Parent → Grandchild
import Header from '$component/Header.smq';
import Card from '$component/Card.smq';
import Button from '$component/Button.smq';
```

In this case, the `Header` component may not render correctly inside the `Card` component, leading to broken layouts or missing content.

By following these guidelines, you can ensure that your **nested slots** work as expected and your components render correctly.  

#### Child Component (e.g., `Card.smq`)

```html
<div class="card-container">
  <slot>
    Fallback content from the child (component).
  </slot>
  <h1>This is the card container</h1>
</div>
```

#### Child Component (e.g., `Header.smq`)

```html
<header class="header">
  <slot>
    Fallback content for the header.
  </slot>
</header>
```

#### Child Component (e.g., `Button.smq`)

```html
<button class="button">
  <slot>
    Fallback content for the button.
  </slot>
</button>
```

---

## Resolved Final Parent Markup

When the parent component (`+page.smq`) is rendered, the resolved markup will look like this:

```html
<div class="card-container">
  <header class="header">
    <button class="button">
      Click Me
    </button>
  </header>
  <h1>This is the card container</h1>
</div>
```

---

## Example: Parent and Child Components

### Parent Component (`+page.smq`)

```javascript
import Card from '$component/Card.smq';
import Header from '$component/Header.smq';
import Button from '$component/Button.smq';
```

```html
<Card>
  <Header>
    <Button>Click Me</Button>
  </Header>
</Card>
```

### Child Component (`Card.smq`)

```html
<div class="card-container">
  <slot>
    Fallback content from the child (component).
  </slot>
  <h1>This is the card container</h1>
</div>
```

### Child Component (`Header.smq`)

```html
<header class="header">
  <slot>
    Fallback content for the header.
  </slot>
</header>
```

### Child Component (`Button.smq`)

```html
<button class="button">
  <slot>
    Fallback content for the button.
  </slot>
</button>
```

---

## Key Points

1. **Slots are Flexible**:
   - You can pass any HTML content, including other components, into a slot.

2. **Fallback Content**:
   - Always provide fallback content in the child component to handle cases where no content is passed from the parent.

3. **Nested Slots**:
   - Use nested slots to create reusable and composable components.

4. **Avoid Mixing Syntax**:
   - Stick to either Semantq syntax or standard HTML tags for consistency.

---

## Best Practices

1. **Use Descriptive Slot Names**:
   - If your component has multiple slots, give them meaningful names (e.g., `<slot name="header">`).

2. **Keep Components Modular**:
   - Break down complex layouts into smaller, reusable components.

3. **Document Slot Usage**:
   - Add comments or documentation to explain how slots should be used in your components.

---

## Conclusion

Slots in Semantq provide a powerful way to compose components and build flexible, reusable layouts. By leveraging **default slots**, **fallback content**, and **nested slots**, you can create highly modular and maintainable applications.

For more details, check out the [Semantq documentation](https://github.com/Gugulethu-Nyoni/semantq) or explore the.

