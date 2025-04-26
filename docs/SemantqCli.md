# Semantq CLI Commands Guide

Welcome to the Semantq CLI Commands Guide! This document provides an overview of the available commands for the Semantq CLI tool, which helps you streamline your project setup and development process.

## Quick Summary of Available Commands (Overview)

### Project Commands
1. `semantq create <projectName>` - Generate new project structure
2. `semantq update` - Update Semantq to latest version
   - `semantq --dry-run` - Preview changes without applying

### Resource Generation
3. `semantq make:resource <name>` - Generate full resource (model+service+controller+route)
   - `-a, --adapter` - Specify database adapter (mongo/supabase)
4. `semantq make:model <name>` - Generate model only
   - `-a, --adapter` - Specify database adapter
5. `semantq make:service <name>` - Generate service only
   - `-a, --adapter` - Specify database adapter
6. `semantq make:controller <name>` - Generate controller only
7. `semantq make:apiRoute <name>` - Generate route only

### Installation Commands
8. `semantq install:server` - Set up server directory
9. `semantq install:supabase` - Configure Supabase
10. `semantq install:tailwind` - Install Tailwind CSS

### Route System
11. `semantq make:route <routeName>` - Create new route with templates
   - `-l, --layout` - Include layout file @layout.smq
   - `-c, --config` - Include config file config.js
   - `-s, --server` - Include server handlers server.js
   - `-a, --all` - Create all resources (@page.smq,@layout.smq,config.js,server.js)

### AI Commands
12. `semantq ai <prompt>` - Generate code using AI
   - `-r, --route` - Specify target route directory (required)
   - `--full` - Wrap in Semantq tags
   - `--js`/`--css`/`--html` - Generate specific code type
   - `--append` - Append to existing file

#### Utility
13. `semantq -v, --version` - Show version number

The CLI handles everything from project scaffolding to AI-assisted development.


## Semantq CLI Commands (Comprehensive)

The Semantq CLI provides a set of commands to quickly scaffold and configure your projects. Below is a list of available commands and their descriptions.

### Available Commands

| Command                     | Description                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| `semantq create myapp`      | Creates a new project with required folders and files. Run this where you want to install the new project. |
| `semantq install:tailwind`  | Installs Tailwind CSS and configures it. Run this inside the project root.  |
| `semantq make:route myroute`| Creates a new route folder with `@page.smq`, `@layout.smq`, and `+server.js`. Run this inside the project root. |

## Usage Examples

### Creating a New Project

To create a new project named `myapp`, run the following command in your desired directory:

```bash
semantq create myapp
```

This will generate a new project with the required folder structure.

### Tailwind CSS Installation


With Semantq, you only need to run one command to install Tailwind CSS. Semantq will automatically install all required dependencies and set up the necessary configurations. However, if you prefer, you can manually install Tailwind CSS by following the guide below.


## One-Command Approach

To install and configure Tailwind CSS, simply run the following command in your Semantq project:

```bash
semantq install:tailwind
```

This single command handles everything for you, from installing dependencies to configuring files. No manual setup is required.


At this point you are done installing Tailwind CSS. 

## Testing Your Tailwind Installation

To verify that Tailwind CSS is working correctly, follow these steps:

1. Add some HTML elements with Tailwind classes to your page or component. For example:
   ```html
   <div class="p-6 bg-blue-500 text-white rounded-lg">
     <h1 class="text-2xl font-bold">Tailwind CSS is Working!</h1>
     <p class="mt-2">This is a test to confirm Tailwind is properly installed.</p>
   </div>
   ```

2. Run your development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to your application. You should see the styled elements on the page.

4. **Inspect the Page Source**:
   - Open your browser’s developer tools (right-click → Inspect).
   - Navigate to the "Sources" tab and look for the `global.css` file.
   - Verify that Tailwind’s utility classes are being applied.


## What Happens During the One-Command Approach Installation ?

When you run `semantq install:tailwind`, the following steps are executed automatically:

### 1. **Install Tailwind CSS and Dependencies**
   - Tailwind CSS v3, PostCSS, and Autoprefixer are installed as development dependencies using npm.
   - Command executed:
     ```bash
     npm install -D tailwindcss@3 postcss autoprefixer
     ```

### 2. **Initialize Tailwind CSS**
   - A `tailwind.config.js` file and a `postcss.config.js` file are generated.
   - Command executed:
     ```bash
     npx tailwindcss init -p
     ```

### 3. **Configure Tailwind’s Content Paths**
   - The `tailwind.config.js` file is updated to include the necessary content paths for your Semantq project.
   - Example configuration:
     ```javascript
     export default {
       content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html,smq}"],
       theme: {
         extend: {},
       },
       plugins: [],
     };
     ```

### 4. **Create or Update `vite.config.js`**
   - The `vite.config.js` file is created or updated to include PostCSS configuration for Tailwind CSS.
   - Example configuration:
     ```javascript
import Inspect from 'vite-plugin-inspect';
import { sync } from 'glob';
import { resolve } from 'path';
import fse from 'fs-extra';

export default {
  plugins: [Inspect()],
  build: {
    rollupOptions: {
      input: {
        // Specify index.html as the entry point to be bundled
        index: resolve(__dirname, 'index.html'),
        // Add all HTML files from the build directory
        ...Object.fromEntries(
          sync('./build/**/*.html'.replace(/\\/g, '/')).map((file) => [
            // Remove the `build/` prefix from the file path
            file.replace(/^\.\/build\//, '').replace(/\.html$/, ''),
            resolve(__dirname, file),
          ])
        ),
      },
    },
    outDir: 'dist', // Set the output directory to the root of dist
    emptyOutDir: true, // Clear the dist directory before building
    assetsDir: 'assets', // Place assets in a dedicated 'assets' directory inside dist
  },
  async closeBundle() {
  const buildDir = resolve(__dirname, 'build');
  const distDir = resolve(__dirname, 'dist');

  // Copy all files from build to dist root, excluding the build directory itself
  await fse.copy(buildDir, distDir, {
    overwrite: true,
    recursive: true,
    filter: (src) => !src.endsWith(buildDir), // Exclude the build directory itself
  });

  console.log('Build files copied to dist root.');
},
};
```

### 5. **Add Tailwind Directives to `global.css`**
   - Tailwind CSS directives (`@tailwind base`, `@tailwind components`, `@tailwind utilities`) are added to the `global.css` file.
   - If `global.css` doesn’t exist, it is created with the Tailwind directives.
   - Example content:
     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```

---

## Manual Installation (Optional)

If you prefer to install Tailwind CSS manually, follow these steps:

### 1. Install Tailwind CSS and Dependencies
Run the following command to install Tailwind CSS, PostCSS, and Autoprefixer:
```bash
npm install -D tailwindcss@3 postcss autoprefixer
```

### 2. Initialize Tailwind CSS
Generate the `tailwind.config.js` and `postcss.config.js` files:
```bash
npx tailwindcss init -p
```

### 3. Configure Tailwind’s Content Paths
Open the `tailwind.config.js` file and update the `content` array to include your project’s file paths:
```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html,smq}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 4. Add Tailwind Directives to Your CSS File
Create or update your `global.css` file (or any other CSS file) and add the following Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Benefits of the One-Command Approach

- **Saves Time**: No need to manually install dependencies or configure files.
- **Eliminates Errors**: Automated setup reduces the risk of misconfiguration.
- **Consistency**: Ensures Tailwind CSS is set up correctly for every Semantq project.

---

## Post-Installation

Once the installation is complete, you can start using Tailwind CSS classes in your Semantq project. Simply run your development server, and Tailwind will be ready to go!

```bash
npm run dev
```

---

## Troubleshooting

If you encounter any issues during installation, check the following:
1. Ensure you have Node.js and npm installed.
2. Verify that your project is a valid Semantq JS Framework application.
3. Check the console for any error messages and refer to the Tailwind CSS documentation if needed.


### Creating a New Route

To create a new route named `myroute`, navigate to the project root and run:

```bash
semantq make:route myroute
```

This will generate a new route folder with the following files:
- `@page.smq`
- `@layout.smq`
- `server.js`

## Contributing

If you have any suggestions or improvements for the Semantq CLI, feel free to open an issue or submit a pull request. We welcome contributions from the community!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Thank you for using Semantq! Happy coding! 🚀
```
