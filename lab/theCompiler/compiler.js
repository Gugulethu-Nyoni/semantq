import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
//import { parse } from '@swc/core';


// Read all .smq files in the current directory
function readSMQFiles(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
        
        // Filter .smq files
        const smqFiles = files.filter(file => path.extname(file) === '.smq');
        
        // Process each .smq file
        smqFiles.forEach(file => {
            readAndCompileSMQFile(path.join(directory, file));
        });
    });
}

// Read and compile a single .smq file
function readAndCompileSMQFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }
        
        const compiledContent = compileSMQContent(data, filePath);
        
        // Write compiled content to a new .html file
        const outputFilePath = path.join(path.dirname(filePath), `${path.basename(filePath, '.smq')}.html`);

/// write js into own file 


/// write html into own file 


        fs.writeFile(outputFilePath, compiledContent, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file ${outputFilePath}:`, err);
                return;
            }
            console.log(`File ${outputFilePath} compiled successfully.`);
        });
    });
}



function compileSMQContent(content, filePath) {
  const jsRegex = /^\s*(?:var|let|const|function|class|if|for|while|switch|case|try|catch|finally|return|import|export)\s*\(?/im;
  const cssRegex = /^\s*[a-zA-Z-]+\s*[:{};]/im;

  let compiledContent = '';
  let i = 0;
  const tagStack = [];

  while (i < content.length) {
    // Find the start of the line
const lineStart = i;
    while (i < content.length && content[i] !== '\n') {
      i++;
    }

    // Extract the line
const line = content.slice(lineStart, i).trim();


const validTags = ['script:', 'style:', 'content:', 'end:'];

// Add this inside the while loop, after extracting the line
// Validate the line for specific custom syntax declarations
if (validTags.includes(line.toLowerCase()) && line !== line.toLowerCase()) {
    throw new Error(`\x1b[31mInvalid tag case detected in file ${filePath}: "${line}". Tags must be in lowercase.\x1b[0m`);
}


    // Check for custom syntax declarations
if (line === 'script:') {
      tagStack.push('script');
      compiledContent += '<script>\n';
    } else if (line === 'style:') {
      tagStack.push('style');
      compiledContent += '<style>\n';
    } else if (line === 'content:') {
      // Skip the content declaration line
continue;
    } else if (line === 'end:') {
      if (tagStack.length === 0) {
        throw new Error(`Invalid "end:" tag found outside of "script:" or "style:" blocks in file ${filePath} \x1b[0m`);
      }
      const topTag = tagStack.pop();
      compiledContent += '</' + topTag + '>\n';
    } else {
      // Regular HTML content or custom syntax
compiledContent += line + '\n';
    }

    // Move to the next line
i++;
  }

  if (tagStack.length > 0) {
    const topTag = tagStack[0];
    if (topTag === 'script') {
      throw new Error(`\x1b[31mMissing "end:" tag for a "script:" block in file ${filePath}\x1b[0m`);
    } else if (topTag === 'style') {
      //throw new Error('Missing "end:" tag for a "style:" block');
      throw new Error(`\x1b[31mMissing "end:" tag for a "style:" block in file ${filePath}\x1b[0m`);

    }
  }

  return compiledContent;
}





// Main function
function compileSMQFiles() {
    const directory = './'; // Current directory
    readSMQFiles(directory);
}

// Compile .smq files
compileSMQFiles();
