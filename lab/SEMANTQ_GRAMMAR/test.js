import parser from './parser_latest.js';
import fs from 'fs';

/*
const customSyntax = `
@if(items.length > 0)
  @each(items as item)
    @if(item.active)
      <li>{item.name}</li>
    @else
      <li>Item is inactive</li>
    @endif
  @endeach
@else
  <p>No items available</p>
@endif
`;
*/

const input = `@if(isLoggedIn)
  Welcome back!
@else
  @each(tasks as task)
    @if(task.title == "write")
      <li> Important task: {task.title} </li>
    @else
      <li> {task.title} </li>
    @endif
  @endeach
@endif
`;

const ast = parser.parse(input);
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





