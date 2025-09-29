import * as fs from 'fs';
import * as path from 'path';

// Import config from 2 levels up
import config from '../../semantq.config.js';

/**
 * Generate file-based routes for your project
 * Scans the given basePath and outputs a fileBasedRoutes.js map file
 */
export function generateFileBasedRoutes(basePath) {
    const fileBasedRoutes = {
        '/404': '/404',  // Add default 404 route
        '/sitemap': '/sitemap',
    };

    try {
        // --- ADDED LOGIC HERE ---
        // 1. Include routes from config.semantqNav.includeRoutes
        const includeRoutes = config.semantqNav?.includeRoutes || {};
        
        for (const [key, value] of Object.entries(includeRoutes)) {
            // Include routes from config.semantqNav.includeRoutes
            // The key is the route path (e.g., '/settings'), and the value is the target (e.g., '/settings' or a full URL)
            fileBasedRoutes[key] = value;
        }

        // 2. Set default routes from config
        const rootTargetPath = config.targetHost;
        fileBasedRoutes['/'] = rootTargetPath;
        fileBasedRoutes['/home'] = rootTargetPath;
        
        // --- END ADDED LOGIC ---

        // 3. Traverse directories
        traverseDirectory(basePath, '', fileBasedRoutes, config); 
        
        // 4. Write to file
        writeRoutesToFile(basePath, fileBasedRoutes);

        console.log('File-based routes generated successfully.');
    } catch (err) {
        console.error('Error generating routes:', err);
    }
}

/**
 * Recursively traverses directories to build route map
 */
function traverseDirectory(directoryPath, relativePath, fileBasedRoutes, config) {
    // Note: The setting of '/' and '/home' is moved to generateFileBasedRoutes
    // to avoid re-setting them on every recursion.

    const files = fs.readdirSync(directoryPath);
    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            const newRelativePath = path.posix.join(relativePath, file);

            // Create route key with leading slash
            const key = path.posix.join('/', newRelativePath);
            
            // Create route value without leading slash
            const value = newRelativePath;
            
            fileBasedRoutes[key] = key; // The route value is often the same as the key for internal directory routes

            // Recurse into subdirectory
            traverseDirectory(filePath, newRelativePath, fileBasedRoutes, config);
        }
    });
}

/**
 * Writes the generated routes to fileBasedRoutes.js, sorted alphabetically
 */
/**
 * Writes the generated routes to fileBasedRoutes.js, sorted alphabetically
 */
function writeRoutesToFile(basePath, fileBasedRoutes) {
    const filePath = path.join(basePath, 'fileBasedRoutes.js');

    // Sort routes alphabetically by key for readability
    const sortedRoutes = Object.keys(fileBasedRoutes)
        .sort()
        .reduce((acc, key) => {
            acc[key] = fileBasedRoutes[key];
            return acc;
        }, {});

    // NEW: Include targetHost in the exported file
    const fileContent = `const fileBasedRoutes = ${JSON.stringify(sortedRoutes, null, 2)};
const targetHost = ${JSON.stringify(config.targetHost)};

export default fileBasedRoutes;
export { targetHost };`;

    fs.writeFileSync(filePath, fileContent);
}