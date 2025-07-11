// cli-utils.js
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

// CLI Color palette
const purple = chalk.hex('#b56ef0');
const purpleBright = chalk.hex('#d8a1ff');
const blue = chalk.hex('#6ec7ff');
const green = chalk.hex('#6ef0b5');
const yellow = chalk.hex('#f0e66e');
const errorRed = chalk.hex('#ff4d4d');
const gray = chalk.hex('#aaaaaa');
const cyan = chalk.hex('#6ef0e6');

// Icons
const SUCCESS_ICON = green('✓');
const WARNING_ICON = yellow('⚠');
const ERROR_ICON = errorRed('✗');
const INFO_ICON = blue('ℹ');
const FOLDER_ICON = purple('📁');
const FILE_ICON = cyan('📄');
const ROCKET_ICON = purpleBright('🚀');
const SPARKLES_ICON = purple('✨');

// Ensure directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); // Corrected line
    console.log(`${FOLDER_ICON} ${purple('Created directory:')} ${gray(dirPath)}`);
  }
}

// Write file only if it doesn't exist
function writeFileIfNotExists(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content.trim());
    console.log(`${SUCCESS_ICON} ${FILE_ICON} ${green('Created:')} ${gray(filePath)}`);
  } else {
    console.log(`${WARNING_ICON} ${yellow('Skipped:')} ${gray(filePath)} ${gray('(already exists)')}`);
  }
}

// Update index.js for easier imports
function updateIndexFile(dirPath, name) {
  const indexPath = path.join(dirPath, 'index.js');
  const exportStatement = `export { default as ${name} } from './${name}.js';\n`;

  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, exportStatement);
    console.log(`${SUCCESS_ICON} ${FILE_ICON} ${green('Created index:')} ${gray(indexPath)}`);
  } else {
    const content = fs.readFileSync(indexPath, 'utf-8');
    if (!content.includes(exportStatement)) {
      fs.appendFileSync(indexPath, exportStatement);
      console.log(`${SUCCESS_ICON} ${green('Updated index:')} ${gray(indexPath)}`);
    }
  }
}

// Simple pluralization function (basic case for common words)
function pluralize(word) {
  if (word.toLowerCase().endsWith('y')) {
    return word.slice(0, -1) + 'ies'; // e.g., "city" -> "cities"
  }
  return word + 's'; // Default: User -> Users
}

// Generate Model function
export function generateModel(name, database, baseDir) {
  const nameLower = name.toLowerCase();
  const pluralName = pluralize(nameLower);
  let modelTemplate = '';

  switch (database) {
    case 'mongo':
      modelTemplate = `
import mongoose from 'mongoose';

const ${nameLower}Schema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// CRUD static methods here...

export default mongoose.model('${name}', ${nameLower}Schema);
`;
      break;

    case 'supabase':
      modelTemplate = `
import { supabase } from '../../lib/supabaseConfig.js';

export default class ${name} {
  constructor(data) {
    this.data = data;
  }

  static async createRecord(data) {
    const { data: record, error } = await supabase
      .from('${pluralName}')
      .insert([data])
      .single();
    if (error) throw error;
    return record;
  }

  // Other CRUD methods here...
}
`;
      break;

    case 'mysql':
      modelTemplate = `
import { v4 as uuidv4 } from 'uuid';
import db from '../adapters/mysql.js';

const ${name}Model = {
  async findById(id) {
    const [rows] = await db.query('SELECT * FROM ${pluralName} WHERE id = ?', [id]);
    return rows[0];
  },

  async findAll() {
    const [rows] = await db.query('SELECT * FROM ${pluralName}');
    return rows;
  },

  async create(data) {
    const { name, description, status = 'active' } = data;
    const uuid = uuidv4();
    await db.query(
      'INSERT INTO ${pluralName} (name, description, status) VALUES (?, ?, ?)',
      [name, description, status]
    );
    const [rows] = await db.query('SELECT * FROM ${pluralName} WHERE name = ?', [name]);
    return rows[0];
  },

  async update(id, data) {
    const { name, description, status } = data;
    await db.query(
      'UPDATE ${pluralName} SET name = ?, description = ?, status = ? WHERE id = ?',
      [name, description, status, id]
    );
    const [rows] = await db.query('SELECT * FROM ${pluralName} WHERE id = ?', [id]);
    return rows[0];
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM ${pluralName} WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

export default ${name}Model;
`;
      break;

    default:
      console.log(`${ERROR_ICON} ${errorRed(`Unsupported database type:`)} ${gray(database)}`);
      return;
  }

  const modelDir = path.join(baseDir, 'models', database);
  ensureDirectoryExists(modelDir);
  const filePath = path.join(modelDir, `${name}.js`);
  writeFileIfNotExists(filePath, modelTemplate);
  updateIndexFile(modelDir, name);
  console.log(`${SUCCESS_ICON} ${green(`Generated ${name} model for`)} ${blue(database)}`);
}

// Generate Service function
export function generateService(name, database, baseDir) {
  const nameLower = name.toLowerCase();
  const pluralName = pluralize(name);

  const serviceTemplate = `
import models from '../models/index.js';

const ${nameLower}Model = models.${name}Model;

class ${name}Service {
  async create(data) {
    return await ${nameLower}Model.create(data);
  }

  async getById(id) {
    return await ${nameLower}Model.findById(id);
  }

  async getAll() {
    return await ${nameLower}Model.findAll();
  }

  async update(id, data) {
    return await ${nameLower}Model.update(id, data);
  }

  async delete(id) {
    return await ${nameLower}Model.delete(id);
  }
}

export default new ${name}Service();
`;

  const serviceDir = path.join(baseDir, 'services');
  ensureDirectoryExists(serviceDir);
  const filePath = path.join(serviceDir, `${nameLower}Service.js`);
  writeFileIfNotExists(filePath, serviceTemplate);
  updateIndexFile(serviceDir, `${name}Service`);
  console.log(`${SUCCESS_ICON} ${green(`Generated ${name} service`)}`);
}

// Generate Controller function
export function generateController(name, baseDir) {
  const nameLower = name.toLowerCase();
  const pluralName = pluralize(name);

  const controllerTemplate = `
import ${nameLower}Service from '../services/${nameLower}Service.js';

class ${name}Controller {
  async create(req, res) {
    try {
      const result = await ${nameLower}Service.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const result = await ${nameLower}Service.getById(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const result = await ${nameLower}Service.getAll();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const result = await ${nameLower}Service.update(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await ${nameLower}Service.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export default new ${name}Controller();
`;

  const controllerDir = path.join(baseDir, 'controllers');
  ensureDirectoryExists(controllerDir);
  const filePath = path.join(controllerDir, `${nameLower}Controller.js`);
  writeFileIfNotExists(filePath, controllerTemplate);
  updateIndexFile(controllerDir, `${name}Controller`);
  console.log(`${SUCCESS_ICON} ${green(`Generated ${name} controller`)}`);
}

// Generate Route function
export function generateRoute(name, baseDir) {
  const nameLower = name.toLowerCase();
  const pluralName = pluralize(nameLower);

  const routeTemplate = `
import express from 'express';
import ${nameLower}Controller from '../controllers/${nameLower}Controller.js';

const router = express.Router();

router.post('/${pluralName}', ${nameLower}Controller.create);
router.get('/${pluralName}/:id', ${nameLower}Controller.getById);
router.get('/${pluralName}', ${nameLower}Controller.getAll);
router.put('/${pluralName}/:id', ${nameLower}Controller.update);
router.delete('/${pluralName}/:id', ${nameLower}Controller.delete);

export default router;
`;

  const routeDir = path.join(baseDir, 'routes');
  ensureDirectoryExists(routeDir);
  const filePath = path.join(routeDir, `${nameLower}Routes.js`);
  writeFileIfNotExists(filePath, routeTemplate);
  updateIndexFile(routeDir, `${nameLower}Routes`);
  console.log(`${SUCCESS_ICON} ${green(`Generated ${name} route`)}`);
}

export async function generateResource(name, database, baseDir) {
  console.log(`\n${ROCKET_ICON} ${purpleBright(`Generating ${name} resource files for:`)} ${blue(database)}\n`);

  await generateModel(name, database, baseDir);
  await generateService(name, database, baseDir);
  await generateController(name, baseDir);
  await generateRoute(name, baseDir);

  console.log(`\n${SPARKLES_ICON} ${purpleBright(`Successfully generated ${name} resource files!`)}\n`);
}
