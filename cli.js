#!/usr/bin/env node
import { program } from 'commander';
import fs from 'fs-extra'; // fs-extra is imported as fs
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url'; 
import dotenv from 'dotenv';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora'; // Import ora for spinners
import degit from 'degit'; // Import degit for cloning repos
import archiver from 'archiver';
import { format } from 'date-fns';
import fetch from 'node-fetch';
import os from 'os'; // <--- Add this line

// Load environment variables from .env file
dotenv.config();


// Icons
// Color palette
const purple = chalk.hex('#b56ef0');
const purpleBright = chalk.hex('#d8a1ff');
const blue = chalk.hex('#6ec7ff');
const green = chalk.hex('#6ef0b5');
const yellow = chalk.hex('#f0e66e');
const errorRed = chalk.hex('#ff4d4d');
const gray = chalk.hex('#aaaaaa');
const cyan = chalk.hex('#6ef0e6');




// Icons
const SUCCESS_ICON = green('✓');
const WARNING_ICON = yellow('⚠');
const ERROR_ICON = errorRed('✗');
const INFO_ICON = blue('ℹ');
const FOLDER_ICON = purple('📁');
const FILE_ICON = cyan('📄');
const ROCKET_ICON = purpleBright('🚀');
const SPARKLES_ICON = purple('✨');


// Import utility functions (ensure these are available in ./cli-utils.js)
// Assuming these are for resource generation, not directly used in the fullstack setup chain
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
// EXTRACTED: INSTALL SERVER LOGIC
// ===============================
// Extracted function for installing the Semantq server
async function installSemantqServer(targetBaseDir) {
  const serverDir = path.join(targetBaseDir, 'semantqQL');
  const repoURL = 'https://github.com/Gugulethu-Nyoni/semantqQL.git';

  try {
    // Check if semantqQL already exists
    try {
      await fs.access(serverDir);
      console.error(errorRed(`✖ Directory 'semantqQL' already exists in this project.`));
      console.log(chalk.yellow(`› Remove it or rename it before running this command.`));
      return false; // Indicate that installation was skipped due to existing directory
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err; // Re-throw other errors
      }
      // Directory does not exist, which is what we want, so continue
    }

    const spinner = ora(blue(`Cloning Semantq server package into ${purple('semantqQL/')}`)).start();

    // Clone using degit
    const emitter = degit(repoURL, { cache: false, force: true });
    await emitter.clone(serverDir);

    spinner.succeed(blue(`✓ Semantq server installed at ${purple('semantqQL/')}`));

    // Install dependencies in the new server directory
    console.log(blue(`Installing dependencies in ${purple('semantqQL/')}`));
    execSync('npm install --silent --no-audit --no-fund', { cwd: serverDir, stdio: 'inherit' });

    console.log(blue(`✓ Server dependencies installed successfully.`));

    // --- IMPORTANT ADDITION FOR PERMISSIONS ---
    const initScriptPath = path.join(serverDir, 'bin', 'init.js');
    console.log(blue(`Setting execute permissions for ${purple('bin/init.js')}`));
    try {
      execSync(`chmod +x ${initScriptPath}`, { stdio: 'pipe' });
      console.log(blue(`✓ Permissions set successfully for bin/init.js.`));
    } catch (permissionError) {
      console.warn(chalk.yellow(`⚠️ Could not set execute permissions for init.js: ${permissionError.message}`));
      console.warn(chalk.yellow(`   You might need to run 'chmod +x ${initScriptPath}' manually.`));
    }
    // --- END IMPORTANT ADDITION ---
    return true; // Indicate success
  } catch (error) {
    console.error(errorRed(`✖ Failed to install Semantq server: ${error.message}`));
    throw error; // Re-throw to be caught by the calling command
  }
}

// ===============================
// EXTRACTED: ADD AUTH UI LOGIC
// ===============================
// Extracted function for adding the Semantq Auth UI
async function addSemantqAuthUI(projectRoot) {
  const tempDir = path.join(projectRoot, '.semantq_temp_auth_ui');
  const repoUrl = 'https://github.com/Gugulethu-Nyoni/semantq_auth_ui.git';

  try {
    console.log(blue('📥 Cloning semantq_auth_ui from GitHub...'));
    execSync(`git clone ${repoUrl} ${tempDir}`, { stdio: 'inherit' });

    // Copy public/* → projectRoot/public
    const srcPublic = path.join(tempDir, 'public');
    const destPublic = path.join(projectRoot, 'public');
    await fs.copy(srcPublic, destPublic, { overwrite: true });
    console.log(blue('✓ Copied public assets to /public'));

    // Copy routes/* → projectRoot/src/routes
    const srcRoutes = path.join(tempDir, 'routes');
    const destRoutes = path.join(projectRoot, 'src', 'routes');
    await fs.copy(srcRoutes, destRoutes, { overwrite: true });
    console.log(blue('✓ Copied route files to /src/routes'));

    // Copy components/* → projectRoot/src/components
    const srcComponents = path.join(tempDir, 'components');
    const destComponents = path.join(projectRoot, 'src', 'components');
    await fs.copy(srcComponents, destComponents, { overwrite: true });
    console.log(blue('✓ Copied component files to /src/components'));

    // Clean up
    await fs.remove(tempDir);
    console.log(gray('🧹 Removed temporary directory'));

    console.log(purpleBright('\n✨ Semantq Auth UI installed successfully!\n'));
    return true; // Indicate success
  } catch (err) {
    console.error(errorRed('✖ Installation failed:'), err.message);
    throw err; // Re-throw to be caught by the calling command
  }
}

// ===============================
// CREATE NEW PROJECT COMMAND
// ===============================
program
  .command('create <projectName>')
  .description('Generate the project structure')
  .option('-fs, --fullstack', 'Install full stack setup (client + server + auth)')
  .action(async (projectName, options) => {
    const targetBaseDir = resolvePath(process.cwd(), projectName); // Target directory where the project is created
    const templateDirectory = resolvePath(sourceBaseDir, 'templates');
    const configDirectory = resolvePath(sourceBaseDir, 'configs');

    try {
      console.log(`${purpleBright('🚀')} ${blue('Creating Semantq project:')} ${purple(projectName)}`);

      // Define directories to create in the target project
      const directories = [
        'src/components/global',
        'src/routes',
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
      
      // NEW: Copy global.css and global.js to project root
      await copyIfExists(resolvePath(templateDirectory, 'global.css'), resolvePath(targetBaseDir, 'global.css'));
      await copyIfExists(resolvePath(templateDirectory, 'global.js'), resolvePath(targetBaseDir, 'global.js'));

      // NEW: Copy 404.smq page from templates/404/@page.smq to project's src/routes/404/@page.smq
      const notFoundPageSource = resolvePath(templateDirectory, '404/@page.smq');
      const notFoundPageTarget = resolvePath(targetBaseDir, 'src/routes/404/@page.smq');
      await fs.ensureDir(resolvePath(targetBaseDir, 'src/routes/404')); // Ensure the 404 directory exists
      await copyIfExists(notFoundPageSource, notFoundPageTarget);
      // PLACE (Copy) the router into src/semantq/router.js
      const sourceFile = path.resolve(sourceBaseDir, 'core_modules', 'router', 'router.js');
      const targetDir = path.resolve(targetBaseDir, 'src', 'semantq');
      const targetFile = path.join(targetDir, 'router.js');

      // Ensure that the target directory exists
      fs.ensureDirSync(targetDir); // Creates the target directory if it doesn't exist

      // Copy the file from source to target
      fs.copySync(sourceFile, targetFile);

      // Copy the public directory recursively
      fs.copySync(resolvePath(sourceBaseDir, 'templates/public'), resolvePath(targetBaseDir, 'public'));

      // Copy the public directory recursively
      fs.copySync(resolvePath(sourceBaseDir, 'templates/components'), resolvePath(targetBaseDir, 'src/components'));

      // Copy config files
      ['semantq.config.js','package.json', 'tsconfig.json', 'vite.config.js'].forEach(file =>
        safeCopySync(resolvePath(configDirectory, file), resolvePath(targetBaseDir, file))
      );

      // Rest of the code remains the same...
      // Install dependencies in the target project
      console.log(`${purpleBright('📦')} ${blue('Installing project dependencies...')}`);
      // Install npm packages with suppressed warnings
      execSync('npm install --silent --no-warnings --no-audit --no-fund', { cwd: targetBaseDir, stdio: 'inherit' });
      // Install development dependencies with suppressed warnings
      execSync('npm install --save-dev --silent --no-warnings --no-audit --no-fund vite@latest vite-plugin-html@latest', { cwd: targetBaseDir, stdio: 'inherit' });

      // --- FULL STACK SETUP ---
      if (options.fullstack) {
        console.log(`${purpleBright('✨')} ${blue('Setting up full stack...')}`);

        // Step 1: Install server
        console.log(`${purpleBright('🖥️')} ${blue('Installing Semantq server...')}`);
        // Pass targetBaseDir to the extracted function
        const serverInstalled = await installSemantqServer(targetBaseDir);

        if (serverInstalled) {
          // Step 2: Install auth module in server
          const serverDir = path.join(targetBaseDir, 'semantqQL');
          console.log(`${purpleBright('🔐')} ${blue('Installing auth module in server:')} ${purple('@semantq/auth')}`);
          execSync('npm install @semantq/auth --silent --no-warnings --no-audit --no-fund', { cwd: serverDir, stdio: 'inherit' });
          console.log(`${purpleBright('✓')} ${blue('Auth module installed in server.')}`);

          // Step 3: Install auth UI in client
          console.log(`${purpleBright('🎨')} ${blue('Installing auth UI in client...')}`);
          // Pass targetBaseDir (project root) to the extracted function
          await addSemantqAuthUI(targetBaseDir);

          console.log(`${purpleBright('✓')} ${blue('Full stack setup complete!')}`);
          console.log(`
  ${purpleBright('» Next steps:')}
  ${purpleBright('›')} ${gray('Configure your auth settings in')} ${purple('semantqQL/semantq.config.js')}
  ${purpleBright('›')} ${gray('Run database migrations:')} ${purple('cd semantqQL && semantq migrate')}
  ${purpleBright('›')} ${gray('Start both client and server:')}
    ${purple('npm run dev')} ${gray('(in project root for client)')}
    ${purple('npm run dev')} ${gray('(in semantqQL for server)')}
`);
        } else {
            console.warn(chalk.yellow(`⚠️ Full stack setup partially completed due to existing server directory. Please check logs above.`));
        }
      } else {
        console.log(`${purpleBright('✓')} ${blue('Project structure generated successfully at')} ${purple(targetBaseDir)}`);
        console.log(`${gray('Now you can run this command to go to')} ${purple(projectName)} ${gray('project directory:')} ${blue(`cd ${projectName}`)}`);
      }
    } catch (error) {
      console.error(`${errorRed('✖')} ${blue('Error generating project:')} ${errorRed(error.message)}`);
      console.error(`${purpleBright('›')} ${gray('Stack trace:')} ${gray(error.stack)}`);
      process.exit(1);
    }
  });




// ===============================
//  ADD MODULE COMMAND
// ===============================
program
  .command('add <moduleName>')
  .description('Add a Semantq module (e.g., @semantq/auth) to your project')
  .action((moduleName) => { // No async needed if only execSync
    console.log(`${purpleBright('📦')} ${blue('Adding module:')} ${purple(moduleName)}${gray('...')}`);
    try {
      // Ensure it's a scoped @semantq module if that's the convention
      const fullModuleName = moduleName.startsWith('@semantq/') ? moduleName : `@semantq/${moduleName}`;
      const projectRoot = process.cwd(); // Ensure we're installing in the current project root

      // This command will run npm install in the current directory (project root)
      execSync(`npm install ${fullModuleName}`, { cwd: projectRoot, stdio: 'inherit' });

      console.log(`${purpleBright('✓')} ${blue('Module')} ${purple(fullModuleName)} ${blue('added successfully!')}`);
      console.log(`${gray('›')} ${blue('Remember to run')} ${purple('semantq migrate')} ${blue('to apply any new database migrations for the module.')}`);

    } catch (error) {
      console.error(`${errorRed('✖')} ${blue('Failed to add module')} ${errorRed(moduleName)}: ${errorRed(error.message)}`);
      // execSync will throw an error if the command fails, so we catch it
      process.exit(1);
    }
  });



//// ===============================
// INSTALL:TAILWIND COMMAND
// ===============================
program
  .command('install:tailwind')
  .description('Install and configure Tailwind CSS for Semantq')
  .action(() => {
    const targetBaseDir = process.cwd();

    try {
      console.log(`${purpleBright('📦')} ${blue('Installing')} ${purple('Tailwind CSS')} ${blue('and dependencies')}${gray('...')}`);
      
      // Step 1: Install Tailwind, PostCSS, and Autoprefixer
      execSync('npm install -D tailwindcss@3 postcss autoprefixer', { cwd: targetBaseDir, stdio: 'inherit' });

      // Step 2: Initialize Tailwind (creates tailwind.config.js and postcss.config.js)
      execSync('npx tailwindcss init -p', { cwd: targetBaseDir, stdio: 'inherit' });

      // Step 3: Write Tailwind config
      const tailwindConfigPath = resolvePath(targetBaseDir, 'tailwind.config.js');
      const tailwindConfigContent = `export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html,smq}"],
  theme: {
    extend: {},
  },
  plugins: [],
};`;
      fs.writeFileSync(tailwindConfigPath, tailwindConfigContent);
      console.log(`${purpleBright('✓')} ${blue('Configured content paths in')} ${purple('tailwind.config.js')}`);

      // Step 4: Inject postcss into existing vite.config.js
      const viteConfigPath = resolvePath(targetBaseDir, 'vite.config.js');
      if (fs.existsSync(viteConfigPath)) {
        const viteConfigOriginal = fs.readFileSync(viteConfigPath, 'utf-8');

        if (!viteConfigOriginal.includes('css:') && !viteConfigOriginal.includes('postcss')) {
          const injectedConfig = viteConfigOriginal.replace(
            /export default\s*{/, // naive match
            `export default {\n  css: {\n    postcss\n  },`
          );

          fs.writeFileSync(viteConfigPath, injectedConfig);
          console.log(`${purpleBright('✓')} ${blue('Injected PostCSS into existing')} ${purple('vite.config.js')}`);
        } else {
          console.log(`${yellow('⚠')} ${gray('vite.config.js already has css config — skipping injection.')}`);
        }
      } else {
        // Fall back to creating vite.config.js with basic Tailwind support
        const viteConfigContent = `import Inspect from 'vite-plugin-inspect';
import { sync } from 'glob';
import { resolve } from 'path';
import fse from 'fs-extra';
import postcss from 'postcss';

export default {
  plugins: [Inspect()],
  css: {
    postcss
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        ...Object.fromEntries(
          sync('./build/**/*.html'.replace(/\\\\/g, '/')).map((file) => [
            file.replace(/^\\.\\/build\\//, '').replace(/\\.html$/, ''),
            resolve(__dirname, file),
          ])
        ),
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
  },
  async closeBundle() {
    const buildDir = resolve(__dirname, 'build');
    const distDir = resolve(__dirname, 'dist');
    await fse.copy(buildDir, distDir, {
      overwrite: true,
      recursive: true,
      filter: (src) => !src.endsWith(buildDir),
    });
    console.log('Build files copied to dist root.');
  },
};`;
        fs.writeFileSync(viteConfigPath, viteConfigContent);
        console.log(`${purpleBright('✓')} ${blue('Created new')} ${purple('vite.config.js')} ${blue('with Tailwind and build settings')}`);
      }

      // Step 5: Create or update global.css
      const globalCSSPath = resolvePath(targetBaseDir, 'global.css');
      const tailwindDirectives = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`;

      if (fs.existsSync(globalCSSPath)) {
        const existingCSS = fs.readFileSync(globalCSSPath, 'utf-8');
        if (!existingCSS.includes('@tailwind')) {
          fs.writeFileSync(globalCSSPath, tailwindDirectives + existingCSS);
          console.log(`${purpleBright('✓')} ${blue('Prepended Tailwind directives to')} ${purple('global.css')}`);
        } else {
          console.log(`${yellow('⚠')} ${gray('Tailwind directives already exist in global.css — skipping.')}`);
        }
      } else {
        fs.writeFileSync(globalCSSPath, tailwindDirectives);
        console.log(`${purpleBright('✓')} ${blue('Created')} ${purple('global.css')} ${blue('with Tailwind directives')}`);
      }

      console.log(`${purpleBright('✨')} ${blue('Tailwind CSS installed and configured successfully!')}`);

    } catch (error) {
      console.error(`${errorRed('✖')} ${blue('Error installing Tailwind CSS:')} ${errorRed(error.message)}`);
    }
  });

// ===========================================
// MAKE:ROUTE COMMAND (Updated with Pylon support)
// ===========================================
program
  .command('make:route')
  .description('Create a new route with stylish feedback')
  .argument('<routeName>', 'Name of the route to create')
  .argument('[role]', 'Role for Pylon routes (optional)')
  .option('-l, --layout', 'Add layout file')
  .option('-c, --crud', 'Add CRUD operations')
  .option('-a, --auth', 'Add auth import to page template')
  .option('-s, --server', 'Add server handlers')
  .option('-A, --all', 'Create all resources at once')
  .option('--ac', 'Shortcut for both --auth and --crud')
  .option('-tw, --tailwind', 'Add Tailwind CSS support')
  .option('-p, --pylon', 'Create a Pylon route with role-based structure')
  .action(async (routeName, role, options) => {
    const { createSpinner } = await import('nanospinner');

    try {
      // Handle Pylon route creation
      if (options.pylon) {
        if (!role) {
          console.log(errorRed('Error: Pylon route requires a role. Use: semantq make:route plan project-manager --pylon'));
          return;
        }
        
        // Apply -A (all) flag logic to Pylon routes
        if (options.all) {
          options.layout = true;
          options.server = true;
        }
        
        await createPylonRoute(routeName, role, options);
        return;
      }

      // If role is provided without --pylon flag, show error
      if (role) {
        console.log(errorRed('Error: Role specified but --pylon flag missing. Use: semantq make:route plan project-manager --pylon'));
        return;
      }

      // Existing regular route creation logic
      const routePath = resolvePath(process.cwd(), 'src/routes', routeName);

      if (fs.existsSync(routePath)) {
        const spinner = createSpinner(purple(`Checking route ${routeName}...`)).start();
        spinner.error({ text: errorRed('Route already exists!') });
        return;
      }

      // Handle shortcut options for regular routes
      if (options.ac) {
        options.auth = true;
        options.crud = true;
      }

      if (options.all) {
        options.layout = true;
        options.server = true;
      }

      // Create directory
      const dirSpinner = createSpinner(purple('Creating route structure...')).start();
      fs.mkdirSync(routePath, { recursive: true });
      dirSpinner.success({ text: purpleBright('Route directory created') });

      // Base template with conditional imports
      let basePageTemplate = `@script\n`;
      
      if (options.auth) {
        basePageTemplate += `import { isAuthenticated, user, accessLevel, logout } from '/public/auth/js/auth.js';\n`;
      }
      
      if (options.crud) {
        basePageTemplate += `import { smQL, Form, Notification } from '@semantq/ql';\n`;
        basePageTemplate += `import Formique from '@formique/semantq';\n`;
        basePageTemplate += `import AnyGrid from 'anygridjs';\n`;
        basePageTemplate += `import AppConfig from '/public/auth/js/config.js';\n`;
        basePageTemplate += `const baseUrl = AppConfig.BASE_URL;\n`;
        basePageTemplate += `const baseOrigin = new URL(baseUrl).origin;\n\n`;
        basePageTemplate += `const api = new smQL(\`\${baseOrigin}\`);\n\n`;
        
        basePageTemplate += `// CRUD Operations\n`;
        basePageTemplate += `// GET for LISTS - many records \n`;
        basePageTemplate += `// const response = await api.get(\`\${baseOrigin}/product/products\`);\n\n`;
        basePageTemplate += `// const productsData = api.getData(response);\n\n`;

        basePageTemplate += `// POST - CREATE \n`;
        basePageTemplate += `// const newCategory = { name: 'Mobiles' }; \n`;
        basePageTemplate += `// const response = await api.post(\`\${baseOrigin}/category/categories\`, newCategory);\n\n`;

        basePageTemplate += `// PUT — Update \n`;
        basePageTemplate += `// const updatedCategory = { name: 'Mobile Phones' }; \n`;
        basePageTemplate += `// const response = await api.put(\`\${baseOrigin}/category/categories/\${categoryId}\`, updatedCategory);\n\n`;

        basePageTemplate += `// DELETE \n`;
        basePageTemplate += `// const productId = 42; \n`;
        basePageTemplate += `// const response = await api.delete(\`\${baseOrigin}/product/products/\${productId}\`, { log: false });\n`;
      } else if (options.auth) {
        basePageTemplate += `// See complete smQL docs here: https://github.com/Gugulethu-Nyoni/smQL \n\n`;
      }
      
      if (options.tailwind) {
        basePageTemplate += `import '../../../global.css';\n\n`;
      }
      basePageTemplate += `@end\n\n@style\n\n@end\n\n@html\n ${routeName} Page\n`;

      // Layout content
      const layoutContent = options.crud ? 
        `@head\n` +
        `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />\n` +
        `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />\n` +
        `<link rel="stylesheet" href="https://unpkg.com/formique-css@1.0.13/formique-css.css" />\n` +
        `<link rel="stylesheet" href="https://unpkg.com/anygridcss@1.0.4/anyGrid.css" />\n` +
        `@end\n` +
        `@body\n\n@end\n` +
        `@footer\n\n@end\n`
      : 
        `@head\n@end\n` +
        `@body\n\n@end\n` +
        `@footer\n\n@end\n`;

      // Define files to create
      const files = {
        '@page.smq': basePageTemplate,
        '@layout.smq': options.layout ? layoutContent : null,
        'server.js': options.server ? `export default {\n  get() { /* ... */ }` + 
          (options.crud ? `,\n  post() { /* ... */ },\n  put() { /* ... */ },\n  delete() { /* ... */ }` : '') + 
          `\n};` : null
      };

      // File creation with visual feedback
      for (const [filename, content] of Object.entries(files)) {
        if (content) {
          const spinner = createSpinner(purple(`Creating ${filename}`)).start();
          await new Promise(resolve => setTimeout(resolve, 200));
          fs.writeFileSync(resolvePath(routePath, filename), content.trim());
          spinner.success({
            text: `${purpleBright('✓')} ${purple(filename)} ${blue('created')}`
          });
        }
      }

      // Enhanced success message
      console.log(`
${purple.bold('» Route created successfully!')}

${purpleBright.bold('Files created:')}
${purpleBright('•')} ${purple('@page.smq')} ${gray('(base template)')} 
${options.auth ? `${purpleBright('  →')} ${gray('With auth support')}\n` : ''}
${options.crud ? `${purpleBright('  →')} ${gray('With CRUD operations')}\n` : ''}
${options.tailwind ? `${purpleBright('  →')} ${gray('With Tailwind CSS support')}\n` : ''}
${options.layout ? `${purpleBright('•')} ${purple('@layout.smq')}` : ''}
${options.server ? `${purpleBright('•')} ${purple('server.js')}` : ''}

${blue.italic('Next steps:')}
  ${purpleBright('›')} Go to ${purple(routeName)} to edit your route files
  ${options.auth ? `${purpleBright('›')} Configure auth in ${purple('/public/auth/js/auth.js')}\n` : ''}
  ${options.crud ? `${purpleBright('›')} Implement CRUD functions in ${purple('@page.smq')}\n` : ''}
  ${options.crud && !options.auth ? `${purpleBright('›')} ${gray('Add appropriate security to your public CRUD endpoints')}\n` : ''}
  ${options.tailwind ? `${purpleBright('›')} Ensure ${purple('global.css')} contains Tailwind directives\n` : ''}
  ${options.tailwind ? `${purpleBright('›')} ${gray('Make sure Tailwind is installed:')} ${purple('semantq install:tailwind')}\n` : ''}
  ${purpleBright('›')} Then run ${purple('npm run dev')} to test
`);

    } catch (error) {
      console.log(`
${errorRed('✖ Error:')} ${error.message}

${blue('Troubleshooting:')}
  ${purpleBright('›')} Check directory permissions
  ${purpleBright('›')} Verify disk space
  ${options.tailwind ? `${purpleBright('›')} Ensure Tailwind is properly configured in your project\n` : ''}
  ${options.tailwind ? `${purpleBright('›')} Install Tailwind with ${purple('semantq install:tailwind')}\n` : ''}
`);
      process.exit(1);
    }
  });



// ===========================================
// PYLON ROUTE CREATION FUNCTION
// ===========================================
async function createPylonRoute(routeName, role, options) {
  const { createSpinner } = await import('nanospinner');
  
  try {
    // Convert route name to proper formats
    const routeDirName = routeName.toLowerCase(); 
    const componentName = pylonToPascalCase(routeName);
    
    // Create role-based directory structure
    const rolePath = resolvePath(process.cwd(), 'src/routes', role);
    const routePath = resolvePath(rolePath, routeDirName);
    
    // Check if route already exists
    if (fs.existsSync(routePath)) {
      const spinner = createSpinner(purple(`Checking route ${role}/${routeDirName}...`)).start();
      spinner.error({ text: errorRed('Route already exists!') });
      return;
    }
    
    // Create directories
    const dirSpinner = createSpinner(purple('Creating Pylon route structure...')).start();
    fs.mkdirSync(routePath, { recursive: true });
    dirSpinner.success({ text: purpleBright(`Route directory created in ${role}/`) });
    
    // Generate @page.smq content
    const pageContent = `@script
import Sidebar from '$components/${role}/Sidebar';
import Header from '$components/${role}/Header';
import ${componentName} from '$components/${role}/${componentName}';
import Footer from '$components/${role}/Footer';

@end

@style

@end

@html

<div class="dashboard-container">
  <Sidebar />

  <main class="main-content">
    <Header />

    <div class="content-area">
      <${componentName} />
    </div>

    <Footer />
  </main>
</div>
`;
    
    // Generate @layout.smq content
    const layoutContent = `@head
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
<link rel="stylesheet" href="https://unpkg.com/formique-css@1.0.13/formique-css.css" />
<link rel="stylesheet" href="https://unpkg.com/anygridcss@1.0.4/anyGrid.css" />
<link rel="stylesheet" href="../../../dashboard/css/dashboard.css" />
@end

@body

@end

@footer

@end
`;
    
    // Define files to create (config.js is optional)
    const files = {
      '@page.smq': pageContent,
      '@layout.smq': layoutContent,
      'config.js': options.config ? `export default {
  meta: {
    title: '${componentName}',
    description: '',
    keywords: '',
    author: '',
    viewport: 'width=device-width, initial-scale=1'
  },
  seo: {
    canonicalUrl: '',
    ogImage: ''
  },
  transition: {
    type: 'fade',
    duration: 300
  },
  middleware: [],
  auth: true
}` : null
    };
    
    // Create files
    for (const [filename, content] of Object.entries(files)) {
      if (content) {
        const spinner = createSpinner(purple(`Creating ${filename}`)).start();
        await new Promise(resolve => setTimeout(resolve, 200));
        fs.writeFileSync(resolvePath(routePath, filename), content.trim());
        spinner.success({
          text: `${purpleBright('✓')} ${purple(filename)} ${blue('created')}`
        });
      }
    }
    
    // Build success message
    let successMessage = `
${purple.bold('» Pylon Route created successfully!')}

${purpleBright.bold('Structure:')}
${purpleBright('•')} ${purple('src/routes/')}${role}/${routeDirName}/
${purpleBright('  ├─')} ${purple('@page.smq')}
${purpleBright('  ├─')} ${purple('@layout.smq')}`;
    
    if (options.config) {
      successMessage += `
${purpleBright('  └─')} ${purple('config.js')}`;
    }
    
    successMessage += `

${purpleBright.bold('Component imports:')}
${purpleBright('•')} Sidebar from ${purple(`'$components/${role}/Sidebar'`)}
${purpleBright('•')} Header from ${purple(`'$components/${role}/Header'`)}
${purpleBright('•')} ${componentName} from ${purple(`'$components/${role}/${componentName}'`)}
${purpleBright('•')} Footer from ${purple(`'$components/${role}/Footer'`)}

${blue.italic('Next steps:')}
  ${purpleBright('›')} Create the ${purple(componentName)} component: ${purple(`semantq make:component ${componentName} --role ${role}`)}
  ${purpleBright('›')} Ensure ${purple('Sidebar')}, ${purple('Header')}, and ${purple('Footer')} components exist in ${purple(`src/components/${role}/`)}
  ${purpleBright('›')} Verify ${purple('dashboard.css')} exists at ${purple('/public/dashboard/css/dashboard.css')}
  ${purpleBright('›')} Run ${purple('npm run dev')} and visit ${purple(`/${role}/${routeDirName}`)}`;
    
    console.log(successMessage);
    
  } catch (error) {
    console.log(`
${errorRed('✖ Error creating Pylon route:')} ${error.message}

${blue('Troubleshooting:')}
  ${purpleBright('›')} Check directory permissions
  ${purpleBright('›')} Ensure role directory can be created
  ${purpleBright('›')} Verify component name transformation
`);
    process.exit(1);
  }
}

// ===========================================
// CASE CONVERSION HELPER FUNCTION
// ===========================================

function pylonToPascalCase(str) {
  if (!str) return '';
  
  return str
    // Split by dash, underscore, or space
    .split(/[-_\s]+/)
    // Capitalize first letter of each part
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}



// ===============================
// REMOVE:ROUTE COMMAND
// ===============================
program
  .command('remove:route <routeName>')
  .description('Remove a route directory and all its contents with confirmation')
  .option('-y, --yes', 'Skip confirmation prompt')
  .action(async (routeName, options) => {
    const targetBaseDir = process.cwd();
    const routePath = resolvePath(targetBaseDir, 'src/routes', routeName);
    
    try {
      // Check if route directory exists
      if (!fs.existsSync(routePath)) {
        console.log(`${INFO_ICON} ${blue('Route')} ${purple(routeName)} ${blue('does not exist.')}`);
        return;
      }

      // Get all files that will be removed
      let filesToRemove = [];
      function collectFiles(dir) {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
          const fullPath = path.join(dir, item);
          if (fs.statSync(fullPath).isDirectory()) {
            collectFiles(fullPath);
          } else {
            filesToRemove.push(fullPath);
          }
        });
      }
      
      if (fs.existsSync(routePath)) {
        collectFiles(routePath);
      }

      // Show what will be removed
      console.log(`\n${WARNING_ICON} ${yellow('The following route will be removed:')}`);
      console.log(`${errorRed('  ✖')} ${gray(routePath)}`);
      
      if (filesToRemove.length > 0) {
        console.log(`\n${yellow('Including files:')}`);
        filesToRemove.forEach(file => {
          console.log(`${errorRed('    ✖')} ${gray(file)}`);
        });
      }

      // Confirmation (unless --yes flag is used)
      let confirmed = options.yes;
      if (!confirmed) {
        const { proceed } = await inquirer.prompt([{
          type: 'confirm',
          name: 'proceed',
          message: `${errorRed(`This will permanently delete the ${routeName} route and all its contents. Proceed?`)}`,
          default: false
        }]);
        confirmed = proceed;
      }

      if (!confirmed) {
        console.log(`${INFO_ICON} ${blue('Operation cancelled.')}`);
        return;
      }

      // Remove route directory and all contents
      const spinner = ora(blue(`Removing route ${routeName}...`)).start();
      
      try {
        fs.removeSync(routePath);
        spinner.succeed(`${blue(`Removed route`)} ${purple(routeName)} ${blue(`and ${filesToRemove.length} files`)}`);

        console.log(`\n${purpleBright('» Next steps:')}`);
        console.log(`${purpleBright('›')} ${gray('Update your routes.js file to remove any references to this route')}`);
        console.log(`${purpleBright('›')} ${gray('Restart your development server')}`);

      } catch (error) {
        spinner.fail(`${errorRed('Failed to remove route:')} ${error.message}`);
      }

    } catch (error) {
      console.error(`${errorRed('✖')} ${blue('Error removing route:')} ${errorRed(error.message)}`);
    }
  });


  




// ===========================================
// MAKE:COMPONENT COMMAND
// ===========================================
program
  .command('make:component <componentName>')
  .description('Create a new component (standard or Pylon-enabled)')
  .option('-p, --pylon', 'Create Pylon-enabled component with feature guarding')
  .action(async (componentName, options) => {
    try {
      // Parse component path (handle nested paths like core/Project)
      let componentPath;
      const baseName = path.basename(componentName);
      const dirName = path.dirname(componentName);
      const componentPascal = toPascalCase(baseName);
      const fileName = `${componentPascal}.smq`;

      if (options.pylon) {
        // Pylon components go to components/pylon/ subdirectory
        // Handle nested paths like admin/User -> components/pylon/admin/User.smq
        const pylonDir = dirName === '.' ? 'pylon' : path.join('pylon', dirName);
        componentPath = resolvePath(process.cwd(), 'src/components', pylonDir, `${baseName}.smq`);
      } else {
        // Standard components go to regular components directory
        componentPath = resolvePath(process.cwd(), 'src/components', `${componentName}.smq`);
      }

      const componentDir = path.dirname(componentPath);
      
      // Check if component already exists
      if (fs.existsSync(componentPath)) {
        console.log(`${ERROR_ICON} ${errorRed('Component already exists!')}`);
        return;
      }

      // Create directory structure (only if it doesn't exist)
      const dirSpinner = ora(purple('Creating component structure...')).start();
      if (!fs.existsSync(componentDir)) {
        fs.mkdirSync(componentDir, { recursive: true });
        dirSpinner.succeed(purpleBright('Component directory created'));
      } else {
        dirSpinner.succeed(purpleBright('Component directory already exists'));
      }

      // Choose template based on Pylon option
      let componentTemplate;
      
      if (options.pylon) {
        // Pylon Component Template:
componentTemplate = `@script
const effectiveSettings = new Set(user.userSettings);
let loadingStatus = $state(true);
const dataModel = "${componentPascal}";
let gridData = [];
let newRecordAdded = $state(false);
//
const routeSlug = toCamelCase(dataModel);
const viewTitle = separateByCaps(dataModel);



/**
 * Helper functions
 */
function toCamelCase(term) {
  if (!term) return "";
  return term
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/[\s-_]+/)
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
}

function separateByCaps(term) {
  if (!term || typeof term !== 'string') {
    return term;
  }
  return term
    .replace(/([A-Z])/g, ' $1')
    .trim();
}

const dataModelFormId = \`add-\${dataModel.toLowerCase()}\`;

const perms = Object.fromEntries([
  // CRUD permissions (dataModel-based)
  ...["create", "read", "update", "delete"].map(a => [
    a,
    effectiveSettings.has(\`\${dataModel.toLowerCase()}_\${a}\`)
  ]),
  
  // DataGrid feature permissions (use full keys directly)
  // Data grid edit or delete will be validated against CRUD update and delete
  ...[
    "datagrid_csvexport",
    "datagrid_excelexport"
  ].map(a => [
    a,
    effectiveSettings.has(a)
  ])
]);

const { create, read, update, delete: deletem, datagrid_csvexport, datagrid_excelexport } = perms;

/* FORMIQUE CONFIGURATION - Customize per component */
const formSchema = [
  ['text', 'name', 'Name', { required: true }, { placeholder: 'Enter name' }],
  ['submit', 'submit', 'Save Record']
];

const formSettings = {
  theme: 'light',
};

const formParams = {
  method: 'POST',
  id: dataModelFormId
};

/* ANYGRID CONFIGURATION - Customize per component */
const gridColumns = [
  { name: 'id', header: 'ID', sortable: true },
  { name: 'name', header: 'NAME', sortable: true },
  { name: 'createdAt', header: 'CREATED AT', sortable: true },
  { name: 'updatedAt', header: 'UPDATED AT', sortable: true }
];

/* ANYGRID CONFIGURATION - Base features template */
const gridBaseFeatures = {
  csvExport: true,
  excelExport: true,
  theme: 'light',
  gridModal: true,
  modalConfig: {
    editable: true,
    deletable: true,
    nonEditableFields: ['id', 'organizationId', 'createdAt', 'updatedAt'],
    hiddenFields: ['id', 'organizationId'],
  },
};

/* ANYGRID CONFIGURATION - Permission-controlled features */
const gridFeatures = {
  ...gridBaseFeatures,
  csvExport: !!datagrid_csvexport,
  excelExport: !!datagrid_excelexport,
  modalConfig: {
    ...gridBaseFeatures.modalConfig,
    editable: !!update,
    deletable: !!deletem,
  },
};

function renderDataGrid() {
  const gridElement = document.getElementById('anygrid');
  if (gridElement) {
    gridElement.innerHTML = '';
    const dataGrid = new AnyGrid(gridData, gridColumns, gridFeatures);
  }
}

// Initialize on component mount
$onMount(async () => {
  try {
    // Initialize UI components after DOM is ready
    if (can("read")) {
      const response = await api.get(\`/\${routeSlug}/\${routeSlug}s\`);
      
      if (!response._ok) {
        Notification.show({
          type: 'error',
          message: \`Failed to fetch \${dataModel}s: \${response.message}\`,
          duration: 6000,
        });
      }

      const errorElement = document.getElementById('error'); 
      if (errorElement && response?.message) {
        errorElement.innerHTML = \`
          <div class="card card-error" style="margin-bottom: 1rem!important;">
            <div class="card-header">
              <div class="card-title">
                <h4>Alert!</h4>
              </div>
              <div class="card-actions">
                <div class="status-indicator error">
                  <i class="fas fa-exclamation-circle"></i>
                </div>
              </div>
            </div>
            <div class="card-body">
              \${response.message}
            </div>
          </div>
        \`;
      }

      gridData = api.getData(response);
      renderDataGrid();  
    }

    if (can("create")) {
      const form = new Formique(formSchema, formSettings, formParams);
      const formSubmission = new Form(dataModelFormId);

      formSubmission.form.addEventListener('form:captured', async (event) => {
        try {
          const payload = event.detail;
          payload.organizationId = parseInt(user.organizationId, 10);

          const response = await api.post(\`/\${routeSlug}/\${routeSlug}s\`, payload);

          if (response?._ok) {
            Notification.show({
              type: 'success',
              message: \`\${dataModel} created successfully\`,
              duration: 6000,
            });
            newRecordAdded.value = true;
          } else {
            Notification.show({
              type: 'error',
              message: \`Failed to create \${dataModel}: \${response.message}\`,
              duration: 6000,
            });
          }
        } catch (error) {
          console.error('Failed to create record:', error);
        }
      });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  } finally {
    loadingStatus.value = false;
  }
});

$effect(async () => {
  if (newRecordAdded.value) {
    const response = await api.get(\`/\${routeSlug}/\${routeSlug}s\`);
    if (response._ok) {
      gridData = api.getData(response);
      renderDataGrid();
    } else {
      Notification.show({
        type: 'error',
        message: \`Failed to refresh \${dataModel}s: \${response.message}\`,
        duration: 6000,
      });
    }
    newRecordAdded.value = false;
  }
});

function can(action) {
  const allowed = perms[action] === true;
  return allowed;
}

function canAny(actions) {
  return actions.some(can);
}

function canAll(actions) {
  return actions.every(can);
}

async function create${componentPascal}() {
  const payload = {
    name: \`IDP_\${Math.floor(Math.random() * 10000)}\`,
    description: 'Integrated Development Plan',
  };

  try {
    const response = await api.post('/${componentPascal.toLowerCase()}/${componentPascal.toLowerCase()}s', payload);
    if (response?._ok) {
      Notification.show({
        type: 'success',
        message: \`\${dataModel} created successfully\`,
        duration: 6000,
      });
      newRecordAdded.value = true;
    } else {
      Notification.show({
        type: 'error',
        message: \`Failed to create \${dataModel}: \${response.message}\`,
        duration: 6000,
      });
    }
  } catch (error) {
    console.error('Error creating ${componentPascal.toLowerCase()}:', error);
    Notification.show({
      type: 'error',
      message: \`An unexpected error occurred while creating \${dataModel}\`,
      duration: 4000,
    });
  }
}

@end

@style
/* PUT YOUR CSS HERE */

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #b56ef0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@end

@html

@if(loadingStatus)
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>Loading...</p>
  </div>
@else

<div id="error"> </div>

@if(can("create"))
<div class="smq-accordion smq-accordion-elevated">
  <div class="smq-accordion-item">
    <input type="checkbox" id="accordion-create" class="smq-accordion-toggle" />
    <label for="accordion-create" class="smq-accordion-header">
      Create {viewTitle}
    </label>
    <div class="smq-accordion-content">
      <div id="\${dataModelFormId}" class="sqm-acc-content">
          <!-- Form will be rendered here by Formique -->
      </div>
    </div>
  </div>
</div>
@endif

@if(can("read"))
<div class="smq-accordion smq-accordion-elevated">
  <div class="smq-accordion-item">
    <input type="checkbox" id="accordion-view" class="smq-accordion-toggle" checked/>
    <label for="accordion-view" class="smq-accordion-header">
      {viewTitle}s
    </label>
    <div class="smq-accordion-content">
      <div id="anygrid" class="sqm-acc-content">
          <!-- Anygrid data grid will be inserted here -->
      </div>
    </div>
  </div>
</div>
@endif

@endif
`;
      } else {
        // Standard Component Template
        componentTemplate = `@script
// ${componentPascal} component JavaScript code here
@end

@style
/* ${componentPascal} component CSS here */
@end

@html

<h1>${componentPascal} Component</h1>

`;
      }

      // Create component file
      const fileSpinner = ora(purple(`Creating ${fileName}`)).start();
      fs.writeFileSync(componentPath, componentTemplate.trim());
      fileSpinner.succeed(`${purpleBright('✓')} ${purple(fileName)} ${blue('created')}`);

      // Enhanced success message
      const relativePath = path.relative(process.cwd(), componentPath);
      console.log(`
${purple.bold('» Component created successfully!')}

${purpleBright.bold('Component created:')}
${purpleBright('•')} ${purple(fileName)} ${options.pylon ? purple('(Pylon-enabled)') : gray('(Standard)')}
${purpleBright('•')} ${gray('Location:')} ${purple(relativePath)}

${blue.italic('Next steps:')}
  ${purpleBright('›')} Import and use in your routes: ${purple(`import ${componentPascal} from '$components/${options.pylon ? 'pylon/' : ''}${componentName}';`)}
  ${options.pylon ? `${purpleBright('›')} ${gray('Finalise your code base for for')} ${purple(componentPascal)}` : ''}
  ${options.pylon ? `${purpleBright('›')} ${gray('Ensure user context is available in parent component')}` : ''}
  ${purpleBright('›')} ${gray('Re-run the build to see the component in action')}
`);

    } catch (error) {
      console.log(`
${errorRed('✖ Error:')} ${error.message}

${blue('Troubleshooting:')}
  ${purpleBright('›')} Check directory permissions
  ${purpleBright('›')} Verify disk space
  ${purpleBright('›')} Ensure component name follows PascalCase convention
`);
      process.exit(1);
    }
  });

// ===============================
// REMOVE:COMPONENT COMMAND
// ===============================
program
  .command('remove:component <componentName>')
  .description('Remove a component file with confirmation')
  .option('-p, --pylon', 'Remove Pylon component from pylon subdirectory')
  .option('-y, --yes', 'Skip confirmation prompt')
  .action(async (componentName, options) => {
    const targetBaseDir = process.cwd();
    
    try {
      // Determine component path based on Pylon option
      let componentPath;
      const baseName = path.basename(componentName);
      const dirName = path.dirname(componentName);
      
      if (options.pylon) {
        // Pylon components are in components/pylon/ subdirectory
        const pylonDir = dirName === '.' ? 'pylon' : path.join('pylon', dirName);
        componentPath = resolvePath(targetBaseDir, 'src/components', pylonDir, `${baseName}.smq`);
      } else {
        // Standard components are in regular components directory
        componentPath = resolvePath(targetBaseDir, 'src/components', `${componentName}.smq`);
      }

      // Check if component file exists
      if (!fs.existsSync(componentPath)) {
        console.log(`${INFO_ICON} ${blue('Component')} ${purple(componentName)} ${blue('does not exist.')}`);
        
        // Suggest alternative location if not found
        let alternativePath;
        if (options.pylon) {
          // Check if it exists in standard location
          alternativePath = resolvePath(targetBaseDir, 'src/components', `${componentName}.smq`);
        } else {
          // Check if it exists in pylon location
          const pylonDir = dirName === '.' ? 'pylon' : path.join('pylon', dirName);
          alternativePath = resolvePath(targetBaseDir, 'src/components', pylonDir, `${baseName}.smq`);
        }
        
        if (fs.existsSync(alternativePath)) {
          const location = options.pylon ? 'standard components directory' : 'pylon subdirectory';
          console.log(`${INFO_ICON} ${blue('Found component in')} ${purple(location)} ${blue('- try with')} ${options.pylon ? '' : '--pylon '}${blue('flag')}`);
        }
        return;
      }

      // Show what will be removed
      const relativePath = path.relative(process.cwd(), componentPath);
      console.log(`\n${WARNING_ICON} ${yellow('The following component will be removed:')}`);
      console.log(`${errorRed('  ✖')} ${gray(relativePath)}`);

      // Confirmation (unless --yes flag is used)
      let confirmed = options.yes;
      if (!confirmed) {
        const { proceed } = await inquirer.prompt([{
          type: 'confirm',
          name: 'proceed',
          message: `${errorRed(`This will permanently delete the ${componentName} component. Proceed?`)}`,
          default: false
        }]);
        confirmed = proceed;
      }

      if (!confirmed) {
        console.log(`${INFO_ICON} ${blue('Operation cancelled.')}`);
        return;
      }

      // Remove component file
      const spinner = ora(blue(`Removing component ${componentName}...`)).start();
      
      try {
        fs.unlinkSync(componentPath);
        spinner.succeed(`${blue(`Removed component`)} ${purple(componentName)} ${options.pylon ? purple('(Pylon)') : ''}`);

        console.log(`\n${purpleBright('» Next steps:')}`);
        console.log(`${purpleBright('›')} ${gray('Remove any imports of this component from your routes')}`);
        console.log(`${purpleBright('›')} ${gray('Restart your development server')}`);

      } catch (error) {
        spinner.fail(`${errorRed('Failed to remove component:')} ${error.message}`);
      }

    } catch (error) {
      console.error(`${errorRed('✖')} ${blue('Error removing component:')} ${errorRed(error.message)}`);
    }
  });






// ===============================
// SEMANTQ INSTALL SERVER (Standalone command)
// ===============================
program
  .command('install:server')
  .description('Install the Semantq server package into your project')
  .action(async () => {
    const targetBaseDir = process.cwd();
    try {
      await installSemantqServer(targetBaseDir);
      console.log(chalk.cyan.bold(`\n› Next:`));
      console.log(chalk.gray(`  › Run ${chalk.yellow('cd semantqQL')}`));
      console.log(chalk.gray(`  › Start your server with ${chalk.yellow('npm run dev')}`));
    } catch (error) {
      process.exit(1);
    }
  });

// ===============================
// INSTALL SEMANTQ AUTH UI (Standalone command)
// ===============================
program
  .command('add:auth-ui')
  .description('Install the Semantq Auth UI into your project')
  .action(async () => {
    const projectRoot = process.cwd();
    try {
      await addSemantqAuthUI(projectRoot);
    } catch (err) {
      process.exit(1);
    }
  });


// ===============================
// SEMANTQ AI COMMANDS
// ===============================


program
  .command('ai <prompt>')
  .description('Generate code using AI and save it to the specified route directory')
  .option('-r, --route <route>', 'Specify the route directory (e.g., contact, store)')
  .option('--full', 'Wrap the response in Semantq custom tags (@script, @style, @html)')
  .option('--js', 'Generate only JavaScript (no wrapping tags)')
  .option('--css', 'Generate only CSS (no wrapping tags)')
  .option('--html', 'Generate only HTML (no wrapping tags)')
  .option('--append', 'Append the generated code to the file instead of overwriting')
  .action(async (prompt, options) => {
    try {
      // Dynamically import the Hugging Face Inference package
      const { InferenceClient } = await import('@huggingface/inference');

      // Initialize the client with the API key from .env
      const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

      // Determine the output directory based on the --route flag
      if (!options.route) {
        console.error("Error: --route flag is required to specify the output directory.");
        process.exit(1);
      }

      const outputDir = path.join("src", "routes", options.route);
      const outputPath = path.join(outputDir, "@page.html"); // Consider changing to @page.smq if appropriate

      // Ensure the output directory exists
      fs.ensureDirSync(outputDir);

      // Append wrapping instructions to the prompt if --full is used
      let finalPrompt = prompt;
      if (options.full) {
        finalPrompt += `
          - Wrap the JavaScript code in Semantq custom JS tags: @script //code @end
          - Wrap the CSS code in Semantq custom CSS tags: @style /* code */ @end
          - Wrap the HTML code in Semantq custom HTML tags: @html <!-- code -->
          - Do not include an @end tag for the HTML section.
          - Return only the HTML code, without any additional explanation.
        `;
      } else if (options.js) {
        finalPrompt += " Return only the JavaScript code, without any additional explanation.";
      } else if (options.css) {
        finalPrompt += " Return only the CSS code, without any additional explanation.";
      } else if (options.html) {
        finalPrompt += " Return only the HTML code, without any additional explanation.";
      }

      // Call the Hugging Face API
      const chatCompletion = await client.chatCompletion({
        model: "deepseek-ai/DeepSeek-R1",
        messages: [
          {
            role: "user",
            content: finalPrompt,
          },
        ],
        provider: "novita",
        max_tokens: 500,
      });

      const response = chatCompletion.choices[0].message.content;

      // Extract code block from Markdown (if present)
      const codeBlockRegex = /```[\s\S]*?```/g;
      const codeMatches = response.match(codeBlockRegex);

      let code = response; // Default to full response
      if (codeMatches && codeMatches.length > 0) {
        code = codeMatches[0].replace(/```/g, "").trim(); // Remove Markdown backticks
      }

      // Append or write the output to the file
      if (options.append) {
        fs.appendFileSync(outputPath, `\n\n${code}`, "utf-8");
        console.log(`Code appended to ${outputPath}`);
      } else {
        fs.writeFileSync(outputPath, code, "utf-8");
        console.log(`Code written to ${outputPath}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });



// ===============================
// ADD THIS FUNCTION TO CLI.JS
// ===============================
async function readServerConfig(projectRoot) {
  // 1. Find server.config.js in projectRoot/semantqQL rather than in project root
  const configPath = path.join(projectRoot, 'semantqQL', 'server.config.js');
  
  try {
    // Dynamically import the config file
    // Note: dynamic 'import()' requires a file URL (pathToFileURL) for local files
    const config = await import(pathToFileURL(configPath).href);
    
    // Return the default export, or the entire module if no default
    return config.default || config;
  } catch (error) {
    console.log(chalk.yellow(`⚠Could not read server.config.js at ${configPath}: ${error.message}`));
    
    // Return a default configuration if the file cannot be read or imported
    return { database: { adapter: 'mysql' } };
  }
}

// ===============================
// MAKE:RESOURCE COMMAND (MCSR - Model, Controller, Service, Route)
// ===============================

program
  .command('make:resource <resourceName>')
  .description('Generate full backend resource (Model, Controller, Service, Route)')
  .option('-p, --pylon', 'Generate Pylon-enabled resources with feature guarding')
  .action(async (resourceName, options) => {
    const targetBaseDir = process.cwd();
    const serverDir = path.join(targetBaseDir, 'semantqQL');
    
    try {
      // Verify server directory exists
      if (!fs.existsSync(serverDir)) {
        console.error(errorRed('✖ semantqQL directory not found.'));
        console.log(chalk.yellow('› Run this command from your project root with semantqQL installed.'));
        console.log(chalk.yellow('› To install the server, run: semantq install:server'));
        return;
      }

      // Load the configuration using the function we just added above
      const serverConfig = await readServerConfig(targetBaseDir);
      
      // Get the database adapter
      const databaseAdapter = serverConfig.database?.adapter || 'mysql';

      console.log(`${purpleBright('🚀')} ${blue('Generating')} ${purple(resourceName)} ${blue('resource for')} ${purple(databaseAdapter)}`);
      if (options.pylon) {
        console.log(`${purpleBright('🛡️')} ${blue('With Pylon feature guarding')}`);
      }

      // Call the main generateResource function with pylon option
      await generateResource(resourceName, serverDir, databaseAdapter, options.pylon);

      console.log(`${purpleBright('✨')} ${blue('Resource generation complete!')}`);
      console.log(`
${purpleBright('» Next steps:')}
  ${databaseAdapter === 'mongo' ?
    `${purpleBright('›')} ${gray('Your MongoDB model is ready to use')}` :
    `${purpleBright('›')} ${gray('Add the model to your schema.prisma')}
      ${purpleBright('›')} ${gray('Run:')} ${purple(`npx prisma migrate dev --name add_${resourceName.toLowerCase()}_model`)}`
  }
  ${options.pylon ? `${purpleBright('›')} ${gray('Configure Pylon feature flags for')} ${purple(resourceName)}` : ''}
  ${purpleBright('›')} ${gray('Add the route to your main router if needed')}
  ${purpleBright('›')} ${gray('Restart your server to apply changes')}
`);
    } catch (error) {
      console.error(`${errorRed('✖')} ${blue('Error generating resource:')} ${errorRed(error.message)}`);
      if (error.stack) {
        console.error(`${purpleBright('›')} ${gray('Stack trace:')} ${gray(error.stack)}`);
      }
      process.exit(1);
    }
  });





/* REMOVE RESOURCE HELPERS */

  // Add these utility functions to cli.js
function toCamelCase(name) {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

function toPascalCase(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}


// ===============================
// REMOVE:RESOURCE COMMAND
// ===============================
program
  .command('remove:resource <resourceName>')
  .description('Remove all resource assets (Model, Controller, Service, Route) with confirmation')
  .option('-y, --yes', 'Skip confirmation prompt')
  .action(async (resourceName, options) => {
    const targetBaseDir = process.cwd();
    const serverDir = path.join(targetBaseDir, 'semantqQL');
    
    try {
      // Verify server directory exists
      if (!fs.existsSync(serverDir)) {
        console.error(errorRed('✖ semantqQL directory not found.'));
        return;
      }

      const namePascal = toPascalCase(resourceName);
      const nameCamel = toCamelCase(resourceName);
      
      // Define files to remove
      const filesToRemove = [
        path.join(serverDir, 'models', 'mysql', `${namePascal}.js`),
        path.join(serverDir, 'models', 'mongo', `${namePascal}.js`),
        path.join(serverDir, 'models', 'sqlite', `${namePascal}.js`),
        path.join(serverDir, 'models', 'supabase', `${namePascal}.js`),
        path.join(serverDir, 'services', `${nameCamel}Service.js`),
        path.join(serverDir, 'controllers', `${nameCamel}Controller.js`),
        path.join(serverDir, 'routes', `${nameCamel}Routes.js`)
      ];

      // Filter to only existing files
      const existingFiles = filesToRemove.filter(file => fs.existsSync(file));

      if (existingFiles.length === 0) {
        console.log(`${INFO_ICON} ${blue('No resource files found for')} ${purple(resourceName)}`);
        return;
      }

      // Show what will be removed
      console.log(`\n${WARNING_ICON} ${yellow('The following files will be removed:')}`);
      existingFiles.forEach(file => {
        console.log(`${errorRed('  ✖')} ${gray(file)}`);
      });

      // Confirmation (unless --yes flag is used)
      let confirmed = options.yes;
      if (!confirmed) {
        const { proceed } = await inquirer.prompt([{
          type: 'confirm',
          name: 'proceed',
          message: `${errorRed('This action cannot be undone. Proceed?')}`,
          default: false
        }]);
        confirmed = proceed;
      }

      if (!confirmed) {
        console.log(`${INFO_ICON} ${blue('Operation cancelled.')}`);
        return;
      }

      // Remove files
      const spinner = ora(blue('Removing resource files...')).start();
      
      let removedCount = 0;
      for (const file of existingFiles) {
        try {
          fs.unlinkSync(file);
          removedCount++;
        } catch (error) {
          spinner.warn(`${yellow('Could not remove:')} ${gray(file)}`);
        }
      }

      spinner.succeed(`${blue(`Removed ${removedCount} files for`)} ${purple(resourceName)}`);

      console.log(`\n${purpleBright('» Next steps:')}`);
      //console.log(`${purpleBright('›')} ${gray('Also remove the model from your schema.prisma if using SQL database')}`);
      //console.log(`${purpleBright('›')} ${gray('Remove any route registrations from your main router')}`);
      console.log(`${purpleBright('›')} ${gray('Restart your server')}`);

    } catch (error) {
      console.error(`${errorRed('✖')} ${blue('Error removing resource:')} ${errorRed(error.message)}`);
    }
  });



// ===============================
// UPDATE COMMAND
// ===============================
program
  .command('update')
  .description('Update Semantq to the latest version (backup your project first)')
  .option('--dry-run', 'Show what would be updated without making changes')
  .option('--force', 'Force update even if versions match')
  .option('--restore', 'Restore missing directories (docs/examples)')
  .action(async (options) => {
    const targetDir = process.cwd();
    // Using degit-friendly repo string
    const GITHUB_REPO = 'Gugulethu-Nyoni/semantq';
    const GITHUB_RAW = 'https://raw.githubusercontent.com/Gugulethu-Nyoni/semantq/main';

    const spinner = ora('Starting Semantq update...').start();

    // Function to create zip backup
    const createBackup = async (dirPath) => {
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const dirName = path.basename(dirPath);
      const backupName = `${dirName}_${timestamp}_backup.zip`;
      const backupPath = path.join(targetDir, backupName);

      const output = fs.createWriteStream(backupPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      return new Promise((resolve, reject) => {
        output.on('close', () => {
          spinner.succeed(`Created backup: ${backupName} (${archive.pointer()} bytes)`);
          resolve(backupPath);
        });

        archive.on('warning', (err) => {
          if (err.code === 'ENOENT') {
            spinner.warn(`Backup warning: ${err.message}`);
          } else {
            reject(err);
          }
        });

        archive.on('error', (err) => reject(err));
        archive.pipe(output);
        archive.directory(dirPath, false);
        archive.finalize();
      });
    };

    try {
      // 1. Get latest version from GitHub
      spinner.text = 'Fetching latest version from GitHub...';
      const latestVersion = await fetch(`${GITHUB_RAW}/package.json`)
        .then(res => res.json())
        .then(pkg => pkg.version)
        .catch(() => {
          throw new Error('Could not fetch latest version from GitHub.');
        });
      spinner.succeed('Fetched latest version.');

      // 2. Get current version
      let currentVersion;
      try {
        const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, 'package.json'), 'utf-8'));
        currentVersion = pkg.dependencies?.semantq?.replace(/^[\^~]/, '') || pkg.version;
      } catch (err) {
        throw new Error('Could not determine current version from package.json.');
      }
      
      console.log(chalk.blue(`Current version: v${currentVersion}`));
      console.log(chalk.blue(`Latest version:  v${latestVersion}`));

      if (latestVersion === currentVersion && !options.force) {
        spinner.info(chalk.green('Already on latest version. Update not required.'));
        return;
      }

      // 3. Confirmation prompt
      spinner.stop();
      const { proceed } = await inquirer.prompt([{
        type: 'confirm',
        name: 'proceed',
        message: `Update from v${currentVersion} to v${latestVersion}? ${chalk.yellow('Backup your project first!')}`,
        default: false
      }]);

      if (!proceed) {
        console.log(chalk.yellow('Update cancelled.'));
        return;
      }
      spinner.start();

      // 4. Dry run mode
      if (options.dryRun) {
        spinner.stop();
        console.log(chalk.blue('\n[Dry Run] Would update:'));
        console.log('• core_modules/ (always updated)');
        
        const optionalDirs = ['docs', 'examples'];
        optionalDirs.forEach(dir => {
          const exists = fs.existsSync(path.join(targetDir, dir));
          console.log(`${exists ? '•' : '○'} ${dir}/ ${exists ? '(will update)' : '(would restore)'}`);
        });
        
        console.log(chalk.gray('(Remove --dry-run to actually apply changes)'));
        return;
      }

      // 5. Perform update
      spinner.text = 'Starting update process...';
      const coreModulesPath = path.join(targetDir, 'core_modules');

      // Backup core_modules if it exists
      if (fs.existsSync(coreModulesPath)) {
        spinner.text = 'Creating backup of core_modules...';
        await createBackup(coreModulesPath);
      }

      // Install latest npm package
      spinner.text = 'Installing latest npm package...';
      execSync('npm install semantq@latest', { stdio: 'ignore' });
      spinner.succeed('NPM package updated successfully.');

      // Download and update core directories from GitHub using degit
      spinner.text = 'Downloading core files from GitHub...';
      const requiredDirs = ['core_modules'];
      const optionalDirs = ['docs', 'examples'];
      const allDirs = [...requiredDirs, ...optionalDirs];
      
      const tempDir = path.join(os.tmpdir(), 'semantq_update');
      
      // Use degit to get the desired directories
      for (const dir of allDirs) {
        const destPath = path.join(targetDir, dir);
        const dirExists = fs.existsSync(destPath);
        
        if (requiredDirs.includes(dir) || dirExists || options.restore) {
          spinner.text = `${dirExists ? 'Updating' : 'Restoring'} ${dir}/ from GitHub...`;
          try {
            // Remove the existing directory before cloning to ensure a clean update
            await fs.remove(destPath);
            
            // Corrected degit clone string to target the subdirectory from the main branch
            const emitter = degit(`${GITHUB_REPO}/${dir}#main`, {
              cache: false,
              force: true,
              verbose: true
            });
            await emitter.clone(destPath);
            spinner.succeed(`${dirExists ? 'Updated' : 'Restored'} ${dir}/`);
          } catch (err) {
            spinner.fail(`Failed to ${dirExists ? 'update' : 'restore'} ${dir}/: ${err.message}`);
            throw new Error(`Update failed for ${dir}/`);
          }
        } else {
          spinner.info(`Skipping ${dir}/ (not present in project and --restore not set)`);
        }
      }

      // Clean up temp directory
      await fs.remove(tempDir);

      // Preserve config (show diff if modified)
      spinner.text = 'Finalizing update...';
      const userConfigPath = path.join(targetDir, 'semantq.config.js');
      const defaultConfigPath = path.join(targetDir, 'node_modules', 'semantq', 'semantq.config.default.js');

      if (fs.existsSync(userConfigPath)) {
        spinner.warn('semantq.config.js was preserved (may need manual updates)');
        if (fs.existsSync(defaultConfigPath)) {
          console.log(chalk.gray('Compare with default config:'));
          console.log(chalk.gray(`  ${defaultConfigPath}`));
        }
      }

      spinner.succeed(chalk.green.bold('Update complete!'));
      console.log(chalk.blue('Restart your dev server to apply changes.'));

    } catch (error) {
      spinner.fail(chalk.red('Update failed.'));
      console.error(chalk.red('\n✖ Error:'), error.message);
      process.exit(1);
    }
  });

// ===============================
// ADD MODULE COMMAND
// ===============================
program
  .command('add <moduleName>')
  .description('Add a Semantq module (e.g., @semantq/auth) to your project')
  .action((moduleName) => { // No async needed if only execSync
    console.log(`${purpleBright('📦')} ${blue('Adding module:')} ${purple(moduleName)}${gray('...')}`);
    try {
      // Ensure it's a scoped @semantq module if that's the convention
      const fullModuleName = moduleName.startsWith('@semantq/') ? moduleName : `@semantq/${moduleName}`;
      const projectRoot = process.cwd(); // Ensure we're installing in the current project root

      // This command will run npm install in the current directory (project root)
      execSync(`npm install ${fullModuleName}`, { cwd: projectRoot, stdio: 'inherit' });

      console.log(`${purpleBright('✓')} ${blue('Module')} ${purple(fullModuleName)} ${blue('added successfully!')}`);
      console.log(`${gray('›')} ${blue('Remember to run')} ${purple('semantq migrate')} ${blue('to apply any new database migrations for the module.')}`);

    } catch (error) {
      console.error(`${errorRed('✖')} ${blue('Failed to add module')} ${errorRed(moduleName)}: ${errorRed(error.message)}`);
      // execSync will throw an error if the command fails, so we catch it
      process.exit(1);
    }
  });

// ===============================
// MIGRATE COMMAND
// ===============================
program
  .command('migrate')
  .description('Run database migrations for the project and its modules')
  .action(() => { // No async needed if only execSync
    const projectRoot = process.cwd();
    console.log(`${purpleBright('🚀')} ${blue('Running migrations...')}`);
    try {
      // Assuming 'npm run migrate' is defined in your project's package.json
      execSync('npm run migrate', { cwd: projectRoot, stdio: 'inherit' });
      console.log(`${purpleBright('✓')} ${blue('Migrations complete.')}`);
    } catch (error) {
      console.error(`${errorRed('✖')} ${blue('Migration failed:')} ${errorRed(error.message)}`);
      process.exit(1);
    }
  });

// ===============================
// START SERVER COMMAND
// ===============================
program
  .command('start')
  .description('Start the Semantq server in development mode')
  .action(() => { // No async needed if only execSync
    const projectRoot = process.cwd();
    console.log(`${purpleBright('⚡')} ${blue('Starting Semantq server (development mode)...')}`);
    try {
      // Use 'npm run dev' which typically uses nodemon for live reloading
      execSync('npm run dev', { cwd: projectRoot, stdio: 'inherit' });
    } catch (error) {
      console.error(`${errorRed('✖')} ${blue('Failed to start server:')} ${errorRed(error.message)}`);
      process.exit(1);
    }
  });


// Parse CLI arguments
program.parse(process.argv);
