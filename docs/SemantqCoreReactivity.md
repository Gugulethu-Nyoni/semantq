# Semantq State (Core) Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Core Concepts](#core-concepts)
3. [Binding Types](#binding-types)
   - [Element Binding](#element-binding)
   - [Text Binding](#text-binding)
   - [Attribute Binding](#attribute-binding)
   - [Class Binding](#class-binding)
4. [Reactive Primitives](#reactive-primitives)
   - [$state](#state)
   - [$derived](#derived)
   - [$effect](#effect)
5. [Usage Examples](#usage-examples)
6. [Best Practices](#best-practices)

## Introduction

Semantq State Core provides reactive state management with declarative bindings for the Semantq framework. It enables automatic DOM updates when state changes using a lightweight reactivity system.

## Core Concepts

- **Reactivity**: Automatic updates when state changes
- **Declarative Bindings**: Connect state to DOM elements
- **Lightweight**: Minimal overhead with efficient updates
- **Framework Integration**: Designed for Semantq's templating system

## Binding Types

### Element Binding

Binds form elements to state with two-way data binding.

```html
<input type="text" @bind={username} />
<select @bind={country}></select>
<input type="checkbox" @bind={isActive} />
```

**Supported Elements**:
- Text inputs
- Number inputs
- Checkboxes
- Radio buttons
- Select (single/multiple)
- Range inputs

### Text Binding

Binds state to text content.

```html
<p>Hello, {username}!</p>
<span>Count: {counter}</span>
```

### Attribute Binding

Binds state to element attributes.

```html
<img src={imageUrl} alt={imageAlt} />
<a href={profileLink} target="_blank">Profile</a>
```

### Class Binding

Conditionally applies CSS classes.

```html
<div @class:active={isActive}>Content</div>
<button @class:disabled={!isValid}>Submit</button>
```

## Reactive Primitives

### $state

Creates reactive state:

```js
const count = $state(0)
```

### $derived

Creates computed values:

```js
const double = $derived(() => count.value * 2)
```

### $effect

Runs side effects when dependencies change:

```js
$effect(() => {
  console.log('Count changed:', count.value)
})
```

## Usage Examples

### Form Binding

```html
<script>
  const form = {
    name: $state(''),
    email: $state(''),
    subscribe: $state(true)
  }
</script>

<form>
  <input type="text" @bind={form.name} placeholder="Name" />
  <input type="email" @bind={form.email} placeholder="Email" />
  <label>
    <input type="checkbox" @bind={form.subscribe} />
    Subscribe to newsletter
  </label>
</form>
```

### Conditional Rendering

```html
@if(user.loggedIn)
  <p>Welcome back, {user.name}!</p>
  <button @click={logout}>Logout</button>
@endif
```

### List Rendering

```html
<ul>
  @foreach(todos as todo)
    <li @class:completed={todo.done}>
      <input type="checkbox" @bind={todo.done} />
      {todo.text}
    </li>
  @endforeach
</ul>
```

## Best Practices

1. **Keep State Local**: Prefer local component state when possible
2. **Use Derived Values**: Compute values from state rather than storing duplicates
3. **Batch Updates**: Group related state changes
4. **Clean Up Effects**: Return cleanup functions from effects
5. **Use Const for State**: Always declare state with `const`

## Framework Integration

Semantq's parser transforms these declarative bindings into optimized JavaScript that uses the State Core reactivity system:

```html
<!-- Declarative -->
<p>{count}</p>
<button @click={increment}>+</button>

<!-- Transformed to -->
<p :text="count"></p>
<button @click="increment">+</button>
```

The framework handles:
- Dependency tracking
- Change detection
- Efficient DOM updates
- Event binding

---

## **License**

Semantq is open-source software licensed under the **MIT License**.

## Semantq Main Documentation: [Semantq](https://github.com/Gugulethu-Nyoni/semantq).
