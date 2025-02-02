import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';

// Define the directory to traverse

const rootDir = process.cwd();

const directoryPath = path.join(rootDir, 'build/routes');

function updateElements(htmlContent, filePath, bindingData) {
  const $ = cheerio.load(htmlContent);

  // Update elements in HTML content based on bindingData
$('[data-bind]').each((index, element) => {
    const key = $(element).attr('data-bind');
    const elementType = $(element).prop('tagName').toLowerCase();

    // Update input or textarea value
if (elementType === 'input' || elementType === 'textarea') {
      if (bindingData[key] !== undefined) {
        const valueWithoutQuotes = bindingData[key].replace(/['"]/g, ''); // Remove surrounding quotes
$(element).val(valueWithoutQuotes);
      }
    }

    // Update other elements' text content
if (bindingData[key] !== undefined) {
      const valueWithoutQuotes = bindingData[key].replace(/['"]/g, ''); // Remove surrounding quotes
$(element).text(valueWithoutQuotes);
    }
  });

// Iterate over text nodes and replace placeholders
$('*:not(script, style)').contents().filter(function() {
    return this.nodeType === 3 && /\{([\w]+)\}/.test(this.nodeValue);
}).each(function() {
    this.nodeValue = this.nodeValue.replace(/\{([\w]+)\}/g, (_, key) => {
        const value = bindingData[key] || '';
        return value.replace(/^['"]|['"]$/g, ''); // Remove surrounding quotes
    });
});

  const updatedContent = $.html().replace(/(<\/?(?:html|head|body)>)/ig, "");

  // Write the updated content back to the file
fs.writeFileSync(filePath, updatedContent, 'utf8');
//console.log($.html());
  //console.log(`Updated file: ${filePath}`);
}


     
// Function to process JavaScript content and update elements in HTML
function processJavaScript(filePath, htmlContent) {
    const $ = cheerio.load(htmlContent);

    // Define the binding data object
    const bindingData = {};

    // Extract let variables and their values
    const letVariableRegex = /let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.*?)(?=[;,])/g;
    let match;
    while ((match = letVariableRegex.exec(htmlContent)) !== null) {
        const [, key, value] = match;
        bindingData[key.trim()] = value.trim().replace(/['"]/g, '');
    }

    // Update elements in HTML based on the binding data and write back to file
    updateElements($.html(), filePath, bindingData);
}

export function traverseDirectory(directory) {
    console.log("inside binder");
    fs.readdirSync(directory).forEach(file => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            traverseDirectory(filePath); // Recursive call with the subdirectory path
        } else {
            if (file.endsWith('+page.smq.html')) {
                // Read the file content
                const fileContent = fs.readFileSync(filePath, 'utf8');
                // Process JavaScript content to update elements in HTML
                processJavaScript(filePath, fileContent);
            }
        }
    });
}


// Start traversing the directory
traverseDirectory(directoryPath);
