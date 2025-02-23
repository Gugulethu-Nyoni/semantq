#!/usr/bin/env node
import { program } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

//import packageJson from './package.json' assert { type: 'json' };
// Read package.json without import assertions
//import { generateResource } from './cli-utils.js';
import { generateResource, generateModel, generateService, generateController, generateRoute } from './cli-utils.js';



// Get the current module's filename and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = __dirname;


// Use the absolute path to reference package.json
const packageJsonPath = path.join(__dirname, 'package.json');
// Read and parse the package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
// Now resolve the paths as usual
//const baseDir = baseDir;
//const templateDirectory = path.join(baseDir, 'templates');
//const coreModulesDirectory = path.join(baseDir, 'core_modules');
//const configsDirectory = path.join(baseDir, 'configs');



// Register the 'make:resource' command
program
  .command('make:resource <name>')
  .description('Generate a full resource (model, service, controller, and routes)')
  .option('-a, --adapter <adapter>', 'Specify the database adapter (mongo or supabase)', 'mongo')
  .action((name, options) => {
    generateResource(name, options.adapter);
  });

// Register the 'make:model' command
program
  .command('make:model <name>')
  .description('Generate a model')
  .option('-a, --adapter <adapter>', 'Specify the database adapter (mongo or supabase)', 'mongo')
  .action((name, options) => {
    generateModel(name, options.adapter);
  });

// Register the 'make:service' command
program
  .command('make:service <name>')
  .description('Generate a service')
  .option('-a, --adapter <adapter>', 'Specify the database adapter (mongo or supabase)', 'mongo')
  .action((name, options) => {
    generateService(name, options.adapter);
  });

// Register the 'make:controller' command
program
  .command('make:controller <name>')
  .description('Generate a controller')
  .action((name) => {
    generateController(name);
  });

// Register the 'make:route' command
program
  .command('make:route <name>')
  .description('Generate a route')
  .action((name) => {
    generateRoute(name);
  });


// Register the 'install:server' command
program
  .command('install:server')
  .description('Create the server directory and initialize server.js')
  .action(() => {
    const serverDir = path.join(baseDir, 'server');
    const serverFilePath = path.join(serverDir, 'server.js');

    // Create the server directory if it doesn't exist
    if (!fs.existsSync(serverDir)) {
      fs.mkdirSync(serverDir, { recursive: true });
      console.log(`✅ Created directory: ${serverDir}`);
    }

    // Write the server.js file
    const serverCode = `
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;
const baseDir = path.dirname(fileURLToPath(baseDir));

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





// Register the 'install:supabase' command
program
  .command('install:supabase')
  .description('Install Supabase and set up configuration')
  .action(() => {
    // Step 1: Install @supabase/supabase-js
    console.log('Installing @supabase/supabase-js...');
    try {
      execSync('npm install @supabase/supabase-js', { stdio: 'inherit' });
      console.log('✅ Successfully installed @supabase/supabase-js');
    } catch (error) {
      console.error('❌ Failed to install @supabase/supabase-js:', error);
      process.exit(1);
    }


    try {
      execSync('npm install dotenv', { stdio: 'inherit' });
      console.log('✅ dotenv installed succesfully!');
    } catch (error) {
      console.error('❌ Failed to install dotenv:', error);
      process.exit(1);
    }




    // Step 2: Create lib/supabaseConfig.js
    const libDir = path.join(baseDir, 'lib');
    const supabaseConfigPath = path.join(libDir, 'supabaseConfig.js');

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
    console.log('👉 Make sure that you have the correct .env set up for your SUPABASE_URL and  SUPABASE_ANON_KEY in the .env file. It is recommended to save your .env file in the root of your project.');

  });






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



// Utility function to copy files and directories if they exist
/*
const copyIfExists = async (source, destination) => {
  try {
    const stats = await fs.promises.stat(source);

    if (stats.isDirectory()) {
      // Handle directory: ensure destination exists and recursively copy files
      await fs.promises.mkdir(destination, { recursive: true });

      const files = await fs.promises.readdir(source);
      for (const file of files) {
        const currentSource = path.join(source, file);
        const currentDestination = path.join(destination, file);
        await copyIfExists(currentSource, currentDestination);
      }
    } else if (stats.isFile()) {
      // Handle file: simply copy it
      await fs.promises.copyFile(source, destination);
      //console.log(`Copied: ${source} to ${destination}`);
    }
  } catch (error) {
    console.warn(`Warning: ${source} does not exist, skipping. Error: ${error.message}`);
  }
};
*/

// ===============================
//  CREATE NEW PROJECT COMMAND
// ===============================
program
  .command('create <projectName>')
  .description('Generate the project structure')
  .action(async (projectName) => {
    const projectPath = path.join(baseDir, projectName);
    const templateDirectory = path.join(baseDir, 'templates');
    const configDirectory = path.join(baseDir, 'configs');

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
      const declaredRoutes = "const declaredRoutes = [\n\n];\n\nexport default declaredRoutes;";
      await fs.writeFile(path.join(projectPath, 'src/routes/routes.js'), declaredRoutes);

  

      // Copy essential files and directories
      safeCopySync(path.resolve(baseDir, './core_modules'), path.join(projectPath, 'core_modules'));
      //safeCopySync(templateDirectory, projectPath);

            // Copy specific template files
      await copyIfExists(path.join(templateDirectory, 'index.html'), path.join(projectPath, 'index.html'));
      await copyIfExists(path.join(templateDirectory, 'global.js'), path.join(projectPath, 'global.js'));
      await copyIfExists(path.join(templateDirectory, 'global.css'), path.join(projectPath, 'global.css'));


      // Copy specific template files
      await copyIfExists(path.join(templateDirectory, 'Button.smq'), path.join(projectPath, 'src/components/global/Button.smq'));
      await copyIfExists(path.join(templateDirectory, 'Count.smq'), path.join(projectPath, 'src/components/global/Count.smq'));
      await copyIfExists(path.join(templateDirectory, '+404.smq'), path.join(projectPath, 'src/routes/+404.smq'));
      
      // copy the public route
      safeCopySync(path.resolve(baseDir, './templates/public'), path.join(projectPath, 'public'));

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

      // Step 1: Install Tailwind CSS v3, PostCSS, and Autoprefixer
      execSync('npm install -D tailwindcss@3 postcss autoprefixer', { stdio: 'inherit' });

      // Step 2: Initialize Tailwind CSS
      execSync('npx tailwindcss init -p', { stdio: 'inherit' });

      // Step 3: Configure Tailwind’s Content Paths in tailwind.config.js
      const tailwindConfigPath = path.join(baseDir, 'tailwind.config.js');
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
      const viteConfigPath = path.join(baseDir, 'vite.config.js');
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
      const globalCSSPath = path.join(baseDir, 'global.css');
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
//  CREATE ROUTE COMMAND
// ===============================
program
  .command('make:route <routeName>')
  .description('Create a new route in src/routes')
  .action((routeName) => {
    const routesDir = path.join(baseDir, 'src/routes');
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
