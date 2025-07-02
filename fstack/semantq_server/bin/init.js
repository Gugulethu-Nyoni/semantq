import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyIfNotExists(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    console.log(`Created ${dest} from template.`);
  } else {
    console.log(`${dest} already exists.`);
  }
}

const projectRoot = path.resolve(__dirname, '..');

const envExample = path.join(projectRoot, '.env.example');
const envFile = path.join(projectRoot, '.env');

const configExample = path.join(projectRoot, 'config', 'semantiq.config.example.js');
const configFile = path.join(projectRoot, 'semantiq.config.js');

try {
  copyIfNotExists(envExample, envFile);
  copyIfNotExists(configExample, configFile);
  console.log('Initialization complete.');
} catch (err) {
  console.error('Error during initialization:', err);
  process.exit(1);
}
