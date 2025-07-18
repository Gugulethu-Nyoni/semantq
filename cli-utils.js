import path from 'path';
import fs from 'fs';
import { pathToFileURL } from 'url';
import { Command } from 'commander';
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

// --- Utility Functions ---

// Ensure directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
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

// Simple pluralization function
function pluralize(word) {
  if (word.toLowerCase().endsWith('y') && word.toLowerCase().length > 1 && !['a', 'e', 'i', 'o', 'u'].includes(word[word.length - 2].toLowerCase())) {
    return word.slice(0, -1) + 'ies';
  }
  if (word.toLowerCase().endsWith('s') || word.toLowerCase().endsWith('x') || word.toLowerCase().endsWith('ch') || word.toLowerCase().endsWith('sh')) {
    return word + 'es';
  }
  return word + 's';
}

// --- Resource Generation Functions ---

// Generate Model function
export function generateModel(name, database, baseDir) {
  const nameLower = name.toLowerCase();
  let modelTemplate = '';

  switch (database) {
    case 'mongo':
      modelTemplate = `
import mongoose from 'mongoose';

const ${nameLower}Schema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('${name}', ${nameLower}Schema);
`;
      break;

    case 'supabase':
    case 'mysql':
      modelTemplate = `
// Add to your schema.prisma:
/*
model ${name} {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Add additional fields as needed
}
*/

// Import the function that returns the Prisma client promise
import getPrismaClient from '../../lib/prisma.js';

export default class ${name}Model {
  /**
   * Creates a new ${nameLower} in the database.
   * @param {object} data - The data for the new ${nameLower}.
   * @returns {Promise<object>} The created ${nameLower} object.
   */
  static async create(data) {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameLower}.create({ data });
  }

  /**
   * Finds a ${nameLower} by its unique ID.
   * @param {string} id - The ID of the ${nameLower} to find.
   * @returns {Promise<object|null>} The found ${nameLower} object, or null if not found.
   */
  static async findById(id) {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameLower}.findUnique({ where: { id } });
  }

  /**
   * Retrieves all ${nameLower}s from the database.
   * @returns {Promise<Array<object>>} An array of all ${nameLower} objects.
   */
  static async findAll() {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameLower}.findMany();
  }

  /**
   * Updates an existing ${nameLower} by its ID.
   * @param {string} id - The ID of the ${nameLower} to update.
   * @param {object} data - The data to update the ${nameLower} with.
   * @returns {Promise<object>} The updated ${nameLower} object.
   */
  static async update(id, data) {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameLower}.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletes a ${nameLower} by its ID.
   * @param {string} id - The ID of the ${nameLower} to delete.
   * @returns {Promise<object>} The deleted ${nameLower} object.
   */
  static async delete(id) {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameLower}.delete({ where: { id } });
  }

  /**
   * Finds ${nameLower}s with pagination.
   * @param {number} [skip=0] - The number of records to skip.
   * @param {number} [take=10] - The number of records to take.
   * @returns {Promise<Array<object>>} An array of ${nameLower} objects for the given pagination.
   */
  static async findWithPagination(skip = 0, take = 10) {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameLower}.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' }, // Assuming 'createdAt' field exists for ordering
    });
  }
}
`;
      break;

    case 'sqlite':
      modelTemplate = `
// Add to your schema.prisma:
/*
model ${name} {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
*/

// Import the function that returns the Prisma client promise
import getPrismaClient from '../../lib/prisma.js';

export default class ${name}Model {
  /**
   * Creates a new ${nameLower} in the database.
   * @param {object} data - The data for the new ${nameLower}.
   * @returns {Promise<object>} The created ${nameLower} object.
   */
  static async create(data) {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameLower}.create({ data });
  }

  /**
   * Finds a ${nameLower} by its unique ID.
   * @param {string} id - The ID of the ${nameLower} to find.
   * @returns {Promise<object|null>} The found ${nameLower} object, or null if not found.
   */
  static async findById(id) {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameLower}.findUnique({ where: { id } });
  }

  /**
   * Retrieves all ${nameLower}s from the database.
   * @returns {Promise<Array<object>>} An array of all ${nameLower} objects.
   */
  static async findAll() {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameLower}.findMany();
  }

  /**
   * Updates an existing ${nameLower} by its ID.
   * @param {string} id - The ID of the ${nameLower} to update.
   * @param {object} data - The data to update the ${nameLower} with.
   * @returns {Promise<object>} The updated ${nameLower} object.
   */
  static async update(id, data) {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameLower}.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletes a ${nameLower} by its ID.
   * @param {string} id - The ID of the ${nameLower} to delete.
   * @returns {Promise<object>} The deleted ${nameLower} object.
   */
  static async delete(id) {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameLower}.delete({ where: { id } });
  }
}
`;
      break;

    default:
      console.log(`${ERROR_ICON} ${errorRed(`Unsupported database type:`)} ${gray(database)}`);
      return false;
  }

  const modelDir = path.join(baseDir, 'models', database);
  ensureDirectoryExists(modelDir);
  const filePath = path.join(modelDir, `${name}.js`);
  writeFileIfNotExists(filePath, modelTemplate);
  console.log(`${SUCCESS_ICON} ${green(`Generated ${name} model for`)} ${blue(database)}`);
  return true;
}

// Generate Service function
export function generateService(name, database, baseDir) {
  const nameLower = name.toLowerCase();

  const serviceTemplate = `
import ${name}Model from '../models/${database}/${name}.js';

class ${name}Service {
  async create(data) {
    return await ${name}Model.create(data);
  }

  async getById(id) {
    return await ${name}Model.findById(id);
  }

  async getAll() {
    return await ${name}Model.findAll();
  }

  async update(id, data) {
    return await ${name}Model.update(id, data);
  }

  async delete(id) {
    return await ${name}Model.delete(id);
  }
}

export default new ${name}Service();
`;

  const serviceDir = path.join(baseDir, 'services');
  ensureDirectoryExists(serviceDir);
  const filePath = path.join(serviceDir, `${nameLower}Service.js`);
  writeFileIfNotExists(filePath, serviceTemplate);
  console.log(`${SUCCESS_ICON} ${green(`Generated ${name} service`)}`);
  return true;
}

// Generate Controller function
export function generateController(name, baseDir) {
  const nameLower = name.toLowerCase();

  const controllerTemplate = `
import ${nameLower}Service from '../services/${nameLower}Service.js';

class ${name}Controller {
  async create${name}(req, res) {
    try {
      const result = await ${nameLower}Service.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async get${name}ById(req, res) {
    try {
      const result = await ${nameLower}Service.getById(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  async getAll${name}s(req, res) {
    try {
      const result = await ${nameLower}Service.getAll();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update${name}(req, res) {
    try {
      // Parse ID from string to integer
      const ${nameLower}Id = parseInt(req.params.id, 10);

      // Validate parsed ID
      if (isNaN(${nameLower}Id)) {
        return res.status(400).json({ error: 'Invalid ${name} ID provided. Must be a number.' });
      }

      const result = await ${nameLower}Service.update(${nameLower}Id, req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete${name}(req, res) {
    try {
      // Parse ID from string to integer
      const ${nameLower}Id = parseInt(req.params.id, 10);

      // Validate parsed ID
      if (isNaN(${nameLower}Id)) {
        return res.status(400).json({ error: 'Invalid ${name} ID provided. Must be a number.' });
      }

      await ${nameLower}Service.delete(${nameLower}Id);
      res.status(204).send();
    } catch (err) {
      if (err.message.includes("Record to delete does not exist")) {
        res.status(404).json({ error: "${name} not found." });
      } else {
        res.status(400).json({ error: err.message });
      }
    }
  }
}

export default new ${name}Controller();
`;

  const controllerDir = path.join(baseDir, 'controllers');
  ensureDirectoryExists(controllerDir);
  const filePath = path.join(controllerDir, `${nameLower}Controller.js`);
  writeFileIfNotExists(filePath, controllerTemplate);
  console.log(`${SUCCESS_ICON} ${green(`Generated ${name} controller`)}`);
  return true;
}




// Generate Route function
export function generateRoute(name, baseDir) {
  const nameLower = name.toLowerCase();
  const pluralName = pluralize(nameLower);
  const controllerName = `${nameLower}Controller`;

  const routeTemplate = `
import express from 'express';
import ${controllerName} from '../controllers/${controllerName}.js';

const router = express.Router();

// 🟢 Public ${name} Routes
router.get('/${pluralName}', ${controllerName}.getAll${name}s);
router.get('/${pluralName}/:id', ${controllerName}.get${name}ById);
router.post('/${pluralName}', ${controllerName}.create${name});
router.put('/${pluralName}/:id', ${controllerName}.update${name});
router.delete('/${pluralName}/:id', ${controllerName}.delete${name});

export default router;
`;

  const routeDir = path.join(baseDir, 'routes');
  ensureDirectoryExists(routeDir);
  const filePath = path.join(routeDir, `${nameLower}Routes.js`);
  writeFileIfNotExists(filePath, routeTemplate);
  console.log(`${SUCCESS_ICON} ${green(`Generated ${name} resources`)}`);
  return true;
}

// Main generateResource function
export async function generateResource(name, baseDir, database) {
  console.log(`\n${ROCKET_ICON} ${purpleBright(`Generating ${name} resource files for:`)} ${blue(database)}\n`);

  if (!(await generateModel(name, database, baseDir))) {
    console.error(`${ERROR_ICON} ${errorRed('Resource generation aborted due to unsupported database type.')}`);
    return;
  }

  await generateService(name, database, baseDir);
  await generateController(name, baseDir);
  await generateRoute(name, baseDir);

  console.log(`\n${SPARKLES_ICON} ${purpleBright(`Successfully generated ${name} resource files!`)}\n`);
}

async function readServerConfig(projectRoot) {
  const configPath = path.join(projectRoot, 'semantq_server', 'semantq.config.js');
  try {
    const fileUrl = typeof pathToFileURL !== 'undefined' 
      ? pathToFileURL(configPath).href
      : 'file://' + configPath.replace(/\\/g, '/');
    
    const config = await import(fileUrl);
    return config.default || config;
  } catch (error) {
    console.log(chalk.yellow(`⚠ Could not read semantq.config.js: ${error.message}`));
    return { database: { adapter: 'mysql' } };
  }
}

const program = new Command();

program
  .command('make:resource <resourceName>')
  .description('Generate full backend resource (Model, Controller, Service, Route)')
  .action(async (resourceName) => {
    const targetBaseDir = process.cwd();
    const serverDir = path.join(targetBaseDir, 'semantq_server');

    try {
      if (!fs.existsSync(serverDir)) {
        console.error(errorRed('✖ semantq_server directory not found.'));
        console.log(chalk.yellow('› Run this command from your project root with semantq_server installed.'));
        console.log(chalk.yellow('› To install the server, run: semantq install:server'));
        return;
      }

      const serverConfig = await readServerConfig(targetBaseDir);
      const databaseAdapter = serverConfig.database?.adapter || 'mysql';

      console.log(`${purpleBright('🚀')} ${blue('Generating')} ${purple(resourceName)} ${blue('resource for')} ${purple(databaseAdapter)}`);

      await generateResource(resourceName, serverDir, databaseAdapter);

      console.log(`${purpleBright('✨')} ${blue('Resource generation complete!')}`);
      console.log(`
${purpleBright('» Next steps:')}
  ${databaseAdapter === 'mongo' ?
    `${purpleBright('›')} ${gray('Your MongoDB model is ready to use')}` :
    `${purpleBright('›')} ${gray('Add the model to your schema.prisma')}
      ${purpleBright('›')} ${gray('Run:')} ${purple(`npx prisma migrate dev --name add_${resourceName.toLowerCase()}_model`)}`
  }
  ${purpleBright('›')} ${gray('Add the route to your main router if needed')}
  ${purpleBright('›')} ${gray('Restart your server to apply changes')}
`);
    } catch (error) {
      console.error(`${errorRed('✖')} ${blue('Error generating resource:')} ${errorRed(error.message)}`);
      if (error.stack) console.error(`${purpleBright('›')} ${gray('Stack trace:')} ${gray(error.stack)}`);
      process.exit(1);
    }
  });

export default program;
