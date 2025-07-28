import fs from 'fs';
import path from 'path';
import { walk } from 'estree-walker';
import { fileURLToPath } from 'url';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define alias resolution (match your Vite config)
const aliasMap = {
    "$components": path.resolve(__dirname, "../../src/components"),
    "$global": path.resolve(__dirname, "../../src/components/global"),
    "$lib": path.resolve(__dirname, "../../src/lib"),
};

// Helper function: Recursively find all `.ast` files
export function findAstFiles(dir) {
    let files = [];
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // Recursive call for subdirectories
            files = files.concat(findAstFiles(fullPath));
        } else if (file.endsWith('.smq.ast')) {
            // Only push files ending with .smq.ast
            files.push(fullPath);
        }
    });
    return files;
}

/**
 * Checks if a file exists at the given path.
 * @param {string} filePath - The path to the file.
 * @returns {boolean} True if the file exists, false otherwise.
 */
function fileExists(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Loads and parses a component AST file.
 * @param {string} componentPath - The path to the component's AST file.
 * @returns {object | null} The parsed AST object, or null if an error occurs.
 */


function loadComponent(componentPath) {
    try {
        const fileName = path.basename(componentPath);
        const componentName = fileName.split('.')[0];
        // Construct the basic .smq.ast filename if the input is a resolved one
        const basicAstFileName = componentName + '.smq.ast';
        const astComponentPath = componentPath.replace(fileName, basicAstFileName);

        const fullPath = path.resolve(componentPath);

        try {
            const fileContent = fs.readFileSync(fullPath, 'utf-8');
            return JSON.parse(fileContent);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // File not found, attempt to read the alternative file path
                const alternativeFullPath = path.resolve(astComponentPath);
                const fileContent = fs.readFileSync(alternativeFullPath, 'utf-8');
                return JSON.parse(fileContent);
            } else {
                // Re-throw the error if it's not a file not found error
                throw error;
            }
        }
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
        return null;
    }
}

/**
 * Merges imported component ASTs into a main AST.
 * This function currently merges JS and CSS ASTs.
 * The HTML merging logic is commented out as it requires a more sophisticated
 * HTML AST traversal and replacement mechanism, which is beyond the scope
 * of fixing the immediate TypeError.
 * @param {Array<object>} imports - An array of import objects (updatedSource, specifiers).
 * @param {string} baseDir - The base directory of the main AST file.
 * @param {string} astFile - The path to the main AST file.
 * @returns {object} The merged AST object.
 */


function mergeComponents(imports, baseDir, astFile) {
    // 1. Read and parse main AST with enhanced error handling
    let mainAst;
    try {
        const astContent = fs.readFileSync(astFile, 'utf-8');
        mainAst = JSON.parse(astContent);
    } catch (error) {
        console.error(`❌ Failed to parse main AST file: ${astFile}`);
        console.error(`Error: ${error.message}`);
        throw new Error(`AST parse failed: ${error.message}`);
    }

    const resourceName = path.basename(astFile, '.smq.ast').split('.')[0];
    const isPage = resourceName === '@page';

    // 2. Initialize merged AST structure
    const mergedAST = {
        jsAST: mainAst.jsAST || { 
            type: "JavaScript", 
            content: { 
                type: "Program", 
                body: [] 
            } 
        },
        cssAST: mainAst.cssAST || { 
            type: "CSS", 
            content: { 
                type: "root", 
                nodes: [] 
            } 
        },
        ...(isPage ? { 
            customAST: mainAst.customAST || { 
                type: "HTML", 
                content: { 
                    html: { 
                        type: "Fragment", 
                        children: [] 
                    } 
                } 
            } 
        } : {})
    };

    // 3. Process each import
    for (const [index, imp] of imports.entries()) {
        const componentName = imp.specifiers[0];
        const componentKey = componentName.toLowerCase();

        // Skip if already merged
        if (mergedAST[`${componentKey}_jsAST`] && mergedAST[`${componentKey}_cssAST`] && mergedAST[`${componentKey}_customAST`]) {
            continue;
        }

        // 4. Path resolution
        let componentPath = imp.updatedSource
            .replace('src', 'build')
            .replace('.smq', '.smq.ast');
        
        if (!imp.updatedSource.endsWith('.smq')) {
            componentPath += '.smq.ast';
        }

        // 5. Component loading with fallbacks
        let componentAST;
        try {
            if (fileExists(componentPath)) {
                componentAST = JSON.parse(fs.readFileSync(componentPath, 'utf-8'));
            } else {
                const resolvedPath = componentPath.replace('.smq.ast', '.resolved.smq.ast');
                if (fileExists(resolvedPath)) {
                    componentAST = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'));
                } else {
                    throw new Error(`Component not found at ${componentPath} or ${resolvedPath}`);
                }
            }

            if (!componentAST || typeof componentAST !== 'object') {
                throw new Error(`Invalid component AST structure`);
            }

            // 7. Extract all AST types with comprehensive fallbacks
            const componentJsAST = componentAST.jsAST || 
                                componentAST[`${componentKey}_jsAST`] || 
                                componentAST[`jsAST_${componentName}`] || {
                type: "JavaScript",
                content: {
                    type: "Program",
                    body: []
                }
            };

            const componentCssAST = componentAST.cssAST || 
                                    componentAST[`${componentKey}_cssAST`] || 
                                    componentAST[`cssAST_${componentName}`] || {
                type: "CSS",
                content: {
                    type: "root",
                    nodes: []
                }
            };

            const componentCustomAST = componentAST.customAST || 
                                    componentAST[componentKey]?.customAST || 
                                    componentAST[componentKey] || 
                                    componentAST[`${componentKey}_customAST`] || {
                type: "HTML",
                content: {
                    html: {
                        type: "Fragment",
                        children: []
                    }
                }
            };

            mergedAST[`${componentKey}_customAST`] = componentCustomAST;

            // 9. Merge JS and CSS into main AST
            if (componentJsAST.content?.body) {
                mergedAST.jsAST.content.body.push(...componentJsAST.content.body);
            }
            
            if (componentCssAST.content?.nodes) {
                mergedAST.cssAST.content.nodes.push(...componentCssAST.content.nodes);
            }

        } catch (error) {
            console.error(`❌ Failed to process ${componentName}: ${error.message}`);
            continue;
        }
    }

    // 10. File writing with full verification
    const outputPath = path.join(baseDir, `${resourceName}.merged.ast`);
    
    try {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, JSON.stringify(mergedAST, null, 2), {
            mode: 0o666,
            flag: 'w'
        });
        
        return mergedAST;
    } catch (error) {
        console.error(`❌ Failed to write merged AST to ${outputPath}: ${error.message}`);
        
        // Fallback write attempt
        try {
            const fallbackPath = path.join(__dirname, 'debug_fallback.ast');
            fs.writeFileSync(fallbackPath, JSON.stringify(mergedAST, null, 2));
            console.error(`⚠️ Wrote fallback copy to: ${fallbackPath}`);
        } catch (fallbackError) {
            console.error(`💥 Couldn't write fallback either: ${fallbackError.message}`);
        }
        
        throw error;
    }
}
/**
 * Parses an AST file to find import declarations.
 * @param {string} astFilePath - The path to the AST file.
 * @returns {Array<object>} An array of import objects found.
 */
function resolveImports(astFilePath) {
    try {
        const astContent = fs.readFileSync(astFilePath, 'utf-8');
        const ast = JSON.parse(astContent);

        // Improved type detection
        const astType = Object.keys(ast).find(key => key.endsWith('AST')) || 'unknown';
        //console.log(`📦 AST parsed successfully, type: ${astType}`);

        const imports = [];
        
        // Handle nested JS AST structure
        if (ast.jsAST && ast.jsAST.content && ast.jsAST.content.type === 'Program') {
            walk(ast.jsAST.content, {
                enter(node) {
                    if (node.type === 'ImportDeclaration' && node.source.value.startsWith('$')) {
                        const source = node.source.value;
                        let updatedSource = source;

                        // Resolve aliases
                        if (source.startsWith('$')) {
                            const firstChunk = source.split('/')[0];
                            const alias = aliasMap[firstChunk];
                            if (alias) {
                                updatedSource = source.replace(firstChunk, alias);
                            }
                        }
                        
                        const specifiers = node.specifiers.map((s) => s.local.name);
                        imports.push({ updatedSource, specifiers });
                    }
                }
            });
        }
        
        //console.log(`📋 Total imports found: ${imports.length}`);
        return imports;
    } catch (error) {
        console.error(`❌ Error resolving imports for ${astFilePath}:`, error);
        return [];
    }
}



/**
 * Main function to resolve imports and merge components across AST files.
 * @param {string} destDir - The destination directory to search for AST files.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of resolved import information.
 */
export async function importsResolver(destDir) {
    try {
        const astFiles = findAstFiles(destDir);

        const resolvedImports = astFiles.map((astFile) => {
            const imports = resolveImports(astFile);

            if (imports.length === 0) return null;

            const baseDir = path.dirname(astFile);
            const mergedContent = mergeComponents(imports, baseDir, astFile);

            return { astFile, imports, mergedContent };
        }).filter(item => item !== null); // Skip files with no imports

        // console.log(`Imports resolved for ${resolvedImports.length} file(s).`);
        return resolvedImports;
    } catch (error) {
        // console.error('Critical error in importsResolver:', error);
        throw error;
    }
}
