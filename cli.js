#!/usr/bin/env node
const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const packageJson = require('./package.json'); // Import package.json

program.version(packageJson.version, '-v, --version', 'Output the current version of semantq');

// Utility function for safely copying directories
const safeCopySync = (source, destination) => {
  try {
    fs.copySync(source, destination, { recursive: true, overwrite: true });
  } catch (error) {
    console.error(`Error copying ${source} to ${destination}:`, error.message);
  }
};

// Utility function to copy files only if they exist
const copyIfExists = async (source, destination) => {
  if (await fs.pathExists(source)) {
    await fs.copyFile(source, destination);
  } else {
    console.warn(`Warning: ${source} does not exist, skipping.`);
  }
};

// ===============================
//  CREATE NEW PROJECT COMMAND
// ===============================
program
  .command('create <projectName>')
  .description('Generate the project structure')
  .action(async (projectName) => {
    const projectPath = path.join(process.cwd(), projectName);
    const templateDirectory = path.resolve(__dirname, './templates');
    const configDirectory = path.resolve(__dirname, './configs');

    try {
      // Define directories to create
      const directories = [
        'src/components/global',
        'src/routes',
        'build/components',
        'build/routes',
        'src/utils',
        'src/styles',
        'tests',
        'docs',
        'examples',
        'public',
      ];
      await Promise.all(directories.map(dir => fs.mkdir(path.join(projectPath, dir), { recursive: true })));
 

     // Create empty routes.json in src/routes
      await fs.writeFile(path.join(projectPath, 'src/routes/routes.json'), '[]');

  

      // Copy essential files and directories
      safeCopySync(path.resolve(__dirname, './core_modules'), path.join(projectPath, 'core_modules'));
      safeCopySync(templateDirectory, projectPath);

      // Copy specific template files
      await copyIfExists(path.join(templateDirectory, 'Button.smq'), path.join(projectPath, 'src/components/global/Button.smq'));
      await copyIfExists(path.join(templateDirectory, 'Count.smq'), path.join(projectPath, 'src/components/global/Count.smq'));
      await copyIfExists(path.join(templateDirectory, '+404.smq'), path.join(projectPath, 'src/routes/+404.smq'));

      // Create empty routes.js
      await fs.writeFile(path.join(projectPath, 'build/routes/routes.js'), 'export default [];');

      // Copy config files
      ['package.json', 'tsconfig.json', 'vite.config.js'].forEach(file =>
        safeCopySync(path.join(configDirectory, file), path.join(projectPath, file))
      );

      // Install dependencies
      console.log('Installing dependencies...');
      execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
      execSync('npm install --save-dev vite@latest vite-plugin-html@latest', { cwd: projectPath, stdio: 'inherit' });

      console.log(`✅ Project structure generated successfully at ${projectPath}`);
      console.log(`Now you can run this command to go to ${projectName} project directory: cd ${projectName}`);

    } catch (error) {
      console.error('❌ Error generating project:', error.message);
      console.error('Stack trace:', error.stack);
    }
  });

// ===============================
//  INSTALL TAILWIND COMMAND
// ===============================

program
  .command('install:tailwind')
  .description('Install and configure Tailwind CSS for Semantq')
  .action(() => {
    try {
      console.log('📦 Installing Tailwind CSS and dependencies...');

      // Step 1: Install Tailwind CSS, PostCSS, and Autoprefixer
      execSync('npm install -D tailwindcss postcss autoprefixer', { stdio: 'inherit' });

      // Step 2: Install Vite and PostCSS for Vite
      execSync('npm install -D vite postcss tailwindcss', { stdio: 'inherit' });

      // Step 3: Initialize Tailwind CSS
      execSync('npx tailwindcss init -p', { stdio: 'inherit' });

      // Step 4: Create or update vite.config.js
      const viteConfigPath = path.join(process.cwd(), 'vite.config.js');
      const viteConfigContent = `import { defineConfig } from 'vite';
import postcss from 'postcss';

export default defineConfig({
  css: {
    postcss
  }
});`;

      fs.writeFileSync(viteConfigPath, viteConfigContent);
      console.log('✅ Created/updated vite.config.js');

      // Step 5: Append Tailwind directives to global.css
      const globalCSSPath = path.join(process.cwd(), 'global.css');
      const tailwindDirectives = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`;

      if (fs.existsSync(globalCSSPath)) {
        fs.appendFileSync(globalCSSPath, tailwindDirectives);
        console.log('✅ Appended Tailwind directives to global.css');
      } else {
        fs.writeFileSync(globalCSSPath, tailwindDirectives);
        console.log('✅ Created global.css with Tailwind directives');
      }

      console.log('🎉 Tailwind CSS installed and configured successfully!');
    } catch (error) {
      console.error('❌ Error installing Tailwind CSS:', error.message);
    }
  });

// ===============================
//  CREATE ROUTE COMMAND
// ===============================
program
  .command('make:route <routeName>')
  .description('Create a new route in src/routes')
  .action((routeName) => {
    const routesDir = path.join(process.cwd(), 'src/routes');
    const routePath = path.join(routesDir, routeName);

    try {
      if (!fs.existsSync(routesDir)) {
        fs.mkdirSync(routesDir, { recursive: true });
      }

      if (fs.existsSync(routePath)) {
        console.warn(`⚠️ Route '${routeName}' already exists.`);
        return;
      }

      fs.mkdirSync(routePath, { recursive: true });

      // Create necessary files
      fs.writeFileSync(path.join(routePath, '+page.smq'), '// Page logic here', 'utf-8');
      //fs.writeFileSync(path.join(routePath, '+layout.smq'), '// Layout logic here', 'utf-8');
      //fs.writeFileSync(path.join(routePath, '+server.js'), '// Server-side logic here\nmodule.exports = {};', 'utf-8');

      console.log(`✅ Route '${routeName}' created successfully!`);
    } catch (error) {
      console.error(`❌ Error creating route '${routeName}':`, error.message);
    }
  });

// Parse CLI arguments
program.parse(process.argv);
