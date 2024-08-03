import fs from 'fs';
//import peg from './grammar.js';

import peg from './test2.js';



// Load the custom syntax from a file or directly as a string
const customSyntax = `
script:

@if (true) 

<h1 class="my-class" > Hi there <h1/> 

@endif 

end:

style:
body {
  background-color: #f0f0f0;
}
end:

content:
<div>Hello, World!</div>
`;

// Function to transpile custom syntax to HTML, CSS, JS
function transpileCustomSyntax(syntax) {
  try {
    const parsed = peg.parse(syntax);

    // Transpile to standard HTML, CSS, JS
    let js = '';
    let css = '';
    let html = '';

    parsed.forEach(block => {
      switch (block.type) {
        case 'script':
          js += block.content.join('') + '\n';
          break;
        case 'style':
          css += block.content.join('') + '\n';
          break;
        case 'content':
          html += block.content.join('') + '\n';
          break;
      }
    });

    return { js, css, html };

  } catch (e) {
    console.error('Syntax Error:', e.message);
    throw e;
  }
}

try {
  const { js, css, html } = transpileCustomSyntax(customSyntax);

  // Output the transpiled code to files or console
  console.log('<script>' + js + '</script>');
  console.log('<style>' + css + '</style>');
  console.log(html);

  fs.writeFileSync('output.html', `<script>${js}</script>\n<style>${css}</style>\n${html}`);
} catch (e) {
  console.error('Failed to transpile custom syntax.');
}
