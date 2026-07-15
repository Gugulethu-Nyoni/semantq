import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

/**
 * Recursively reads SMQ files from a directory and processes them.
 * @param {string} directory - The directory path to search for SMQ files.
 * @returns {Promise<void>}
 */
async function readSMQFiles(directory) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
        await readSMQFiles(fullPath);
        continue;
      }
      
      if (entry.isFile() && entry.name.endsWith('.smq')) {
        const fileName = entry.name.replace('.smq', '');
        if (fileName !== '@layout') {
          await readAndCompileSMQFile(fullPath);
        }
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${directory}:`, err);
    throw err;
  }
}

/**
 * Reads and compiles an SMQ file, extracting script, style, and HTML content.
 * @param {string} filePath - The path to the SMQ file to compile.
 * @returns {Promise<void>}
 */
async function readAndCompileSMQFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');

    const buildPath = filePath.replace('src', 'build');

    // Ensure the directory is created before writing the file
    await fs.mkdir(path.dirname(buildPath), { recursive: true });

    let compiledContent = compileSMQContent(data, buildPath);

    /* EXPERIMENT - Extract script, style, and HTML */
    let scriptContent = '';
    let styleContent = '';
    let i = 0;
    let tagStack = [];

    // Extract script and style content including opening and closing tags
    while (i < compiledContent.length) {
      if (compiledContent.slice(i, i + 8) === '<script>') {
        tagStack.push('<script type="module">');
        scriptContent += '<script type="module">';
        i += 8;
        while (i < compiledContent.length && compiledContent.slice(i, i + 9) !== '</script>') {
          scriptContent += compiledContent[i];
          i++;
        }
        scriptContent += '</script>';
        i += 9;
      } else if (compiledContent.slice(i, i + 7) === '<style>') {
        tagStack.push('<style>');
        styleContent += '<style>';
        i += 7;
        while (i < compiledContent.length && compiledContent.slice(i, i + 8) !== '</style>') {
          if(compiledContent[i]) {
            styleContent += compiledContent[i];
          }
          i++;
        }
        styleContent += '</style>';
        i += 8;
      } else if (compiledContent.slice(i, i + 9) === '</script>') {
        tagStack.pop();
        scriptContent += '</script>';
        i += 9;
      } else if (compiledContent.slice(i, i + 8) === '</style>') {
        tagStack.pop();
        styleContent += '</style>';
        i += 8;
      } else {
        i++;
      }
    }

    let code = compiledContent;

    let htmlContent = '';
    i = 0;
    tagStack = [];

    while (i < code.length) {
      if (code.slice(i, i + 8) === '<script>') {
        tagStack.push('<script>');
        i += 8;
      } else if (code.slice(i, i + 7) === '<style>') {
        tagStack.push('<style>');
        i += 7;
      } else if (code.slice(i, i + 9) === '</script>') {
        tagStack.pop();
        i += 9;
      } else if (code.slice(i, i + 8) === '</style>') {
        tagStack.pop();
        i += 8;
      } else if (tagStack.length === 0) {
        htmlContent += code[i];
        i++;
      } else {
        i++;
      }
    }

    // Wrap HTML content with <customSyntax> tags if not already wrapped
    let wrappedHtmlContent = htmlContent.trim();
    if (!wrappedHtmlContent.startsWith('<customSyntax>')) {
      wrappedHtmlContent = '<customSyntax>\n' + wrappedHtmlContent;
    }
    if (!wrappedHtmlContent.endsWith('</customSyntax>')) {
      wrappedHtmlContent += '\n</customSyntax>';
    }

    // Combine the content
    compiledContent = scriptContent + '\n\n' + styleContent + '\n\n' + wrappedHtmlContent;

    // Write compiled content to a new .html file
    const outputFilePath = path.join(path.dirname(buildPath), `${path.basename(buildPath, '.smq')}.smq.html`);
    await fs.writeFile(outputFilePath, compiledContent, 'utf8');
    
  } catch (err) {
    console.error(`Error processing file ${filePath}:`, err);
    throw err;
  }
}

/**
 * Compiles SMQ content by processing custom syntax tags and converting them to HTML.
 * @param {string} content - The SMQ content to compile.
 * @param {string} filePath - The path to the file being compiled (for error reporting).
 * @returns {string} The compiled HTML content.
 * @throws {Error} If invalid tag cases or missing end tags are detected.
 */
function compileSMQContent(content, filePath) {
  // Split the content into lines
  const lines = content.split('\n');
  let compiledContent = '';
  let inCodeBlock = false;
  const tagStack = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if we are entering or exiting a pre or code block
    if (line.includes('<pre>') || line.includes('<code>')) {
      inCodeBlock = true;
    }
    if (line.includes('</pre>') || line.includes('</code>')) {
      inCodeBlock = false;
    }

    // If inside a code block, just add the line to the compiled content and continue
    if (inCodeBlock) {
      compiledContent += line + '\n';
      continue;
    }

    const validTags = ['@script', '@style', '@html', '@end'];
    // Validate the line for specific custom syntax declarations
    if (validTags.includes(line.toLowerCase()) && line !== line.toLowerCase()) {
      throw new Error(`\x1b[31mInvalid tag case detected in file ${filePath}: "${line}". Tags must be in lowercase.\x1b[0m`);
    }

    // Check for custom syntax declarations
    if (line === '@script') {
      tagStack.push('script');
      compiledContent += '<script>\n';
    } else if (line === '@style') {
      tagStack.push('style');
      compiledContent += '<style>\n';
    } else if (line === '@html') {
      compiledContent += '<customSyntax>\n';
      tagStack.push('html');
    } else if (line === '@end') {
      if (tagStack.length === 0) {
        throw new Error(`Invalid "@end" tag found outside of "@script" or "@style" blocks in file ${filePath} \x1b[0m`);
      }
      const topTag = tagStack.pop();
      if (topTag === 'html') {
        compiledContent += '</customSyntax>\n';
      } else {
        compiledContent += `</${topTag}>\n`;
      }
    } else {
      // Regular HTML content or custom syntax
      compiledContent += line + '\n';
    }
  }

  if (tagStack.length > 0) {
    const topTag = tagStack[0];
    if (topTag === 'script') {
      throw new Error(`\x1b[31mMissing "@end" tag for a "@script" block in file ${filePath}\x1b[0m`);
    } else if (topTag === 'style') {
      throw new Error(`\x1b[31mMissing "@end" tag for a "@style" block in file ${filePath}\x1b[0m`);
    }
  }

  return compiledContent;
}

/**
 * Main function to compile SMQ files from a source directory.
 * @param {string} sourceDir - The source directory containing SMQ files.
 * @returns {Promise<void>}
 */
export async function compileSMQFiles(sourceDir) {
  //console.log(`🚀 [compileSMQFiles] Starting with sourceDir: ${sourceDir}`);
  await readSMQFiles(sourceDir);
  //console.log(`✅ [compileSMQFiles] COMPLETED all files in: ${sourceDir}`);
}