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
// Generate Model function - FIXED for PostgreSQL
export function generateModel(name, database, baseDir) {
  const namePascal = toPascalCase(name);
  const nameCamel = toCamelCase(name);
  
  // SURGICAL FIX: Normalize database adapter name to directory name
  // Map 'postgresql' → 'postgresql' (keep as is for directory)
  // Map 'mysql' → 'mysql'
  // Map 'supabase' → 'supabase'
  // Map 'postgres' → 'postgresql' (if needed)
  let modelDirName = database;
  
  // Handle common variations
  if (database === 'postgres') {
    modelDirName = 'postgresql';
  }
  
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
    case 'postgresql': // ADDED: PostgreSQL case
    case 'postgres':   // ADDED: Alternative name
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
    const prisma = await getPrismaClient();
    return prisma.${nameCamel}.create({ data });
  }

  /**
   * Finds a ${nameCamel} by its unique ID.
   * @param {string} id - The ID of the ${nameCamel} to find.
   * @returns {Promise<object|null>} The found ${nameCamel} object, or null if not found.
   */
  static async findById(id) {
    const prisma = await getPrismaClient();
    return prisma.${nameCamel}.findUnique({ where: { id } });
  }

  /**
   * Retrieves all ${nameCamel}s from the database.
   * @returns {Promise<Array<object>>} An array of all ${nameCamel} objects.
   */
  static async findAll() {
    const prisma = await getPrismaClient();
    return prisma.${nameCamel}.findMany();
  }

  /**
   * Updates an existing ${nameCamel} by its ID.
   * @param {string} id - The ID of the ${nameCamel} to update.
   * @param {object} data - The data to update the ${nameCamel} with.
   * @returns {Promise<object>} The updated ${nameCamel} object.
   */
  static async update(id, data) {
    const prisma = await getPrismaClient();
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
    const prisma = await getPrismaClient();
    return prisma.${nameCamel}.delete({ where: { id } });
  }

  /**
   * Finds ${nameCamel}s with pagination.
   * @param {number} [skip=0] - The number of records to skip.
   * @param {number} [take=10] - The number of records to take.
   * @returns {Promise<Array<object>>} An array of ${nameCamel} objects for the given pagination.
   */
  static async findWithPagination(skip = 0, take = 10) {
    const prisma = await getPrismaClient();
    return prisma.${nameCamel}.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
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
  static async create(data) {
    const prisma = await getPrismaClient();
    return prisma.${nameCamel}.create({ data });
  }

  static async findById(id) {
    const prisma = await getPrismaClient();
    return prisma.${nameCamel}.findUnique({ where: { id } });
  }

  static async findAll() {
    const prisma = await getPrismaClient();
    return prisma.${nameCamel}.findMany();
  }

  static async update(id, data) {
    const prisma = await getPrismaClient();
    return prisma.${nameCamel}.update({
      where: { id },
      data,
    });
  }

  static async delete(id) {
    const prisma = await getPrismaClient();
    return prisma.${nameCamel}.delete({ where: { id } });
  }
}
`;
      break;

    default:
      console.log(`${ERROR_ICON} ${errorRed(`Unsupported database type:`)} ${gray(database)}`);
      return false;
  }

  // SURGICAL FIX: Use normalized directory name
  const modelDir = path.join(baseDir, 'models', modelDirName);
  ensureDirectoryExists(modelDir);
  const filePath = path.join(modelDir, `${namePascal}.js`);
  writeFileIfNotExists(filePath, modelTemplate);
  console.log(`${SUCCESS_ICON} ${green(`Generated ${namePascal} model for`)} ${blue(database)} ${gray(`→ ${modelDirName}/`)}`);
  return true;
}


// Generate Service function
export function generateService(name, database, baseDir, pylon = false) {
  const namePascal = toPascalCase(name);
  const nameCamel = toCamelCase(name);

  // CHOOSE TEMPLATE BASED ON PYLON OPTION
  const serviceTemplate = pylon ? 
    generatePylonServiceTemplate(namePascal, nameCamel, database) : // ← PASS database parameter
    generateStandardServiceTemplate(namePascal, nameCamel, database);

  const serviceDir = path.join(baseDir, 'services');
  ensureDirectoryExists(serviceDir);
  const filePath = path.join(serviceDir, `${nameCamel}Service.js`);
  writeFileIfNotExists(filePath, serviceTemplate);
  console.log(`${SUCCESS_ICON} ${green(`Generated ${namePascal} service`)} ${pylon ? purple('(Pylon-enabled)') : ''}`);
  return true;
}

// NEW: Pylon Service Template
// NEW: Pylon Service Template - ADD database parameter
function generatePylonServiceTemplate(namePascal, nameCamel, database) { // ← ADD database parameter
  return `
import ${namePascal}Model from '../models/${database}/${namePascal}.js';
import pylonService from '../node_modules/@semantq/pylon/services/pylonService.js';

class ${namePascal}Service {
  
  async create(req) {
    const data = req.body;          
    const userData = req.userData;

    try {
      const res = await ${namePascal}Model.create(data);
      console.log("${namePascal} Creation Response:", res);

      if (!res || !res.id) {
        console.error("${namePascal} creation failed — no ID returned from DB.");
        throw new Error("${namePascal} creation failed — invalid database response.");
      }
      
      if (userData && userData.organizationId) {
        console.log("1. inside metering");
        const usageLog = await pylonService.logUsage(userData);
        console.log("usageLog", usageLog);
      }
      
      return res;
    } catch (err) {
      console.error("${namePascal} creation error:", {
        message: err.message,
        code: err.code,
        meta: err.meta,
      });
      throw new Error(\`${namePascal} creation failed: \${err.message}\`);
    }
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
}



// EXISTING: Standard Service Template (keep as is)
function generateStandardServiceTemplate(namePascal, nameCamel, database) {
  return `
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
}



// Generate Controller function - ADD pylon parameter
export function generateController(name, baseDir, pylon = false) { // ← ADD pylon parameter
  const namePascal = toPascalCase(name); // For class name and method names
  const nameCamel = toCamelCase(name); // For service import name, service variable, and file name

  // CHOOSE TEMPLATE BASED ON PYLON OPTION
  const controllerTemplate = pylon ? 
    generatePylonControllerTemplate(namePascal, nameCamel) :
    generateStandardControllerTemplate(namePascal, nameCamel);

  const controllerDir = path.join(baseDir, 'controllers');
  ensureDirectoryExists(controllerDir);
  const filePath = path.join(controllerDir, `${nameCamel}Controller.js`);
  writeFileIfNotExists(filePath, controllerTemplate);
  console.log(`${SUCCESS_ICON} ${green(`Generated ${namePascal} controller`)} ${pylon ? purple('(Pylon-enabled)') : ''}`);
  return true;
}

// NEW: Pylon Controller Template
function generatePylonControllerTemplate(namePascal, nameCamel) {
  return `
import ${nameCamel}Service from '../services/${nameCamel}Service.js';

class ${namePascal}Controller {
  async create${namePascal}(req, res) {
    try {
      //console.log("User Data in Controller?", req.userData);
      const result = await ${nameCamel}Service.create(req);
      console.log("result", result);
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
}

// EXISTING: Standard Controller Template (keep as is)
function generateStandardControllerTemplate(namePascal, nameCamel) {
  return `
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
}


// Generate Route function
export function generateRoute(name, baseDir, pylon = false) {
  const namePascal = toPascalCase(name);
  const nameCamel = toCamelCase(name);
  const pluralNameCamel = pluralize(nameCamel);

  // CHOOSE TEMPLATE BASED ON PYLON OPTION
  const routeTemplate = pylon ? 
    generatePylonRouteTemplate(namePascal, nameCamel, pluralNameCamel) :
    generateStandardRouteTemplate(namePascal, nameCamel, pluralNameCamel);

  const routeDir = path.join(baseDir, 'routes');
  ensureDirectoryExists(routeDir);
  const filePath = path.join(routeDir, `${nameCamel}Routes.js`);
  writeFileIfNotExists(filePath, routeTemplate);
  console.log(`${SUCCESS_ICON} ${green(`Generated ${namePascal} routes`)} ${pylon ? purple('(Pylon-enabled)') : ''}`);
  return true;
}

// Standard Route Template (non-Pylon)
function generateStandardRouteTemplate(namePascal, nameCamel, pluralNameCamel) {
  return `
import express from 'express';
import ${nameCamel}Controller from '../controllers/${nameCamel}Controller.js';
// Import authentication and authorization middleware
import { validateApiKey } from '../middleware/validateApiKey.js';
import { authenticateToken } from '@semantq/auth/lib/middleware/authMiddleware.js';
import { authorize } from '@semantq/auth/lib/middleware/authorize.js';

const router = express.Router();

// =========================================================================
// 🔵 API_KEY - Service-to-service communication - DIRECT MIDDLEWARE
// THIS MUST COME FIRST to ensure it is not blocked by /${pluralNameCamel}/:id
// For example:
// router.get('/${pluralNameCamel}/stats', validateApiKey, ${nameCamel}Controller.get${namePascal}Stats);
// =========================================================================

// 🟢 PUBLIC - No authentication
// For example:
// router.get('/${pluralNameCamel}/public/:id', ${nameCamel}Controller.getPublic${namePascal}ById);
// router.get('/${pluralNameCamel}/latest', ${nameCamel}Controller.getLatest${namePascal}s);

// 🟡 AUTHENTICATED - Logged-in users only
router.get('/${pluralNameCamel}', authenticateToken, ${nameCamel}Controller.getAll${namePascal}s);
router.get('/${pluralNameCamel}/:id', authenticateToken, ${nameCamel}Controller.get${namePascal}ById);
router.post('/${pluralNameCamel}', authenticateToken, ${nameCamel}Controller.create${namePascal});
router.put('/${pluralNameCamel}/:id', authenticateToken, ${nameCamel}Controller.update${namePascal});
router.delete('/${pluralNameCamel}/:id', authenticateToken, ${nameCamel}Controller.delete${namePascal});

// 🟠 AUTHORIZED - Specific user roles
// For example, this route requires an access level of 2
// router.patch('/${pluralNameCamel}/:id', authenticateToken, authorize(2), ${nameCamel}Controller.patch${namePascal});
// router.delete('/${pluralNameCamel}/:id/admin', authenticateToken, authorize(3), ${nameCamel}Controller.adminDelete${namePascal});

// 🔴 FULLY_PROTECTED - API key + user authentication
// For example:
// router.post('/${pluralNameCamel}/bulk', validateApiKey, authenticateToken, ${nameCamel}Controller.bulkCreate${namePascal}s);

// 🚨 FULLY_AUTHORIZED - API key + user authentication + specific role
// For example:
// router.post('/${pluralNameCamel}/system', validateApiKey, authenticateToken, authorize(3), ${nameCamel}Controller.systemCreate${namePascal});

export default router;
`;
}

// Pylon Route Template (with feature guarding)
function generatePylonRouteTemplate(namePascal, nameCamel, pluralNameCamel) {
  return `
import express from 'express';
import ${nameCamel}Controller from '../controllers/${nameCamel}Controller.js';
// Import authentication and authorization middleware
import { validateApiKey } from '../middleware/validateApiKey.js';
import { authenticateToken } from '@semantq/auth/lib/middleware/authMiddleware.js';
import { authorize } from '@semantq/auth/lib/middleware/authorize.js';
import pylonService from '../node_modules/@semantq/pylon/services/pylonService.js';
const dataModel = '${namePascal}';

const router = express.Router();

// =========================================================================
// 🔵 API_KEY - Service-to-service communication - DIRECT MIDDLEWARE
// THIS MUST COME FIRST to ensure it is not blocked by /${pluralNameCamel}/:id
// For example:
// router.get(
//   '/${pluralNameCamel}/stats', 
//   validateApiKey,
//   pylonService.featureGuard(dataModel, 'read'),
//   ${nameCamel}Controller.get${namePascal}Stats
// );
// =========================================================================

// 🟢 PUBLIC - No authentication (No Pylon feature guarding)
// For example:
// router.get('/${pluralNameCamel}/public/:id', ${nameCamel}Controller.getPublic${namePascal}ById);
// router.get('/${pluralNameCamel}/latest', ${nameCamel}Controller.getLatest${namePascal}s);

// 🟡 AUTHENTICATED - Logged-in users only
router.get(
  '/${pluralNameCamel}',
  authenticateToken,
  pylonService.featureGuard(dataModel, 'read'),
  ${nameCamel}Controller.getAll${namePascal}s
);

router.get(
  '/${pluralNameCamel}/:id',
  authenticateToken,
  ${nameCamel}Controller.get${namePascal}ById
);

router.post(
  '/${pluralNameCamel}',
  authenticateToken,
  pylonService.featureGuard(dataModel, 'create'),
  ${nameCamel}Controller.create${namePascal}
);

router.put(
  '/${pluralNameCamel}/:id',
  authenticateToken,
  pylonService.featureGuard(dataModel, 'update'),
  ${nameCamel}Controller.update${namePascal}
);

router.delete(
  '/${pluralNameCamel}/:id',
  authenticateToken,
  pylonService.featureGuard(dataModel, 'delete'),
  ${nameCamel}Controller.delete${namePascal}
);

// 🟠 AUTHORIZED - Specific user roles
// For example, this route requires an access level of 2
// router.patch(
//   '/${pluralNameCamel}/:id',
//   authenticateToken,
//   authorize(2),
//   pylonService.featureGuard(dataModel, 'update'),
//   ${nameCamel}Controller.patch${namePascal}
// );
//
// router.delete(
//   '/${pluralNameCamel}/:id/admin',
//   authenticateToken,
//   authorize(3),
//   pylonService.featureGuard(dataModel, 'delete'),
//   ${nameCamel}Controller.adminDelete${namePascal}
// );

// 🔴 FULLY_PROTECTED - API key + user authentication
// For example:
// router.post(
//   '/${pluralNameCamel}/bulk',
//   validateApiKey,
//   authenticateToken,
//   pylonService.featureGuard(dataModel, 'create'),
//   ${nameCamel}Controller.bulkCreate${namePascal}s
// );
//
// router.get(
//   '/${pluralNameCamel}/system/stats',
//   validateApiKey,
//   authenticateToken,
//   pylonService.featureGuard(dataModel, 'read'),
//   ${nameCamel}Controller.getSystem${namePascal}Stats
// );

// 🚨 FULLY_AUTHORIZED - API key + user authentication + specific role
// For example:
// router.post(
//   '/${pluralNameCamel}/system',
//   validateApiKey,
//   authenticateToken,
//   authorize(3),
//   pylonService.featureGuard(dataModel, 'create'),
//   ${nameCamel}Controller.systemCreate${namePascal}
// );
//
// router.delete(
//   '/${pluralNameCamel}/system/:id',
//   validateApiKey,
//   authenticateToken,
//   authorize(3),
//   pylonService.featureGuard(dataModel, 'delete'),
//   ${nameCamel}Controller.systemDelete${namePascal}
// );

export default router;
`;
}



// Main generateResource function
// Main generateResource function - ADD pylon parameter
export async function generateResource(name, baseDir, database, pylon = false) {
  const namePascal = toPascalCase(name);
  console.log(`\n${ROCKET_ICON} ${purpleBright(`Generating ${namePascal} resource files for:`)} ${blue(database)}`);
  if (pylon) {
    console.log(`${purpleBright('🛡️')} ${blue('With Pylon feature guarding')}`);
  }
  console.log(); // Empty line for spacing

  if (!(await generateModel(name, database, baseDir))) {
    console.error(`${ERROR_ICON} ${errorRed('Resource generation aborted due to unsupported database type.')}`);
    return;
  }

  // CORRECTED: Use the pylon parameter, don't hardcode to false
  await generateService(name, database, baseDir, pylon); 
  await generateController(name, baseDir, pylon);
  await generateRoute(name, baseDir, pylon);

  console.log(`\n${SPARKLES_ICON} ${purpleBright(`Successfully generated ${namePascal} resource files!`)}\n`);
}


