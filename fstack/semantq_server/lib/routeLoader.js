// routeLoader.js
import fs from 'fs';
import path from 'path';
import express from 'express';
import { pathToFileURL } from 'url';

/**
 * Dynamically load and mount routes from a directory
 * @param {express.Application} app - Express app instance
 * @param {string} routesPath - Path to the routes folder
 * @param {string} mountBasePath - Base URL path to mount routes under, e.g. "/auth"
 */
export async function loadRoutes(app, routesPath, mountBasePath = '') {
  console.log(`Attempting to load routes from: ${routesPath}`); // Added logging
  const files = fs.readdirSync(routesPath);

  for (const file of files) {
    if (file.endsWith('.js')) {
      const routeFilePath = path.join(routesPath, file);
      console.log(`Attempting to import route file: ${routeFilePath}`); // Added logging
      try {
        const routeModule = await import(pathToFileURL(routeFilePath).href);

        // Route filename (without Routes.js) as path, e.g. "userRoutes.js" -> "/user"
        const routeName = file.replace(/Routes?\.js$/i, '').toLowerCase();

        // Use mountBasePath if provided, else derive from routeName
        const routePath = mountBasePath || `/${routeName}`;

        if (routeModule.default && typeof routeModule.default === 'function') {
          app.use(routePath, routeModule.default);
          console.log(`✅ Mounted route '${routePath}' from '${file}'`);
        } else {
          console.warn(`⚠️ Route file '${file}' at '${routeFilePath}' does not export a default function.`);
        }
      } catch (importError) {
        console.error(`❌ Failed to import route file '${file}' at '${routeFilePath}':`, importError);
        // Re-throw to propagate the error up to the server's catch block
        throw importError;
      }
    }
  }
}