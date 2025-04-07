#!/usr/bin/env node
import { program } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
//import { InferenceClient } from "@huggingface/inference";
import dotenv from 'dotenv';
import inquirer from 'inquirer';
import chalk from 'chalk';

// Load environment variables from .env file
dotenv.config();

//const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

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


 // Color palette
    const purple = chalk.hex('#b56ef0');
    const purpleBright = chalk.hex('#d8a1ff');
    const blue = chalk.hex('#6ec7ff');
    const errorRed = chalk.hex('#ff4d4d');
    const gray = chalk.hex('#aaaaaa');

   



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
    const targetBasePublic = path.join(targetBaseDir, 'public');
    const serverDir = resolvePath(targetBaseDir, 'server');
    const serverFilePath = resolvePath(serverDir, 'server.js');

    // Create the server directory if it doesn't exist
    if (!fs.existsSync(serverDir)) {
      fs.mkdirSync(serverDir, { recursive: true });
      console.log(`${purpleBright('✓')} ${blue('Created directory:')} ${purple(serverDir)}`);
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

// Automatically load all routes from the \`routes\` folder
const routesPath = path.join(baseDir, 'routes');
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith('Routes.js')) {
    const route = \`./routes/\${file}\`;
    import(route).then((module) => {
      const routeName = file.replace('Routes.js', '').toLowerCase();
      app.use(\`/api/\${routeName}\`, module.default);
      console.log(\`\${purpleBright('✓')} \${blue('Loaded route:')} /api/\${purple(routeName)}\`);
    }).catch((err) => console.error(\`\${errorRed('✖')} \${blue('Failed to load')} \${purple(file)}: \${errorRed(err.message || err)}\`));
  }
});

// Default route
app.get('/', (req, res) => res.send('API is running 🚀'));

// Start server
app.listen(PORT, () => console.log(\`\${chalk.green('●')} \${purple('Server running on')} \${blue(\`port \${PORT}\`)}\`));
`;

    fs.writeFileSync(serverFilePath, serverCode.trim());
console.log(
  `${purpleBright('✓')} ${blue('Server created file successfully.')} ${gray('Now you can create resources for your database or API-driven apps.')}`
);
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
console.log(`${blue('Installing')} ${purple('@supabase/supabase-js')}${gray('...')}`);

try {
  execSync('npm install @supabase/supabase-js', { cwd: targetBaseDir, stdio: 'inherit' });
  console.log(`${purpleBright('✓')} ${blue('Successfully installed')} ${purple('@supabase/supabase-js')}`);
} catch (error) {
  console.error(`${errorRed('✖')} ${blue('Failed to install')} ${purple('@supabase/supabase-js')}: ${errorRed(error.message)}`);
  process.exit(1);
}

// Step 2: Install dotenv
console.log(`${blue('Installing')} ${purple('dotenv')}${gray('...')}`);

try {
  execSync('npm install dotenv', { cwd: targetBaseDir, stdio: 'inherit' });
  console.log(`${purpleBright('✓')} ${blue('dotenv installed successfully!')}`);
} catch (error) {
  console.error(`${errorRed('✖')} ${blue('Failed to install')} ${purple('dotenv')}: ${errorRed(error.message)}`);
  process.exit(1);
}

// Step 3: Install @huggingface/inference
console.log(`${blue('Installing')} ${purple('@huggingface/inference')}${gray('...')}`);

try {
  execSync('npm install @huggingface/inference', { cwd: targetBaseDir, stdio: 'inherit' });
  console.log(`${purpleBright('✓')} ${blue('@huggingface/inference installed successfully!')}`);
} catch (error) {
  console.error(`${errorRed('✖')} ${blue('Failed to install')} ${purple('@huggingface/inference')}: ${errorRed(error.message)}`);
  process.exit(1);
}


    // Step 3: Create lib/supabaseConfig.js
    const libDir = resolvePath(targetBaseDir, 'lib');
    const supabaseConfigPath = resolvePath(libDir, 'supabaseConfig.js');

    // Create the lib directory if it doesn't exist
    if (!fs.existsSync(libDir)) {
      fs.mkdirSync(libDir, { recursive: true });
      console.log(`${purpleBright('✓')} ${blue('Created directory:')} ${purple(libDir)}`);
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
console.log(`${purpleBright('✓')} ${blue('Created file:')} ${purple(supabaseConfigPath)}`);
console.log(`${chalk.green('●')} ${purpleBright('Supabase setup complete!')}`);
console.log(`${purpleBright('›')} ${gray('Make sure that you have the correct')} ${purple('.env')} ${gray('set up for your')} ${purple('SUPABASE_URL')} ${gray('and')} ${purple('SUPABASE_ANON_KEY')} ${gray('in the root of your project.')}`);

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
      //await copyIfExists(resolvePath(templateDirectory, 'global.js'), resolvePath(targetBasePublic, 'global.js'));
      //await copyIfExists(resolvePath(templateDirectory, 'global.css'), resolvePath(targetBasePublic, 'global.css'));

      // PLACE (Copy) the router into src/semantq/router.js
      const sourceFile = path.resolve(sourceBaseDir, 'core_modules', 'router', 'router.js');
      const targetDir = path.resolve(targetBaseDir, 'src', 'semantq');
      const targetFile = path.join(targetDir, 'router.js');

      // Ensure that the target directory exists
      fs.ensureDirSync(targetDir);  // Creates the target directory if it doesn't exist

      // Copy the file from source to target
      fs.copySync(sourceFile, targetFile);


      //safeCopySync(resolvePath(sourceBaseDir, 'templates/public'), resolvePath(targetBaseDir, 'public'));
      // Copy the public directory recursively 
      fs.copySync(resolvePath(sourceBaseDir, 'templates/public'), resolvePath(targetBaseDir, 'public'));
      
      // Copy the public directory recursively 
      fs.copySync(resolvePath(sourceBaseDir, 'templates/components'), resolvePath(targetBaseDir, 'src/components'));
      // Create empty routes.js in src/routes
      await fs.writeFile(resolvePath(targetBaseDir, 'src/routes/routes.js'), 'export default [];');

      // Copy config files
      ['semantq.config.js','package.json', 'tsconfig.json', 'vite.config.js'].forEach(file =>
        safeCopySync(resolvePath(configDirectory, file), resolvePath(targetBaseDir, file))
      );

      // Install dependencies in the target project
      console.log('Installing dependencies...');
      // Install npm packages with suppressed warnings
      execSync('npm install --silent --no-warnings --no-audit --no-fund', { cwd: targetBaseDir, stdio: 'inherit' });
      // Install development dependencies with suppressed warnings
      execSync('npm install --save-dev --silent --no-warnings --no-audit --no-fund vite@latest vite-plugin-html@latest', { cwd: targetBaseDir, stdio: 'inherit' });

console.log(`${purpleBright('✓')} ${blue('Project structure generated successfully at')} ${purple(targetBaseDir)}`);
console.log(`${gray('Now you can run this command to go to')} ${purple(projectName)} ${gray('project directory:')} ${blue(`cd ${projectName}`)}`);    } catch (error) {
console.error(`${errorRed('✖')} ${blue('Error generating project:')} ${errorRed(error.message)}`);
console.error(`${purpleBright('›')} ${gray('Stack trace:')} ${gray(error.stack)}`);    }
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
//  MAKE:ROUTE COMMAND - FULL RESOURCES 
// ===========================================
program
  .command('make:route <routeName>')
  .description('Create a new route with stylish feedback')
  .option('-l, --layout', 'Add layout file')
  .option('-c, --config', 'Add config file')
  .option('-s, --server', 'Add server handlers')
  .option('-a, --all', 'Create all resources at once')
  .action(async (routeName, options) => {
    const { default: chalk } = await import('chalk');
    const { createSpinner } = await import('nanospinner');

    // Color palette
    const purple = chalk.hex('#b56ef0');
    const purpleBright = chalk.hex('#d8a1ff');
    const blue = chalk.hex('#6ec7ff');
    const errorRed = chalk.hex('#ff4d4d');
    const gray = chalk.hex('#aaaaaa');

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

${purpleBright.bold('Files:')}
${purpleBright('•')} ${purple('@page.smq')} ${gray('(base template)')}
${options.layout ? `${purpleBright('•')} ${purple('@layout.smq')}` : ''}
${options.config ? `${purpleBright('•')} ${purple('config.js')}` : ''}
${options.server ? `${purpleBright('•')} ${purple('server.js')}` : ''}

${blue.italic('Next steps:')}
  ${purpleBright('›')} Add route to ${purple('src/routes/routes.js')}
  ${purpleBright('›')} Run ${purple('semantq dev')} to test
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
//  SEMANTQ AI COMMANDS
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
      const outputPath = path.join(outputDir, "@page.html");

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
//  UPDATE COMMAND
// ===============================
program
  .command('update')
  .description('Update Semantq to the latest version (backup your project first)')
  .option('--dry-run', 'Show what would be updated without making changes')
  .action(async (options) => {
    const chalk = (await import('chalk')).default;
    const inquirer = (await import('inquirer')).default;
    const { execSync } = await import('child_process');
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
        console.log('• examples/');
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


// Parse CLI arguments
program.parse(process.argv);