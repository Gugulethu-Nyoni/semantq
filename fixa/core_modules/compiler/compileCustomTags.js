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
           // console.log(filePath);
          readSMQFiles(filePath); // Recursively call on subdirectory
        } 

        //else if (path.basename(file).toLowerCase() === '.smq' && path.basename(file).toLowerCase() !== '@layout.smq') {

        else if (path.basename(file).endsWith('.smq')) {
            const fileName = path.basename(file).replace('.smq',''); // @page or @layout or Button
           // console.log(`Found.smq file: ${filePath} ${fileName}`);
            if (fileName !== '@layout') {
                //console.log(`We compile ${fileName}`);
            readAndCompileSMQFile(filePath);
          }
          //readAndCompileSMQFile(filePath);
        }

      });
    });
  });
}


async function readAndCompileSMQFile(filePath) {
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');

        const buildPath = filePath.replace('src', 'build');

        // Ensure the directory is created before writing the file
        await fs.promises.mkdir(path.dirname(buildPath), { recursive: true });

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
        await fs.promises.writeFile(outputFilePath, compiledContent, 'utf8');
        //console.log(`File ${outputFilePath} compiled successfully.`);
    } catch (err) {
        console.error(`Error processing file ${filePath}:`, err);
    }
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


const validTags = ['@script', '@style', '@html', '@end'];

// Add this inside the while loop, after extracting the line
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
      // Skip the html declaration line

       // Add the opening tag for the wrapper
      compiledContent += '<customSyntax>\n';
      tagStack.push('html');

continue;
    } else if (line === '@end') {
      if (tagStack.length === 0) {
        throw new Error(`Invalid "@end" tag found outside of "@script" or "@style" blocks in file ${filePath} \x1b[0m`);
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
      throw new Error(`\x1b[31mMissing "@end" tag for a "@script" block in file ${filePath}\x1b[0m`);
    } else if (topTag === 'style') {
      //throw new Error('Missing "@end" tag for a "@style" block');
      throw new Error(`\x1b[31mMissing "@end" tag for a "@style" block in file ${filePath}\x1b[0m`);

    }
  }

  return compiledContent;
}





// Main function
export function compileSMQFiles(sourceDir) {
    readSMQFiles(sourceDir);
}

// Compile .smq files
//compileSMQFiles(sourceDir);
