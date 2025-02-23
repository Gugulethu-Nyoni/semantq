import path from 'path';
import { fileURLToPath } from 'url';

// Get the current module's directory using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Now resolve the paths as usual
const baseDir = __dirname;
const templateDirectory = path.join(baseDir, 'templates');
const coreModulesDirectory = path.join(baseDir, 'core_modules');
const configsDirectory = path.join(baseDir, 'configs');

// Log the resolved paths to verify correctness
console.log('Base Directory:', baseDir);
console.log('Template Directory:', templateDirectory);
console.log('Core Modules Directory:', coreModulesDirectory);
console.log('Configs Directory:', configsDirectory);