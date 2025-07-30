// index.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CodeGenerator } from './CodeGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function transpileSemantqFile(inputFilePath, outputDirPath) {
    try {
        // Ensure output directory exists
        await fs.promises.mkdir(outputDirPath, { recursive: true });
        await fs.promises.mkdir(path.join(outputDirPath, 'runtime'), { recursive: true }); // Create runtime subfolder

        // Copy runtime helpers
        const runtimeSourcePath = path.join(__dirname, 'src', 'runtime', 'dom-helpers.js'); // Assuming source path
        const runtimeDestPath = path.join(outputDirPath, 'runtime', 'dom-helpers.js');
        await fs.promises.copyFile(runtimeSourcePath, runtimeDestPath);
        console.log(`Copied runtime helper: ${runtimeDestPath}`);

        // You might also copy semantq-state-library.js if it's local
        // const stateLibSourcePath = path.join(__dirname, 'src', 'runtime', 'semantq-state-library.js');
        // const stateLibDestPath = path.join(outputDirPath, 'runtime', 'semantq-state-library.js');
        // await fs.promises.copyFile(stateLibSourcePath, stateLibDestPath);
        // console.log(`Copied state library: ${stateLibDestPath}`);


        // ... (rest of your transpilation logic) ...
        const astString = await fs.promises.readFile(inputFilePath, 'utf-8');
        const unifiedAST = JSON.parse(astString);

        const generator = new CodeGenerator();
        const transpiledCode = generator.transpile(unifiedAST);

        const outputFileName = path.basename(inputFilePath, '.ast') + '.js';
        const componentOutputFilePath = path.join(outputDirPath, outputFileName);
        await fs.promises.writeFile(componentOutputFilePath, transpiledCode, 'utf-8');

        console.log(`Transpilation successful! Component output written to: ${componentOutputFilePath}`);

    } catch (error) {
        console.error('Error during transpilation:', error);
        process.exit(1);
    }
}

const unifiedAstPath = path.join(__dirname, 'unified.ast');
const outputDirectory = path.join(__dirname, 'dist');

transpileSemantqFile(unifiedAstPath, outputDirectory);