// semantq_server/config_loader.js

import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs/promises';

// Get the directory of this config_loader.js file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // This is semantq_server/

// Path to the project root (the directory containing semantq_server)
const projectParentDir = path.resolve(__dirname, '..');

/**
 * Dynamically loads the Semantq configuration.
 * It first checks for 'semantq.config.js' in the parent directory
 * (where 'semantq_server' might be installed).
 * If not found, it falls back to 'semantq.config.js' in the 'config' subdirectory
 * of 'semantq_server'.
 *
 * @returns {Promise<object>} The loaded configuration object.
 * @throws {Error} If no config file is found or accessible.
 */
async function loadSemantqConfig() {
    // 1. Path for config file in the parent directory (e.g., myapp/semantq.config.js)
    const rootConfigPath = path.join(projectParentDir, 'semantq.config.js');
    const rootConfigUrl = pathToFileURL(rootConfigPath).href;

    // 2. Path for config file inside semantq_server/config/ (e.g., semantq_server/config/semantq.config.js)
    const internalConfigPath = path.join(__dirname, 'config', 'semantq.config.js');
    const internalConfigUrl = pathToFileURL(internalConfigPath).href;

    try {
        // Try loading from the root (parent) directory first
        await fs.access(rootConfigPath, fs.constants.R_OK); // Check if file exists and is readable
        console.log(`[Config Loader] Using config from project root: ${rootConfigPath}`);
        const { default: config } = await import(rootConfigUrl);
        return config;
    } catch (rootConfigError) {
        if (rootConfigError.code === 'ENOENT' || rootConfigError.code === 'EACCES') {
            // Root config not found or accessible, try internal config
            try {
                await fs.access(internalConfigPath, fs.constants.R_OK); // Check if file exists and is readable
                console.log(`[Config Loader] Using internal config: ${internalConfigPath}`);
                const { default: config } = await import(internalConfigUrl);
                return config;
            } catch (internalConfigError) {
                const errorMessage = `[Config Loader] Neither project root config (${rootConfigPath}) nor internal config (${internalConfigPath}) found or accessible.`;
                console.error(errorMessage);
                throw new Error(errorMessage);
            }
        } else {
            // Re-throw other unexpected errors for the root config check
            const errorMessage = `[Config Loader] Unexpected error while loading config from root (${rootConfigPath}): ${rootConfigError.message}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    }
}

// Cache the loaded config to avoid reloading it on every import
let cachedConfig = null;

// Export an async function that returns the config
// This allows other modules to import it and await the config
export default (async () => {
    if (cachedConfig) {
        return cachedConfig;
    }
    cachedConfig = await loadSemantqConfig();
    return cachedConfig;
})();

/*
// Alternative: If you prefer to expose a promise directly
// rather than an async IIFE, you can do this:
export const configPromise = loadSemantqConfig();
// Then consumers would use:
// import { configPromise } from '../../config_loader.js';
// const config = await configPromise;
*/