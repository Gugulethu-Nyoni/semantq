
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


Here's the Markdown documentation for the new function call support:

```markdown
## Function Call Expressions

Semantq now supports JavaScript-style function calls in condition tests, including nested calls and method invocations.

### Basic Syntax
```semantq
@if(functionName())
@if(functionName(arg1, arg2))
@if(object.method())
```

### Supported Patterns

#### 1. Simple Function Calls
```semantq
@if(isActive()) 
  <!-- Content -->
@endif

@if(checkPermission())
  <!-- Content -->
@endif
```

#### 2. With Arguments
```semantq
@if(hasAccess(user, 'admin'))
  <!-- Content -->
@endif

@if(between(value, 0, 100))
  <!-- Content -->
@endif
```

#### 3. Method Calls
```semantq
@if(user.isAdmin())
  <!-- Content -->
@endif

@if(profile.hasPermission('edit'))
  <!-- Content -->
@endif
```

#### 4. Nested Calls
```semantq
@if(getUser().isVerified())
  <!-- Content -->
@endif

@if(validate(input, getRules()))
  <!-- Content -->
@endif
```

#### 5. Complex Arguments
```semantq
@if(verify(user, { strict: true }))
  <!-- Content -->
@endif

@if(check(status, ['active', 'pending']))
  <!-- Content -->
@endif
```

### Rules and Limitations
1. **Whitespace**: Flexible around parentheses and commas
   - Valid: `@if(func(a,b))` or `@if(func( a, b ))`
2. **Arguments**: Can be any valid expression
   - Includes literals, variables, other function calls
3. **Method Chains**: Currently supports single-level calls
   - `obj.method()` works
   - `obj.method().another()` not yet supported

### Edge Cases Handled
```semantq
@if(noArgFunc())  <!-- No arguments -->
@if(trailingComma(a,))  <!-- Trailing comma -->
@if(emptyArgs())  <!-- Empty parentheses -->
```

> Note: Function calls follow the same precedence rules as JavaScript, evaluating arguments before the function call itself.
```


