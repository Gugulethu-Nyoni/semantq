
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

**Note:** Function calls follow the same precedence rules as JavaScript, evaluating arguments before the function call itself.


Here's the documentation addition for bitwise expressions in GitHub Markdown format, focusing just on the new capability while maintaining your existing style:


## Bitwise Expressions

Bitwise operations in condition tests:

### Bitwise AND
```semantq
@if(flags & ADMIN_FLAG)
  <!-- Content when flag is set -->
@endif
```

## Bitwise Expressions

Semantq supports all JavaScript bitwise operations in condition tests:

### Supported Bitwise Operators

| Operator | Name                      | Example                      | Description |
|----------|---------------------------|------------------------------|-------------|
| `&`      | AND                       | `flags & ADMIN`              | Sets bits that exist in both values |
| `\|`     | OR                        | `permissions \| READ`        | Sets bits that exist in either value |
| `^`      | XOR                       | `mask ^ TOGGLE`              | Toggles bits that differ between values |
| `<<`     | Left Shift                | `value << 2`                 | Shifts bits left by specified number |
| `>>`     | Sign-Propagating Right Shift | `value >> 1`              | Preserves sign when shifting right |
| `>>>`    | Zero-Fill Right Shift     | `color >>> 8`                | Shifts right filling with zeros |
| `~`      | NOT (Unary)               | `~visibility`                | Inverts all bits |

### Usage Examples

```semantq
@if(permissions & (READ | WRITE))
  <!-- Content when either read or write permission exists -->
@endif

@if((flags << 2) > MAX_VALUE)
  <!-- Content after bit shifting -->
@endif

@if(~visibility & HIDDEN)
  <!-- Content when NOT hidden -->
@endif
```

### Operator Precedence
Bitwise operations have precedence between equality checks and logical AND:

1. Equality (`==`, `!=`)
2. **Bitwise (`&`, `|`, `^`)**
3. Logical AND (`&&`)
4. Logical OR (`||`)

### Examples
```semantq
@if((user.roles & ADMIN) && !isSuspended)
  <!-- Admin-specific content -->
@endif

@if(config.flags & (FEATURE_A | FEATURE_B))
  <!-- Feature-flagged content -->
@endif
```

### Notes
- Bitwise operations work with numeric values
- Parentheses can be used to override precedence
- Works with all existing expression types



# If Logic Block Consequent Expressions

Consequent expressions within `@if` blocks support these expression types:

## Basic Literals
```semantq
@if(showNumbers)
  {42}               <!-- Number -->
  {3.14}             <!-- Float -->
@endif

@if(showGreeting)
  {"hello"}          <!-- Double-quoted string -->
  {'world'}          <!-- Single-quoted string -->
@endif

@if(showBools)
  {true}             <!-- Boolean true -->
  {false}            <!-- Boolean false -->
@endif
```

## Variables & Properties
```semantq
@if(hasItems)
  {count}            <!-- Simple variable -->
@endif

@if(userExists)
  {user}             <!-- Object reference -->
  {user.name}        <!-- Dot notation -->
  {user.profile.id}  <!-- Nested properties -->
@endif
```

## Arithmetic Operations
```semantq
@if(shouldCalculate)
  {a + b}            <!-- Addition -->
  {width * 0.5}      <!-- Multiplication -->
  {10 % 3}           <!-- Modulo -->
  {(a + b) * c}      <!-- Grouped operations -->
@endif
```

## Comparisons
```semantq
@if(score > 60)      <!-- Greater than -->
  <passBadge/>
@endif

@if(temp <= 0)       <!-- Less than or equal -->
  <FreezeWarning/>
@endif
```

## Logical Operators
```semantq
@if(!isLoading)      <!-- NOT operator -->
  {content}
@endif

@if(isAdmin && isActive)  <!-- AND -->
  <adminPanel/>
@endif
```

## Function Calls
```semantq
@if(shouldRender)
  {getUserName()}              <!-- No args -->
  {formatDate(timestamp)}      <!-- With args -->
@endif
```

## Complete Example
```semantq
@if(user.isActive && items.length > 0)
  <h2>{user.name}'s Items</h2>
  {showCount && <p>Total: {items.length}</p>}
  {items.map(item => 
    <item-card name={item.name} price={item.price}/>
  )}
@endif
```

### Notes:
1. All expressions must be wrapped in `{ }`
2. Works alongside HTML content
3. Maintains JavaScript expression semantics
4. Supports all standard operator precedence


**License**

Semantq is open-source software licensed under the **MIT License**.

## Semantq Main Documentation: [Semantq](https://github.com/Gugulethu-Nyoni/semantq).
