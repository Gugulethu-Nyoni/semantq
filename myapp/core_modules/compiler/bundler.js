import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

// Function to extract JavaScript content
function extractJavaScript(document) {
  const scriptElements = document.getElementsByTagName("script");
  const jsCode = [];

  for (let i = 0; i < scriptElements.length; i++) {
    const scriptContent = scriptElements[i].textContent.trim();
    jsCode.push(scriptContent);
  }

  return jsCode.join('\n');
}

// Function to extract CSS content
function extractCSS(document) {
  const styleTags = document.getElementsByTagName('style');
  const cssContent = [];

  for (let i = 0; i < styleTags.length; i++) {
    cssContent.push(styleTags[i].textContent);
  }

  return cssContent.join('\n');
}

// Function to extract HTML content
function extractHTML(document) {
  return document.body.innerHTML.trim();
}

// Encapsulate JavaScript, styles, and HTML together
function encapsulateContent(jsCode, cssContent, htmlContent) {
  // Encapsulate the JavaScript code, styles, and HTML in the createComponentMarkup function
  const encapsulatedCode = `
    // Function to create the component markup
    function createComponentMarkup() {
      ${jsCode}
    }

    // Immediately-invoked function expression (IIFE) to execute the createComponentMarkup function
    (function() {
      createComponentMarkup();
    })();
  
    // Add encapsulated styles
    const style = document.createElement('style');
    style.textContent = \`
      ${cssContent}
    \`;
    document.head.appendChild(style);

    // Add encapsulated HTML
      const container = document.createElement('div');
      container.id = 'componentContainer';
      document.body.appendChild(container);
      componentContainer.innerHTML = \`${htmlContent}\`;
  `;

  return encapsulatedCode;
}

function bundleProcess(filePath, fileContent) {
  // Parse the HTML content using JSDOM
  const { window } = new JSDOM(fileContent);
  const document = window.document;

  // Extract JavaScript, CSS, and HTML content
  const jsCode = extractJavaScript(document);
  const cssContent = extractCSS(document);
  const htmlContent = extractHTML(document);

  // Encapsulate JavaScript, CSS, and HTML together
  const encapsulatedCode = encapsulateContent(jsCode, cssContent, htmlContent);

// Get the directory name of the immediate parent directory of the input file
const parentDirName = path.basename(path.dirname(filePath));

// Get the directory path of the input file
const inputDirPath = path.dirname(filePath);

// Generate the full output file path by combining the input directory path with the output file name
const outputFilePath = path.join(inputDirPath, `${parentDirName}.js`);

console.log("here now:"+outputFilePath);
// Write the encapsulated code to the output file
fs.writeFileSync(outputFilePath, encapsulatedCode, 'utf8');

console.log(`Encapsulated code has been written to ${outputFilePath}`);

}

export function traverseDirectory(directory) {
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
        bundleProcess(filePath, fileContent);
      }
    }
  });
}

const rootDir = process.cwd();

const directoryPath = path.join(rootDir, 'build/routes');

// Start traversing the directory
traverseDirectory(directoryPath);
