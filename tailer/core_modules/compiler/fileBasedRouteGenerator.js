import * as fs from 'fs';
import * as path from 'path';

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
    // Add default routes if they don't exist
    if (!fileBasedRoutes['/']) fileBasedRoutes['/'] = '';
    if (!fileBasedRoutes['/home']) fileBasedRoutes['/home'] = 'home';

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
            
            fileBasedRoutes[key] = value;

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