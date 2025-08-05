import * as fs from 'fs';
import * as path from 'path';
// fileURLToPath is not used in the provided code blocks, so it's removed for cleanup.

/**
 * Recursively reads a directory, finds all '@layout.smq' files,
 * and triggers their compilation.
 * @param {string} directory The path to the directory to scan.
 */
async function readSMQFiles(directory) {
    //console.log(`[DEBUG] Starting directory scan: ${directory}`);
    try {
        const files = await fs.promises.readdir(directory);

        for (const file of files) {
            const filePath = path.join(directory, file);
            const stats = await fs.promises.stat(filePath);

            if (stats.isDirectory()) {
                // Recursively call on subdirectory
                await readSMQFiles(filePath);
            } else if (file === '@layout.smq') {
                // Only process files named @layout.smq
                //console.log(`[DEBUG] Found @layout.smq file: ${filePath}`);
                await readAndCompileSMQFile(filePath);
            }
        }
    } catch (err) {
        console.error(`[ERROR] Failed to read directory ${directory}:`, err);
    }
}

// --- Horizontal Line ---

/**
 * Compiles SMQ content by parsing custom @tags and assembling them into a standard HTML structure.
 * This parser processes the content line by line.
 * @param {string} content The raw content from the .smq file.
 * @param {string} filePath The original file path (used for comprehensive error reporting).
 * @returns {string} The compiled HTML content.
 * @throws {Error} If an invalid tag case is detected, an @end tag is misplaced, or a block is unclosed.
 */
function compileSMQContent(content, filePath) {
    //console.log(`DEBUG Starting SMQ content transformation (line-by-line parser).");

    let compiledHtmlContent = '';
    const tagStack = []; // Keeps track of currently open custom tags

    // Define custom tag mappings to standard HTML tags
    const tagMappings = {
        '@script': '<script type="module">', // Ensures modern module scripts
        '@head': '<head>',
        '@body': '<body>', // Standard HTML body tag
        '@footer': '<footer>',
    };

    // List of valid custom tags for case validation and parsing logic
    const validTags = ['@script', '@head', '@body', '@footer', '@end'];

    const lines = content.split('\n'); // Split content into individual lines for processing

    for (const line of lines) {
        const trimmedLine = line.trim();

        // Preserve empty lines to maintain formatting in the output
        if (trimmedLine === '') {
            compiledHtmlContent += '\n';
            continue;
        }

        // Validate that custom tags are always in lowercase
        if (validTags.includes(trimmedLine.toLowerCase()) && trimmedLine !== trimmedLine.toLowerCase()) {
            throw new Error(
                `\x1b[31mInvalid tag case detected in file ${filePath}: "${trimmedLine}". ` +
                `Custom tags must be in lowercase (e.g., '@head' instead of '@Head').\x1b[0m`
            );
        }

        // Process custom tag declarations and their corresponding content
        if (trimmedLine === '@script') {
            tagStack.push('script');
            compiledHtmlContent += tagMappings['@script'] + '\n';
        } else if (trimmedLine === '@head') {
            tagStack.push('head');
            compiledHtmlContent += tagMappings['@head'] + '\n';
        } else if (trimmedLine === '@body') {
            tagStack.push('body');
            compiledHtmlContent += tagMappings['@body'] + '\n';
        } else if (trimmedLine === '@footer') {
            tagStack.push('footer');
            compiledHtmlContent += tagMappings['@footer'] + '\n';
        } else if (trimmedLine === '@end') {
            // Handle closing custom tags
            if (tagStack.length === 0) {
                throw new Error(
                    `\x1b[31mMisplaced "@end" tag in file ${filePath}. ` +
                    `Found "@end" without a corresponding open custom tag.\x1b[0m`
                );
            }
            const topTag = tagStack.pop(); // Get the most recently opened tag

            // Append the correct HTML closing tag
            if (topTag === 'script') {
                compiledHtmlContent += '</script>\n';
            } else if (topTag === 'head') {
                compiledHtmlContent += '</head>\n';
            } else if (topTag === 'body') {
                compiledHtmlContent += '</body>\n';
            } else if (topTag === 'footer') {
                compiledHtmlContent += '</footer>\n';
            } else {
                // This case should ideally not be reached if only valid tags are pushed onto the stack
                throw new Error(
                    `\x1b[31mInternal error: Unexpected tag "${topTag}" found on stack for @end in file ${filePath}.\x1b[0m`
                );
            }
        } else {
            // If it's not a custom tag, it's considered regular HTML content
            compiledHtmlContent += line + '\n'; // Use original line to preserve indentation
        }
    }

    // After processing all lines, check for any unclosed custom tags
    if (tagStack.length > 0) {
        const unclosedTag = tagStack[tagStack.length - 1];
        throw new Error(
            `\x1b[31mMissing "@end" tag for the "${unclosedTag}" block in file ${filePath}. ` +
            `All custom blocks must be properly closed.\x1b[0m`
        );
    }

    //console.log(`DEBUG SMQ content transformation completed.");
    return compiledHtmlContent; 
}

// --- Horizontal Line ---

/**
 * Reads an SMQ file, compiles its content using `compileSMQContent`,
 * and writes the resulting HTML to a new .smq.html file in the 'build' directory.
 * @param {string} filePath The path to the source SMQ file (e.g., 'src/routes/node/@layout.smq').
 */
async function readAndCompileSMQFile(filePath) {
    try {
        //console.log(`[DEBUG] Attempting to read file: ${filePath}`);

        // Read the source file content
        const data = await fs.promises.readFile(filePath, 'utf8');
        //console.log(`[DEBUG] Read file content. Length: ${data.length} characters.`);

        // Construct the output file path in the 'build' directory
        const buildPath = filePath.replace('src', 'build');
        const outputFilePath = path.join(path.dirname(buildPath), `${path.basename(buildPath, '.smq')}.smq.html`);
        
        //console.log(`[DEBUG] Output HTML file will be written to: ${outputFilePath}`);

        // Ensure the target directory exists before attempting to write the file
        const dirname = path.dirname(outputFilePath);
        await fs.promises.mkdir(dirname, { recursive: true });
        //console.log(`[DEBUG] Target directory verified: ${dirname}`);
        
        // Verify directory was created
        const dirExists = await fs.promises.access(dirname).then(() => true).catch(() => false);
        //console.log(`[DEBUG] Directory exists after creation attempt: ${dirExists}`);

        // Compile the content

        let compiledContent = compileSMQContent(data, filePath);

        // Write the file

        //console.log(compiledContent);
        await fs.promises.writeFile(outputFilePath, compiledContent, 'utf8');
        
        // Verify file was written
        const fileExists = await fs.promises.access(outputFilePath).then(() => true).catch(() => false);
        //console.log(`[DEBUG] File exists after write attempt: ${fileExists}`);
        if (fileExists) {
            const stats = await fs.promises.stat(outputFilePath);
        
        /*
        console.log(`[DEBUG] File stats: ${JSON.stringify({
                size: stats.size,
                mode: stats.mode.toString(8),
                uid: stats.uid,
                gid: stats.gid
            })}`);
            */
        }
        
        //console.log(`[SUCCESS] File compiled and written successfully: ${outputFilePath}`);

    } catch (err) {
        console.error(`[ERROR] Failed to process file ${filePath}:`, err);
        // More detailed error handling...
    }
}

// --- Horizontal Line ---

/**
 * Main function to initiate the compilation of SMQ files.
 * This function should be called with the source directory containing your .smq files.
 * @param {string} sourceDir The root directory to start compiling SMQ files from.
 */
export function compileSMQFiles(sourceDir) {
    //console.log(`[INFO] Starting SMQ file compilation process from source directory: ${sourceDir}`);
    readSMQFiles(sourceDir);
}
