#!/usr/bin/env node
import { program } from 'commander';
import fs from 'fs-extra'; // fs-extra is imported as fs
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
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


// ===============================
// EXTRACTED: INSTALL SERVER LOGIC
// ===============================
// Extracted function for installing the Semantq server
async function installSemantqServer(targetBaseDir) {
  const serverDir = path.join(targetBaseDir, 'semantq_server');
  const repoURL = 'https://github.com/Gugulethu-Nyoni/semantq_server.git';

  try {
    // Check if semantq_server already exists
    try {
      await fs.access(serverDir);
      console.error(errorRed(`✖ Directory 'semantq_server' already exists in this project.`));
      console.log(chalk.yellow(`› Remove it or rename it before running this command.`));
      return false; // Indicate that installation was skipped due to existing directory
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err; // Re-throw other errors
      }
      // Directory does not exist, which is what we want, so continue
    }

    const spinner = ora(blue(`Cloning Semantq server package into ${purple('semantq_server/')}`)).start();

    // Clone using degit
    const emitter = degit(repoURL, { cache: false, force: true });
    await emitter.clone(serverDir);

    spinner.succeed(blue(`✓ Semantq server installed at ${purple('semantq_server/')}`));

    // Install dependencies in the new server directory
    console.log(blue(`Installing dependencies in ${purple('semantq_server/')}`));
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
    console.log(blue('✅ Copied public assets to /public'));

    // Copy routes/* → projectRoot/src/routes
    const srcRoutes = path.join(tempDir, 'routes');
    const destRoutes = path.join(projectRoot, 'src', 'routes');
    await fs.copy(srcRoutes, destRoutes, { overwrite: true }); // Ensure overwrite is true
    console.log(blue('✅ Copied route files to /src/routes'));

    // Clean up
    await fs.remove(tempDir);
    console.log(gray('🧹 Removed temporary directory'));

    console.log(purpleBright('\n✨ Semantq Auth UI installed successfully!\n'));
    return true; // Indicate success
  } catch (err) {
    console.error(errorRed('❌ Installation failed:'), err.message);
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
      // Create empty routes.js in src/routes (this line is redundant as it's done above)
      // await fs.writeFile(resolvePath(targetBaseDir, 'src/routes/routes.js'), 'export default [];');

      // Copy config files
      ['semantq.config.js','package.json', 'tsconfig.json', 'vite.config.js'].forEach(file =>
        safeCopySync(resolvePath(configDirectory, file), resolvePath(targetBaseDir, file))
      );

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
          const serverDir = path.join(targetBaseDir, 'semantq_server');
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
  ${purpleBright('›')} ${gray('Configure your auth settings in')} ${purple('semantq_server/semantq.config.js')}
  ${purpleBright('›')} ${gray('Run database migrations:')} ${purple('cd semantq_server && semantq migrate')}
  ${purpleBright('›')} ${gray('Start both client and server:')}
    ${purple('npm run dev')} ${gray('(in project root for client)')}
    ${purple('npm run dev')} ${gray('(in semantq_server for server)')}
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
// INSTALL:TAILWIND COMMAND
// ===============================
program
  .command('install:tailwind')
  .description('Install and configure Tailwind CSS for Semantq')
  .action(() => {
    const targetBaseDir = process.cwd(); // Use the current working directory as the target

    try {
      console.log(`${purpleBright('📦')} ${blue('Installing')} ${purple('Tailwind CSS')} ${blue('and dependencies')}${gray('...')}`);
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
      console.log(`${purpleBright('✓')} ${blue('Configured content paths in')} ${purple('tailwind.config.js')}`);
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
      console.log(`${purpleBright('✓')} ${blue('Updated')} ${purple('vite.config.js')}`); // or 'Created' based on actual operation

      // Step 5: Append Tailwind directives to global.css
      const globalCSSPath = resolvePath(targetBaseDir, 'global.css');
      const tailwindDirectives = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`;

      if (fs.existsSync(globalCSSPath)) {
        // Read the existing content
        const existingContent = fs.readFileSync(globalCSSPath, 'utf-8');

        // Write Tailwind directives at the top and append the existing content
        fs.writeFileSync(globalCSSPath, tailwindDirectives + existingContent);
        console.log(`${purpleBright('✓')} ${blue('Appended Tailwind directives to the top of')} ${purple('global.css')}`);
      } else {
        // Create global.css with Tailwind directives if it doesn't exist
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
  .option('-c, --config', 'Add config file')
  .option('-s, --server', 'Add server handlers')
  .option('-a, --all', 'Create all resources at once')
  .action(async (routeName, options) => {
    // Note: chalk and nanospinner are imported here, ensure they are available
    const { createSpinner } = await import('nanospinner');

    // Color palette (already defined globally, but re-defined here for local scope consistency)
    // Removed redundant chalk import as it's global now
    // const purple = chalk.hex('#b56ef0');
    // const purpleBright = chalk.hex('#d8a1ff');
    // const blue = chalk.hex('#6ec7ff');
    // const errorRed = chalk.hex('#ff4d4d');
    // const gray = chalk.hex('#aaaaaa');

    try {
      const routePath = resolvePath(process.cwd(), 'src/routes', routeName);

      // Check if route exists
      if (fs.existsSync(routePath)) {
        const spinner = createSpinner(purple(`Checking route ${routeName}...`)).start();
        spinner.error({ text: errorRed('Route already exists!') });
        return;
      }

      // Create all resources if -a flag is set
      if (options.all) {
        options.layout = true;
        options.config = true;
        options.server = true;
      }

      // Create directory
      const dirSpinner = createSpinner(purple('Creating route structure...')).start();
      fs.mkdirSync(routePath, { recursive: true });
      dirSpinner.success({ text: purpleBright('Route directory created') });

      // File templates
      const files = {
        '@page.smq': `@script\n\n@end\n\n@style\n\n@end\n\n@html\n  ${routeName} Page\n`,
        '@layout.smq': options.layout ? `@script\n// Imports only\n@end\n\n@head\n\n@end\n\n@body\n\n@end\n\n@footer\n\n@end\n` : null,
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
  middleware: []
}` : null,
        'server.js': options.server ? `export default {\n  get() { /* ... */ }\n};` : null
      };

      // File creation with visual feedback
      for (const [filename, content] of Object.entries(files)) {
        if (content) {
          const spinner = createSpinner(purple(`Creating ${filename}`)).start();
          await new Promise(resolve => setTimeout(resolve, 200)); // Visual delay
          fs.writeFileSync(resolvePath(routePath, filename), content.trim());
          spinner.success({
            text: `${purpleBright('✓')} ${purple(filename)} ${blue('created')}`
          });
        }
      }

      // Success message
      console.log(`
${purple.bold('» Route created successfully!')}

${purpleBright.bold('Files created:')}
${purpleBright('•')} ${purple('@page.smq')} ${gray('(base template)')}
${options.layout ? `${purpleBright('•')} ${purple('@layout.smq')}` : ''}
${options.config ? `${purpleBright('•')} ${purple('config.js')}` : ''}
${options.server ? `${purpleBright('•')} ${purple('server.js')}` : ''}

${blue.italic('Next steps:')}
  ${purpleBright('›')} Go to ${purple(routeName)} to edit your route files
  ${purpleBright('›')} Then run ${purple('npm run dev')} to test
`);

    } catch (error) {
      console.log(`
${errorRed('✖ Error:')} ${error.message}

${blue('Troubleshooting:')}
  ${purpleBright('›')} Check directory permissions
  ${purpleBright('›')} Verify disk space
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
      console.log(chalk.gray(`  › Run ${chalk.yellow('cd semantq_server')}`));
      console.log(chalk.gray(`  › Start your server with ${chalk.yellow('npm run dev')}`));
    } catch (error) {
      // Error already logged by installSemantqServer
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
      // Error already logged by addSemantqAuthUI
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
// UPDATE COMMAND
// ===============================
program
  .command('update')
  .description('Update Semantq to the latest version (backup your project first)')
  .option('--dry-run', 'Show what would be updated without making changes')
  .action(async (options) => {
    const targetDir = process.cwd();

    try {
      // Get versions
      const latestVersion = execSync('npm view semantq version', { encoding: 'utf-8' }).trim();
      const currentVersion = JSON.parse(fs.readFileSync('package.json', 'utf-8')).version;

      if (latestVersion === currentVersion) {
        console.log(chalk.green('✓ Already on latest version (v' + currentVersion + ')'));
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
        console.log('• core_modules/');
        console.log('• docs/');
        console.log('• • examples/');
        console.log(chalk.gray('(Add --force to actually apply changes)'));
        return;
      }

      // Perform update
      console.log(chalk.blue('Updating Semantq...'));

      // 1. Install latest version
      execSync('npm install semantq@latest', { stdio: 'inherit' });

      // 2. Update core directories (force overwrite)
      const dirsToUpdate = ['core_modules', 'docs', 'examples'];
      dirsToUpdate.forEach(dir => {
        const source = path.join('node_modules', 'semantq', dir);
        const dest = path.join(targetDir, dir);

        fs.rmSync(dest, { recursive: true, force: true });
        fs.copySync(source, dest);
        console.log(chalk.green(`✓ Updated ${dir}/`));
      });

      // 3. Preserve config (show diff if modified)
      const userConfigPath = path.join(targetDir, 'semantq.config.js');
      const defaultConfigPath = path.join('node_modules', 'semantq', 'semantq.config.default.js');

      if (fs.existsSync(userConfigPath)) {
        console.log(chalk.yellow('⚠️ semantq.config.js was preserved (may need manual updates)'));
        if (fs.existsSync(defaultConfigPath)) {
          console.log(chalk.gray('Compare with default config:'));
          console.log(chalk.gray(`  ${defaultConfigPath}`));
        }
      }

      console.log(chalk.green.bold('\n✓ Update complete!'));
      console.log(chalk.blue('Restart your dev server to apply changes.'));

    } catch (error) {
      console.error(chalk.red('✖ Update failed:'), error.message);
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
