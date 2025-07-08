import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { loadRoutes } from './lib/routeLoader.js';
import { discoverSemantqModules } from './lib/moduleLoader.js';
import fs from 'fs/promises';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

// 🆕 Import Supabase adapter
import supabaseAdapter from './models/adapters/supabase.js';

// 🆕 Import config loader
import configPromise from './config_loader.js';

// Setup __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Init Express
const app = express();
const PORT = process.env.PORT || 3003;

(async () => {
  try {
    // ✅ Load config
    const semantqConfig = await configPromise;

    // ✅ CORS config using allowedOrigins from loaded config
    app.use(cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (semantqConfig.allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          return callback(new Error(`CORS: Origin ${origin} not allowed`));
        }
      },
      credentials: true
    }));

    app.use(bodyParser.json());
    app.use(cookieParser());

    // Health check
    app.get('/', (req, res) => {
      res.json({ status: 'Semantq Server is running' });
    });

    // Helper to check if a path exists
    async function pathExists(p) {
      try {
        await fs.access(p);
        return true;
      } catch {
        return false;
      }
    }

    // ✅ INIT Supabase first with fallback to .env
    await supabaseAdapter.init(); 

    // Load core routes
    const coreRoutesPath = path.resolve(__dirname, 'routes');
    if (await pathExists(coreRoutesPath)) {
      await loadRoutes(app, coreRoutesPath);
    } else {
      console.warn(`⚠️ Core routes directory not found at ${coreRoutesPath}. Skipping.`);
    }

    // Load routes from all discovered Semantq modules
    const moduleSources = await discoverSemantqModules();
    for (const module of moduleSources) {
      const moduleRoutesPath = path.join(module.path, 'routes');
      if (await pathExists(moduleRoutesPath)) {
        await loadRoutes(app, moduleRoutesPath, `/${module.name}`);
      } else {
        console.warn(`⚠️ Module '${module.name}' at '${module.path}' does not have a 'routes' directory. Skipping route loading.`);
      }
    }

    app.listen(PORT, () => {
      console.log(`✅ Semantq Server running on port ${PORT} (Env: ${process.env.NODE_ENV || 'development'})`);
    });
  } catch (err) {
    console.error('❌ Failed to initialize server:', err);
    process.exit(1);
  }
})();
