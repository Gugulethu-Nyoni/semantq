#!/usr/bin/env node
import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// Get the current working directory
const cwd = process.cwd();

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

program.parse();

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
