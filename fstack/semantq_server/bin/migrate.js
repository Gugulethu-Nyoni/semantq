#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exit } from 'process';

import config from '../semantiq.config.js';

// Import DB adapter connector dynamically based on adapter config
const adapterName = config.database.adapter;
if (!adapterName) {
  console.error('❌ No database adapter defined in semantiq.config.js under database.adapter');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.resolve(__dirname, '../models/migrations', adapterName);

if (!fs.existsSync(migrationsDir)) {
  console.error(`❌ Migration directory does not exist for adapter "${adapterName}": ${migrationsDir}`);
  process.exit(1);
}

async function loadAdapter() {
  try {
    const adapterPath = `../models/adapters/${adapterName}.js`;
    const adapterModule = await import(adapterPath);
    return adapterModule.default;
  } catch (err) {
    console.error(`❌ Failed to load adapter ${adapterName}:`, err);
    process.exit(1);
  }
}

async function getAppliedMigrations(db) {
  try {
    const [rows] = await db.query('SELECT name FROM migrations');
    return rows.map(row => row.name);
  } catch (err) {
    // If migrations table doesn't exist, create it
    if (err.code === 'ER_NO_SUCH_TABLE' || err.code === '42P01') { // MySQL or Postgres error code for missing table
      console.log('⚠️ migrations table missing, creating...');
      await db.query(`
        CREATE TABLE migrations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL,
          applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      return [];
    }
    throw err;
  }
}

async function runMigrationFile(db, filePath) {
  const ext = path.extname(filePath);
  if (ext === '.sql') {
    // Run SQL migration
    const sql = fs.readFileSync(filePath, 'utf8');
    await db.query(sql);
  } else if (ext === '.js') {
    // Run JS migration
    const migration = await import(filePath);
    if (migration.up && typeof migration.up === 'function') {
      await migration.up(db);
    } else {
      throw new Error(`Migration file ${filePath} missing async 'up(db)' export function`);
    }
  } else {
    throw new Error(`Unsupported migration file type: ${filePath}`);
  }
}

async function main() {
  console.log(`🚀 Running migrations for adapter: ${adapterName}`);

  const db = await loadAdapter();

  const appliedMigrations = await getAppliedMigrations(db);

  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql') || f.endsWith('.js'))
    .sort();

  for (const file of migrationFiles) {
    if (appliedMigrations.includes(file)) {
      console.log(`✔️ Skipping already applied migration: ${file}`);
      continue;
    }

    console.log(`⬆️ Applying migration: ${file}`);
    try {
      await runMigrationFile(db, path.join(migrationsDir, file));
      await db.query('INSERT INTO migrations (name) VALUES (?)', [file]);
      console.log(`✅ Migration applied: ${file}`);
    } catch (err) {
      console.error(`❌ Failed migration: ${file}`, err);
      process.exit(1);
    }
  }

  console.log('🎉 All migrations applied successfully!');
  process.exit(0);
}

main();
