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
        } else if (file === '+layout.smq') {
          // Only pick up files named +layout.smq
          // console.log(`Found +layout.smq file: ${filePath}`);
          readAndCompileSMQFile(filePath);
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
    /*
    let scriptContent = '';
    let htmlContent = '';
    let i = 0;
    let tagStack = [];

    // Extract script content including opening and closing tags
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
      } else if (compiledContent.slice(i, i + 7) === '@head') {
        // Extract @head content and wrap it with <header>
        htmlContent += '<header>';
        i += 6;
        while (i < compiledContent.length && compiledContent.slice(i, i + 6) !== '@end') {
          htmlContent += compiledContent[i];
          i++;
        }
        htmlContent += '</header>';
      } else if (compiledContent.slice(i, i + 6) === '@body') {
        // Extract @body content and wrap it with <main>
        htmlContent += '<main>';
        i += 5;
        while (i < compiledContent.length && compiledContent.slice(i, i + 5) !== '@end') {
          htmlContent += compiledContent[i];
          i++;
        }
        htmlContent += '</main>';
      } else if (compiledContent.slice(i, i + 7) === '@footer') {
        // Extract @foot content and wrap it with <footer>
        htmlContent += '<footer>';
        i += 6;
        while (i < compiledContent.length && compiledContent.slice(i, i + 5) !== '@end') {
          htmlContent += compiledContent[i];
          i++;
        }
        htmlContent += '</footer>';
      } else {
        i++;
      }
    }

    // Combine the content
    compiledContent = scriptContent + '\n\n' + htmlContent;

    */

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

  // Define custom tag mappings
  const tagMappings = {
    '@script': '<script>',
    '@head': '<header>',
    '@body': '<main>',
    '@footer': '<footer>',
    '@end': '</>',
  };

  const validTags = ['@script', '@head', '@body', '@footer', '@end'];

  while (i < content.length) {
    const lineStart = i;
    while (i < content.length && content[i] !== '\n') {
      i++;
    }

    const line = content.slice(lineStart, i).trim();

    // Log the current line and tag stack for debugging
    //console.log(`Processing line: "${line}"`);
    //console.log(`Current tag stack:`, tagStack);

    // Validate lowercase tags
    if (validTags.includes(line.toLowerCase()) && line !== line.toLowerCase()) {
      throw new Error(`\x1b[31mInvalid tag case detected in file ${filePath}: "${line}". Tags must be in lowercase.\x1b[0m`);
    }

    // Handle custom tag declarations
    if (line === '@script') {
      tagStack.push('script');
      compiledContent += tagMappings['@script'] + '\n';
    } else if (line === '@head') {
      tagStack.push('head');
      compiledContent += tagMappings['@head'] + '\n';
    } else if (line === '@body') {
      tagStack.push('body');
      compiledContent += tagMappings['@body'] + '\n';
    } else if (line === '@footer') {
      tagStack.push('footer');
      compiledContent += tagMappings['@footer'] + '\n';
    } else if (line === '@end') {
      if (tagStack.length === 0) {
        throw new Error(`Invalid "@end" tag found outside of any open block in file ${filePath}`);
      }
      const topTag = tagStack.pop();
      if (topTag === 'script') {
        compiledContent += '</script>\n';
      } else if (topTag === 'head') {
        compiledContent += '</header>\n';
      } else if (topTag === 'body') {
        compiledContent += '</main>\n';
      } else if (topTag === 'footer') {
        compiledContent += '</footer>\n';
      } else {
        compiledContent += `</${topTag}>\n`;
      }
    } else {
      // Regular HTML or custom content (that doesn't require transformation)
      compiledContent += line + '\n';
    }

    i++;
  }

  // Ensure all opened blocks are properly closed
  if (tagStack.length > 0) {
    const topTag = tagStack[0];
    throw new Error(`Missing "@end" tag for a "${topTag}" block in file ${filePath}`);
  }
   //console.log(compiledContent);
  //compiledContent =`<customSyntax> ${compiledContent} </customSyntax>`;
  return compiledContent;
}




// Main function
export function compileSMQFiles(sourceDir) {
   // const directory = '../../src/routes'; // src directory
    readSMQFiles(sourceDir);
}

// Compile .smq files
//compileSMQFiles(sourceDir);
