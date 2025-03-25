
# Semantq If Logic Blocks

Semantq enables intuitive JavaScript syntax right in your HTML, combining the power of programmatic logic with the simplicity of declarative templates. This custom syntax:

- **Reduces boilerplate** - Write conditions directly where they matter
- **Maintains readability** - Clean, HTML-friendly syntax
- **Saves development time** - No context switching between template and logic files
- **Gradually adoptable** - Works alongside standard JavaScript

## Basic Example

```semantq
@if(user.isPremium)
  <div class="premium-banner">
    Welcome back, premium member!
  </div>
@endif

Conditional logic with `@if` blocks in Semantq currently supports the following test expressions:

## Basic Syntax

```semantq
@if(condition)
  Content rendered when condition is truthy
@endif
```

## Supported Test Expressions

### 1. Boolean Literals
```semantq
@if(true)
  This will always render
@endif

@if(false)
  This will never render
@endif
```

### 2. Variable Checks
```semantq
@if(isAdmin)
  Admin-only content
@endif
```

### 3. Boolean Coercion Pattern

Semantq supports JavaScript-style boolean coercion using double negation. This pattern converts truthy/falsy values to strict booleans:

```semantq
@if(!!isHidden)
  Inactive notice
@endif
```

### 4. Numeric Comparisons
```semantq
@if(score > 90)
  High score content
@endif

@if(items <= 5)
  Low inventory warning
@endif
```

### 5. String Comparisons
```semantq
@if(role === 'admin')
  Admin dashboard
@endif

@if(status != "active")
  Inactive notice
@endif
```

### 6. Logical Operators
```semantq
@if(isLoggedIn && !isSuspended)
  User content
@endif

@if(isOwner || isModerator)
  Privileged controls
@endif
```

### 7. Parenthetical Grouping
```semantq
@if((a > b) && (c !== d))
  Complex condition content
@endif
```

### 8. Arithmetic Expressions
```semantq
@if((count * 2) > threshold)
  Double count exceeds threshold
@endif
```

## Currently Supported Operators

| Type          | Operators               |
|---------------|-------------------------|
| Logical       | `&&`, `||`, `!`         |
| Comparison    | `==`, `!=`, `===`, `!==`|
| Relational    | `<`, `>`, `<=`, `>=`    |
| Arithmetic    | `+`, `-`, `*`, `/`, `%` |

## Important Notes

1. All operators require proper spacing (e.g., `a > b` not `a>b`)
2. String literals must be quoted with `'` or `"`
3. The content block must appear on a new line after the condition
4. Currently supported value types:
   - Booleans (`true`/`false`)
   - Numbers (`42`, `3.14`)
   - Strings (`'text'`, `"text"`)
   - Variables/identifiers

Example combining multiple features:
```semantq
@if((user.score > 100) && (user.status === 'active'))
  Premium active user content
@endif
```
