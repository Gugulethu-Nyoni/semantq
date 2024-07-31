#!/usr/bin/env node
import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { execSync } from 'child_process'; // Import execSync from child_process module

// Get the current working directory
const cwd = process.cwd();

// Install Tailwind CSS command
program
  .command('install:tailwind')
  .description('Install Tailwind CSS')
  .action(installTailwind);

function installTailwind() {
  try {
    console.log('Installing Tailwind CSS...');
    execSync('npm install --save-dev tailwindcss postcss autoprefixer', { stdio: 'inherit' });
    execSync('npx tailwindcss init -p', { stdio: 'inherit' });

    // Create tailwind.config.js
    const tailwindConfigContent = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // For development
    "./build/**/*.{html,js}", // For production
  ],
  theme: {
    extend: {
      colors: {
        "primary-color": "#0C1A53",
      },
    },
  },
  plugins: [],
};`;

fs.writeFileSync('tailwind.config.js', tailwindConfigContent);


    // Create semantq.config.js
    const configContent = `
      module.exports = {
        content: [
          "${path.join(process.cwd(), 'global.css')}"
        ],
        theme: {
          extend: {}
        },
        plugins: []
      };
    `;

    fs.writeFileSync('semantq.config.js', configContent);

    // Get existing content of global.css
    const existingContent = fs.readFileSync('global.css', 'utf-8');

    // Add Tailwind CSS directives to existing content
    const updatedContent = `${existingContent}\n@tailwind base;\n@tailwind components;\n@tailwind utilities;`;

    // Append updated content to global.css
    fs.writeFileSync('global.css', updatedContent, 'utf-8');

    console.log('\x1b[32m' + 'Tailwind CSS installed successfully!' + '\x1b[0m');
  } catch (error) {
    console.error('\x1b[31m' + 'Error occurred while installing Tailwind CSS:', error.message + '\x1b[0m');
  }
}





/* CREATE ROUTE COMMAND */


// Define the path to the src directory, relative to the cwd
const srcDir = path.join('src');
// Define the path to the routes directory, relative to the srcDir
const routesDir = path.join(srcDir, 'routes');

program
  .command('make:route <routeName>')
  .description('Create a new route with the specified routeName')
  .action((routeName) => {
    const routeDir = path.join(routesDir, routeName);

    // Check if route directory already exists
if (fs.existsSync(routeDir)) {
      // Route directory already exists
const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
});

      rl.question('\x1b[34m' + `Route '${routeName}' already exists. Do you want to overwrite it? (yes/no): ` + '\x1b[0m', (answer) => {
        if (answer.trim().toLowerCase() === 'yes') {
          // User wants to overwrite the existing route
createRoute(routeDir, routeName);
        } else {
          // User does not want to overwrite, cancel operation
console.log('Operation cancelled. Route was not created.');
        }
        rl.close();
      });
    } else {
      // Route directory does not exist, create it
createRoute(routeDir, routeName);
    }
  });


function createRoute(routeDir, routeName) {
  // Create route directory
fs.mkdirSync(routeDir, { recursive: true });

  // Create +page.smq file
const pageContent = '// Add your page content here';
  fs.writeFileSync(path.join(routeDir, '+page.smq'), pageContent, 'utf-8');

  // Create +layout.smq file
const layoutContent = '// Add your layout content here';
  fs.writeFileSync(path.join(routeDir, '+layout.smq'), layoutContent, 'utf-8');

  // Create +server.js file
const serverContent = '// Add your server-side logic here\nmodule.exports = {};';
  fs.writeFileSync(path.join(routeDir, '+server.js'), serverContent, 'utf-8');

// Use path.relative for the success message
const relativeRouteDir = path.relative(process.cwd(), path.join(routesDir, routeName));
console.log('\x1b[32m' + `Route ${routeName} created successfully in ${relativeRouteDir}!` + '\x1b[0m');
}


program.parse();