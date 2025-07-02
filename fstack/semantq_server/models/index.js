// models/index.js
import config from '../semantiq.config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url'; // <--- ADDED pathToFileURL here

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detect selected adapter
const adapter = config.database.adapter;
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
    // Ensure the path for dynamic import is a file URL
    const modulePath = pathToFileURL(path.join(modelsDir, file)).href; // Correctly uses pathToFileURL
    const modelModule = await import(modulePath);
    models[modelName] = modelModule.default || modelModule;
    console.log(`✅ Loaded model: ${modelName} from ${file}`);
  }
}

export default models;