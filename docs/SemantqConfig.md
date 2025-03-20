# Semantq Configuration Documentation (`semantq.config.js`)

The `semantq.config.js` file is the central configuration file for Semantq, an AI-first JavaScript framework. It allows you to define global settings, components, libraries, routes, and menu generation for your application. Below is a detailed breakdown of each configuration option, presented in the same order as they appear in the file.

---

## **1. Basic Configuration**

### **`domain`**
- **Type:** `string`
- **Default:** `'localhost'`
- **Description:**  
  Specifies the domain name for your application. This is typically used for server-side rendering (SSR) or when generating absolute URLs.  
  You can override this value using the `DOMAIN` environment variable.

  **Example:**
  ```javascript
  domain: process.env.DOMAIN || 'localhost'
  ```

---

### **`targetHost`**
- **Type:** `string`
- **Default:** `'https://example.com'`
- **Description:**  
  Defines the target host for your application. This is useful when your application is hosted on a specific domain or subdomain.  
  You can override this value using the `TARGET_HOST` environment variable.

  **Example:**
  ```javascript
  targetHost: process.env.TARGET_HOST || 'https://example.com'
  ```

---

### **`pageTitle`**
- **Type:** `string`
- **Default:** `'My Awesome Website'`
- **Description:**  
  Sets the default title for your website. This title is used in the `<title>` tag of your HTML pages unless overridden by individual pages.

  **Example:**
  ```javascript
  pageTitle: 'My Awesome Website'
  ```

---

### **`envFilePath`**
- **Type:** `string`
- **Default:** `path.join(rootDir, '.env')`
- **Description:**  
  Specifies the path to your `.env` file, which contains environment variables for your application. By default, it looks for a `.env` file in the root directory of your project.

  **Example:**
  ```javascript
  envFilePath: path.join(rootDir, '.env')
  ```

---

### **`sitemap`**
- **Type:** `boolean`
- **Default:** `true`
- **Description:**  
  Enables or disables the automatic generation of a sitemap for your application. If enabled, Semantq will generate a `sitemap.xml` file based on your routes. This file can be submitted to search engines like Google for SEO indexing.  
  Additionally, Semantq will generate an HTML version of the sitemap at `/sitemap/index.html`, which can be accessed via `yourdomain.com/sitemap`.

  **Example:**
  ```javascript
  sitemap: true
  ```

---

### **`base`**
- **Type:** `string`
- **Default:** `'/'`
- **Description:**  
  Defines the base path for your application. This is useful if your application is hosted in a subdirectory (e.g., `/subdir/`). All routes will be prefixed with this base path.

  **Example:**
  ```javascript
  base: '/'
  ```

---

## **2. Global Components Configuration**


### **`globalComponents.$global`**
- **Type:** `string`
- **Default:** `path.join(rootDir, 'src/components/global')`
- **Description:**  
  Specifies the directory where global components are stored. Global components are reusable components that can be accessed across your application using the `$global` alias. This alias simplifies importing components by avoiding the need to write full paths.

  **Example:**
  ```javascript
  '$global': path.join(rootDir, 'src/components/global')
  ```

  This means that in your app pages or components, you can import global components like this:

  ```javascript
  import Button from '$global/Button';
  ```

  OR

    ```javascript
  import Button from '$global/animations/Underline';
  ```


  Instead of writing the full path:

  ```javascript
  import Button from '../../../src/components/global/Button';
  ```

  This saves you time and makes your code cleaner and easier to maintain.

  ---

## **3. Library Configuration**

### **`lib.$lib`**
- **Type:** `string`
- **Default:** `path.join(rootDir, 'lib')`
- **Description:**  
  Specifies the directory where your custom libraries are stored. These libraries can be accessed across your application using the `$lib` alias.

  **Example:**
  ```javascript
  '$lib': path.join(rootDir, 'lib')
  ```

---

## **4. Routes Configuration**

### **`routes.declaredRoutes`**
- **Type:** `string`
- **Default:** `path.join(rootDir, 'src/routes/routes.js')`
- **Description:**  
  Specifies the path to the file containing declared routes for your application. Declared routes are explicitly defined routes that provide fine-grained control over the routing structure. Unlike file-based routes, declared routes allow you to define custom paths that do not necessarily match the file structure.

  **Example:**
  ```javascript
  declaredRoutes: path.join(rootDir, 'src/routes/routes.js')
  ```

  **Declared Routes Example:**
  ```javascript
  const declaredRoutes = [
    { path: 'services', filePath: '/services' },
    { path: 'africa', filePath: 'products/africa' },
  ];

  export default declaredRoutes;
  ```

  This allows you to create more meaninful link texts and URLs like `<a href="africa">Africa Products</a>` instead of `<a href="products/africa"> Products Africa </a>`.

---

### **`routes.fileBasedRoutes`**
- **Type:** `string`
- **Default:** `path.join(rootDir, 'build/routes/fileBasedRoutes.js')`
- **Description:**  
  Specifies the path to the file containing file-based routes for your application. File-based routes are automatically generated (during build) based on the file structure in your `src/routes` directory. For example, creating a route like `semantq make:route services/africa` will generate a file-based route like `"services/africa": "services/africa"`.

  **Example:**
  ```javascript
  fileBasedRoutes: path.join(rootDir, 'build/routes/fileBasedRoutes.js')
  ```

  **File-Based Routes Example:**
  ```javascript
  "services/africa": "services/africa"
  ```

  This makes links like `<a href="services/europe">Europe Services</a>` possible and recognisable by the Semantq router. 

---

### **Key Notes on Routes**
- **File-Based Routing:**  
  Semantq automatically handles file-based routing based on the directory structure in `src/routes`. Developers don't need to manually configure these routes. Simply build your navigation markup based on them. Alternatively, if you enable SemantqNav in the config file, it will handle the entire navigation setup for you. 
- **Declared Routes:**  
  For more fine-grained control, developers can declare routes in `src/routes/routes.js`. Declared routes take priority over file-based routes, allowing you to override file-based paths for cleaner and more meaningful URLs.
- **Example of Priority:**  
  If you have a file-based route like `"products/africa": "products/africa"` and a declared route like `{ path: 'africa', filePath: 'products/africa' }`, Semantq will prioritize the declared route, resulting in a cleaner URL like `<a href="africa">Africa Products</a>` instead of: `<a href="products/africa"> Products Africa </a>`

---

## **5. Menu (semantqNav) Configuration**

### **`semantqNav.enable`**
- **Type:** `boolean`
- **Default:** `true`
- **Description:**  
  Enables or disables the automatic generation of a navigation menu for your application. If enabled, Semantq will generate a menu and insert it into `<div id="smq-menu-container"></div>` elements in your pages during compilation. This eliminates the need to manually write the menu.

  **Example:**
  ```javascript
  enable: true
  ```

---

### **`semantqNav.containerClass`**
- **Type:** `string`
- **Default:** `'smq-menu-container'`
- **Description:**  
  Specifies the CSS class name for the container `<div>` element of the generated menu.

  **Example:**
  ```javascript
  containerClass: 'smq-menu-container'
  ```

---

### **`semantqNav.ulClass`**
- **Type:** `string`
- **Default:** `'smq-menu-list'`
- **Description:**  
  Specifies the CSS class name for the `<ul>` element of the generated menu.

  **Example:**
  ```javascript
  ulClass: 'smq-menu-list'
  ```

---

### **`semantqNav.liClass`**
- **Type:** `string`
- **Default:** `'smq-menu-item'`
- **Description:**  
  Specifies the CSS class name for the `<li>` elements of the generated menu.

  **Example:**
  ```javascript
  liClass: 'smq-menu-item'
  ```

---

### **`semantqNav.excludeRoutes`**
- **Type:** `Array<string>`
- **Default:** `[]`
- **Description:**  
  Specifies an array of routes to exclude from the generated menu. This is useful for hiding oe skippinf specific pages and routes (e.g., login or admin pages) from the navigation.

  **Example:**
  ```javascript
  excludeRoutes: ['/login', '/admin', '/']
  ```

---

### **`semantqNav.hierarchical`**
- **Type:** `boolean`
- **Default:** `true`
- **Description:**  
  Enables or disables hierarchical dropdowns for nested routes. If enabled, nested routes will be displayed as dropdown menus.

  **Example:**
  ```javascript
  hierarchical: true
  ```

---

### **`semantqNav.customLinkTexts`**
- **Type:** `Object`
- **Default:** `{}`
- **Description:**  
  Allows you to customize the link texts for menu items. This is useful when the default link texts generated from file-based routes are not user-friendly or meaningful.

  **Example:**
  ```javascript
  customLinkTexts: {
    'services/europe': 'Europe Services',
    'products/africa': 'Africa Products',
  }
  ```

---

## **6. Menu Features**

### **Automatic Menu Generation**
- If `semantqNav.enable` is set to `true`, Semantq will automatically generate a navigation menu and insert it into `<div id="semantq-nav-container"></div>` elements in your pages during compilation.
- The menu is mobile-friendly, with a burger menu for smaller screens.
- It supports multi-level (hierarchical) dropdowns based on your route structure.
- The menu is designed to be basic (almost headless), allowing developers to write custom styles using the provided and configurable (changeable) class names (`semantq-nav-container`, `semantq-nav-list`, `semantq-nav-item`).

### **Menu Customization**
- The navigation markup and scoped CSS file are written into the `src/components/global` directory during the `npm dev` step.
- Developers can access the `SemantqMenu.html` file in `/build/components/global/` to make final edits and tweaks before running the `npm run build` step.

---

## **7. Example Configuration**

Here’s an example of a complete `semantq.config.js` file:

```javascript
import path from 'path';
const rootDir = process.cwd();

export default {
  domain: process.env.DOMAIN || 'localhost',
  targetHost: process.env.TARGET_HOST || 'https://example.com',
  pageTitle: 'My Awesome Website',
  envFilePath: path.join(rootDir, '.env'),
  sitemap: true,
  base: '/',

  globalComponents: {
    '$global': path.join(rootDir, 'src/components/global'),
  },

  lib: {
    '$lib': path.join(rootDir, 'lib'),
  },

  routes: {
    declaredRoutes: path.join(rootDir, 'src/routes/routes.js'),
    fileBasedRoutes: path.join(rootDir, 'build/routes/fileBasedRoutes.js'),
  },

  semantqNav: {
    enable: true,
    containerClass: 'semantq-nav-container',
    ulClass: 'semantq-nav-list',
    liClass: 'semantq-nav-item',
    excludeRoutes: ['/login', '/admin','/'],
    hierarchical: true,
    customLinkTexts: {
      'services/europe': 'Europe Services',
      'products/africa': 'Africa Products',
    },
  },
};
```

---

## **8. Conclusion**

The `semantq.config.js` file is a powerful tool for configuring your Semantq application. By understanding and customizing these options, you can tailor your application to meet specific requirements, improve performance, and enhance user experience. For further assistance, refer to the official Semantq documentation or community forums.

## **License**

Semantq is open-source software licensed under the **MIT License**.

## Semantq Main Documentation: [Semantq Syntax Guide](https://github.com/Gugulethu-Nyoni/semantq).
