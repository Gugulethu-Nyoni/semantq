import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import { parse } from 'acorn';
import postcss from 'postcss';
import escodegen from 'escodegen';
import parser from './semantq_parser.js'; 




function readSMQHTMLFiles(directory) {

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
          readSMQHTMLFiles(filePath); // Recursively call on subdirectory
        } else if (path.extname(file).toLowerCase() === '.html') {
         // console.log(`Found html file: ${filePath}`);

         const parsedBlocks = parseComponent(filePath);

         //console.log(parsedBlocks);

        }
      });
    });
  });
}




function parseComponent(filePath) {

  //console.log("PATH",filePath);


  try {
    // Read file synchronously
    const code = fs.readFileSync(filePath, 'utf8');
    //console.log(code);

    const $ = cheerio.load(code);

    // Extract JavaScript code from <script> tags
    const jsCode = $('script').html() || '';

    //console.log(jsCode);

    // Extract CSS code from <style> tags
    let cssCode = $('style').html() || '';

      //console.log("ISSUE",JSON.stringify(cssCode,null,2)); return;

      if (cssCode==="\n  [object Object]\n"){
          cssCode='';
      }

// Define markers
const startMarker = '<customSyntax>';
const endMarker = '</customSyntax>';

// Find start and end indices
const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker, startIndex);

// Extract customSyntax block including markers
let customCode = code.substring(startIndex, endIndex + endMarker.length).trim();

// Replace markers in the extracted block
customCode = customCode.replace('<customSyntax>', '<customSyntax> <div id="1"> <div id="2"> <div id="3"> <section id="4">');
customCode = customCode.replace('</customSyntax>', '</section> </div> </div> </div> </customSyntax>');

//console.log("HERE", customCode);


     //return;

    
    //console.log(customCode);

    // Parse JavaScript code using acorn
    const jsAST = parse(jsCode, { ecmaVersion: 2022 });

    // Parse CSS code using postcss
    const cssAST = postcss.parse(cssCode, { from: 'style' });

     //console.log(JSON.stringify(cssAST, null,2));
    const regeneratedCss = cssAST.toResult().css;
	 //console.log(regeneratedCss);




    // Parse HTML (customSyntax) using your custom parser (replace customParser with your actual parser)
    const customAST = parser.parse(customCode);
   
   // console.log("CS ",JSON.stringify(customAST, null, 2));

   // console.log("JS ", JSON.stringify(jsAST, null, 2));
  
  //	const generatedCode = escodegen.generate(jsAST);
  //    console.log(generatedCode);

    const newFilePath = filePath.replace('.html','.ast'); 
    writeToFile({jsAST: jsAST, cssAST, cssAST, customAST: customAST, newFilePath: newFilePath});

/*
    return {
      jsAST,
      cssAST,
      customAST
    };

*/

  } catch (err) {
    console.error(`Error processing file ${filePath}:`, err);
    return null;
  }
}











// Main function
export function compileSMQFiles(destDir) {
    //const directory = '../../build/routes'; // dest directory
  return  readSMQHTMLFiles(destDir);
}

// Compile .smq files
//compileSMQFiles();


function writeToFile(astObjects){

//console.log(astObjects); return;

// Creating new objects with the same structure
const jsAST = { type: 'JavaScript', content: astObjects.jsAST };
const cssAST = { type: 'CSS', content: astObjects.cssAST };
const customAST = { type: 'Custom', content: astObjects.customAST };


  const astObject= {
jsAST,
cssAST,
customAST,

  }

const jsonString = JSON.stringify(astObject, null, 2);

const newFilePath = astObjects.newFilePath; 



    fs.unlink(newFilePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error(err);
    } else {
      fs.writeFile(newFilePath, jsonString, (err) => {
        if (err) {
          console.error(err);
        } else {
          //console.log('Ast File written successfully');
        }
      });
    }
  });


}