import * as fs from 'fs';
import * as path from 'path';


const rootDir = process.cwd();

const srcDirectory = path.join(rootDir, 'src/routes');
const buildDirectory = path.join(rootDir, 'build/routes');


const TokenType = {
    HtmlContent: 'HtmlContent',
    ScriptStart: 'ScriptStart',
    ScriptEnd: 'ScriptEnd',
    ScriptText: 'ScriptText',
    StyleStart: 'StyleStart',
    StyleEnd: 'StyleEnd',
    StyleText: 'StyleText',
    ScriptTag: 'ScriptTag', 
    StyleTag: 'StyleTag', 
    ContentTag: 'ContentTag', 
};

function compile(sourceCode) {
    const tokens = [];

    const scriptMatch = sourceCode.match(/script:\s*\n*([\s\S]*?)(?=style:|content:|$)/);
    if (scriptMatch) {
        const scriptMatchString = scriptMatch[0].slice(0, 7);
        const scriptText = scriptMatch[1].trim();
        tokens.push({ type: TokenType.ScriptTag, value: scriptMatchString });
        tokens.push({ type: TokenType.ScriptText, value: scriptText });
    }

    const styleMatch = sourceCode.match(/style:\s*\n*([\s\S]*?)(?=script:|content:|$)/);
    if (styleMatch) {
        const styleMatchString = styleMatch[0].slice(0, 6);
        const styleText = styleMatch[1].trim();
        tokens.push({ type: TokenType.StyleTag, value: styleMatchString });
        tokens.push({ type: TokenType.StyleText, value: styleText });
    }

    const contentMatch = sourceCode.match(/content:\s*\n*([\s\S]*?)(?=script:|style:|$)/);
    if (contentMatch) {
        const contentMatchString = contentMatch[0].slice(0, 8);
        const contentContent = contentMatch[1].trim();
        tokens.push({ type: TokenType.ContentTag, value: contentMatchString });
        tokens.push({ type: TokenType.HtmlContent, value: contentContent });
    }

    const promises = [];

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
    constructor(scriptTag) {
        this.scriptTag = scriptTag;
    }

    parseScript() {
        console.log('\x1b[32mSuccess\x1b[0m:Javascript compiled successfully.');
    }
}

class StyleParser {
    constructor(styleTag) {
        this.styleTag = styleTag;
    }

    parseStyle() {
        console.log('\x1b[32mSuccess\x1b[0m:CSS compiled successfully.');
    }
}

class ContentParser {
    constructor(contentTag) {
        this.contentTag = contentTag;
    }

    parseContent() {
        console.log('\x1b[32mSuccess\x1b[0m:Html compiled successfully.');
    }
}

function validateScriptTokens(tokens) {
    const scriptParser = new ScriptParser();
    scriptParser.parseScript();
}

function validateStyleTokens(tokens) {
    const styleParser = new StyleParser();
    styleParser.parseStyle();
}

function validateContentTokens(tokens) {
    const contentParser = new ContentParser();
    contentParser.parseContent();
}

function generateHTML(tokens) {
    let htmlCode = '';

    for (const token of tokens) {
        switch (token.type) {
            case TokenType.ScriptTag:
                htmlCode += '<script>\n';
                break;
            case TokenType.ScriptText:
                htmlCode += token.value + '\n';
                htmlCode += '</script>\n';
                break;
            case TokenType.StyleTag:
                htmlCode += '<style>\n';
                break;
            case TokenType.StyleText:
                htmlCode += token.value + '\n';
                htmlCode += '</style>\n';
                break;
            case TokenType.HtmlContent:
                htmlCode += token.value + '\n';
                break;
            default:
                break;
        }
    }

    return htmlCode;
}


// Assuming this is a class method
export function readRoutesRecursively() {

console.log("within");


//const srcDirectory = path.join(rootDir, 'src/routes');
//const buildDirectory = path.join(rootDir, 'build/routes');


    // Function to recursively read files from a directory
const recursiveRead =  (directoryPath, currentBuildPath) => {
    const files = fs.readdirSync(directoryPath);
    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const buildFilePath = path.join(currentBuildPath, file);

        if (fs.statSync(filePath).isDirectory()) {
            const nextBuildPath = path.join(currentBuildPath, file);
             recursiveRead(filePath, nextBuildPath);
        } else {
            if (file === '+page.smq' && path.extname(filePath) === '.smq') {
    const fileContent = fs.readFileSync(filePath, 'utf-8'); // Read file content
    //console.log(fileContent);
    //return;

    const compiledContent = compile(fileContent);
    const normalHmtl= generateHTML(compiledContent);
    //console.log(compiledContent);
    //return;

     // Pass content to compile function
    fs.writeFileSync(buildFilePath, normalHmtl);
    handleImports(filePath, buildFilePath);
}
        }
    }
};


    // Start recursive reading
    recursiveRead(srcDirectory, buildDirectory);
}


function handleImports() {
    //const srcDirectory = '../../src/components';
    //const buildDirectory = '../../build/components';

    if (!fs.existsSync(buildDirectory)) {
        fs.mkdirSync(buildDirectory, { recursive: true });
    }

    const traverseDirectory = (directoryPath, currentBuildPath) => {
        const files = fs.readdirSync(directoryPath);
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const buildPath = path.join(currentBuildPath, path.relative(srcDirectory, filePath));

            if (fs.statSync(filePath).isDirectory()) {
               traverseDirectory(filePath, currentBuildPath);
            } else {
                if (path.extname(file) === '.smq') {
                    if (!fs.existsSync(path.dirname(buildPath))) {
                        fs.mkdirSync(path.dirname(buildPath), { recursive: true });
                    }

                    const componentContent = fs.readFileSync(filePath, 'utf-8');
                    const compiledComponentContent = compile(componentContent);
                    const componentNormalHtml = generateHTML(compiledComponentContent);

                    fs.writeFileSync(buildPath, componentNormalHtml);
                }
            }
        }
    };

   traverseDirectory(srcDirectory, buildDirectory);
}

