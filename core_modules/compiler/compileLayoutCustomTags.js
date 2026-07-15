// compileLayoutCustomTags.js - full file with minimal change

import * as fs from 'fs';
import * as path from 'path';

async function readSMQFiles(directory) {
    try {
        const files = await fs.promises.readdir(directory);

        for (const file of files) {
            const filePath = path.join(directory, file);
            const stats = await fs.promises.stat(filePath);

            if (stats.isDirectory()) {
                await readSMQFiles(filePath);
            } else if (file === '@layout.smq') {
                await readAndCompileSMQFile(filePath);
            }
        }
    } catch (err) {
        console.error(`Failed to read directory ${directory}:`, err);
    }
}

function compileSMQContent(content, filePath) {
    let compiledHtmlContent = '';
    const tagStack = [];

    const tagMappings = {
        '@script': '<script type="module">',
        '@head': '<head>',
        '@body': '<body>',
        '@footer': '<footer>',
    };

    const validTags = ['@script', '@head', '@body', '@footer', '@end'];
    const lines = content.split('\n');

    for (const line of lines) {
        const trimmedLine = line.trim();

        if (trimmedLine === '') {
            compiledHtmlContent += '\n';
            continue;
        }

        if (validTags.includes(trimmedLine.toLowerCase()) && trimmedLine !== trimmedLine.toLowerCase()) {
            throw new Error(
                `\x1b[31mInvalid tag case detected in file ${filePath}: "${trimmedLine}". ` +
                `Custom tags must be in lowercase.\x1b[0m`
            );
        }

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
            if (tagStack.length === 0) {
                throw new Error(
                    `\x1b[31mMisplaced "@end" tag in file ${filePath}. ` +
                    `Found "@end" without a corresponding open custom tag.\x1b[0m`
                );
            }
            const topTag = tagStack.pop();

            if (topTag === 'script') {
                compiledHtmlContent += '</script>\n';
            } else if (topTag === 'head') {
                compiledHtmlContent += '</head>\n';
            } else if (topTag === 'body') {
                compiledHtmlContent += '</body>\n';
            } else if (topTag === 'footer') {
                compiledHtmlContent += '</footer>\n';
            } else {
                throw new Error(
                    `\x1b[31mInternal error: Unexpected tag "${topTag}" found on stack for @end in file ${filePath}.\x1b[0m`
                );
            }
        } else {
            compiledHtmlContent += line + '\n';
        }
    }

    if (tagStack.length > 0) {
        const unclosedTag = tagStack[tagStack.length - 1];
        throw new Error(
            `\x1b[31mMissing "@end" tag for the "${unclosedTag}" block in file ${filePath}. ` +
            `All custom blocks must be properly closed.\x1b[0m`
        );
    }

    return compiledHtmlContent;
}

async function readAndCompileSMQFile(filePath) {
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');

        const buildPath = filePath.replace('src', 'build');
        const outputFilePath = path.join(path.dirname(buildPath), `${path.basename(buildPath, '.smq')}.smq.html`);

        const dirname = path.dirname(outputFilePath);
        await fs.promises.mkdir(dirname, { recursive: true });

        let compiledContent = compileSMQContent(data, filePath);
        await fs.promises.writeFile(outputFilePath, compiledContent, 'utf8');

    } catch (err) {
        console.error(`Failed to process file ${filePath}:`, err);
    }
}

// ============================================================
// THE FIX: Only this function changed
// ============================================================
export async function compileSMQFiles(sourceDir) {
    await readSMQFiles(sourceDir);
}
// ============================================================