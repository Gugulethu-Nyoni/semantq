import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

// Function to compile a +page.smq file and its imports
function compileFile(filePath, imports = []) {
    console.log(`Compiling file this: ${filePath}`);

    // Read the content of the file// which file 
    const content = fs.readFileSync(filePath, 'utf8');



    // Extract import statements
const jsImportRegex = /import\s+(\w+)\s+from\s+'((?:.*?\/src\/components)[^']*)';/gm;    
  
    let match;
    while ((match = jsImportRegex.exec(content)) !== null) {
        const componentName = match[1];
        let componentPath = match[2];

        //console.log("import matches found");
        //console.log(componentPath);
        //return;

        // Check if the import path has the .smq extension // important for enabling
        // import Button from './components/Button' without smq 
        
        if (!componentPath.endsWith('.smq')) {
            componentPath += '.smq'; // Append the .smq extension if not present
        }
        

        // Resolve the path of the imported component
        const componentFullPath = componentPath;// path.resolve(path.dirname(filePath), componentPath);
        imports.push(componentFullPath);

        // Recursively compile the imported component
        compileFile(componentFullPath, imports);
    }

    // Compile the main page content
    const compiledSource = content; //compile(content); // Assuming `compile` function is defined elsewhere

    // Initialize an empty object to store the main page content
    let mainPageContent = {
        jsCode: '',
        cssCode: '',
        htmlCode: ''
    };

const dom = new JSDOM(compiledSource);

// Extract JavaScript content if <script> tag exists
const scriptElement = dom.window.document.querySelector('script');
if (scriptElement) {
    const scriptContent = scriptElement.textContent;

const excludedImportsRegex = /^\s*import\s+[\w\.]+\s+from\s+'.*?\/components\/.*?'\s*;?$/gm
const appendJsCode = scriptContent.replace(excludedImportsRegex, '');


    mainPageContent.jsCode = `<script>${appendJsCode}</script>`;
} else {
    mainPageContent.jsCode = '';
}




    // Extract CSS content from <style> tags if they exist
    const styleTags = dom.window.document.querySelectorAll('style');
    mainPageContent.cssCode = styleTags.length > 0 ? Array.from(styleTags).map(styleTag => `<style>${styleTag.textContent}</style>`).join('\n') : '';

    // Extract HTML content
    const htmlElements = dom.window.document.body.children;
    const htmlContentArray = Array.from(htmlElements).map(element => {
        if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
            // Skip script and style tags
            return '';
        } else if (element.nodeType === 3) {
            // Handle plain text nodes
            return element.textContent.trim();
        } else {
            // Handle regular HTML elements
            return element.outerHTML;
        }
    });
mainPageContent.htmlCode += '\n'; // Add a blank line
mainPageContent.htmlCode += htmlContentArray.join('\n'); // Append the new HTML content

    

    // Merge the content of main page with its imports
    imports.forEach(importPath => {
        // Read and compile content of each import
        const importCompiledSource = fs.readFileSync(importPath, 'utf8'); //compile(fs.readFileSync(importPath, 'utf8')); // Assuming `compile` function is defined elsewhere

        // Create a DOM environment from the compiled import source using jsdom
        const importDom = new JSDOM(importCompiledSource);


        /// checks 

        // Check if main page already has script and style tags
// Check if main page already has script and style tags
    const hasScriptTag = /<script\b[^>]*>[\s\S]*<\/script>/i.test(mainPageContent.jsCode);
    const hasStyleTags = /<style\b[^>]*>[\s\S]*<\/style>/i.test(mainPageContent.cssCode);

    //console.log('Tags exist?: ' + hasScriptTag);
    //console.log('Styles exist?: ' + hasStyleTags);

  /*
    // Create script tag if not present
    if (!hasScriptTag) {
        mainPageContent.jsCode = `<script>${mainPageContent.jsCode}</script>`;
    }

    // Create style tags if not present
    if (!hasStyleTags) {
        mainPageContent.cssCode = `<style>${mainPageContent.cssCode}</style>`;
    }
    */

      // Extract JavaScript content if <script> tag exists
const importScriptElement = importDom.window.document.querySelector('script');
if (!hasScriptTag && importScriptElement) {
    // If main page doesn't have a <script> tag, create one with the imported content

    // Exclude import statements from the imported JavaScript content
    const importJsCode = importScriptElement.textContent.replace(importRegex, '');

    mainPageContent.jsCode += `<script>${importJsCode}</script>`;
} else if (hasScriptTag) {
    // If main page already has a <script> tag, append the imported content inside it

    // Exclude import statements from the imported JavaScript content
    const importJsCode = importScriptElement ? importScriptElement.textContent.replace(importRegex, '') : '';

    // Append the imported JavaScript content inside the existing <script> tag
    mainPageContent.jsCode = mainPageContent.jsCode.replace(/<\/script>/i, `${importJsCode}</script>`);
}



// Extract CSS content from <style> tags if they exist
const importStyleTags = importDom.window.document.querySelectorAll('style');
if (!hasStyleTags && importStyleTags.length > 0) {
    // If main page doesn't have <style> tags, create them with the imported content
    mainPageContent.cssCode += Array.from(importStyleTags).map(styleTag => `<style>${styleTag.textContent}</style>`).join('\n');
} else if (hasStyleTags) {
    // If main page already has <style> tags, append the imported content inside them
    const styleContent = importStyleTags.length > 0 ? Array.from(importStyleTags).map(styleTag => styleTag.textContent).join('\n') : '';
    mainPageContent.cssCode = mainPageContent.cssCode.replace(/<\/style>/ig, `${styleContent}</style>`);
}




        // Extract HTML content
        const importHtmlElements = importDom.window.document.body.children;
        const importHtmlContentArray = Array.from(importHtmlElements).map(element => {
            if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
                // Skip script and style tags
                return '';
            } else if (element.nodeType === 3) {
                // Handle plain text nodes
                return element.textContent.trim();
            } else {
                // Handle regular HTML elements
                return element.outerHTML;
            }
        });
        mainPageContent.htmlCode += '\n';
        mainPageContent.htmlCode += importHtmlContentArray.join('\n');
    });


     if (path.basename(filePath) === '+page.smq') {

    // Write merged content to the output file
        const directoryPath = path.dirname(filePath);
    const fileName = path.basename(filePath);
    const fileExtension = '.html';
    let outputFilePath = path.join(directoryPath, `${fileName}${fileExtension}`);
    outputFilePath=outputFilePath.replace('src','build');
    const allContent = `${mainPageContent.jsCode}\n${mainPageContent.cssCode}\n${mainPageContent.htmlCode}`;
    fs.writeFileSync(outputFilePath, allContent);


}


}






// Function to recursively read files from a directory
export function loopFilesRecursively(directoryPath) {

    //console.log("routesDest:"+routesDest);

    fs.readdirSync(directoryPath).forEach(file => {
        const filePath = path.join(directoryPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            // Recursively read files from subdirectories
            loopFilesRecursively(filePath);
        } else {
            if (file === '+page.smq' && path.extname(filePath) === '.smq') {
                compileFile(filePath);
            }
        }
    });
}

