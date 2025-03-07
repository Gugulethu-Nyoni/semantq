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
- **Optional Sections**: The `@head`, `@body`, and `@footer` sections are optional. You can include only the sections you need.

---

## **2. Creating a Layout File**

To create a custom layout, add a `+layout.smq` file in the desired route or base directory.

### **File Placement**
- **Base Route Layout**: Place the `+layout.smq` file in the base route directory (e.g., `src/routes/admin/+layout.smq`). This layout will apply to all routes under the `admin` directory.
- **Specific Route Layout**: Place the `+layout.smq` file in a specific route directory (e.g., `src/routes/admin/dashboard/+layout.smq`). This layout will apply only to the `dashboard` route.

---

## **3. Layout File Structure**

The `+layout.smq` file follows a specific structure with four main sections. All sections (`@script`, `@head`, `@body`, `@footer`) are **optional**, and you can include only the sections you need.

### **Sections**
1. **`@script`**: Include JavaScript for importing necessary components.  
   **Note**: JavaScript included here is not bundled with the final app. It is only used during the layout-building workflow.  
   You can import local components using the `$global` alias or relative paths.
   ```smq
   @script
   import TopBar from '$global/TopBar';
   import SideBar from '$global/SideBar';
   import MainContent from '$global/MainContent';
   import Footer from '$global/Footer';
   @end
   ```

2. **`@head`**: Include CSS links and script tags for your layout.  
   **Example**: Add local CSS files or CDN links.
   ```smq
   @head
   <link rel="stylesheet" href="/public/admin.css" />
   <link rel="stylesheet" href="https://unpkg.com/anygridcss@1.0.1/anyGrid.css" />
   @end
   ```

3. **`@body`**: Define the HTML structure for the body of the page.  
   **Note**: Semantq works with `<div id="app"></div>` as the main app container. You can override this, but you must maintain the `id="app"` attribute.  
   You can use imported components in the body section.
   ```smq
   @body
   <TopBar />
   <SideBar />
   <MainContent>
     <!-- Main content goes here -->
   </MainContent>
   <Footer />
   @end
   ```

4. **`@footer`**: Include HTML or scripts that go into the footer of the page.  
   **Example**: Add a local JavaScript file.
   ```smq
   @footer
   <script src="/public/admin.js" type="module"></script>
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
@script
import TopBar from '$global/TopBar';
import SideBar from '$global/SideBar';
import MainContent from '$global/MainContent';
import Footer from '$global/Footer';
@end

@head
<link rel="stylesheet" href="/public/admin.css" />
<link rel="stylesheet" href="https://unpkg.com/anygridcss@1.0.1/anyGrid.css" />
@end

@body
<TopBar />
<SideBar />
<MainContent>
  <!-- Main content goes here -->
</MainContent>
<Footer />
@end

@footer
<script src="/public/admin.js" type="module"></script>
@end
```

### **Example 2: Custom Layout for Dashboard Route**
Create a `+layout.smq` file in the `dashboard` directory:
```smq
@head
<link rel="stylesheet" href="/public/dashboard.css" />
@end

@body
<div id="app">
  <header>Dashboard</header>
  <main>Dashboard Content</main>
</div>
@end
```

---

## **6. Best Practices**

1. **Maintain the `id="app"` Container (Optional)**:  
   If you want to have fine grained control over Semantq's default app container you must include a `<div id="app"></div>` in the `@body` section of your +layout.file.

2. **Use CDN Resources Wisely**:  
   When using CDN css and js resources (e.g., Bootstrap), ensure they are loaded in the `@head` section.

3. **Avoid App-Specific JavaScript in Layouts**:  
   JavaScript included in the `@script` section is not bundled with the final app. Use it only for layout-specific workflows. 

4. **Leverage Layout Inheritance**:  
   Define base layouts for groups of routes to avoid duplication and ensure consistency.

5. **Test Layout Overrides**:  
   When overriding a base layout, test the specific route to ensure the custom layout works as expected.

6. **Layout Sections Are Optional**:  
   Only include the section(s) (`@head`, `@body`, `@footer`) that are necessary for your layout. All of these are optional. Only use what you need. 

---

## **Conclusion**

Layouts in Semantq provide a powerful way to customize the structure of your pages and components. By using `+layout.smq` files, you can define base layouts for groups of routes or create custom layouts for specific routes. This flexibility allows you to build complex applications while maintaining a clean and organized codebase.

For more information, refer to the [Semantq JS Framework Documentation](https://github.com/Gugulethu-Nyoni/semantq).
