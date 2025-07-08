// semantq_server/lib/moduleLoader.js
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..'); // Go up one level from 'lib' to project root

/**
 * Helper to check if a path exists (using fs.promises)
 * @param {string} p - The path to check.
 * @returns {Promise<boolean>}
 */
async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Discovers all installed Semantq modules from 'packages/' and 'node_modules/'.
 * @returns {Promise<Array<{name: string, path: string}>>} An array of discovered modules.
 */
export async function discoverSemantqModules() {
  const packagesDir = path.join(projectRoot, 'packages');
  const nodeModulesDir = path.join(projectRoot, 'node_modules');

  const moduleSources = [];

  //console.log(`[ModuleLoader] Scanning for modules in: ${packagesDir}`); // DEBUG
  // 1. Scan 'packages' directory
  if (await pathExists(packagesDir)) {
    const internalPackages = await fs.readdir(packagesDir);
    //console.log(`[ModuleLoader] Found directories in 'packages/': ${internalPackages.join(', ')}`); // DEBUG
    for (const pkgName of internalPackages) {
      const pkgPath = path.join(packagesDir, pkgName);
      const pkgPackageJsonPath = path.join(pkgPath, 'package.json');
      //console.log(`[ModuleLoader] Checking package: ${pkgName} at ${pkgPath}`); // DEBUG
      if (await pathExists(pkgPackageJsonPath)) {
        try {
          const pkgJson = JSON.parse(await fs.readFile(pkgPackageJsonPath, 'utf8'));
          // FIX: Changed 'semantq-module' to 'semantq-module'
          //console.log(`[ModuleLoader] Read package.json for ${pkgName}. semantq-module: ${pkgJson['semantq-module']}`); // DEBUG
          if (pkgJson['semantq-module']) { // FIX: Changed 'semantq-module' to 'semantq-module'
            moduleSources.push({ name: pkgJson.name || pkgName, path: pkgPath });
            //console.log(`[ModuleLoader] ✅ Discovered local module: ${pkgJson.name || pkgName}`); // DEBUG
          }
        } catch (jsonError) {
          console.error(`[ModuleLoader] ❌ Error parsing package.json for ${pkgName} at ${pkgPackageJsonPath}:`, jsonError.message); // DEBUG
        }
      } else {
        console.log(`[ModuleLoader] No package.json found for ${pkgName} at ${pkgPackageJsonPath}`); // DEBUG
      }
    }
  } else {
  //  console.log(`[ModuleLoader] 'packages/' directory not found at ${packagesDir}`); // DEBUG
  }

  //console.log(`[ModuleLoader] Scanning for modules in: ${nodeModulesDir}`); // DEBUG
  // 2. Scan 'node_modules' for Semantq modules
  if (await pathExists(nodeModulesDir)) {
    const npmPackages = await fs.readdir(nodeModulesDir);
    //console.log(`[ModuleLoader] Found directories in 'node_modules/': ${npmPackages.join(', ')}`); // DEBUG
    for (const pkgName of npmPackages) {
      // Handle scoped npm packages (e.g., @scope/my-module)
      if (pkgName.startsWith('@')) {
        const scopedPackagesPath = path.join(nodeModulesDir, pkgName);
        const scopedPackages = await fs.readdir(scopedPackagesPath);
        for (const scopedPkgName of scopedPackages) {
          const fullPkgName = `${pkgName}/${scopedPkgName}`;
          const pkgPath = path.join(scopedPackagesPath, scopedPkgName);
          const pkgPackageJsonPath = path.join(pkgPath, 'package.json');
          //console.log(`[ModuleLoader] Checking scoped package: ${fullPkgName} at ${pkgPath}`); // DEBUG
          if (await pathExists(pkgPackageJsonPath)) {
            try {
              const pkgJson = JSON.parse(await fs.readFile(pkgPackageJsonPath, 'utf8'));
              // FIX: Changed 'semantq-module' to 'semantq-module'
              //console.log(`[ModuleLoader] Read package.json for ${fullPkgName}. semantq-module: ${pkgJson['semantq-module']}`); // DEBUG
              if (pkgJson['semantq-module']) { // FIX: Changed 'semantq-module' to 'semantq-module'
                moduleSources.push({ name: pkgJson.name, path: pkgPath });
                //console.log(`[ModuleLoader] ✅ Discovered npm module: ${pkgJson.name}`); // DEBUG
              }
            } catch (jsonError) {
              console.error(`[ModuleLoader] ❌ Error parsing package.json for ${fullPkgName} at ${pkgPackageJsonPath}:`, jsonError.message); // DEBUG
            }
          } else {
            //console.log(`[ModuleLoader] No package.json found for ${fullPkgName} at ${pkgPackageJsonPath}`); // DEBUG
          }
        }
      } else {
        const pkgPath = path.join(nodeModulesDir, pkgName);
        const pkgPackageJsonPath = path.join(pkgPath, 'package.json');
        //console.log(`[ModuleLoader] Checking npm package: ${pkgName} at ${pkgPath}`); // DEBUG
        if (await pathExists(pkgPackageJsonPath)) {
          try {
            const pkgJson = JSON.parse(await fs.readFile(pkgPackageJsonPath, 'utf8'));
            // FIX: Changed 'semantq-module' to 'semantq-module'
            //console.log(`[ModuleLoader] Read package.json for ${pkgName}. semantq-module: ${pkgJson['semantq-module']}`); // DEBUG
            if (pkgJson['semantq-module']) { // FIX: Changed 'semantq-module' to 'semantq-module'
              moduleSources.push({ name: pkgJson.name, path: pkgPath });
              console.log(`[ModuleLoader] ✅ Discovered npm module: ${pkgJson.name}`); // DEBUG
            }
          } catch (jsonError) {
            console.error(`[ModuleLoader] ❌ Error parsing package.json for ${pkgName} at ${pkgPackageJsonPath}:`, jsonError.message); // DEBUG
          }
        } else {
          //console.log(`[ModuleLoader] No package.json found for ${pkgName} at ${pkgPackageJsonPath}`); // DEBUG
        }
      }
    }
  } else {
    console.log(`[ModuleLoader] 'node_modules/' directory not found at ${nodeModulesDir}`); // DEBUG
  }

  return moduleSources;
}
