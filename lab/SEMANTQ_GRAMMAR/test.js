import parser from './latestParser.mjs';
import fs from 'fs';

const customSyntax = `
@if(user.loggedIn)
  <p>Welcome back, {user.name}!</p>
@endif
`;

const ast = parser.parse(customSyntax);
const astString = JSON.stringify(ast, null, 2);

// Write to file
fs.writeFile('ast-output.json', astString, (err) => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log('AST successfully written to ast-output.json');
  }
});

console.log(astString);