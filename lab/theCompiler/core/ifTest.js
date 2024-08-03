import fs from 'fs';
import parser from './if_grammar.js';



// Load the custom syntax from a file or directly as a string
const customSyntax = `@if (a > b) 
    <div class="main" id="2324" @click={increment} @mouseover={do} > 
        Hi there 
    </div> 
@endif`;


// Parse the custom syntax and output the AST
try {
  const result = parser.parse(customSyntax);
  console.log("AST output:", JSON.stringify(result, null, 2));
} catch (e) {
  console.error("Parsing error:", e.message);
}