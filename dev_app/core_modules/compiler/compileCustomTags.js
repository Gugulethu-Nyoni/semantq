import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';


function readSMQFiles(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
     // console.error('Error reading directory:', err);
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
          //console.log(`Found .smq file: ${filePath}`);
          readAndCompileSMQFile(filePath);
        }
      });
    });
  });
}


// Read and compile a single .smq file
async function readAndCompileSMQFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }


        //console.log("HERE",filePath);
        const buildPath= filePath.replace('src','build');

        fs.promises.mkdir(path.dirname(buildPath), { recursive: true });
        //console.log(`Directory created or already exists: ${path.dirname(buildPath)}`);
        //console.log("BP",buildPath);

        
        let compiledContent = compileSMQContent(data, buildPath);

        /* EXPERIMENT */ 



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

// Log or process the extracted script and style content as needed
//console.log('Script Content:');
//console.log(scriptContent);

//console.log('Style Content:');
//console.log(styleContent);

// Example of further processing or output:
// combinedContent = scriptContent + styleContent;




let code =compiledContent;// `<script>...</script><style>...</style><button>...</button><span>...</span>`;

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

// Replace the original htmlContent in compiledContent with wrappedHtmlContent
compiledContent = scriptContent + '\n\n' + styleContent + '\n\n' + wrappedHtmlContent;

//console.log(compiledContent); // Output the updated compiledContent




//console.log(htmlContent); // Output: <button>...</button><span>...</span>

/*  END EXPERIMENT */



        
        // Write compiled content to a new .html file
        const outputFilePath = path.join(path.dirname(buildPath), `${path.basename(buildPath, '.smq')}.smq.html`);

/// write js into own file 


/// write html into own file 

        //console.log("HERE",compiledContent);


        fs.writeFile(outputFilePath, compiledContent, 'utf8', (err) => {
            if (err) {

                console.error(`Error writing file ${outputFilePath}:`, err);
                return;
            }
           // console.log(`File ${outputFilePath} compiled successfully.`);
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


const validTags = ['script:', 'style:', 'html:', 'end:'];

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
    } else if (line === 'html:') {
      // Skip the html declaration line

       // Add the opening tag for the wrapper
      compiledContent += '<customSyntax>\n';
      tagStack.push('html');

continue;
    } else if (line === 'end:') {
      if (tagStack.length === 0) {
        throw new Error(`Invalid "end:" tag found outside of "script:" or "style:" blocks in file ${filePath} \x1b[0m`);
      }
      const topTag = tagStack.pop();

      //console.log(topTag);

      if (topTag === 'html') {

        // Add the closing tag for the wrapper
        compiledContent += '</customSyntax>\n';
      } else {
        compiledContent += `</${topTag}>\n`;
      }


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
export function compileSMQFiles(sourceDir) {
   // const directory = '../../src/routes'; // src directory
    readSMQFiles(sourceDir);
}

// Compile .smq files
//compileSMQFiles(sourceDir);
