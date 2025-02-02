#!/usr/bin/env node
const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

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

// Define the command to generate the project structure
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
        'src/components',
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

      // Copy essential files and directories
      safeCopySync(path.resolve(__dirname, './core_modules'), path.join(projectPath, 'core_modules'));
      safeCopySync(templateDirectory, projectPath);

      // Copy specific template files
      await copyIfExists(path.join(templateDirectory, 'Button.smq'), path.join(projectPath, 'src/components/Button.smq'));
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
    } catch (error) {
      console.error('❌ Error generating project:', error.message);
      console.error('Stack trace:', error.stack);
    }
  });

program.parse(process.argv);