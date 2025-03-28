
# Semantq Parser Syntax Capabilities

## Table of Contents
1. [Basic HTML Elements](#basic-html-elements)
2. [Expressions in HTML](#expressions-in-html)
3. [Logic Blocks](#logic-blocks)
4. [Self-Closing Components](#self-closing-components)
5. [Mixed Content](#mixed-content)
6. [Nested Structures](#nested-structures)

## Basic HTML Elements

Standard HTML tags with attributes and content:

```html
<div class="container">
  <p>Hello World</p>
  <img src="logo.png" alt="Company Logo" />
</div>

<input type="checkbox" checked />
```

## Expressions in HTML

### Text Interpolation
```html
<p>Counter: {count}</p>
<p>{count} items ({percentage}% complete)</p>
<p>{Math.round(percentage * 100)}% completed</p>
```

### Attribute Interpolation
```html
<img src={imageUrl} alt={caption} />
<Component prop={value} />
<input type="text" value={searchText} />
```

### Event Handlers
```html
<button @click={handleClick}>Click me</button>
<input @input={handleInput} />
```

## Logic Blocks

### Basic Conditionals
```html
@if(user.loggedIn)
  <p>Welcome back, {user.name}!</p>
@endif

@if(false)
@endif
```

### Complex Conditions
```html
@if(items.length > 0)
  {counter}
@endif

@if(page === 'dashboard')
  <Dashboard />
@endif
```

## Self-Closing Components

```html
<Component />
<Header />
<Footer />
@if(showComponent)
  <Component />
@endif
```

## Mixed Content

### HTML with Expressions
```html
<div>
  <span>{user.firstName} {user.lastName}</span>
  <img src={user.avatarUrl} />
</div>
```

### Logic Blocks with Mixed Content
```html
@if(showAlert)
  <div class="alert">
    <AlertIcon />
    <span>{alertMessage}</span>
    <button @click={dismissAlert}>×</button>
  </div>
@endif

@if(items.length > 0)
  {counter} <p @click={incrementer}>Hi there</p>
@endif
```

## Nested Structures

### Nested Logic Blocks
```html
@if(page === 'dashboard')
  <Dashboard>
    @if(hasNewNotifications)
      <NotificationBadge count={notificationCount} />
    @endif
  </Dashboard>
@endif
```

### Complex Document Structure
```html
<article>
  <h1>{post.title}</h1>
  
  @if(post.featuredImage)
    <figure>
      <img src={post.featuredImage.url} 
           alt={post.featuredImage.alt} />
      @if(post.featuredImage.caption)
        <figcaption>{post.featuredImage.caption}</figcaption>
      @endif
    </figure>
  @endif

  <div class="content">
    {post.content}
  </div>
</article>
```

### Adjacent Elements
```html
<Header />
@if(content)
  <MainContent />                
@endif
<Footer />

<div>
  <Header />
  @if(user)
    <Profile />
  @endif
</div>
```

This documentation covers all currently supported syntax patterns in a hierarchical organization, from basic elements to complex nested structures.

More blocks to be added. 

### Semantq Syntax Philosophy:

Consistency, intuition, flexibility, elegance and efficiency. 

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


For more details, check out the [Semantq documentation](https://github.com/Gugulethu-Nyoni/semantq)
