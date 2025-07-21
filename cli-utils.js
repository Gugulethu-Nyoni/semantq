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

/**
 * Converts a string to camelCase.
 * Handles single words and multi-word PascalCase.
 * e.g., "ProductCategory" -> "productCategory"
 * e.g., "Product" -> "product"
 * e.g., "driverLocation" -> "driverLocation" (no change)
 */
function toCamelCase(name) {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

/**
 * Converts a string to PascalCase (first letter capitalized of each word, no hyphens).
 * This function will primarily capitalize the first letter if the input is already camelCase
 * or a single word.
 * e.g., "productCategory" -> "ProductCategory"
 * e.g., "product" -> "Product"
 */
function toPascalCase(name) {
  // Ensure the name is treated as a single string for PascalCase conversion
  // This helps if the input name is already "DriverLocation" or "productCategory"
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// --- Resource Generation Functions ---

// Generate Model function
export function generateModel(name, database, baseDir) {
  const namePascal = toPascalCase(name); // Use PascalCase for model file, class, and Mongoose model name
  const nameCamel = toCamelCase(name); // Use camelCase for Prisma model name in queries (e.g., prisma.driverLocation)
  let modelTemplate = '';

  switch (database) {
    case 'mongo':
      modelTemplate = `
import mongoose from 'mongoose';

const ${nameCamel}Schema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('${namePascal}', ${nameCamel}Schema);
`;
      break;

    case 'supabase':
    case 'mysql':
      modelTemplate = `
// Add to your schema.prisma:
/*
model ${namePascal} {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Add additional fields as needed
}
*/

// Import the function that returns the Prisma client promise
import getPrismaClient from '../../lib/prisma.js';

export default class ${namePascal}Model {
  /**
   * Creates a new ${nameCamel} in the database.
   * @param {object} data - The data for the new ${nameCamel}.
   * @returns {Promise<object>} The created ${nameCamel} object.
   */
  static async create(data) {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameCamel}.create({ data });
  }

  /**
   * Finds a ${nameCamel} by its unique ID.
   * @param {string} id - The ID of the ${nameCamel} to find.
   * @returns {Promise<object|null>} The found ${nameCamel} object, or null if not found.
   */
  static async findById(id) {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameCamel}.findUnique({ where: { id } });
  }

  /**
   * Retrieves all ${nameCamel}s from the database.
   * @returns {Promise<Array<object>>} An array of all ${nameCamel} objects.
   */
  static async findAll() {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameCamel}.findMany();
  }

  /**
   * Updates an existing ${nameCamel} by its ID.
   * @param {string} id - The ID of the ${nameCamel} to update.
   * @param {object} data - The data to update the ${nameCamel} with.
   * @returns {Promise<object>} The updated ${nameCamel} object.
   */
  static async update(id, data) {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameCamel}.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletes a ${nameCamel} by its ID.
   * @param {string} id - The ID of the ${nameCamel} to delete.
   * @returns {Promise<object>} The deleted ${nameCamel} object.
   */
  static async delete(id) {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameCamel}.delete({ where: { id } });
  }

  /**
   * Finds ${nameCamel}s with pagination.
   * @param {number} [skip=0] - The number of records to skip.
   * @param {number} [take=10] - The number of records to take.
   * @returns {Promise<Array<object>>} An array of ${nameCamel} objects for the given pagination.
   */
  static async findWithPagination(skip = 0, take = 10) {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameCamel}.findMany({
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
model ${namePascal} {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
*/

// Import the function that returns the Prisma client promise
import getPrismaClient from '../../lib/prisma.js';

export default class ${namePascal}Model {
  /**
   * Creates a new ${nameCamel} in the database.
   * @param {object} data - The data for the new ${nameCamel}.
   * @returns {Promise<object>} The created ${nameCamel} object.
   */
  static async create(data) {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameCamel}.create({ data });
  }

  /**
   * Finds a ${nameCamel} by its unique ID.
   * @param {string} id - The ID of the ${nameCamel} to find.
   * @returns {Promise<object|null>} The found ${nameCamel} object, or null if not found.
   */
  static async findById(id) {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameCamel}.findUnique({ where: { id } });
  }

  /**
   * Retrieves all ${nameCamel}s from the database.
   * @returns {Promise<Array<object>>} An array of all ${nameCamel} objects.
   */
  static async findAll() {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameCamel}.findMany();
  }

  /**
   * Updates an existing ${nameCamel} by its ID.
   * @param {string} id - The ID of the ${nameCamel} to update.
   * @param {object} data - The data to update the ${nameCamel} with.
   * @returns {Promise<object>} The updated ${nameCamel} object.
   */
  static async update(id, data) {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameCamel}.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletes a ${nameCamel} by its ID.
   * @param {string} id - The ID of the ${nameCamel} to delete.
   * @returns {Promise<object>} The deleted ${nameCamel} object.
   */
  static async delete(id) {
    const prisma = await getPrismaClient(); // Get the initialized Prisma client
    return prisma.${nameCamel}.delete({ where: { id } });
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
  const filePath = path.join(modelDir, `${namePascal}.js`); // File name in PascalCase
  writeFileIfNotExists(filePath, modelTemplate);
  console.log(`${SUCCESS_ICON} ${green(`Generated ${namePascal} model for`)} ${blue(database)}`);
  return true;
}

// Generate Service function
export function generateService(name, database, baseDir) {
  const namePascal = toPascalCase(name); // For class name and model import
  const nameCamel = toCamelCase(name); // For service instance variable name and file name

  const serviceTemplate = `
import ${namePascal}Model from '../models/${database}/${namePascal}.js';

class ${namePascal}Service {
  async create(data) {
    return await ${namePascal}Model.create(data);
  }

  async getById(id) {
    return await ${namePascal}Model.findById(id);
  }

  async getAll() {
    return await ${namePascal}Model.findAll();
  }

  async update(id, data) {
    return await ${namePascal}Model.update(id, data);
  }

  async delete(id) {
    return await ${namePascal}Model.delete(id);
  }
}

export default new ${namePascal}Service();
`;

  const serviceDir = path.join(baseDir, 'services');
  ensureDirectoryExists(serviceDir);
  const filePath = path.join(serviceDir, `${nameCamel}Service.js`); // File name in camelCase
  writeFileIfNotExists(filePath, serviceTemplate);
  console.log(`${SUCCESS_ICON} ${green(`Generated ${namePascal} service`)}`);
  return true;
}

// Generate Controller function
export function generateController(name, baseDir) {
  const namePascal = toPascalCase(name); // For class name and method names
  const nameCamel = toCamelCase(name); // For service import name, service variable, and file name

  const controllerTemplate = `
import ${nameCamel}Service from '../services/${nameCamel}Service.js';

class ${namePascal}Controller {
  async create${namePascal}(req, res) {
    try {
      const result = await ${nameCamel}Service.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async get${namePascal}ById(req, res) {
    try {
      const result = await ${nameCamel}Service.getById(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  async getAll${namePascal}s(req, res) {
    try {
      const result = await ${nameCamel}Service.getAll();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update${namePascal}(req, res) {
    try {
      // Parse ID from string to integer (for sqlite/mysql; mongo uses string IDs)
      const resourceId = parseInt(req.params.id, 10);

      // Validate parsed ID
      if (isNaN(resourceId)) {
        return res.status(400).json({ error: 'Invalid ${namePascal} ID provided. Must be a number.' });
      }

      const result = await ${nameCamel}Service.update(resourceId, req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete${namePascal}(req, res) {
    try {
      // Parse ID from string to integer (for sqlite/mysql; mongo uses string IDs)
      const resourceId = parseInt(req.params.id, 10);

      // Validate parsed ID
      if (isNaN(resourceId)) {
        return res.status(400).json({ error: 'Invalid ${namePascal} ID provided. Must be a number.' });
      }

      await ${nameCamel}Service.delete(resourceId);
      res.status(204).send();
    } catch (err) {
      if (err.message.includes("Record to delete does not exist")) {
        res.status(404).json({ error: "${namePascal} not found." });
      } else {
        res.status(400).json({ error: err.message });
      }
    }
  }
}

export default new ${namePascal}Controller();
`;

  const controllerDir = path.join(baseDir, 'controllers');
  ensureDirectoryExists(controllerDir);
  const filePath = path.join(controllerDir, `${nameCamel}Controller.js`); // File name in camelCase
  writeFileIfNotExists(filePath, controllerTemplate);
  console.log(`${SUCCESS_ICON} ${green(`Generated ${namePascal} controller`)}`);
  return true;
}

// Generate Route function
export function generateRoute(name, baseDir) {
  const namePascal = toPascalCase(name); // For comments and controller method calls
  const nameCamel = toCamelCase(name); // For controller import name, route path, and file name
  const pluralNameCamel = pluralize(nameCamel); // Pluralize the camelCase name for routes (e.g., driverLocations)

  const routeTemplate = `
import express from 'express';
import ${nameCamel}Controller from '../controllers/${nameCamel}Controller.js';

const router = express.Router();

// 🟢 Public ${namePascal} Routes
router.get('/${pluralNameCamel}', ${nameCamel}Controller.getAll${namePascal}s);
router.get('/${pluralNameCamel}/:id', ${nameCamel}Controller.get${namePascal}ById);
router.post('/${pluralNameCamel}', ${nameCamel}Controller.create${namePascal});
router.put('/${pluralNameCamel}/:id', ${nameCamel}Controller.update${namePascal});
router.delete('/${pluralNameCamel}/:id', ${nameCamel}Controller.delete${namePascal});

export default router;
`;

  const routeDir = path.join(baseDir, 'routes');
  ensureDirectoryExists(routeDir);
  const filePath = path.join(routeDir, `${nameCamel}Routes.js`); // File name in camelCase, e.g., driverLocationRoutes.js
  writeFileIfNotExists(filePath, routeTemplate);
  console.log(`${SUCCESS_ICON} ${green(`Generated ${namePascal} resources`)}`);
  return true;
}

// Main generateResource function
export async function generateResource(name, baseDir, database) {
  const namePascal = toPascalCase(name); // Ensure consistent PascalCase for display
  console.log(`\n${ROCKET_ICON} ${purpleBright(`Generating ${namePascal} resource files for:`)} ${blue(database)}\n`);

  if (!(await generateModel(name, database, baseDir))) {
    console.error(`${ERROR_ICON} ${errorRed('Resource generation aborted due to unsupported database type.')}`);
    return;
  }

  await generateService(name, database, baseDir);
  await generateController(name, baseDir);
  await generateRoute(name, baseDir);

  console.log(`\n${SPARKLES_ICON} ${purpleBright(`Successfully generated ${namePascal} resource files!`)}\n`);
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

      // Ensure the display name is PascalCase
      const displayResourceName = toPascalCase(resourceName);
      console.log(`${purpleBright('🚀')} ${blue('Generating')} ${purple(displayResourceName)} ${blue('resource for')} ${purple(databaseAdapter)}`);

      await generateResource(resourceName, serverDir, databaseAdapter);

      console.log(`${purpleBright('✨')} ${blue('Resource generation complete!')}`);
      console.log(`
${purpleBright('» Next steps:')}
  ${databaseAdapter === 'mongo' ?
    `${purpleBright('›')} ${gray('Your MongoDB model is ready to use')}` :
    `${purpleBright('›')} ${gray('Add the model to your schema.prisma')}
      ${purpleBright('›')} ${gray('Run:')} ${purple(`npx prisma migrate dev --name add_${toCamelCase(resourceName)}_model`)}`
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