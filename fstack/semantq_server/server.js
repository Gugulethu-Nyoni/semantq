import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { loadRoutes } from './lib/routeLoader.js';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(bodyParser.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Semantq Server is running' });
});

// Make this an async IIFE to properly handle async/await
(async () => {
  try {
    // Load core routes
    const coreRoutesPath = path.resolve('./routes');
    await loadRoutes(app, coreRoutesPath);

    // Load package/module routes dynamically
    const packagesPath = path.resolve('./packages');
    if (fs.existsSync(packagesPath)) {
      const packages = fs.readdirSync(packagesPath);

      for (const pkgName of packages) {
        const pkgRoutesPath = path.join(packagesPath, pkgName, 'routes');
        if (fs.existsSync(pkgRoutesPath)) {
          await loadRoutes(app, pkgRoutesPath, `/${pkgName}`);
        }
      }
    }

    app.listen(PORT, () => {
      console.log(`Semantq Server running on port ${PORT} (Env: ${process.env.NODE_ENV || 'development'})`);
    });
  } catch (err) {
    console.error('Failed to initialize server:', err);
    process.exit(1);
  }
})();