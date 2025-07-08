// models/index.js
import config from '../semantiq.config.js'; // This direct import of config is problematic for config_loader
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detect selected adapter
const adapter = config.database.adapter; // Problematic if config not loaded by config_loader
if (!adapter) {
  throw new Error('No database adapter configured in semantiq.config.js');
}

// Path to the adapter-specific models directory
const modelsDir = path.join(__dirname, adapter);

// Dynamically load all model files in the adapter directory
const models = {};

const files = fs.readdirSync(modelsDir);
for (const file of files) {
  if (file.endsWith('.js')) {
    const modelName = path.basename(file, '.js');
    const modulePath = pathToFileURL(path.join(modelsDir, file)).href;
    const modelModule = await import(modulePath);
    models[modelName] = modelModule.default || modelModule;
    console.log(`✅ Loaded model: ${modelName} from ${file}`);
  }
}

export default models;