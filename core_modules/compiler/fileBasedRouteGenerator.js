import * as fs from 'fs';
import * as path from 'path';

export function generateFileBasedRoutes(basePath) {
    const fileBasedRoutes = {};

    try {
        traverseDirectory(basePath, '', fileBasedRoutes);
        writeRoutesToFile(basePath, fileBasedRoutes);
    } catch (err) {
        console.error('Error generating routes:', err);
    }
}

function traverseDirectory(directoryPath, relativePath, fileBasedRoutes) {
    // Add default routes
    fileBasedRoutes['/'] = '/';
    fileBasedRoutes['home'] = '/';

    const files = fs.readdirSync(directoryPath);
    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            const newRelativePath = `${path.posix.join(relativePath, file)}`;
            fileBasedRoutes[newRelativePath] = newRelativePath;
            traverseDirectory(filePath, newRelativePath, fileBasedRoutes);
        }
    });
}

function writeRoutesToFile(basePath, fileBasedRoutes) {
    const filePath = path.join(basePath, 'fileBasedRoutes.js');
    //console.log(filePath);
    const fileContent = `const fileBasedRoutes = ${JSON.stringify(fileBasedRoutes, null, 2)};\n\nexport default fileBasedRoutes;`;
    fs.writeFileSync(filePath, fileContent);
}

// Example usage:
// const rootDir = process.cwd();
// const basePath = path.join(rootDir, 'build/routes');
// generateFileBasedRoutes(basePath);
