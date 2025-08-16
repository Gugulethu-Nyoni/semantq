# Semantq

[![NPM](https://img.shields.io/npm/v/semantq.svg)](https://www.npmjs.com/package/semantq)
[![NPM Downloads](https://img.shields.io/npm/dt/semantq.svg)](https://www.npmjs.com/package/semantq)
[![GitHub Stars](https://img.shields.io/github/stars/Gugulethu-Nyoni/semantq.svg)](https://github.com/Gugulethu-Nyoni/semantq/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/Gugulethu-Nyoni/semantq.svg)](https://github.com/Gugulethu-Nyoni/semantq/issues)

<a href="https://github.com/Gugulethu-Nyoni/semantq/blob/main/LICENSE">
  <img alt="semantq uses the MIT license" src="https://img.shields.io/github/license/Gugulethu-Nyoni/semantq" style="max-width: 100%;">
</a>

[![GitHub Workflow](https://img.shields.io/github/workflow/status/Gugulethu-Nyoni/semantq/CI/main.svg)](https://github.com/Gugulethu-Nyoni/semantq/actions)

## Introduction

**Semantq** is a lightweight JavaScript framework designed to simplify modern web development. Its declarative syntax, built-in state management, reactive logic blocks, and seamless full-stack integration make it ideal for both frontend and full-stack projects.


# Semantq Developer Guide

# Table of Contents

## Semantq Developer Guide
1. [Introduction](#introduction)
2. [Installation & Setup](#installation--setup)
3. [Project Configuration](#project-configuration-semantqconfigjs)
4. [File-Based Routing](#file-based-routing)
   - [Manual Route Creation](#manual-route-creation)
   - [CLI-Based Routing](#cli-based-routing)
5. [Component Composition](#component-composition)
   - [Creating Reusable Components](#creating-reusable-components)
   - [Importing Components](#importing-components)
6. [NPM Integration](#npm-integration)
7. [State Management](#state-management)
8. [Hot Module Replacement with Vite](#hot-module-replacement-with-vite)
9. [Semantq Ecosystem](#semantq-ecosystem)
10. [CLI Commands & Project Scaffolding](#cli-commands--project-scaffolding)
11. [Declarative Syntax](#declarative-syntax)
    - [Interpolations](#interpolations)
    - [Event Handlers](#event-handlers)
    - [Logic Blocks](#logic-blocks)
12. [Automated Navigation Menu Generation](#automated-navigation-menu-generation)
    - [Configuration Options Explained](#configuration-options-explained)
    - [Example Output](#example-output)
    - [Hierarchical Menu](#hierarchial-menu-hierarchical-true)
13. [Full-Stack Integration with SemantqQL](#full-stack-integration-with-semantqql)
    - [Abstraction with smQL](#abstraction-with-smql)
    - [Side-by-Side Comparison](#side-by-side-comparison)
14. [Feature/Module Specific Docs](#featuremodule-specific-docs)
15. [License](#license)

### Key goals

* Declarative HTML with reactive features
* Reusable components and layouts
* Simplified routing and navigation
* Built-in state and data management
* Full-stack plug-and-play with SemantqQL


## Installation & Setup

Install Semantq via npm:

```bash
npm install semantq
```
OR install globally to use it anywhere in your system

```bash
npm install -g semantq
```

Run your development server:

```bash
npm run dev
```
Now you can view your app on the browser on the given address.

* Works out-of-the-box with Vite for hot module replacement (HMR)
* Supports full customisation via `semantq.config.js`


## Project Configuration (`semantq.config.js`)

Customize project-wide settings:

```js
module.exports = {
  targetHost: process.env.TARGET_HOST || 'http://localhost:3000',
  pageTitle: 'My Awesome Website',
  metaDescription: 'My Awesome Website',
  metaKeywords: 'Awesome this, awesome that',

  sitemap: true,

  semantqNav: {
    enable: true,
    containerClass: 'semantq-nav-container',
    ulClass: 'semantq-nav-list',
    liClass: 'semantq-nav-item',
    priorityRoutes: ['/home'],
    excludeRoutes: ['/404'],
    includeRoutes: {
      '/sitemap': '/sitemap',
      '/home': '/'
    },
    hierarchical: true, 
    parentMenuDisplay: 'inline', // stacked or inline
    customLinkTexts: {
      badmin: 'User Dashboard',

    },
  },
};
```

Other configuration options include:

* Custom page titles, meta descriptions, and keywords
* Sitemap and navigation menu generation
* Hierarchical routing and route priorities



## File-Based Routing

### Manual Route Creation

Create directories under `src/routes`:

```
src/routes/about
```
Then inside the about directory create the file: `@page.smq`.

You can then component your component following this component structure:

```html
@script
// your js here
@end

@style
/* css here */
@end

@html 

all blocks are optional 
```

**Note** the @html tag is optional just for your visual clarity - also note that the tag doesn't not have a closing tag (`@end`). If you include a closing tag `@end` for the `@html` block the compiler will throw an error.

The HTML standard also works:

```html
<script>
  // your js here
</script>

<style>
  /* css here */
<style>

<h1> Hello World </h1> 

```

All blocks are optional so this will work:

```html
<h1> Hello World </h1>
```


### CLI-Based Routing

Once you’ve mastered Semantq manual route creation, you can take advantage of the Command Line Interface (CLI). This powerful tool automatically generates directories, installs the base files, and provides skeletal tags to help you get started quickly—saving you valuable time in production.


```bash
semantq make:route about -l
```

The command above will create the route: `src/routes/about` and include all necessary files e.g. `src/routes/about/@page.smq` and `src/routes/about/@layout.smq`

Options:

| Option            | Description                                       |
| ----------------- | ------------------------------------------------- |
| `-l` / `--layout` | Create layout page for `<head>` scripts and links |
| `-a` / `--auth`   | Restrict page to signed-in users                  |
| `--crud` / `-c`   | Generate CRUD abstractions                        |
| `--ac`            | Combine auth + CRUD                               |




## Component Composition

### Creating Reusable Components

* Default and named slots supported

## Default Slots

```html
<!-- src/components/global/Animation.smq -->

<div class="animation">
  <slot> Fall back content from the imported (child) component </slot> <!-- default slot -->
</div>
```

### Importing Components

```smq
@script
import Animation from '$global/Animation';
@end

@html
<Animation /> 
// this will resolve the mark up from the imported component (without the raw slot element )
```

Final Resolved default slot mark up

```smq
<div class="animation">
  Fall back content from the imported (child) component
</div>
```

**Note** how content was passed from the child component because the parent component (page) did not provide any content to be inserted into the default slot.


If you want to pass content from the parent component (page) see the example below:

```smq
@script
import Animation from '$global/Animation';
@end

@html
<Animation> 
  <h1> My animated heading </h1> 
</Animation> 
```

Final resolved mark up:

```html
<div class="animation">
  <h1> My animated heading </h1> 
</div>
```

**Note** The Javascript and CSS in the respective tags (blocks) in your imported component will also be imorted and merged with the main page js and css. 

* Shorthand automatically resolves to `src/components/global/Animation.smq`
* Useful for reusable components such as headers, footers, nav, modals, and more

## Named Slots

Here’s a refined **Markdown section** for your Semantq README that demonstrates a reusable child component with full markup, clean parent usage via named slots, and a clear warning about keeping the child self-contained. I’ve chosen a **small “Documentation Footnote” card** use case that fits your docs context.


## Named Slots for Reusable Components

Semantq supports **named slots** that allow you to keep your main page cleaner while making child components reusable.


**⚠️ Warning:** The child component should generally have **self-contained markup**. Prefer using elements like `<div>` or `<section>` in the child component to avoid situations where parent-provided content (e.g., a `<div>`) ends up wrapped in invalid HTML such as a `<p>`. Modern browsers may tolerate this, but it can lead to unpredictable rendering.


### Child Component (`FootnoteCard.smq`)

```mark
@script
 //some js for the component
@end

@style
  /* some css for the component */
@end

@html
<div class="footnote-card">
  <div class="footnote-header">
    <slot name="header" />
  </div>

  <div class="footnote-body">
    <slot name="body" />
  </div>

  <div class="footnote-footer">
    <slot name="footer" />
  </div>
</div>
```

* The child defines **named slots**: `header`, `body`, and `footer`.
* It wraps content in full `<div>` structure to ensure valid HTML regardless of what the parent passes.


### Parent Usage (`DocsPage.smq`)

```mark
<FootnoteCard>
  <div slot="header">Note</div>

  <div slot="body">
    This section explains the key usage of Semantq slots.
  </div>

  <div slot="footer">
    <a href="#more-info">Learn more</a>
  </div>
</FootnoteCard>
```

* The parent only provides **minimal, surgical content** for each slot.
* The child handles all layout, styling, and structure, keeping the page markup clean and maintainable.


### Final Rendered Mark

```mark
<div class="footnote-card">
  <div class="footnote-header">
    <div>Note</div>
  </div>

  <div class="footnote-body">
    <div>This section explains the key usage of Semantq slots.</div>
  </div>

  <div class="footnote-footer">
    <div><a href="#more-info">Learn more</a></div>
  </div>
</div>
```

**Benefits:**

* Reusable components without worrying about parent markup conflicts.
* Named slots allow selective content injection.
* Keeps main documentation page markup neat and readable.


## NPM Integration

* Any npm package can be used in pages or components
* Browser-targeted packages must be imported appropriately

```js
import _ from 'lodash';
```

* Works seamlessly with Semantq’s Vite powered bundler

## State Management

Native reactive state library:

```js
@script
const count = $state(0);
const doubled = $derived(() => count.value * 2);

$effect(() => {
  console.log(`Current count: ${count.value}`);
});
@end
```

* `$state` → reactive variable
* `$derived` → computed value
* `$effect` → auto-run reactive effect


## Hot Module Replacement with Vite

* Automatic reload of HTML and CSS on changes
* No need to refresh the browser
* This applies only to the entry page: `project_root/index.html` on the Single Page Application (SPA) contexts. 


## Semantq Ecosystem

| Module          | Description                                               |
| --------------- | --------------------------------------------------------- |
| [Formique](https://github.com/Gugulethu-Nyoni/formique)       | No-code, low-code Schema Definition Language form builder with API integration        |
| [AnyGrid](https://github.com/Gugulethu-Nyoni/anygrid)       | Searchable, paginated, sortable data visualization with on-screen edit/delete API support |
| [@semantq/state](https://www.npmjs.com/package/@semantq/state)  | Framework-agnostic state management library               |
| [@semantqQL](https://github.com/Gugulethu-Nyoni/semantqQL)    | MCSR Node.js server (model, controller, service, route)   |
| [@semantq/auth](https://github.com/Gugulethu-Nyoni/semantq_auth)   | Full-stack auth server with database and email support    |
| [@semantq/ql](https://github.com/Gugulethu-Nyoni/smQL)  | JS fetch abstraction and CRUD functions                   |
| [SemantqCommerce](#) | Plug-and-play e-commerce solution (WIP)                   |
| [SemantqProse](#)    | SSR blogging & CMS with email marketing (WIP)             |
| [@semantq/iot](#)    | IoT module for embedded systems (WIP)                     |
                    |

## CLI Commands & Project Scaffolding

| Command                                      | Description                                                     |
| -------------------------------------------- | --------------------------------------------------------------- |
| `semantq create myapp`                       | Scaffold new project                                            |
| `semantq make:route dashboard --auth --crud` | Create authenticated CRUD route                                 |
| `semantq install:tailwind`                   | Setup Tailwind CSS                                              |
| `semantq update`                             | Update core dev modules (with confirmation prompts)             |
| `semantq create my_crud_app -fs`             | Full-stack scaffold (frontend + SemantqQL + auth)               |
| `semantq make:resource Product`              | Generate full MCSR resource (model, controller, service, route) |

Example CRUD fetch:

```bash
curl -X GET http://localhost:3003/product/products
```


## Declarative Syntax

### Interpolations

```html
<h1> Hello {name} </h1>
<p>Clicked: {count} {count > 0 ? 'times' : 'time'}</p>
```

### Event Handlers

```html
<button @click={increment}>Click Me</button>
```

### Logic Blocks

```html
<h1>Dashboard</h1>

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

* Supported so far: `@if / @else / @endif` and `@each / @endeach`
* More logic blocks coming


## Automated Navigation Menu Generation

Semantq can automatically generate a navigation menu based on your defined routes. This reduces boilerplate and ensures your navigation stays consistent as your app grows. Configuration is done inside your `semantq.config.js`:

```js
semantqNav: {
  enable: true,
  containerClass: 'semantq-nav-container',
  ulClass: 'semantq-nav-list',
  liClass: 'semantq-nav-item',
  priorityRoutes: ['/home','/about'],
  excludeRoutes: ['/404','/auth','/'],
  includeRoutes: {
    '/services': '/about/frontend',
    '/home': '/',
    '/search': 'https://google.com'
  },
  hierarchical: true,
  parentMenuDisplay: 'inline',
  customLinkTexts: {
    admin: 'User Dashboard'
  },
}
```

### Configuration Options Explained

* **`enable`**
  Turns auto-navigation on or off. If set to `false`, no nav menu will be generated.

* **`containerClass`**
  Applies a CSS class to the outer navigation container (`<nav>` element), making it easy to style globally.

* **`ulClass` / `liClass`**
  Classes applied to the `<ul>` and `<li>` elements, so you can fully customise the look and feel of the menu.

This means you can instruct Semantq to generate a navigation menu that suits your styles if you don't want to rely on the default css. 

* **`priorityRoutes`**
  An array of routes that should always appear that order in  the navigation, regardless of alphabetical order or hierarchy.

* **`excludeRoutes`**
  Routes that should not be shown in the navigation. Common examples are error pages (`/404`), auth flows (`/auth`), or the root `/` route if you don’t want it to appear.

* **`includeRoutes`**
  Lets you explicitly add or remap routes:

  * Map one route to another: `'/services': '/about/frontend'` makes the `/services` menu entry point to `/about/frontend`.
  * Map a route to an external link: `'/search': 'https://google.com'`.
  * Map root paths: `'/home': '/'` means the `/home` menu entry will actually point to `/`.

* **`hierarchical`**
  If `true`, routes are displayed in a nested structure (dropdowns or tree menu), reflecting folder hierarchy. If `false`, all routes are displayed flat.

* **`parentMenuDisplay`**
  Controls how parent routes with children are rendered:

  * `"inline"` → all menu items are inlined - except for drop downs if hierarchical is true
  * `"stacked"` → a vertically stacked navigation menu


* **`customLinkTexts`**
  Overrides default link text for specific routes. For example:

  ```js
  customLinkTexts: { admin: 'User Dashboard' }
  ```

  will display `"User Dashboard"` instead of `"admin"`.


### Example Output

Given the configuration above, your navigation will render  as:

```html
<nav class="semantq-nav-container">
  <ul class="semantq-nav-list">
    <li class="semantq-nav-item"><a href="/">Home</a></li>
    <li class="semantq-nav-item"><a href="/about">About</a></li>
    <li class="semantq-nav-item"><a href="/about/frontend">Services</a></li>
    <li class="semantq-nav-item"><a href="https://google.com" target="_blank">Search</a></li>
    <li class="semantq-nav-item"><a href="/admin">User Dashboard</a></li>
  </ul>
</nav>
```

Notice that:

* `/home` was remapped to `/`.
* `/services` was linked to `/about/frontend`.
* `/search` became an external link.
* The `admin` route displays as “User Dashboard.”
* `/404`, `/auth`, and `/` were excluded.

### Hierarchial Menu: `hierarchical: true` 

Hierachical menus follow the src/routes **folder structure**.

Suppose your project has the following route files:

```
src/routes/
├── home
├── about
├── services/
│   ├── africa
│   ├── asia
│   └── europe
├── contact
```

### With `hierarchical: true`

The menu generator recognises the nested structure (`services/africa`, `services/asia`, etc.) and outputs **nested `<ul>` lists**.

```html
<nav class="semantq-nav-container">
  <ul class="semantq-nav-list">
    <li class="semantq-nav-item"><a href="/home">Home</a></li>
    <li class="semantq-nav-item"><a href="/about">About</a></li>
    <li class="semantq-nav-item">
      <a href="/services">Services</a>
      <ul class="semantq-nav-list">
        <li class="semantq-nav-item"><a href="/services/africa">Africa</a></li>
        <li class="semantq-nav-item"><a href="/services/asia">Asia</a></li>
        <li class="semantq-nav-item"><a href="/services/europe">Europe</a></li>
      </ul>
    </li>
    <li class="semantq-nav-item"><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

The `/services` route acts as a **parent menu item**, while `/services/africa`, `/services/asia`, and `/services/europe` appear as dropdown children at the same level.


**Note**
With Semantq, there are no limits to how deep your routes can go. The framework automatically translates directory nesting into fully functional multi-level dropdown menus. Each dropdown item can seamlessly expand into its own nested menu, giving you an infinitely scalable navigation system that grows with your app — without extra configuration.

Here’s a **visual hierarchical example** to illustrate how `hierarchical: true` and infinite nesting works in Semantq:

### Example: Multi-Level Dropdown Menu

```html
<nav class="semantq-nav-container">
  <ul class="semantq-nav-list">
    <li class="semantq-nav-item">
      <a href="/home">Home</a>
    </li>
    <li class="semantq-nav-item">
      <a href="/services">Services ▾</a>
      <ul class="semantq-nav-list">
        <li class="semantq-nav-item">
          <a href="/services/africa">Africa ▾</a>
          <ul class="semantq-nav-list">
            <li class="semantq-nav-item"><a href="/services/africa/north">North</a></li>
            <li class="semantq-nav-item"><a href="/services/africa/south">South</a></li>
          </ul>
        </li>
        <li class="semantq-nav-item">
          <a href="/services/asia">Asia ▾</a>
          <ul class="semantq-nav-list">
            <li class="semantq-nav-item"><a href="/services/asia/east">East</a></li>
            <li class="semantq-nav-item"><a href="/services/asia/west">West</a></li>
          </ul>
        </li>
      </ul>
    </li>
    <li class="semantq-nav-item">
      <a href="/about">About</a>
    </li>
  </ul>
</nav>
```

**How it works in Semantq**

* Each folder in `src/routes` automatically maps to a menu item.
* Subfolders become **nested `<ul>` lists inside parent `<li>` items**.
* There is **no depth limit**: if you keep nesting folders, the dropdown menus keep nesting as well.
* Custom CSS (`semantq-nav-container`, `semantq-nav-list`, `semantq-nav-item`) controls styling and dropdown behaviour.



### With `hierarchical: false`

If you turn hierarchy off, the same routes flatten into a single-level list:

```html
<nav class="semantq-nav-container">
  <ul class="semantq-nav-list">
    <li class="semantq-nav-item"><a href="/home">Home</a></li>
    <li class="semantq-nav-item"><a href="/about">About</a></li>
    <li class="semantq-nav-item"><a href="/services">Services</a></li>
    <li class="semantq-nav-item"><a href="/services/africa">Africa</a></li>
    <li class="semantq-nav-item"><a href="/services/asia">Asia</a></li>
    <li class="semantq-nav-item"><a href="/services/europe">Europe</a></li>
    <li class="semantq-nav-item"><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

⚡ Bonus: You can control how parent items behave with `parentMenuDisplay`:

* `"inline"` → renders a **horizontal menu** layout. Dropdowns are preserved if `hierarchical: true`.
* `"stacked"` → renders a **vertically stacked menu** layout. Dropdowns are preserved if `hierarchical: true`.

* Automatic menu generation with custom classes, route priorities, and hierarchies


## Full-Stack Integration with SemantqQL

* **Plug-and-play backend generation** with model, controller, service, and route
* Works with **MySQL, Supabase, MongoDB, SQLite**
* Fully integrated with **frontend, authentication, and CRUD**
* Supports **REST APIs** immediately after scaffolding

Example command:

```bash
semantq make:resource Product
```

This will create the **Model, Controller, Service, and Route (MCSR)** resources, with routes automatically mounted by the server.

You can query the generated endpoint directly:

```bash
curl -X GET http://localhost:3003/product/products
```

Here’s a refined version in clean Markdown:

---

You can add your **Product** schema in `project_root/semantqQL/prisma/schema.prisma`:

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Float
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Then, on your command line, navigate to the backend server:

```bash
cd semantqQL
```

Run the migration to create the **Product** table in your database:

```bash
npx prisma migrate dev --name added_product_model
```

For more details on the full-stack setup, visit: [Semantq Full Stack Guide](docs/SemantqFullStack.md)


The route is automatically prefixed by the resource name (in lowercase).

### Full JavaScript Fetch Example

```js
const fetchProducts = async () => {
  const res = await fetch('http://localhost:3003/product/products', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await res.json();
  console.log(data);
};

fetchProducts();
```


### Abstraction with smQL

```js
import { smQL } from '@semantq/ql';

// fetch data
const api = new smQL('http://localhost:3003');

// Example: DELETE request
const response = await api.get('/product/products');
// OR
//const response = await api.delete(`/product/products/${product.id}`);

// Extract valid product objects
const products = Object.values(response).filter(
  item => typeof item === 'object' && item !== null && !Array.isArray(item)
);

console.log(products);
```


### Side-by-Side Comparison

| **Operation**   | **Raw Fetch**                                                      | **smQL**                                |
| --------------- | ------------------------------------------------------------------ | --------------------------------------- |
| Setup           | Must specify method, headers, JSON handling manually.              | Just call `new smQL(baseURL)`.          |
| GET Products    | `fetch('.../product/products', { method: 'GET', headers: {...} })` | `await api.get('/product/products')`    |
| DELETE Products | `fetch('.../product/products', { method: 'DELETE' })`              | `await api.delete('/product/products')` |
| JSON Extraction | Must call `.json()` manually.                                      | Handled internally by smQL.             |
| Logging         | Must add manually.                                                 | Built-in (can enable/disable).          |
| Code Clarity    | Verbose, repetitive.                                               | Clean, concise, standardised.           |

For a comprehensive guide on **smQL features**, please visit:
[https://github.com/Gugulethu-Nyoni/smQL](https://github.com/Gugulethu-Nyoni/smQL)


## Feature/Module Specific Docs

### Core Features
- [Semantq AI CLI Guide](docs/SemantqAI.md) - Generate compliant code using AI
- [Semantq Config Guide](docs/SemantqConfig.md) - Manage app configuration
- [Semantq State Guide](docs/SemantqState.md) - Reactive state management system
- [Semantq Core State Guide](docs/SemantqStateCore.md) - Core state management
- [Semantq Reactivity Guide](docs/SemantqCoreReactivity.md) - Semantq Reactivity Guide

### Template System
- [If Logic Block](docs/logicBlocks/if.md) - If Logic Block Guide
- [Each Logic Block](docs/logicBlocks/each.md) - Each Logic Block Guide
- [Syntax Guide](docs/SemantqSyntaxComprehensive.md) - Comprehensive syntax reference
- [Slot Composition](docs/SemantqSlots.md) - Component slot patterns
- [Layout System](docs/SemantqLayouts.md) - Application layout management

### Application Architecture
- [Semantq Full Stack Quick Start](docs/SemantqFullStack.md) - Guide for Building CRUD projects with Semantq.
- [Semantq CLI](docs/SemantqCli.md) - Command line interface
- [Semantq Full Stack Architecture](docs/SemantqQL.md) - Full Server set up with a robust plug and play database driven authentication.

## **License**

Semantq is open-source software licensed under the **MIT License**.