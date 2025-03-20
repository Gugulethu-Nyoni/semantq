# **Semantq AI CLI Documentation**

The **Semantq AI CLI** is a powerful tool for generating code using AI. It is designed specifically for the **Semantq Framework**. Arguably the first AI-first, AI-driven and  purpose-specific JavaScript framework. With this CLI, developers can quickly generate JavaScript, CSS, and HTML code using natural language prompts and save the output to the appropriate route directories within their apps.

---

## **Table of Contents**
1. [Installation](#installation)
2. [Usage](#usage)
   - [Basic Command](#basic-command)
   - [Generating Full Components](#generating-full-components)
   - [Generating Specific Code Types](#generating-specific-code-types)
   - [Appending Code](#appending-code)
3. [Command Reference](#command-reference)
4. [Examples](#examples)
5. [Contributing](#contributing)
6. [License](#license)

---

## **Installation**

The semantq AI Command Line Interface commands come with Semantq framework installation so you don't need to install these seperately. To install Semantq, install the npm package globally via npm:

```bash
npm install -g semantq
```

Once installed, you can run the CLI using the `semantq` command.

---

## **Usage**

### **Basic Command**
The core command is `semantq ai`, which generates code based on a prompt and saves it to the specified route directory.

#### **Syntax:**
```bash
semantq ai <prompt> --route <route> [options]
```

#### **Example:**
```bash
semantq ai "write a login form with email and password fields" --route auth
```

This will generate HTML for a login form and save it to `/src/routes/auth/+page.html`.

---

### **Generating Full Components**
To generate a full component with JavaScript, CSS, and HTML wrapped in Semantq custom tags, use the `--full` flag.

#### **Syntax:**
```bash
semantq ai <prompt> --route <route> --full
```

#### **Example:**
```bash
semantq ai "write a card component" --route contact --full
```

**Output in `/src/routes/contact/+page.html`:**
```html
@script
// JavaScript code for the card component
function toggleCard() {
  console.log("Card toggled!");
}
@end

@style
/* CSS code for the card component */
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
@end

@html
<!-- HTML code for the card component -->
<div class="card">
  <h2>Card Title</h2>
  <p>This is a card component.</p>
</div>
```

---

### **Generating Specific Code Types**
You can generate only JavaScript, CSS, or HTML by using the `--js`, `--css`, or `--html` flags.

#### **Syntax:**
```bash
semantq ai <prompt> --route <route> --js
semantq ai <prompt> --route <route> --css
semantq ai <prompt> --route <route> --html
```

#### **Examples:**
1. **Generate JavaScript:**
   ```bash
   semantq ai "write JavaScript for a toggle button" --route settings --js
   ```

   **Output in `/src/routes/settings/+page.html`:**
   ```javascript
   const toggleButton = document.getElementById("toggle-button");
   toggleButton.addEventListener("click", () => {
     console.log("Button toggled!");
   });
   ```

2. **Generate CSS:**
   ```bash
   semantq ai "write CSS for a navbar with links to Home, About, and Contact" --route dashboard --css
   ```

   **Output in `/src/routes/dashboard/+page.html`:**
   ```css
   .navbar {
     display: flex;
     justify-content: space-between;
     padding: 1rem;
     background-color: #333;
     color: white;
   }

   .navbar a {
     color: white;
     text-decoration: none;
     margin: 0 1rem;
   }
   ```

3. **Generate HTML:**
   ```bash
   semantq ai "write a login form with email and password fields" --route auth --html
   ```

   **Output in `/src/routes/auth/+page.html`:**
   ```html
   <form>
     <label for="email">Email:</label>
     <input type="email" id="email" name="email" required>
     <label for="password">Password:</label>
     <input type="password" id="password" name="password" required>
     <button type="submit">Login</button>
   </form>
   ```

---

### **Appending Code**
To append generated code to an existing file instead of overwriting it, use the `--append` flag.

#### **Syntax:**
```bash
semantq ai <prompt> --route <route> --js --append
semantq ai <prompt> --route <route> --css --append
semantq ai <prompt> --route <route> --html --append
```

#### **Example Workflow:**
1. **Generate JavaScript:**
   ```bash
   semantq ai "write JavaScript for a toggle button" --route contact --js --append
   ```

2. **Generate CSS:**
   ```bash
   semantq ai "write CSS for a navbar with links to Home, About, and Contact" --route contact --css --append
   ```

3. **Generate HTML:**
   ```bash
   semantq ai "write a card component" --route contact --html --append
   ```

**Output in `/src/routes/contact/+page.html`:**
```javascript
const toggleButton = document.getElementById("toggle-button");
toggleButton.addEventListener("click", () => {
  console.log("Button toggled!");
});


.navbar {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: #333;
  color: white;
}

.navbar a {
  color: white;
  text-decoration: none;
  margin: 0 1rem;
}


<div class="card">
  <h2>Card Title</h2>
  <p>This is a card component.</p>
</div>
```

You can then go ahead and wrap these code blocks with the required Semantq js and css tags (`@script //js code @end and @style /* css */ @html (optional)`)
---

## **Command Reference**

| Command                                      | Description                                                                 |
|----------------------------------------------|-----------------------------------------------------------------------------|
| `semantq ai <prompt> --route <route>`        | Generate code and save it to the specified route directory.                 |
| `semantq ai <prompt> --route <route> --full` | Generate a full component with JS, CSS, and HTML wrapped in custom tags.    |
| `semantq ai <prompt> --route <route> --js`   | Generate only JavaScript.                                                   |
| `semantq ai <prompt> --route <route> --css`  | Generate only CSS.                                                          |
| `semantq ai <prompt> --route <route> --html` | Generate only HTML.                                                         |
| `semantq ai <prompt> --route <route> --append`| Append the generated code to the file instead of overwriting it.            |

---

## **Examples**

### **1. Generate a Full Component**
```bash
semantq ai "write a card component" --route contact --full
```

### **2. Generate Only CSS**
```bash
semantq ai "write CSS for a navbar" --route dashboard --css
```

### **3. Append JavaScript to an Existing File**
```bash
semantq ai "write JavaScript for a toggle button" --route settings --js --append
```

---

## **Contributing**

We welcome contributions to the Semantq AI CLI! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

---

## **License**

Semantq is open-source software licensed under the **MIT License**.

## Semantq Main Documentation: [Semantq Syntax Guide](https://github.com/Gugulethu-Nyoni/semantq).