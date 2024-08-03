import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import parser from './if_parser.js';




function readSMQFiles(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error stat-ing file:', err);
          return;
        }

        if (stats.isDirectory()) {
          readSMQFiles(filePath); // Recursively call on subdirectory
        } else if (path.extname(file).toLowerCase() === '.smq') {
          console.log(`Found .smq file: ${filePath}`);
          validateIfSyntax(filePath);
        }
      });
    });
  });
}






function validateIfSyntax(filePath) {

// Load the content from a file (e.g., 'input.html')
const fileContents = fs.readFileSync(filePath, 'utf-8');

// Step 1: Find potential @if instances
const ifRegex = /@if\s*\(.*?\)/g;
let match;

while ((match = ifRegex.exec(fileContents)) !== null) {
  const startIndex = match.index;
  const endIndex = ifRegex.lastIndex;

  // Step 2: Check for content and @endif
  const remainingContent = fileContents.substring(endIndex);
  const endifIndex = remainingContent.indexOf('@endif');
  const hasContent = remainingContent.trim().length > 0;
  const hasEndif = endifIndex !== -1;

  if (hasContent && hasEndif) {
    // Extract the content between @if and @endif
    const matchContent = remainingContent.substring(0, endifIndex);
    const completeMatch = fileContents.substring(startIndex, endIndex + endifIndex + 7); // 7 is the length of '@endif'

    // Step 3: Validate the match
    try {
      const result = parser.parse(completeMatch);
      //console.log("Validated AST:", JSON.stringify(result, null, 2));
      console.log("\x1b[32mIf Custom Syntax Validation Done :\x1b[0m");

    } catch (e) {
      console.error("\x1b[31mValidation error:\x1b[0m", e.message);
    }
  } else {
    console.error("\x1b[31mInvalid @if syntax: missing content or @endif \x1b[0m");
  }
}



}




// Main function
function validateSMQFiles() {
    const directory = '../../src/routes'; // src directory
    readSMQFiles(directory);
}

// Compile .smq files
validateSMQFiles();
