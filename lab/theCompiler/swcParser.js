// Import SWC parser
import { parse } from '@swc/core';

// JavaScript code string to parse
const code = `

input = document.getElementById('boundIput');
input.value="hello world";


function alerter(mess) {

alert(mess);

}


`;

// Parse the code using SWC
const ast = parse(code, {
  // Optional SWC options
  syntax: 'ecmascript', // Specify the JavaScript syntax (e.g., 'typescript', 'ecmascript')
  sourceType: 'module', // Specify the source type (e.g., 'module', 'script')
  dynamicImport: true, // Enable support for dynamic import() syntax
});

console.log(ast); // Output the parsed AST
