#!/usr/bin/env node
const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Define the command to generate the project structure
program
  .command('create <projectName>')
  .description('Generate the project structure')
  .action(async (projectName) => {
    const projectPath = path.join(process.cwd(), projectName);

    try {
      // Create parent directories
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
        'public'
      ];
      
      await Promise.all(directories.map(dir => fs.mkdir(path.join(projectPath, dir), { recursive: true })));
      

      // Define template and config paths
      const templateDirectory = path.resolve(__dirname, './templates');
      const configDirectory = path.resolve(__dirname, './configs');

      // Copy core_modules directory to the project directory
      fs.copySync(path.resolve(__dirname, './core_modules'), path.join(projectPath, 'core_modules'), {
        recursive: true,
        overwrite: true,
      });

      // Copy template files to the project directory
      fs.copySync(templateDirectory, projectPath, {
        recursive: true,
        overwrite: true,
      });

      // Copy Button.smq from templates folder to src/components directory
      const buttonSmqSource = path.join(templateDirectory, 'Button.smq');
      const buttonSmqDestination = path.join(projectPath, 'src', 'components', 'Button.smq');
      await fs.copyFile(buttonSmqSource, buttonSmqDestination);

      // Copy +404.smq from templates folder to src/routes directory
      const errorPageSmqSource = path.join(templateDirectory, '+404.smq');
      const errorPageSmqDestination = path.join(projectPath, 'src', 'routes', '+404.smq');
      await fs.copyFile(errorPageSmqSource, errorPageSmqDestination);

      // Create routes.js in build/routes directory
      await fs.writeFile(
        path.join(projectPath, 'build', 'routes', 'routes.js'),
        'export default [];'
      );

      // Copy config files (package.json, tsconfig.json, vite.config.js, etc.)
      fs.copySync(path.join(configDirectory, 'package.json'), path.join(projectPath, 'package.json'));
      fs.copySync(path.join(configDirectory, 'tsconfig.json'), path.join(projectPath, 'tsconfig.json'));
      fs.copySync(path.join(configDirectory, 'vite.config.js'), path.join(projectPath, 'vite.config.js'));

      // Install Vite and the HTML plugin
      execSync('npm install --save-dev vite@latest vite-plugin-html@latest', {
        cwd: projectPath,
        stdio: 'inherit',
      });

      console.log(`Project structure generated successfully at ${projectPath}`);
    } catch (error) {
      console.error('Error generating project:', error.message);
      console.error('Stack trace:', error.stack);
    }
  });

program.parse(process.argv);