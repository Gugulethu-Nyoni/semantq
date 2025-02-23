// cli-utils.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Write file only if it doesn't exist
function writeFileIfNotExists(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content.trim());
    console.log(`✅ Created: ${filePath}`);
  } else {
    console.warn(`⚠️ Skipped: ${filePath} already exists.`);
  }
}

// Update index.js for easier imports
function updateIndexFile(dirPath, name) {
  const indexPath = path.join(dirPath, 'index.js');
  const exportStatement = `export { default as ${name} } from './${name}.js';\n`;

  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, exportStatement);
  } else {
    const content = fs.readFileSync(indexPath, 'utf-8');
    if (!content.includes(exportStatement)) {
      fs.appendFileSync(indexPath, exportStatement);
    }
  }
}

// Main resource generation function
export function generateResource(name, database) {
  const folders = ['models', 'services', 'controllers', 'routes'];
  folders.forEach(folder => ensureDirectoryExists(path.join(__dirname, `server/${folder}`)));

  generateModel(name, database);
  generateService(name,database);
  generateController(name);
  generateRoute(name);

  console.log(`🎉 Successfully generated ${name} resource with ${database} adapter!`);
}

// Simple pluralization function (basic case for common words)
function pluralize(word) {
  if (word.toLowerCase().endsWith('y')) {
    return word.slice(0, -1) + 'ies'; // e.g., "city" -> "cities"
  }
  return word + 's'; // Default case: "User" -> "Users"
}

// Generate Model with CRUD operations and actual record fetching
// Generate Model function
export function generateModel(name, database) {
  const nameLower = name.toLowerCase();
  const pluralName = pluralize(nameLower);//`${nameLower}s`; // Plural table name for Supabase
  
  let modelTemplate = '';

  switch (database) {
    case 'mongo':
      // MongoDB model schema
      modelTemplate = `
import mongoose from 'mongoose';

const ${nameLower}Schema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// CRUD Operations
${name}Schema.statics.createRecord = async function(data) {
  const record = new this(data);
  return await record.save();
};

${name}Schema.statics.getAllRecords = async function() {
  return await this.find(); // Fetch all records from MongoDB
};

${name}Schema.statics.updateRecord = async function(id, data) {
  return await this.findByIdAndUpdate(id, data, { new: true });
};

${name}Schema.statics.deleteRecord = async function(id) {
  return await this.findByIdAndDelete(id);
};

export default mongoose.model('${name}', ${nameLower}Schema);
`;
      break;

    case 'supabase':
      // Supabase model (assuming PostgreSQL as database)
      modelTemplate = `
import { supabase } from '../../lib/supabaseConfig.js'; // Make sure to import your Supabase client

export default class ${name} {
  constructor(data) {
    this.data = data;
  }

  // CRUD Operations
  static async createRecord(data) {
    const { data: record, error } = await supabase
      .from('${pluralName}') // Using plural table name
      .insert([data])
      .single();

    if (error) throw error;
    return record;
  }

  static async getAllRecords() {
    const { data, error } = await supabase
      .from('${pluralName}')
      .select('*');

    if (error) throw error;
    return data;
  }

  static async updateRecord(id, data) {
    const { data: updatedRecord, error } = await supabase
      .from('${pluralName}')
      .update(data)
      .eq('id', id)
      .single();

    if (error) throw error;
    return updatedRecord;
  }

  static async deleteRecord(id) {
    const { data, error } = await supabase
      .from('${pluralName}')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return data;
  }
}
`;
      break;

    default:
      console.error(`❌ Unsupported database type: ${database}`);
      return;
  }

  // Write model file to disk
  const filePath = path.join(__dirname, `server/models/${name}.js`);
  writeFileIfNotExists(filePath, modelTemplate);
  
  // Update index file for dynamic imports
  updateIndexFile(path.join(__dirname, 'server/models'), name);

  console.log(`✅ Generated ${name} model with ${database} adapter.`);
}






// Function to generate service dynamically based on database type
export function generateService(name, database) {
  const nameLower = name.toLowerCase();
  const pluralName = pluralize(name); // Pluralize the name for use in the model and service

  // Template for Supabase Service with pluralized names
  const supabaseServiceTemplate = `
import ${name} from '../models/${name}.js';

class ${name}Service {
  async create${name}(data) {
    return await ${name}.createRecord(data);
  }

  async get${name}ById(id) {
    return await ${name}.findById(id);
  }

  async getAll${pluralName}() {
    return await ${name}.getAllRecords();
  }

  async update${name}(id, data) {
    return await ${name}.updateRecord(id, data);
  }

  async delete${name}(id) {
    return await ${name}.deleteRecord(id);
  }
}

export default new ${name}Service();
`;

  // Template for MongoDB Service with pluralized names
  const mongoServiceTemplate = `
import ${name} from '../models/${name}.js';

class ${name}Service {
  async create${name}(data) {
    return await ${name}.createRecord(data);
  }

  async get${name}ById(id) {
    return await ${name}.findById(id);
  }

  async getAll${pluralName}() {
    return await ${name}.getAllRecords();
  }

  async update${name}(id, data) {
    return await ${name}.updateRecord(id, data);
  }

  async delete${name}(id) {
    return await ${name}.deleteRecord(id);
  }
}

export default new ${name}Service();
`;

  // Select the correct template based on the database type
  let serviceTemplate = '';
  if (database === 'supabase') {
    serviceTemplate = supabaseServiceTemplate;
  } else if (database === 'mongo') {
    serviceTemplate = mongoServiceTemplate;
  } else {
    console.error('Unsupported database type. Please use "supabase" or "mongo".');
    return;
  }

  // Create the service file path dynamically
  const filePath = path.join(__dirname, `server/services/${nameLower}Service.js`);
  writeFileIfNotExists(filePath, serviceTemplate);  // Assuming a function to write the file if it doesn't exist
  updateIndexFile(path.join(__dirname, 'server/services'), `${name}Service`);  // Update the index file for service imports

  console.log(`✅ Generated ${name} service for ${database}.`);
}







// Generate Controller
export function generateController(name) {
  const nameLower = name.toLowerCase();
  const pluralName = pluralize(nameLower);  // Use custom pluralize function

  const controllerTemplate = `
import ${nameLower}Service from '../services/${nameLower}Service.js';

class ${name}Controller {
  async create${name}(req, res) {
    try {
      const ${nameLower} = await ${nameLower}Service.create${name}(req.body);
      res.status(201).json(${nameLower});
    } catch (error) {
      console.error(\`❌ Failed to create ${name}:\`, error);
      res.status(400).json({ error: error.message, details: error.stack });
    }
  }

  async get${name}(req, res) {
    try {
      const ${nameLower} = await ${nameLower}Service.get${name}ById(req.params.id);
      res.status(200).json(${nameLower});
    } catch (error) {
      console.error(\`❌ Failed to fetch ${name}:\`, error);
      res.status(404).json({ error: '${name} not found', details: error.stack });
    }
  }

  async getAll${name}s(req, res) {
    try {
      const ${nameLower}s = await ${nameLower}Service.getAll${name}s();
      res.status(200).json(${nameLower}s);
    } catch (error) {
      console.error(\`❌ Failed to fetch all ${name}s:\`, error);
      res.status(500).json({ error: 'Failed to fetch all records', details: error.stack });
    }
  }

  async update${name}(req, res) {
    try {
      const ${nameLower} = await ${nameLower}Service.update${name}(req.params.id, req.body);
      res.status(200).json(${nameLower});
    } catch (error) {
      console.error(\`❌ Failed to update ${name}:\`, error);
      res.status(400).json({ error: error.message, details: error.stack });
    }
  }

  async delete${name}(req, res) {
    try {
      await ${nameLower}Service.delete${name}(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error(\`❌ Failed to delete ${name}:\`, error);
      res.status(400).json({ error: error.message, details: error.stack });
    }
  }
}

export default new ${name}Controller();
`;

  const filePath = path.join(__dirname, `server/controllers/${nameLower}Controller.js`);
  writeFileIfNotExists(filePath, controllerTemplate);
  updateIndexFile(path.join(__dirname, 'server/controllers'), `${name}Controller`);
  console.log(`✅ Generated ${name} controller.`);
}


// Generate Route
export function generateRoute(name) {
  const nameLower = name.toLowerCase();
  const pluralName = pluralize(nameLower);  // Use custom pluralize function

  const routeTemplate = `
import express from 'express';
import ${nameLower}Controller from '../controllers/${nameLower}Controller.js';

const router = express.Router();

// Create record
router.post('/${pluralName}', ${nameLower}Controller.create${name});
// Get single record by ID
router.get('/${pluralName}/:id', ${nameLower}Controller.get${name});
// Get all records
router.get('/${pluralName}', ${nameLower}Controller.getAll${name}s);
// Update record by ID
router.put('/${pluralName}/:id', ${nameLower}Controller.update${name});
// Delete record by ID
router.delete('/${pluralName}/:id', ${nameLower}Controller.delete${name});

export default router;
`;

  // Write the route file
  const filePath = path.join(__dirname, `server/routes/${nameLower}Routes.js`);
  writeFileIfNotExists(filePath, routeTemplate);

  // Update index file for dynamic imports
  updateIndexFile(path.join(__dirname, 'server/routes'), `${nameLower}Routes`);
  
  console.log(`✅ Generated ${name} route.`);
}