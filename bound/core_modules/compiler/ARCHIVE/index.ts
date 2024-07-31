import * as fs from 'fs';
import * as path from 'path';
// Import your ComponentSyntaxCompiler class if it's defined in a separate file
// import { ComponentSyntaxCompiler } from './ComponentSyntaxCompiler';




/// ROUTES BUILD COMPILER AND IMPORTS COMPILER 


// Function to copy routes from src to build
function copyRoutes(src, dest) {
  // Ensure that both build/ and build/routes exist
  const buildDir = path.dirname(dest);
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }

  // Read files from src
  fs.readdir(src, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    files.forEach(file => {
      const filePathSrc = path.join(src, file);
      const filePathDest = path.join(dest, file);

      // Check if item is a directory or a file before copying
      const stat = fs.statSync(filePathSrc);
      if (stat.isDirectory()) {
        // Create directory in the destination
        fs.mkdirSync(filePathDest, { recursive: true });
        // Recursively copy contents of nested directories
        copyRoutes(filePathSrc, filePathDest);
      } else if (stat.isFile()) {
        // Copy the file
        fs.copyFileSync(filePathSrc, filePathDest);
      }
    });
  });
}

// 1. Copy the routes from src/routes to build/routes
const routesSrc = path.join(new URL('../../src/routes/', import.meta.url).pathname);
const routesDest = path.join(new URL('../../build/routes/', import.meta.url).pathname);
copyRoutes(routesSrc, routesDest);

// 2. Replace the import statements in build/routes/*/index.html files
const replaceImportsInFiles = (directory) => {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    files.forEach(file => {
      const fullPath = path.join(directory, file);

      // Check if the current path is a directory
      if (fs.statSync(fullPath).isDirectory()) {
        // Recursively process nested directories
        replaceImportsInFiles(fullPath);
      } else {
        // Check if the file is a +page.smq file
        if (file === '+page.smq') {
          const content = fs.readFileSync(fullPath, 'utf-8');

          // Replace imports like 'src/components/MyComponent' with 'build/components/MyComponent'
          const newContent = content.replace(/src\/components/g, 'build/components');

          fs.writeFileSync(fullPath, newContent, 'utf-8');
        }
      }
    });
  });
};

replaceImportsInFiles(routesDest);



// END ROUTES AND IMPORTS COMPILER 




// CUSTOM SYNTAX COMPILER BELOW 

/* COMPILER  */

// Update TokenType enum to include ScriptTag, StyleTag, and ContentTag
enum TokenType {
  HtmlContent = 'HtmlContent',
  ScriptStart = 'ScriptStart',
  ScriptEnd = 'ScriptEnd',
  ScriptText = 'ScriptText',
  StyleStart = 'StyleStart',
  StyleEnd = 'StyleEnd',
  StyleText = 'StyleText',
  ScriptTag = 'ScriptTag', // New token type for script tag
  StyleTag = 'StyleTag', // New token type for style tag
  ContentTag = 'ContentTag', // New token type for content tag
}

interface ScriptStyleContentToken {
  type: TokenType;
  value: string;
  source: string;
}

function compile(sourceCode: string): { type: TokenType; value: string }[] {
    const tokens: { type: TokenType; value: string }[] = [];

    // Match script block
    const scriptMatch = sourceCode.match(/script:\s*\n*([\s\S]*?)(?=style:|content:|$)/);
    if (scriptMatch) {
        const scriptMatchString = scriptMatch[0].slice(0, 7);
        const scriptText = scriptMatch[1].trim();
        tokens.push({ type: TokenType.ScriptTag, value: scriptMatchString });
        tokens.push({ type: TokenType.ScriptText, value: scriptText });
    }

    // Match style block
    const styleMatch = sourceCode.match(/style:\s*\n*([\s\S]*?)(?=script:|content:|$)/);
    if (styleMatch) {
        const styleMatchString = styleMatch[0].slice(0, 6);
        const styleText = styleMatch[1].trim();
        tokens.push({ type: TokenType.StyleTag, value: styleMatchString });
        tokens.push({ type: TokenType.StyleText, value: styleText });
    }

    // Match content block
    const contentMatch = sourceCode.match(/content:\s*\n*([\s\S]*?)(?=script:|style:|$)/);
    if (contentMatch) {
        const contentMatchString = contentMatch[0].slice(0, 8);
        const contentContent = contentMatch[1].trim();
        tokens.push({ type: TokenType.ContentTag, value: contentMatchString });
        tokens.push({ type: TokenType.HtmlContent, value: contentContent });
    }

    // Call validation functions
   // Call validation functions

   if (scriptMatch) {
    validateScriptTokens(tokens);

    }

        if (styleMatch) {

    validateStyleTokens(tokens);

}

 if (contentMatch) {
    validateContentTokens(tokens);

 }

    return tokens;
}



class ScriptParser {
    private scriptTag: string;

    constructor(scriptTag: string) {
        this.scriptTag = scriptTag;
    }

    // Method to validate and parse script tokens
    public parseScript(): void {
        // Initialize an array to store error messages
        const errors: string[] = [];

        // Validate if scriptTag ends with a colon
        if (!this.scriptTag.trim().endsWith(':')) {
            // Push error message with "Error" highlighted in red
            errors.push('\x1b[31m' + `Error: Script component '${this.scriptTag}' should be followed by a colon (:) e.g. \n script: \n . If you've added a colon : to your script declaration and still encounter this error, it indicates that your script declaration might not be spelled correctly or is not written in lowercase. e.g. script: ` + '\x1b[0m');
        }

        // Validate if scriptTag is lowercase and ends with ':'
        const scriptTagWithoutColon = this.scriptTag.replace(':', '');
        if (scriptTagWithoutColon !== 'script') {
            // Push error message with "Error" highlighted in red
            errors.push('\x1b[31m' + `Error: Script tag should be lowercase (script:).` + '\x1b[0m');
        }

        // Split the scriptTag into lines
        const lines = this.scriptTag.trim().split('\n');

        // Validate if script is preceded or followed by other elements on the same line
        if (lines.length > 1) {
            // Push error message with "Error" highlighted in red
            errors.push('\x1b[31m' + 'Error: script: component must be on its own line without any other elements before or after it. e.g. \n script: \n' + '\x1b[0m');
        }

        // Check if script is followed immediately by style or content
        for (let i = 0; i < lines.length - 1; i++) {
            const currentLine = lines[i].trim();
            const nextLine = lines[i + 1].trim();
            if (currentLine.startsWith('script:') && (nextLine.startsWith('style:') || nextLine.startsWith('content:'))) {
                // Check if there is at least one newline between script: and style: or content:
                if (!nextLine.startsWith('\n')) {
                    // Push error message with "Error" highlighted in red
                    errors.push('\x1b[31m' + 'Error: There must be at least one newline between script: and style: or content: declarations.' + '\x1b[0m');
                    // Terminate the compilation if there is any error
                    throw new Error('Compilation terminated due to errors.');
                }
            }
        }

        // If any errors occurred, throw an error and terminate the compilation
        if (errors.length > 0) {
            // Display all error messages
            errors.forEach(error => console.error(error));
            // Terminate the compilation if there is any error
            throw new Error('Compilation terminated due to errors.');
        }

        // Perform further validation (not implemented in this example)
        //console.log('\x1b[32mSuccess\x1b[0m: Semantic analysis and further validation of script tag.');
        //console.log('\x1b[32mSuccess\x1b[0m: Script tag parsed successfully.');
        console.log('\x1b[32mSuccess\x1b[0m:Javascript compiled successfully.');
   
 
    }
}




// Define a StyleParser class to handle parsing of style tokens
class StyleParser {
    private styleTag: string;

    constructor(styleTag: string) {
        this.styleTag = styleTag;
    }

    // Method to validate and parse style tokens
    public parseStyle(): void {
        // Initialize an array to store error messages
        const errors: string[] = [];

        // Validate if styleTag ends with a colon
        if (!this.styleTag.trim().endsWith(':')) {
            errors.push(`\x1b[31mError\x1b[0m: Style component '${this.styleTag}' should be followed by a colon (:) e.g. \n style: \n . If you've added a colon : to your style declaration and still encounter this error, it indicates that your style declaration might not be spelled correctly or is not written in lowercase. e.g. style: `);
            throw new Error("Compilation terminated due to errors.");
        }

        // Validate if styleTag is lowercase and ends with ':'
        const styleTagWithoutColon = this.styleTag.replace(':', '');
        if (styleTagWithoutColon !== 'style') {
            errors.push(`\x1b[31mError\x1b[0m: Style tag should be lowercase (style:).`);
            throw new Error("Compilation terminated due to errors.");
        }

        // Split the styleTag into lines
        const lines = this.styleTag.trim().split('\n');

        // Validate if style is preceded or followed by other elements on the same line
        if (lines.length > 1) {
            errors.push('\x1b[31mError\x1b[0m: Style component must be on its own line without any other elements before or after it. e.g. \n style: \n');
            throw new Error("Compilation terminated due to errors.");
        }

        // Check if style is followed immediately by script or content
        for (let i = 0; i < lines.length - 1; i++) {
            const currentLine = lines[i].trim();
            const nextLine = lines[i + 1].trim();
            if (currentLine.startsWith('style:') && (nextLine.startsWith('script:') || nextLine.startsWith('content:'))) {
                // Check if there is at least one newline between style: and script: or content:
                if (!nextLine.startsWith('\n')) {
                    errors.push('\x1b[31mError\x1b[0m: There must be at least one newline between style: and script: or content: declarations.');
                    throw new Error("Compilation terminated due to errors.");
                }
            }
        }

        // Check if any errors occurred
// Check if any errors occurred
// Check if any errors occurred
if (errors.length > 0) {
    // Display all error messages in red
    errors.forEach(error => console.error('\x1b[31mError: ' + error + '\x1b[0m'));
    console.error('\x1b[31mCompilation terminated due to errors.\x1b[0m');
    return;
}

        // Perform further validation (not implemented in this example)
        //console.log('\x1b[32mSuccess\x1b[0m: Semantic analysis and further validation of style tag.');
        //console.log('\x1b[32mSuccess\x1b[0m: Style tag parsed successfully.');
        console.log('\x1b[32mSuccess\x1b[0m:CSS compiled successfully.');
    }
}



// Define a ContentParser class to handle parsing of content tokens
class ContentParser {
    private contentTag: string;

    constructor(contentTag: string) {
        this.contentTag = contentTag;
    }

    // Method to validate and parse content tokens
    public parseContent(): void {
        // Initialize an array to store error messages
        const errors: string[] = [];

        // Validate if contentTag ends with a colon
        if (!this.contentTag.trim().endsWith(':')) {
            errors.push(`Content component '${this.contentTag}' should be followed by a colon (:) e.g. \n content: \n . If you've added a colon : to your content declaration and still encounter this error, it indicates that your content declaration might not be spelled correctly or is not written in lowercase. e.g. content: `);
        }

        // Validate if contentTag is lowercase and ends with ':'
        const contentTagWithoutColon = this.contentTag.replace(':', '');
        if (contentTagWithoutColon !== 'content') {
            errors.push(`Content tag should be lowercase (content:).`);
        }

        // Split the contentTag into lines
        const lines = this.contentTag.trim().split('\n');

        // Validate if content is preceded or followed by other elements on the same line
        if (lines.length > 1) {
            errors.push('Error: content: component must be on its own line without any other elements before or after it. e.g. \n content: \n');
        }

        // Check if content is followed immediately by script or style
        for (let i = 0; i < lines.length - 1; i++) {
            const currentLine = lines[i].trim();
            const nextLine = lines[i + 1].trim();
            if (currentLine.startsWith('content:') && (nextLine.startsWith('script:') || nextLine.startsWith('style:'))) {
                // Check if there is at least one newline between content: and script: or style:
                if (!nextLine.startsWith('\n')) {
                    errors.push('Error: There must be at least one newline between content: and script: or style: declarations.');
                    break;
                }
            }
        }

        // Check if any errors occurred
        if (errors.length > 0) {
            // Display all error messages
            errors.forEach(error => console.error(`Error: ${error}`));
            return;
        }

        // Perform further validation (not implemented in this example)
        //console.log('\x1b[32mSuccess\x1b[0m: Semantic analysis and further validation of content tag.');
        //console.log('\x1b[32mSuccess\x1b[0m: Content tag parsed successfully.');   
        console.log('\x1b[32mSuccess\x1b[0m:Html compiled successfully.');
  }
}



function validateScriptTokens(tokens: { type: TokenType; value: string }[]): void {
    let scriptTag = '';

    // Iterate through tokens to extract script tag
    for (const token of tokens) {
        if (token.type === TokenType.ScriptTag) {
            scriptTag = token.value; // Assign the value of the script tag token
            //console.log(scriptTag); // Log the scriptTag after it's assigned a value
            break;
        }
    }

    // Create an instance of ScriptParser and validate the script tag
    const scriptParser = new ScriptParser(scriptTag);
    scriptParser.parseScript();
}


// Invoker function to extract and validate style tokens
function validateStyleTokens(tokens: { type: TokenType; value: string }[]): void {
    let styleTag = '';

    // Iterate through tokens to extract style tag
    for (const token of tokens) {
        if (token.type === TokenType.StyleTag) {
            styleTag = token.value;
            break;
        }
    }

    // Create an instance of StyleParser and validate the style tag
    const styleParser = new StyleParser(styleTag);
    styleParser.parseStyle();
}

// Invoker function to extract and validate content tokens
function validateContentTokens(tokens: { type: TokenType; value: string }[]): void {
    let contentTag = '';

    // Iterate through tokens to extract content tag
    for (const token of tokens) {
        if (token.type === TokenType.ContentTag) {
            contentTag = token.value;
            break;
        }
    }

    // Create an instance of ContentParser and validate the content tag
    const contentParser = new ContentParser(contentTag);
    contentParser.parseContent();
}

// Test with the given tokens
//validateScriptTokens(tokens);
//validateStyleTokens(tokensExample);
//validateContentTokens(tokensExample);



// NOW THAT WE ARE HERE LET'S GENERATE STANDARD OR TARGET CODE


// Define a function to generate HTML code from tokens
function generateHTML(tokens: { type: TokenType; value: string }[]): string {
    let htmlCode = '';

    for (const token of tokens) {
        switch (token.type) {
            case TokenType.ScriptTag:
                // Convert script: to <script> tag
                htmlCode += '<script>\n';
                break;
            case TokenType.ScriptText:
                // Place JavaScript code below <script> tag
                htmlCode += token.value + '\n';
                // Add closing </script> tag
                htmlCode += '</script>\n';
                break;
            case TokenType.StyleTag:
                // Convert style: to <style> tag
                htmlCode += '<style>\n';
                break;
            case TokenType.StyleText:
                // Place CSS code below <style> tag
                htmlCode += token.value + '\n';
                // Add closing </style> tag
                htmlCode += '</style>\n';
                break;
            case TokenType.HtmlContent:
                // Simply include HTML content as is
                htmlCode += token.value + '\n';
                break;
            default:
                break;
        }
    }

// Wrap the generated HTML code in an export statement
    const exportStatement = `export const buttonContent = \`\n${htmlCode}\n\`;`;

    return exportStatement;
    
    }

// Test the code generation with the given tokens

























/* index.ts CORE  */



// Define a function to compile all components
function compileComponents(srcDirectory: string, buildDirectory: string) {
    const componentFiles = fetchComponentFiles(srcDirectory);
    componentFiles.forEach(file => {
        compileComponent(file, buildDirectory);
    });
}

// Function to fetch all .smq files from the src/components directory
function fetchComponentFiles(directory: string): string[] {
    console.log('Fetching component files from:', directory);
    const componentFiles: string[] = [];
    const files = fs.readdirSync(directory);
    files.forEach(file => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile() && path.extname(filePath) === '.smq') {
            console.log('Found component file:', filePath);
            componentFiles.push(filePath);
        }
    });
    return componentFiles;
}

// Function to compile a single component
function compileComponent(componentFile: string, buildDirectory: string) {
    console.log('Compiling component:', componentFile);
    // Read the source code from the component file
    const sourceCode = fs.readFileSync(componentFile, 'utf-8');
    const componentName = path.basename(componentFile, '.smq');


    const compiled = compile(sourceCode);
    const compiledHTML = generateHTML(compiled);



  /*
    // Create an instance of ComponentSyntaxCompiler
    const compiler = new ComponentSyntaxCompiler();

    // Compile the source code and generate tokens
    const tokens = compiler.compile(sourceCode);

    // Generate HTML code from tokens
    const compiledHTML = compiler.generateHTML(tokens);
    */ 

    // Write compiled HTML to file
    const outputFile = path.join(buildDirectory, `${componentName}.smq`);
    fs.writeFileSync(outputFile, compiledHTML);

    console.log(`Component ${componentName} has been compiled and written to ${outputFile}`);
}

// Main function to execute compilation of all components
function main() {
    console.log('Starting compilation process...');
    const srcDirectory = path.join(new URL('../../src/components', import.meta.url).pathname);
    const buildDirectory = path.join(new URL('../../build/components', import.meta.url).pathname);
    compileComponents(srcDirectory, buildDirectory);
}

// Execute the main function
main();



