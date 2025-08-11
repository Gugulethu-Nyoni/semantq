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
        '/404': '404'  // Add default 404 route
    };

    try {
        traverseDirectory(basePath, '', fileBasedRoutes);
        writeRoutesToFile(basePath, fileBasedRoutes);
        console.log('File-based routes generated successfully.');
    } catch (err) {
        console.error('Error generating routes:', err);
    }
}

/**
 * Recursively traverses directories to build route map
 */
function traverseDirectory(directoryPath, relativePath, fileBasedRoutes) {
    // Use values from config
    const rootTargetPath = config.targetHost;

    // Set both '/' and '/home' to the same targetHost value
    fileBasedRoutes['/'] = rootTargetPath;
    fileBasedRoutes['/home'] = rootTargetPath;

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
            
            fileBasedRoutes[key] = key; //value;

            // Recurse into subdirectory
            traverseDirectory(filePath, newRelativePath, fileBasedRoutes);
        }
    });
}

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

    const fileContent = `const fileBasedRoutes = ${JSON.stringify(sortedRoutes, null, 2)};\n\nexport default fileBasedRoutes;`;

    fs.writeFileSync(filePath, fileContent);
}
