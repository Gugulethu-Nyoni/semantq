# **Layouts in Semantq JS Framework**

In the Semantq JS Framework, **layouts** allow you to define custom structures for your pages and components. By default, all components and pages rely on the `index.html` file for their layout. However, you can override this behavior by creating a `+layout.smq` file in specific routes or base directories.

This documentation explains how to use layouts effectively in your Semantq project.

---

## **Table of Contents**

1. [Introduction to Layouts](#introduction-to-layouts)
2. [Creating a Layout File](#creating-a-layout-file)
3. [Layout File Structure](#layout-file-structure)
4. [Layout Inheritance](#layout-inheritance)
5. [Examples](#examples)
6. [Best Practices](#best-practices)

---

## **1. Introduction to Layouts**

By default, all components and pages in Semantq rely on the `index.html` file for their layout. However, you can define custom layouts for specific routes or groups of routes using the `+layout.smq` file.

### **Key Concepts**
- **`+layout.smq`**: A layout file that defines the structure for a route or group of routes.
- **Layout Inheritance**: Layouts can be inherited from parent directories, allowing you to define a base layout for a group of routes.
- **Override Behavior**: You can override the default layout or a base layout by defining a `+layout.smq` file in a specific route.

---

## **2. Creating a Layout File**

To create a custom layout, add a `+layout.smq` file in the desired route or base directory.

### **File Placement**
- **Base Route Layout**: Place the `+layout.smq` file in the base route directory (e.g., `src/routes/admin/+layout.smq`). This layout will apply to all routes under the `admin` directory.
- **Specific Route Layout**: Place the `+layout.smq` file in a specific route directory (e.g., `src/routes/admin/dashboard/+layout.smq`). This layout will apply only to the `dashboard` route.

---

## **3. Layout File Structure**

The `+layout.smq` file follows a specific structure with four main sections:

### **Sections**
1. **`@script`**: Include JavaScript for importing necessary components.  
   **Note**: JavaScript included here is not bundled with the final app. It is only used during the layout-building workflow.
   ```smq
   @script
   // Import necessary components or libraries
   import { ComponentA, ComponentB } from './components';
   @end
   ```

2. **`@head`**: Include CSS links and script tags for your layout.  
   **Example**: Add Bootstrap CSS and JS CDN links.
   ```smq
   @head
   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" />
   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
   @end
   ```

3. **`@body`**: Define the HTML structure for the body of the page.  
   **Note**: Semantq works with `<div id="app"></div>` as the main app container. You can override this, but you must maintain the `id="app"` attribute.
   ```smq
   @body
   <div id="app">
     <header>Custom Header</header>
     <main>Main Content</main>
   </div>
   @end
   ```

4. **`@footer`**: Include HTML that goes into the footer of the page.
   ```smq
   @footer
   <footer>Custom Footer</footer>
   @end
   ```

---

## **4. Layout Inheritance**

Layouts in Semantq follow a hierarchical inheritance model. This means that:

- If a `+layout.smq` file is defined in a base route directory (e.g., `src/routes/admin/+layout.smq`), it will apply to all routes under that directory.
- If a specific route defines its own `+layout.smq` file (e.g., `src/routes/admin/dashboard/+layout.smq`), it will override the base layout for that route.

### **Example**
```
src/
  routes/
    admin/
      +layout.smq              # Base layout for all admin routes
      dashboard/
        +layout.smq            # Custom layout for the dashboard route
      users/
        +page.smq              # Uses the base admin layout
      subscribers/
        +page.smq              # Uses the base admin layout
```

---

## **5. Examples**

### **Example 1: Base Layout for Admin Routes**
Create a `+layout.smq` file in the `admin` directory:
```smq
@head
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
@end

@body
<div id="app">
  <header>Admin Portal</header>
  <main>Main Content</main>
</div>
@end

@footer
<footer>Admin Footer</footer>
@end
```

### **Example 2: Custom Layout for Dashboard Route**
Create a `+layout.smq` file in the `dashboard` directory:
```smq
@head
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
@end

@body
<div id="app">
  <header>Dashboard</header>
  <main>Dashboard Content</main>
</div>
@end

@footer
<footer>Dashboard Footer</footer>
@end
```

---

## **6. Best Practices**

1. **Maintain the `id="app"` Container**:  
   Always include a `<div id="app"></div>` in the `@body` section to ensure compatibility with Semantq's rendering system.

2. **Use CDN Resources Wisely**:  
   When using CDN resources (e.g., Bootstrap), ensure they are loaded in the `@head` section.

3. **Avoid App-Specific JavaScript in Layouts**:  
   JavaScript included in the `@script` section is not bundled with the final app. Use it only for layout-specific workflows.

4. **Leverage Layout Inheritance**:  
   Define base layouts for groups of routes to avoid duplication and ensure consistency.

5. **Test Layout Overrides**:  
   When overriding a base layout, test the specific route to ensure the custom layout works as expected.

---

## **Conclusion**

Layouts in Semantq provide a powerful way to customize the structure of your pages and components. By using `+layout.smq` files, you can define base layouts for groups of routes or create custom layouts for specific routes. This flexibility allows you to build complex applications while maintaining a clean and organized codebase.

For more information, refer to the [Semantq JS Framework Documentation](#).

---

Feel free to customize this documentation further to match your framework's branding and style. Let me know if you need additional sections or examples! 🚀