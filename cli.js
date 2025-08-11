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

// Load environment variables from .env file
dotenv.config();

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


// Color palette (already defined in your CLI, ensuring consistency)
const purple = chalk.hex('#b56ef0');
const purpleBright = chalk.hex('#d8a1ff');
const blue = chalk.hex('#6ec7ff');
const errorRed = chalk.hex('#ff4d4d');
const gray = chalk.hex('#aaaaaa');
const yellow = chalk.hex('#ffff00'); 







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
    await fs.copy(srcPublic, destPublic, { overwrite: true }); // Ensure overwrite is true
    console.log(blue('✓ Copied public assets to /public'));

    // Copy routes/* → projectRoot/src/routes
    const srcRoutes = path.join(tempDir, 'routes');
    const destRoutes = path.join(projectRoot, 'src', 'routes');
    await fs.copy(srcRoutes, destRoutes, { overwrite: true }); // Ensure overwrite is true
    console.log(blue('✓ Copied route files to /src/routes'));

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
// MAKE:ROUTE COMMAND - FULL RESOURCES
// ===========================================
program
  .command('make:route <routeName>')
  .description('Create a new route with stylish feedback')
  .option('-l, --layout', 'Add layout file')
  .option('-c, --crud', 'Add CRUD operations')
  .option('-a, --auth', 'Add auth import to page template')
  .option('-s, --server', 'Add server handlers')
  .option('-A, --all', 'Create all resources at once')
  .option('--ac', 'Shortcut for both --auth and --crud')
  .option('-tw, --tailwind', 'Add Tailwind CSS support')
  .action(async (routeName, options) => {
    const { createSpinner } = await import('nanospinner');

    try {
      const routePath = resolvePath(process.cwd(), 'src/routes', routeName);

      if (fs.existsSync(routePath)) {
        const spinner = createSpinner(purple(`Checking route ${routeName}...`)).start();
        spinner.error({ text: errorRed('Route already exists!') });
        return;
      }

      // Handle shortcut options
      if (options.ac) {
        options.auth = true;
        options.crud = true;
      }

      if (options.all) {
        options.layout = true;
        options.config = true;
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
        if (options.auth) {
          basePageTemplate += `import '/public/dashboard/js/theme.js';\n`;
        }
        basePageTemplate += `import 'https://cdn.jsdelivr.net/npm/chart.js';\n`;
        basePageTemplate += `import smQL, { Form } from '@semantq/ql';\n`;
        basePageTemplate += `import Formique from '@formique/semantq';\n`;
        basePageTemplate += `import AnyGrid from 'anygridjs';\n`;
        basePageTemplate += `import AppConfig from '/public/auth/js/config.js';\n`;
        basePageTemplate += `const baseUrl = AppConfig.BASE_URL;\n`;
        basePageTemplate += `const baseOrigin = new URL(baseUrl).origin;\n\n`;
        
        basePageTemplate += `// CRUD Operations\n`;
        basePageTemplate += `// GET \n`;
        basePageTemplate += `// const data = await new smQL(\`\${baseOrigin}/product/products\`);\n\n`;
        
        basePageTemplate += `// POST - CREATE \n`;
        basePageTemplate += `// const newCategory = { name: 'Mobiles' }; \n`;
        basePageTemplate += `// const response = await new smQL(\`\${baseOrigin}/category/categories\`, 'POST', newCategory);\n\n`;
        
        basePageTemplate += `// PUT — Update \n`;
        basePageTemplate += `// const updatedCategory = { name: 'Mobile Phones' }; \n`;
        basePageTemplate += `// const response = await new smQL(\`\${baseOrigin}/category/categories/\${categoryId}\`, 'PUT', updatedCategory);\n\n`;
        
        basePageTemplate += `// DELETE \n`;
        basePageTemplate += `// const productId = 42; \n`;
        basePageTemplate += `// const response = await new smQL(\`\${baseOrigin}/product/products/\${productId}\`, 'DELETE', null, { log: false });\n`;
      } else if (options.auth) {
        basePageTemplate += `import '/public/dashboard/js/dashboard.js';\n`;
      }
      
      if (options.tailwind) {
        basePageTemplate += `import '../../../global.css';\n`;
      }
      
      basePageTemplate += `@end\n\n@style\n\n@end\n\n@html\n ${routeName} Page\n`;

      // Layout content
      const layoutContent = options.crud ? 
        `@head\n` +
        `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />\n` +
        `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />\n` +
        `<link rel="stylesheet" href="https://unpkg.com/formique-css@1.0.13/formique-css.css" />\n` +
        `<link rel="stylesheet" href="https://unpkg.com/anygridcss@1.0.2/anyGrid.css" />\n` +
        (options.auth ? `<link href="/dashboard/css/dashboard.css" rel="stylesheet" />\n` : '') +
        `@end\n` +
        `@body\n\n@end\n` +
        `@footer\n\n@end\n` :
        `@head\n` +
        `<link rel="stylesheet" href="https://unpkg.com/formique-css@1.0.11/formique-css.css" />\n` +
        `<link rel="stylesheet" href="https://unpkg.com/anygridcss@1.0.2/anyGrid.css" anygrid-style />\n` +
        `@end\n\n` +
        `@script\n// Imports only\n@end\n\n` +
        `@body\n\n@end\n\n` +
        `@footer\n\n@end\n`;

      const files = {
        '@page.smq': basePageTemplate,
        '@layout.smq': options.layout ? layoutContent : null,
        'config.js': options.config ? `export default {
  meta: {
    title: '${routeName}',
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
  middleware: []${options.auth ? `,\n  auth: true` : ''}
}` : null,
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
${options.config ? `${purpleBright('•')} ${purple('config.js')}` : ''}
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
// MAKE:RESOURCE COMMAND (MCSR - Model, Controller, Service, Route)
// ===============================

// function to read the config
// Use dynamic import to support JS config files
async function readServerConfig(projectRoot) {
  const configPath = path.join(projectRoot, 'semantqQL', 'semantq.config.js');
  try {
    // Dynamically import the config file
    const config = await import(pathToFileURL(configPath).href);
    // Return the default export, or the entire module if no default
    return config.default || config;
  } catch (error) {
    console.log(chalk.yellow(`⚠ Could not read semantq.config.js: ${error.message}`));
    // Return a default configuration if the file cannot be read or imported
    return { database: { adapter: 'mysql' } };
  }
}


program
  .command('make:resource <resourceName>')
  .description('Generate full backend resource (Model, Controller, Service, Route)')
  .action(async (resourceName) => {
    const targetBaseDir = process.cwd();
    const serverDir = path.join(targetBaseDir, 'semantqQL');
    const configPath = path.join(serverDir, 'semantq.config.js');

    try {
      // Verify server directory exists
      if (!fs.existsSync(serverDir)) {
        console.error(errorRed('✖ semantqQL directory not found.'));
        console.log(chalk.yellow('› Run this command from your project root with semantqQL installed.'));
        console.log(chalk.yellow('› To install the server, run: semantq install:server'));
        return;
      }

      // Load the configuration
      const serverConfig = await readServerConfig(targetBaseDir);
      
      // Get the database adapter - this is the key fix
      const databaseAdapter = serverConfig.database?.adapter || 'mysql';

      console.log(`${purpleBright('🚀')} ${blue('Generating')} ${purple(resourceName)} ${blue('resource for')} ${purple(databaseAdapter)}`);

      // Generate all resource files
      await generateResource(resourceName, serverDir, databaseAdapter);

      console.log(`${purpleBright('✨')} ${blue('Resource generation complete!')}`);
      console.log(`
${purpleBright('» Next steps:')}
  ${databaseAdapter === 'mongo' ?
    `${purpleBright('›')} ${gray('Your MongoDB model is ready to use')}` :
    `${purpleBright('›')} ${gray('Add the model to your schema.prisma')}
     ${purpleBright('›')} ${gray('Run:')} ${purple(`npx prisma migrate dev --name add_${resourceName.toLowerCase()}_model`)}`
  }
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
    const GITHUB_REPO = 'https://github.com/Gugulethu-Nyoni/semantq';
    const GITHUB_RAW = 'https://raw.githubusercontent.com/Gugulethu-Nyoni/semantq/main';

    try {
      // Get latest version from GitHub
      const latestVersion = await fetch(`${GITHUB_RAW}/package.json`)
        .then(res => res.json())
        .then(pkg => pkg.version)
        .catch(() => {
          throw new Error('Could not fetch latest version from GitHub');
        });

      // Get current version
      let currentVersion;
      try {
        currentVersion = JSON.parse(fs.readFileSync('package.json', 'utf-8')).dependencies?.semantq?.replace(/^[\^~]/, '');
        if (!currentVersion) {
          currentVersion = JSON.parse(fs.readFileSync('package.json', 'utf-8')).version;
        }
      } catch (err) {
        throw new Error('Could not determine current version from package.json');
      }

      console.log(chalk.blue(`Current version: v${currentVersion}`));
      console.log(chalk.blue(`Latest version:  v${latestVersion}`));

      if (latestVersion === currentVersion && !options.force) {
        console.log(chalk.green('✓ Already on latest version'));
        return;
      }

      // Confirmation prompt
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

      // Dry run mode
      if (options.dryRun) {
        console.log(chalk.blue('[Dry Run] Would update:'));
        console.log('• core_modules/ (always updated)');
        
        // Check which optional directories exist
        const optionalDirs = ['docs', 'examples'];
        optionalDirs.forEach(dir => {
          const exists = fs.existsSync(path.join(targetDir, dir));
          console.log(`${exists ? '•' : '○'} ${dir}/ ${exists ? '(will update)' : '(would restore)'}`);
        });
        
        console.log(chalk.gray('(Remove --dry-run to actually apply changes)'));
        return;
      }

      // Perform update
      console.log(chalk.blue('\nUpdating Semantq...'));

      // 1. Install latest version
      console.log(chalk.blue('Installing latest npm package...'));
      execSync('npm install semantq@latest', { stdio: 'inherit' });

      // 2. Download and update core directories from GitHub
      console.log(chalk.blue('\nUpdating core files from GitHub...'));
      
      const requiredDirs = ['core_modules'];
      const optionalDirs = ['docs', 'examples'];
      const tempDir = path.join(os.tmpdir(), 'semantq_update');
      
      // Create temp directory
      fs.mkdirSync(tempDir, { recursive: true });
      
      // Clone repo (only once)
      if (!fs.existsSync(path.join(tempDir, 'semantq'))) {
        execSync(`git clone --depth 1 --filter=blob:none --sparse ${GITHUB_REPO} ${path.join(tempDir, 'semantq')}`, 
          { stdio: 'pipe' });
      }
      
      // Update required directories (always)
      for (const dir of requiredDirs) {
        try {
          const destPath = path.join(targetDir, dir);
          
          console.log(chalk.blue(`- Updating required ${dir}/...`));
          
          execSync(`cd ${path.join(tempDir, 'semantq')} && git sparse-checkout set ${dir}`, { stdio: 'pipe' });
          
          // Remove existing directory
          fs.rmSync(destPath, { recursive: true, force: true });
          
          // Copy new files
          fs.copySync(path.join(tempDir, 'semantq', dir), destPath);
          
          console.log(chalk.green(`  ✓ Updated ${dir}/`));
        } catch (err) {
          console.log(chalk.red(`  ✖ Failed to update ${dir}/: ${err.message}`));
          throw err; // Fail completely if required directory can't be updated
        }
      }
      
      // Update optional directories (only if they exist or --restore is set)
      for (const dir of optionalDirs) {
        const destPath = path.join(targetDir, dir);
        const dirExists = fs.existsSync(destPath);
        
        if (dirExists || options.restore) {
          try {
            console.log(chalk.blue(`- ${dirExists ? 'Updating' : 'Restoring'} ${dir}/...`));
            
            execSync(`cd ${path.join(tempDir, 'semantq')} && git sparse-checkout set ${dir}`, { stdio: 'pipe' });
            
            // Remove existing directory if it exists
            if (dirExists) {
              fs.rmSync(destPath, { recursive: true, force: true });
            }
            
            // Copy new files
            fs.copySync(path.join(tempDir, 'semantq', dir), destPath);
            
            console.log(chalk.green(`  ✓ ${dirExists ? 'Updated' : 'Restored'} ${dir}/`));
          } catch (err) {
            console.log(chalk.yellow(`  ⚠️ Could not ${dirExists ? 'update' : 'restore'} ${dir}/: ${err.message}`));
          }
        } else {
          console.log(chalk.gray(`- Skipping ${dir}/ (not present in project)`));
        }
      }
      
      // Clean up temp directory
      fs.rmSync(tempDir, { recursive: true, force: true });

      // 3. Preserve config (show diff if modified)
      const userConfigPath = path.join(targetDir, 'semantq.config.js');
      const defaultConfigPath = path.join('node_modules', 'semantq', 'semantq.config.default.js');

      if (fs.existsSync(userConfigPath)) {
        console.log(chalk.yellow('\n⚠️ semantq.config.js was preserved (may need manual updates)'));
        if (fs.existsSync(defaultConfigPath)) {
          console.log(chalk.gray('Compare with default config:'));
          console.log(chalk.gray(`  ${defaultConfigPath}`));
        }
      }

      console.log(chalk.green.bold('\n✓ Update complete!'));
      console.log(chalk.blue('Restart your dev server to apply changes.'));

    } catch (error) {
      console.error(chalk.red('\n✖ Update failed:'), error.message);
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
