#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // This is /myapp/semantq_server/bin

// Path to the 'semantq_server' directory itself (parent of 'bin')
const semantqServerDir = path.resolve(__dirname, '..'); // This is /myapp/semantq_server

// Path to the overall project root (parent of 'semantq_server')
// This is two levels up from 'bin', or one level up from 'semantq_serverDir'
const containingProjectRoot = path.resolve(__dirname, '..', '..'); // This is /myapp/

function copyIfNotExists(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    console.log(`Created ${dest} from template.`);
  } else {
    console.log(`${dest} already exists.`);
  }
}

// --- MODIFIED LINE FOR .env FILE ---
// We want .env to be copied to the containing project root (e.g., /myapp/.env)
const envExample = path.join(semantqServerDir, '.env.example'); // .env.example is inside semantq_server
const envFile = path.join(containingProjectRoot, '.env'); // .env goes to the containing project root
// --- END MODIFIED LINE ---

// For semantiq.config.js, we assume it's copied into the semantq_server directory itself
// This is consistent with config_loader's fallback logic.
const configExample = path.join(semantqServerDir, 'config', 'semantiq.config.example.js');
const configFile = path.join(semantqServerDir, 'semantiq.config.js');


try {
  copyIfNotExists(envExample, envFile);
  copyIfNotExists(configExample, configFile);
  console.log('Initialization complete.');
} catch (err) {
  console.error('Error during initialization:', err);
  process.exit(1);
}