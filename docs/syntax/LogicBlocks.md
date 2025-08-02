### Semantq Logic Blocks

Logic blocks provide a declarative way to add control flow directly in your markup. Using @if, @else, @each, and other directives, you can conditionally render elements or iterate over arrays—all cleanly scoped and readable within the HTML section.

* `@if / @else / @endif`
* `@each / @endeach`
* **Nested logic blocks** with a real-world example (`active` check per user)

The structure remains clean, incremental, and technically accurate.

## Logic Blocks in Semantq

Semantq's logic blocks allow you to declaratively control what gets rendered based on reactive state or dynamic expressions. These blocks include **conditionals**, **iteration**, and **nesting**, all while maintaining reactivity.

### Logic Block Syntax Overview

| Block Type  | Syntax Pattern                         | Description                                |
| ----------- | -------------------------------------- | ------------------------------------------ |
| Conditional | `@if (condition)` / `@else` / `@endif` | Show/hide content based on logic           |
| Iteration   | `@each (array as item)` / `@endeach`   | Render markup for each item in a list      |
| Nesting     | Logic blocks inside other blocks       | Enable granular conditional logic per item |

## Conditional Blocks: `@if`, `@else`, `@endif`

These are used to conditionally show content based on the value of a reactive variable or expression.

### Basic Example

```html
@if(isAdmin)
  <h1>Welcome Admin</h1>
@else
  <h1>Welcome Guest</h1>
@endif
```

* Shows the first block if `isAdmin` is truthy, else the second.
* Conditions can use `.value`, but top-level properties are also auto-wrapped for readability.

### With Toggleable State

```html
<button @click={toggle(true)}>Login</button>
<button @click={toggle(false)}>Logout</button>

@if(isAdmin)
  <p>You're logged in as admin.</p>
@endif
```

## Iteration Blocks: `@each`, `@endeach`

Used to repeat elements for each item in an array.

### Basic List Example

```html
@each(people as person)
  <p>{person.name}</p>
@endeach
```

* Reactively updates if `people.value` changes (items added/removed).


## Nested Logic: Conditionals inside Iteration

Semantq allows nesting logic blocks to support more complex UIs.

### Example: Active Members Filter

```js
@script
const items = $state([
  { id: 1, name: 'John', active: false },
  { id: 2, name: 'Musa', active: true },
  { id: 3, name: 'Jane', active: false }
]);
@end
```

```html
<h1> Nested If and each Blocks</h1>

@if(items.length > 0)
  @each(items as item)
    @if(item.active)
      <li>{item.name}</li>
    @else
      <li>Member is inactive</li>
    @endif
  @endeach
@else
  <p>No items available</p>
@endif
```

### Output (If rendered in browser):

* Musa appears with their name.
* John and Jane show as "Member is inactive."
* If `items` becomes empty, the fallback `<p>` is rendered.

### Behavior Notes

* `@if` and `@each` must always be closed with `@endif` and `@endeach`.
* Nesting works at any depth but should be kept readable.
* Loops and conditionals **auto-update** when the reactive state changes.


## Summary Table: Logic Blocks

| Block Type   | Syntax Example             | Purpose                             |
| ------------ | -------------------------- | ----------------------------------- |
| `@if`        | `@if (isAdmin)`            | Render block if condition is true   |
| `@else`      | `@else`                    | Alternative block if `@if` is false |
| `@endif`     | `@endif`                   | Marks end of a conditional block    |
| `@each`      | `@each (items as item)`    | Iterates through a list             |
| `@endeach`   | `@endeach`                 | Marks end of iteration block        |
| Nested Logic | `@if` inside `@each`, etc. | Granular control over each item     |


### Full Working Logic Example

```js
@script
const items = $state([
  { id: 1, name: 'John', active: false },
  { id: 2, name: 'Musa', active: true },
  { id: 3, name: 'Jane', active: false }
]);
@end
```

```html
<h1> Dashboard </h1>

@if(items.length > 0)
  @each(items as item)
    @if(item.active)
      <li>{item.name}</li>
    @else
      <li>Member is inactive</li>
    @endif
  @endeach
@else
  <p>No items available</p>
@endif
```
