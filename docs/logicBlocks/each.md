
# `@each` Logic Block Documentation

## Introduction

The `@each` block in the Semantq JS Framework is used to iterate over a collection of items and render content for each item. It is a key component in building dynamic templates where content is repeated based on data. This block supports both **simple iteration** and **keyed iteration** and can be nested with other logic blocks like `@if`, `@else`, and `@each` itself for more complex dynamic content.

---

## Basic `@each` Syntax

The `@each` block allows you to loop through an array of items and repeat the content inside the block for each item. It is often used to generate lists, tables, or other repeated elements in a template.

### Syntax

```html
@each(items as item)
  <!-- Rendered for each item in the collection -->
  <li>{item}</li>
@endeach
```

### Explanation:
- `items`: The collection or array you are iterating over.
- `item`: The variable that represents each individual element in the collection.
- The content inside the block (in this case, the `<li>{item}</li>`) will be repeated for each `item` in the `items` array.

---

## Keyed `@each` Syntax

Keyed iteration is useful when each item in the collection has a unique identifier, such as an `id`. Using keys ensures efficient re-rendering when the data changes, as the framework can track which items have been modified, added, or removed.

### Syntax

```html
@each(items as item (item.id))
  <!-- Rendered for each item, using item.id as the unique key -->
  <li>{item.name}</li>
@endeach
```

### Explanation:
- `items`: The collection you are iterating over.
- `item`: The variable representing each individual element within the collection.
- `item.id`: The unique key used for each iteration. This can be any unique identifier, like `item.id`.
- The content inside the block will be rendered for each `item` in the collection, and the `item.id` ensures that each item is uniquely identifiable, which improves rendering performance, especially for large datasets.

---

## Nested `@if` Inside `@each` Block

You can nest `@if` blocks inside an `@each` block to conditionally render content based on the properties of each item. This is useful when you need to check a condition for each item and render different content depending on the result.

### Example

```html
@each(items as item)
  @if(item.active)
    <li>{item.name}</li>
  @else
    <li>Item is inactive</li>
  @endif
@endeach
```

### Explanation:
- The `@each` block loops over the `items` array.
- Inside the loop, the `@if` block checks if the `item.active` property is `true`.
  - If `true`, it renders the item’s name (`<li>{item.name}</li>`).
  - If `false`, it renders a message indicating the item is inactive (`<li>Item is inactive</li>`).
- This demonstrates how you can combine iteration with conditional logic to display different content based on item properties.

---

## Nested `@each` Inside `@if` Block

You can also nest an `@each` block inside an `@if` block to only render the list when a specific condition is met. This is useful when you want to conditionally display an entire list or group of items based on some logic.

### Example

```html
@if(items.length > 0)
  @each(items as item)
    <li>{item.name}</li>
  @endeach
@else
  <p>No items available</p>
@endif
```

### Explanation:
- The `@if` block checks whether the `items` array has any elements (`items.length > 0`).
  - If true, it enters the `@each` block and renders each item in the list (`<li>{item.name}</li>`).
  - If false, it displays a message indicating there are no items available (`<p>No items available</p>`).
- This example shows how you can use a condition to decide whether to iterate over a collection.

---

## Combining `@if`, `@each`, and `@else` Blocks

You can further combine the `@each`, `@if`, and `@else` blocks to create more complex conditional and iterative logic. For example, you can conditionally render an entire list of items based on a specific condition and provide alternate content if the condition fails.

### Example

```html
@if(test)
  @each(items as item)
    @if(item.show)
      <li>{item.name}</li>
    @else
      <li>Item is hidden</li>
    @endif
  @endeach
@else
  <p>No items to display</p>
@endif
```

### Explanation:
- The `@if(test)` block checks if the `test` condition is `true`.
  - If true, it enters the `@each` block and iterates over `items`.
  - Inside the `@each` block, another `@if` checks whether the `item.show` property is `true`. If it is, the item name is displayed; if not, a message stating "Item is hidden" is shown.
- If `test` is `false`, the content inside the `@else` block is rendered, which simply says, "No items to display".

---

## Example with JavaScript Data (Full Picture)

Here's how you can use the `@each` block with JavaScript data, combining the different logic blocks for a fully dynamic template:

```html
@script
  // Example JavaScript data
  const items = [
    { name: 'Item 1', active: true, show: true, id: 1 },
    { name: 'Item 2', active: false, show: true, id: 2 },
    { name: 'Item 3', active: true, show: false, id: 3 }
  ];
@end

@html
@if(items.length > 0)
  @each(items as item)
    @if(item.active)
      <li>{item.name}</li>
    @else
      <li>Item is inactive</li>
    @endif
  @endeach
@else
  <p>No items available</p>
@endif
```

### Explanation:
- The JavaScript array `items` contains objects with properties such as `name`, `active`, and `show`.
- The `@if` block checks if there are any items in the `items` array.
  - If true, the `@each` block iterates over the `items` array.
  - Inside the loop, the `@if` block checks if the `item.active` property is `true`. If it is, the item's name is displayed; otherwise, a message indicating that the item is inactive is shown.
- If the `items` array is empty, the `@else` block renders a message saying, "No items available".

---

## Summary of Key Features:
- **Basic `@each` iteration**: Repeats content for each item in a collection.
- **Keyed `@each`**: Iterates over a collection and uses a unique key (e.g., `item.id`) for each item.
- **Nesting `@if` in `@each`**: Allows conditional rendering for each item within the loop.
- **Nesting `@each` in `@if`**: Conditionally renders the entire loop based on a condition.
- **Combining `@if`, `@else`, and `@each`**: Enables complex conditional logic with iteration.

---

## Conclusion

The `@each` block is a powerful tool in the Semantq JS Framework, enabling flexible iteration over collections and dynamic rendering of content. By combining `@each` with other logic blocks like `@if` and `@else`, you can create dynamic, data-driven templates that adapt based on conditions. 

**License**

Semantq is open-source software licensed under the **MIT License**.

## Semantq Main Documentation: [Semantq](https://github.com/Gugulethu-Nyoni/semantq).
