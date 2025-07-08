import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

export function loadEnv() {
  const rootEnvPath = path.resolve(process.cwd(), '../.env');
  const localEnvPath = path.resolve(process.cwd(), '.env');

  if (fs.existsSync(rootEnvPath)) {
    dotenv.config({ path: rootEnvPath });
    console.log('Loaded environment variables from project root .env');
  } else if (fs.existsSync(localEnvPath)) {
    dotenv.config({ path: localEnvPath });
    console.log('Loaded environment variables from local semantq_server/.env');
  } else {
    console.warn('⚠️ No .env file found in project root or semantq_server folder');
  }
}
