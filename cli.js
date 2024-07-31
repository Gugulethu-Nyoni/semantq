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
            await fs.mkdir(path.join(projectPath, 'src', 'components'), { recursive: true });
            await fs.mkdir(path.join(projectPath, 'src', 'routes'), { recursive: true });
            await fs.mkdir(path.join(projectPath, 'build', 'components'), { recursive: true });
            await fs.mkdir(path.join(projectPath, 'build', 'routes'), { recursive: true });
            await fs.mkdir(path.join(projectPath, 'src', 'utils'), { recursive: true });
            await fs.mkdir(path.join(projectPath, 'src', 'styles'), { recursive: true });
            await fs.mkdir(path.join(projectPath, 'tests'), { recursive: true });
            await fs.mkdir(path.join(projectPath, 'docs'), { recursive: true });
            await fs.mkdir(path.join(projectPath, 'examples'), { recursive: true });
            await fs.mkdir(path.join(projectPath, 'public'), { recursive: true });

            // Create files

const templateDirectory = path.resolve(__dirname, './templates');
const projectDirectory = path.resolve(process.cwd(), projectName);


// Copy core_modules directory to the project directory
fs.copySync(path.resolve(__dirname, './core_modules'), path.join(projectPath, 'core_modules'), {
    recursive: true,
    overwrite: true
});


// Copy template files to the project directory
fs.copySync(templateDirectory, projectDirectory, {
  recursive: true,
  overwrite: true,
  filter: (src, dest) => {
    if (src.endsWith('/public/semantiq.svg')) {
      return src.replace('/public/', '/');
    }
    return src;
  }
});


// Copy Button.smq from templates folder to src/components directory
const templatesDirectory = path.join(__dirname, 'templates');
const buttonSmqSource = path.join(templatesDirectory, 'Button.smq');
const buttonSmqDestination = path.join(projectPath, 'src', 'components', 'Button.smq');
await fs.copyFile(buttonSmqSource, buttonSmqDestination);


// Copy +404.smq from templates folder to src/routes directory
const errorPageSmqSource = path.join(templatesDirectory, '+404.smq');
const errorPageSmqDestination = path.join(projectPath, 'src', 'routes', '+404.smq');
await fs.copyFile(errorPageSmqSource, errorPageSmqDestination);

// Create routes.js in build/routes directory
            await fs.writeFile(
                path.join(projectPath, 'build', 'routes', 'routes.js'),
                'export default [];'
            );


// Create package.json
/*
await fs.writeFile(
  path.join(projectPath, 'package.json'),
  JSON.stringify({
      name: projectName,
      version: '1.0.0',
      description: '',
      type: 'module',
      main: 'src/index.js',
      scripts: {
          start: 'node server.js',
          compile: 'NODE_OPTIONS="--import=./core_modules/register.js" node core_modules/compilers/index.ts',
          dev: 'vite',
          semantiq: 'node ./core_modules/artisan/cli.js'
      },
      keywords: [],
      author: '',
      license: 'ISC',
      dependencies: {},
      devDependencies: {
          "@swc/cli": "^0.3.12",
          "@swc/core": "^1.4.11",
          "@types/node": "^20.12.2",
          "ts-node": "^10.9.2",
          "typescript": "^5.4.3",
          "vite": "^5.2.7",
          "vite-plugin-html": "^3.2.2",
          "commander": "^9.2.0"
      }
  }, null, 4)
);
*/

      
        // Install Vite and the HTML plugin
execSync(`npm install --save-dev vite@latest vite-plugin-html@latest`, {
            cwd: projectPath,
            stdio: 'inherit',
        });

        // Create vite.config.js
        /*
await fs.writeFile(path.join(projectPath, 'vite.config.js'), `
            import { defineConfig } from 'vite';
            import { createHtmlPlugin } from 'vite-plugin-html';

            export default defineConfig({
              plugins: [
                createHtmlPlugin({
                  inject: true,
                }),
              ],
            });
        `);
*/
  fs.copySync(path.resolve(__dirname, './configs/package.json'), path.join(projectPath, 'package.json'));
  fs.copySync(path.resolve(__dirname, './configs/tsconfig.json'), path.join(projectPath, 'tsconfig.json'));
  fs.copySync(path.resolve(__dirname, './configs/cli.js'), path.join(projectPath, 'core_modules', 'artisan', 'cli.js'));
  fs.copySync(path.resolve(__dirname, './configs/vite.config.js'), path.join(projectPath, 'vite.config.js'));

        console.log(`Project structure generated successfully at ${projectPath}`);
    } catch (error) {
        console.error('Error generating project:', error);
    }
});

program.parse(process.argv);