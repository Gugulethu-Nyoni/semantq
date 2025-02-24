#!/usr/bin/env node
import { program } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Import utility functions
import { generateResource, generateModel, generateService, generateController, generateRoute } from './cli-utils.js';

// Get the current module's filename and directory (sourceBaseDir)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceBaseDir = __dirname; // Directory of the semantq npm package

// Read package.json from the source directory
const packageJsonPath = path.join(sourceBaseDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Set the version from package.json
program.version(packageJson.version, '-v, --version', 'Output the current version of semantq');

// Utility function to resolve paths relative to the source or target directory
const resolvePath = (baseDir, ...paths) => path.resolve(baseDir, ...paths);

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
//  MAKE:RESOURCE COMMAND
// ===============================
program
  .command('make:resource <name>')
  .description('Generate a full resource (model, service, controller, and routes)')
  .option('-a, --adapter <adapter>', 'Specify the database adapter (mongo or supabase)', 'mongo')
  .action((name, options) => {
    generateResource(name, options.adapter, process.cwd()); // Pass targetBaseDir
  });

// ===============================
//  MAKE:MODEL COMMAND
// ===============================
program
  .command('make:model <name>')
  .description('Generate a model')
  .option('-a, --adapter <adapter>', 'Specify the database adapter (mongo or supabase)', 'mongo')
  .action((name, options) => {
    generateModel(name, options.adapter, process.cwd()); // Pass targetBaseDir
  });

// ===============================
//  MAKE:SERVICE COMMAND
// ===============================
program
  .command('make:service <name>')
  .description('Generate a service')
  .option('-a, --adapter <adapter>', 'Specify the database adapter (mongo or supabase)', 'mongo')
  .action((name, options) => {
    generateService(name, options.adapter, process.cwd()); // Pass targetBaseDir
  });

// ===============================
//  MAKE:CONTROLLER COMMAND
// ===============================
program
  .command('make:controller <name>')
  .description('Generate a controller')
  .action((name) => {
    generateController(name, process.cwd()); // Pass targetBaseDir
  });

// ===============================
//  MAKE:ROUTE COMMAND
// ===============================
program
  .command('make:apiRoute <name>')
  .description('Generate a route')
  .action((name) => {
    generateRoute(name, process.cwd()); // Pass targetBaseDir
  });

// ===============================
//  INSTALL:SERVER COMMAND
// ===============================
program
  .command('install:server')
  .description('Create the server directory and initialize server.js')
  .action(() => {
    const targetBaseDir = process.cwd(); // Use the current working directory as the target
    const serverDir = resolvePath(targetBaseDir, 'server');
    const serverFilePath = resolvePath(serverDir, 'server.js');

    // Create the server directory if it doesn't exist
    if (!fs.existsSync(serverDir)) {
      fs.mkdirSync(serverDir, { recursive: true });
      console.log(`✅ Created directory: ${serverDir}`);
    }

    // Write the server.js file
    const serverCode = `
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;
const baseDir = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(express.json());

// 🔄 Automatically load all routes from the \`routes\` folder
const routesPath = path.join(baseDir, 'routes');
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith('Routes.js')) {
    const route = \`./routes/\${file}\`;
    import(route).then((module) => {
      const routeName = file.replace('Routes.js', '').toLowerCase();
      app.use(\`/api/\${routeName}\`, module.default);
      console.log(\`✅ Loaded route: /api/\${routeName}\`);
    }).catch((err) => console.error(\`❌ Failed to load \${file}:\`, err));
  }
});

// Default route
app.get('/', (req, res) => res.send('API is running 🚀'));

// Start server
app.listen(PORT, () => console.log(\`🟢 Server running on port \${PORT}\`));
`;

    fs.writeFileSync(serverFilePath, serverCode.trim());
    console.log(`✅ Server created file successfully. Now you can create resources for your database or api driven apps.`);
  });

// ===============================
//  INSTALL:SUPABASE COMMAND
// ===============================
program
  .command('install:supabase')
  .description('Install Supabase and set up configuration')
  .action(() => {
    const targetBaseDir = process.cwd(); // Use the current working directory as the target

    // Step 1: Install @supabase/supabase-js
    console.log('Installing @supabase/supabase-js...');
    try {
      execSync('npm install @supabase/supabase-js', { cwd: targetBaseDir, stdio: 'inherit' });
      console.log('✅ Successfully installed @supabase/supabase-js');
    } catch (error) {
      console.error('❌ Failed to install @supabase/supabase-js:', error);
      process.exit(1);
    }

    // Step 2: Install dotenv
    try {
      execSync('npm install dotenv', { cwd: targetBaseDir, stdio: 'inherit' });
      console.log('✅ dotenv installed successfully!');
    } catch (error) {
      console.error('❌ Failed to install dotenv:', error);
      process.exit(1);
    }

    // Step 3: Create lib/supabaseConfig.js
    const libDir = resolvePath(targetBaseDir, 'lib');
    const supabaseConfigPath = resolvePath(libDir, 'supabaseConfig.js');

    // Create the lib directory if it doesn't exist
    if (!fs.existsSync(libDir)) {
      fs.mkdirSync(libDir, { recursive: true });
      console.log(`✅ Created directory: ${libDir}`);
    }

    // Write the supabaseConfig.js file
    const supabaseConfigCode = `
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
`;

    fs.writeFileSync(supabaseConfigPath, supabaseConfigCode.trim());
    console.log(`✅ Created file: ${supabaseConfigPath}`);

    console.log('🟢 Supabase setup complete!');
    console.log('👉 Make sure that you have the correct .env set up for your SUPABASE_URL and SUPABASE_ANON_KEY in the root of your project.');
  });

// ===============================
//  CREATE NEW PROJECT COMMAND
// ===============================
program
  .command('create <projectName>')
  .description('Generate the project structure')
  .action(async (projectName) => {
    const targetBaseDir = resolvePath(process.cwd(), projectName); // Target directory where the project is created
    const templateDirectory = resolvePath(sourceBaseDir, 'templates');
    const configDirectory = resolvePath(sourceBaseDir, 'configs');

    try {
      // Define directories to create in the target project
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
      await Promise.all(directories.map(dir => fs.mkdir(resolvePath(targetBaseDir, dir), { recursive: true })));

      // Create empty routes.json in src/routes
      const declaredRoutes = "const declaredRoutes = [\n\n];\n\nexport default declaredRoutes;";
      await fs.writeFile(resolvePath(targetBaseDir, 'src/routes/routes.js'), declaredRoutes);

      // Copy essential files and directories from semantq to the target project
      safeCopySync(resolvePath(sourceBaseDir, 'core_modules'), resolvePath(targetBaseDir, 'core_modules'));

      // Copy specific template files
      await copyIfExists(resolvePath(templateDirectory, 'index.html'), resolvePath(targetBaseDir, 'index.html'));
      await copyIfExists(resolvePath(templateDirectory, 'global.js'), resolvePath(targetBaseDir, 'global.js'));
      await copyIfExists(resolvePath(templateDirectory, 'global.css'), resolvePath(targetBaseDir, 'global.css'));
      await copyIfExists(resolvePath(templateDirectory, 'Button.smq'), resolvePath(targetBaseDir, 'src/components/global/Button.smq'));
      await copyIfExists(resolvePath(templateDirectory, 'Count.smq'), resolvePath(targetBaseDir, 'src/components/global/Count.smq'));
      await copyIfExists(resolvePath(templateDirectory, '+404.smq'), resolvePath(targetBaseDir, 'src/routes/+404.smq'));

      // Copy the public directory
      safeCopySync(resolvePath(sourceBaseDir, 'templates/public'), resolvePath(targetBaseDir, 'public'));

      // Create empty routes.js in build/routes
      await fs.writeFile(resolvePath(targetBaseDir, 'build/routes/routes.js'), 'export default [];');

      // Copy config files
      ['package.json', 'tsconfig.json', 'vite.config.js'].forEach(file =>
        safeCopySync(resolvePath(configDirectory, file), resolvePath(targetBaseDir, file))
      );

      // Install dependencies in the target project
      console.log('Installing dependencies...');
      execSync('npm install', { cwd: targetBaseDir, stdio: 'inherit' });
      execSync('npm install --save-dev vite@latest vite-plugin-html@latest', { cwd: targetBaseDir, stdio: 'inherit' });

      console.log(`✅ Project structure generated successfully at ${targetBaseDir}`);
      console.log(`Now you can run this command to go to ${projectName} project directory: cd ${projectName}`);
    } catch (error) {
      console.error('❌ Error generating project:', error.message);
      console.error('Stack trace:', error.stack);
    }
  });

// ===============================
//  INSTALL:TAILWIND COMMAND
// ===============================
program
  .command('install:tailwind')
  .description('Install and configure Tailwind CSS for Semantq')
  .action(() => {
    const targetBaseDir = process.cwd(); // Use the current working directory as the target

    try {
      console.log('📦 Installing Tailwind CSS and dependencies...');

      // Step 1: Install Tailwind CSS v3, PostCSS, and Autoprefixer
      execSync('npm install -D tailwindcss@3 postcss autoprefixer', { cwd: targetBaseDir, stdio: 'inherit' });

      // Step 2: Initialize Tailwind CSS
      execSync('npx tailwindcss init -p', { cwd: targetBaseDir, stdio: 'inherit' });

      // Step 3: Configure Tailwind’s Content Paths in tailwind.config.js
      const tailwindConfigPath = resolvePath(targetBaseDir, 'tailwind.config.js');
      const tailwindConfigContent = `export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html,smq}"],
  theme: {
    extend: {},
  },
  plugins: [],
};`;

      fs.writeFileSync(tailwindConfigPath, tailwindConfigContent);
      console.log('✅ Configured content paths in tailwind.config.js');

      // Step 4: Create or update vite.config.js
      const viteConfigPath = resolvePath(targetBaseDir, 'vite.config.js');
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
      const globalCSSPath = resolvePath(targetBaseDir, 'global.css');
      const tailwindDirectives = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`;

      if (fs.existsSync(globalCSSPath)) {
        // Read the existing content
        const existingContent = fs.readFileSync(globalCSSPath, 'utf-8');
        
        // Write Tailwind directives at the top and append the existing content
        fs.writeFileSync(globalCSSPath, tailwindDirectives + existingContent);
        console.log('✅ Appended Tailwind directives to the top of global.css');
      } else {
        // Create global.css with Tailwind directives if it doesn't exist
        fs.writeFileSync(globalCSSPath, tailwindDirectives);
        console.log('✅ Created global.css with Tailwind directives');
      }

      console.log('🎉 Tailwind CSS installed and configured successfully!');
    } catch (error) {
      console.error('❌ Error installing Tailwind CSS:', error.message);
    }
  });

// ===============================
//  MAKE:ROUTE COMMAND
// ===============================
program
  .command('make:route <routeName>')
  .description('Create a new route in src/routes')
  .action((routeName) => {
    const targetBaseDir = process.cwd(); // Use the current working directory as the target
    const routesDir = resolvePath(targetBaseDir, 'src/routes');
    const routePath = resolvePath(routesDir, routeName);

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
    const pageContent = `@script

    @end

    @style

    @end

    @html`;

    fs.writeFileSync(resolvePath(routePath, '+page.smq'), pageContent, 'utf-8');
      console.log(`✅ Route '${routeName}' created successfully!`);
    } catch (error) {
      console.error(`❌ Error creating route '${routeName}':`, error.message);
    }
  });

// Parse CLI arguments
program.parse(process.argv);