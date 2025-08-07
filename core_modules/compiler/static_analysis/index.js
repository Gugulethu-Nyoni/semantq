"use strict";

import { writeFile, mkdir } from 'node:fs/promises';
import { join, basename } from 'node:path';
import escodegen from 'escodegen';
import { parse } from 'acorn';
import customHtmlParser from '../customHtmlParser.js';
import fs from 'fs-extra';
import path from 'path';
import prettier from 'prettier';
import Anatomique from './anatomique.js';
import { readFile as fsReadFile } from 'node:fs/promises';

/**
 * Main transformation pipeline - processes ASTs and generates final output files.
 * This is the orchestrator that now explicitly separates JS bundle generation from HTML file creation.
 * @param {Object} jsAST - JavaScript AST (Program node from Acorn).
 * @param {string} cssCode - CSS content.
 * @param {Object} customSyntaxAST - Custom HTML AST (from .smq file).
 * @param {string} filePath - Original source file path (e.g., /path/to/routes/node/@page.smq.ast).
 */
export default async function transformASTs(jsAST, cssCode, customSyntaxAST, filePath) {
    try {


        const fileName = path.basename(path.dirname(filePath));
        const appRootId = 'app';

        // 1. First extract imports BEFORE any processing
        const { importsAST } = hoistImports(jsAST); 

        //console.log("Initial jsAST", jsAST);

        const clonedJSAST = structuredClone(jsAST);
        //clonedJSAST.body = clonedJSAST.body.filter(node => node.type !== 'ImportDeclaration');
        const mainPageOriginalJS = clonedJSAST.body?.length
          ? escodegen.generate(clonedJSAST)
          : '';

    //console.log("Original JS", mainPageOriginalJS);


//console.log("JS Generated", mainPageOriginalJS);
//console.log("JS AST structure", jsAST);



        // --- PHASE 1: CORE CUSTOM SYNTAX TRANSPILATION ---
        // Anatomique transpiles custom HTML (customSyntaxAST) into reactive JS code.
        const transpiler = new Anatomique({ content: jsAST }, cssCode, customSyntaxAST, filePath, mainPageOriginalJS);
        const { transpiledJSCode } = await transpiler.output();


        //console.log("Critical",transpiledJSCode);


        //return;

        // --- PHASE 2: LAYOUT PROCESSING (if a layout exists for this route) ---
        const layoutHTML = await processLayoutFile(filePath);
        const hasLayout = Boolean(layoutHTML);
        let layoutJS = '';
        if (hasLayout) {
            layoutJS = generateLayoutJS(layoutHTML);
        }

        // --- PHASE 3: FINAL JAVASCRIPT BUNDLE ASSEMBLY ---
        // Combine original JS, transpiled custom syntax JS, and layout JS into a single JS file.
        const finalJsCode = await generateFinalJsBundle(
            importsAST,
            jsAST,
            transpiledJSCode,
            hasLayout,
            layoutJS,
            cssCode,
            fileName
            
        );

        // --- FINAL PHASE: WRITE OUTPUT FILES ---
        // Write the complete JS, CSS, and HTML files to their respective locations.
        // The HTML file is now generated in this step.
        await writeOutputFiles(filePath, finalJsCode, cssCode, fileName, appRootId);

    } catch (error) {
        console.error('❌ Transformation pipeline failed:', error);
        throw error;
    }
}

// -----------------------------------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------------------------------

/**
 * Generates base imports for the application.
 * @returns {string} - Common import statements.
 */
function generateBaseImports() {
  return `
import Router from '/core_modules/router/router.js';

\n
import {
  $state,
  $derived,
  $effect,
  $getValue,
  bind,
  bindText,
  bindAttr,
  bindClass,
  $props,
} from "@semantq/state";
`;
}




/**
 * Processes layout file if available and extracts its HTML content.
 * @param {string} filePath - The original file path to deduce layout path.
 * @returns {Object|null} - Object containing head, main, footer HTML strings, or null if no layout.
 */
async function processLayoutFile(filePath) {
    const targetDir = path.dirname(filePath);
    const layoutResolvedPath = path.join(targetDir, '@layout.resolved.ast');
    const layoutSmqPath = path.join(targetDir, '@layout.smq.ast');

    const layoutFilePath = fs.existsSync(layoutResolvedPath)
        ? layoutResolvedPath
        : fs.existsSync(layoutSmqPath) ? layoutSmqPath : null;

    if (!layoutFilePath) return null;

    try {
        const layoutContent = await fsReadFile(layoutFilePath, 'utf-8');
        const layoutAST = JSON.parse(layoutContent);
        //console.log("LAYOUT AST",JSON.stringify(layoutAST));
        return extractLayoutContent(layoutAST);
    } catch (error) {
        console.error('Error processing layout file:', error);
        return null;
    }
}

/**
 * Extracts specific HTML blocks (head, main, footer) from a layout AST.
 * Uses customHtmlParser to convert AST nodes back to HTML strings.
 * @param {Object} layoutAST - The AST of the layout file.
 * @returns {Object} - HTML content strings for head, main, and footer.
 */
function extractLayoutContent(layoutAST) {
    const blocks = { head: null, main: null, footer: null };
    const traverse = (node) => {
        if (Array.isArray(node)) return node.forEach(traverse);
        if (node?.type === 'Element') {
            if (node.name === 'head') blocks.head = node;
            else if (node.name === 'main') blocks.main = node;
            else if (node.name === 'footer') blocks.footer = node;
        }
        if (node?.children) node.children.forEach(traverse);
    };

    if (layoutAST?.customAST?.content?.html?.children) {
        // Correct path to the children of the customSyntax element
        const rootNodes = layoutAST.customAST.content.html.children[0].children; 
        if (rootNodes) traverse(rootNodes);
    }
    
    //console.log("THE HEAD", customHtmlParser(blocks.head));
    return {
        head: blocks.head ? customHtmlParser(blocks.head) : '',
        main: blocks.main ? customHtmlParser(blocks.main) : '',
        footer: blocks.footer ? customHtmlParser(blocks.footer) : ''
    };
}

/**
 * Generates JavaScript code for incorporating the layout HTML.
 * @param {Object} layoutHTML - Object containing head, main, footer HTML strings.
 * @returns {string} - JavaScript code for rendering the layout.
 */
function generateLayoutJS(layoutHTML) {
    return `
function layoutInit() {
    const layoutBlocks = {
        head: \`${layoutHTML.head}\`,
        body: \`${layoutHTML.main}\`,
        footer: \`${layoutHTML.footer}\`
    };
    function updateHead(html) {
        // Use a temporary template to parse the incoming HTML string.
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = html;

        // Iterate over all children of the parsed HTML.
        // Append them directly to the head, preserving existing elements.
        const head = document.head;
        while (tempContainer.firstChild) {
            head.appendChild(tempContainer.firstChild);
        }
    }
    function updateBody(html) {
        document.body.innerHTML = '';
        const template = document.createElement('template');
        template.innerHTML = html;
        document.body.appendChild(template.content.cloneNode(true));
    }
    function appendFooter(html) {
        const template = document.createElement('template');
        template.innerHTML = html;
        document.body.appendChild(template.content.cloneNode(true));
    }
    if (layoutBlocks.head) updateHead(layoutBlocks.head);
    if (layoutBlocks.body) updateBody(layoutBlocks.body);
    if (layoutBlocks.footer) appendFooter(layoutBlocks.footer);
}
layoutInit();`;
}

/**
 * Generates the complete JavaScript bundle by combining all code parts.
 * @param {Object} originalJsAST - The initial JavaScript AST.
 * @param {string} transpiledJSCode - JS code transpiled from custom HTML.
 * @param {boolean} hasLayout - Whether a layout is present.
 * @param {string} layoutJS - JavaScript code for layout initialization.
 * @returns {Promise<string>} - The complete JS bundle string.
 */
// In transformASTs.js

// ... other helper functions ...

/**
 * Generates the complete JavaScript bundle.
 * @param {Object} originalJsAST - The initial JavaScript AST.
 * @param {string} transpiledJSCode - The full component JS string from Anatomique.
 * @param {boolean} hasLayout - Whether a layout is present.
 * @param {string} layoutJS - JavaScript code for layout initialization.
 * @returns {Promise<string>} - The complete JS bundle string.
 */

async function generateFinalJsBundle(importsAST, originalJsAST, transpiledJSCode, hasLayout, layoutJS, cssCode, fileName) {
    // Hoist imports from the original JS AST

    //console.log("originalJsAST",originalJsAST);
    //const { importsAST } = hoistImports(originalJsAST);

    ///console.log("cssCode",cssCode);



    let allImports = generateBaseImports();

    if (cssCode !=='') {

        const cssImportNode = {
          type: 'ImportDeclaration',
          specifiers: [],
          source: {
            type: 'Literal',
            value: `./${fileName}.css`,
            raw: `'./${fileName}.css'`
          }
        };

        // Add the new AST node to the existing imports array
        importsAST.unshift(cssImportNode); // Use unshift to add it to the beginning of the array
   } 
        if (importsAST.length > 0) {
            allImports += escodegen.generate({
                type: "Program",
                body: importsAST,
                sourceType: "module"
            });
        }

        //console.log("allImports",allImports);


    // also get imports from originalJsAST if any and add them to allImports

    //console.log("JS AST",JSON.stringify(originalJsAST,null,2))


    const finalJsBundle = await formatCode(`
    ${allImports}
    ${hasLayout ? `
    // Layout initialization script
    ${layoutJS}
    ` : ''}

    // Transpiled code from Anatomique, including renderComponent and all page logic
    ${transpiledJSCode}
    `, 'babel');

    return finalJsBundle;
}


/**
 * Separates import declarations from other JavaScript code.
 * @param {Object} ast - The AST to process.
 * @returns {{importsAST: Array, jsCodeAST: Array}} - Arrays of import nodes and other JS code nodes.
 */
function hoistImports(ast) {

    //console.log("hoistImports",ast);
    const importsAST = [];
    const jsCodeAST = [];
    if (ast && Array.isArray(ast.body)) {
        ast.body.forEach(node => {
            node.type === "ImportDeclaration"
                ? importsAST.push(node)
                : jsCodeAST.push(node);
        });
    }
    return { importsAST, jsCodeAST };
}

/**
 * Formats code using Prettier.
 * @param {string} code - The code string to format.
 * @param {'babel'|'html'|'css'} parser - The parser to use for Prettier.
 * @returns {Promise<string>} - The formatted code string.
 */
async function formatCode(code, parser) {
    try {
        return await prettier.format(code, { parser });
    } catch (err) {
        console.error(`Error formatting ${parser} code:`, err);
        return code;
    }
}

/**
 * Writes the final generated JavaScript, CSS, and HTML files to disk.
 * The HTML file is now generated directly within this function.
 * @param {string} originalFilePath - The original source file path.
 * @param {string} jsCode - The complete JavaScript bundle.
 * @param {string} cssCode - The complete CSS content.
 * @param {string} fileName - The base name for the output JS and CSS files.
 * @param {string} appRootId - The ID of the root HTML element.
 */
async function writeOutputFiles(originalFilePath, jsCode, cssCode, fileName, appRootId) {
    const outputDir = path.dirname(originalFilePath);
    const jsPath = path.join(outputDir, `${fileName}.js`);
    const cssPath = path.join(outputDir, `${fileName}.css`);
    const htmlPath = path.join(outputDir, 'index.html');

    // Ensure output directory exists
    await mkdir(outputDir, { recursive: true });

    // Generate the minimal HTML shell.
    const config = await import('../../../semantq.config.js');
    const { brand, pageTitle, metaDescription } = config.default;

// removed: ${cssCode ? `<link rel="stylesheet" href="./${fileName}.css">` : ''}
    const htmlContent = await formatCode(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDescription}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="${brand}">
</head>
<body>
    <div id="${appRootId}"></div>
    <script type="module">
        import { renderComponent } from './${fileName}.js';
        document.addEventListener("DOMContentLoaded", () => {
            
            renderComponent();
            
        });
    </script>
</body>
</html>`, 'html');

    await Promise.all([
        fs.writeFile(jsPath, jsCode),
        cssCode && fs.writeFile(cssPath, cssCode),
        fs.writeFile(htmlPath, htmlContent)
    ]);
    //console.log(`✨ Generated files for ${fileName}: ${jsPath}, ${htmlPath}${cssCode ? `, ${cssPath}` : ''}`);
}