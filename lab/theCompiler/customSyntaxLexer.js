// Define token types
const TokenType = {

  IF_KEYWORD: 'IF_KEYWORD',
  CONDITION: 'CONDITION',
  RAW_HTML: 'RAW_HTML',
  ELSE_KEYWORD: 'ELSE_KEYWORD',
  END_IF_KEYWORD: 'END_IF_KEYWORD',


  FOR_KEYWORD: 'FOR_KEYWORD',
  LOOP_VARIABLE: 'LOOP_VARIABLE',
  COLON: 'COLON',
  ARRAY_VARIABLE: 'ARRAY_VARIABLE',
  RAW_HTML: 'RAW_HTML',
  END_FOR_KEYWORD: 'END_FOR_KEYWORD',


  FOR_EACH_KEYWORD: 'FOR_EACH_KEYWORD',
  LOOP_VARIABLE: 'LOOP_VARIABLE',
  COLON: 'COLON',
  ARRAY_LOOP: 'ARRAY_LOOP',
  INDEX_VARIABLE: 'INDEX_VARIABLE',
  RAW_HTML: 'RAW_HTML',
  END_FOR_EACH_KEYWORD: 'END_FOR_EACH_KEYWORD',


  WHILE_KEYWORD: 'WHILE_KEYWORD',
  LOOP_VARIABLE: 'LOOP_VARIABLE',
  COLON: 'COLON',
  ARRAY_LOOP: 'ARRAY_LOOP',
  INDEX_VARIABLE: 'INDEX_VARIABLE',
  RAW_HTML: 'RAW_HTML',
  END_WHILE_KEYWORD: 'END_WHILE_KEYWORD',



  EVENT_HANDLER: 'EVENT_HANDLER',




};

// Lexer function for @if statement
function ifLexer(input) {
    const tokens = [];
    let index = 0;

    while (index < input.length) {
        if (input.startsWith('{@if', index)) {
            tokens.push({ type: 'IF_KEYWORD', value: '{@if' });
            index += '{@if'.length;
            continue;
        }

        if (input.startsWith('{@else', index)) {
            tokens.push({ type: 'ELSE_KEYWORD', value: '{@else' });
            index += '{@else'.length;
            continue;
        }

        if (input.startsWith('{@endif', index)) {
            tokens.push({ type: 'ENDIF_KEYWORD', value: '{@endif' });
            index += '{@endif'.length;
            continue;
        }

        // Find the start of raw HTML
        const rawHtmlStart = index;
        while (index < input.length && !input.startsWith('{', index)) {
            index++;
        }
        
        // Extract the raw HTML
        const rawHtml = input.slice(rawHtmlStart, index);
        tokens.push({ type: 'RAW_HTML', value: rawHtml });
    }

    return tokens;
}

// Test the lexer function
const inputCode = `
{@if condition}
  <h2>Condition is true</h2>
{@else}
  <h2>Condition is false</h2>
{@endif}
`;

//const tokens = ifLexer(inputCode);
//console.log(tokens);





// FOR LEXER

function forLexer(input) {
    const tokens = [];
    let index = 0;

    while (index < input.length) {
        if (input.startsWith('{@for', index)) {
            tokens.push({ type: TokenType.FOR_KEYWORD, value: '{@for' });
            index += 5; // Move index past '{@for'

            // Find the loop variable
            let loopVarStart = index;
            while (input[index] !== ':' && index < input.length) {
                index++;
            }
            const loopVar = input.slice(loopVarStart, index).trim();            
            tokens.push({ type: TokenType.LOOP_VARIABLE, value: loopVar });

            // Move past ' ' after the colon
            index += 2;

            // Find the array variable
            let arrayVarStart = index;
            while (input[index] !== ' ' && index < input.length) {
                index++;
            }
            const arrayVar = input.slice(arrayVarStart, index).trim();

            tokens.push({ type: TokenType.COLON, value: ':' });
            tokens.push({ type: TokenType.ARRAY_VARIABLE, value: arrayVar });

            continue;
        }

        if (input.startsWith('{@endfor}', index)) {
            tokens.push({ type: TokenType.END_FOR_KEYWORD, value: '{@endfor}' });
            index += 9; // Move index past '{@endfor}'
            continue;
        }

        // Extract RAW_HTML token
        const htmlStart = index;
        while (!input.startsWith('{@', index) && index < input.length) {
            index++;
        }
        const html = input.slice(htmlStart, index);
        if (html.trim().length > 0) {
            tokens.push({ type: TokenType.RAW_HTML, value: html });
        }
    }

    return tokens;
}

//const input = '{@for product: products}\n  <h2>Item: {product}</h2>\n{@endfor}';
//const tokens = forLexer(input);
//console.log(tokens);




function forEachLexer(input) {
  const tokens = [];
  let index = 0;

  while (index < input.length) {
    if (input.startsWith('{@forEach', index)) {
      tokens.push({ type: TokenType.FOR_EACH_KEYWORD, value: '{@forEach' });
      index += 9; // Move index past '{@forEach'

      // Find the loop variable
      let loopVarStart = index;
      while (input[index] !== ':' && index < input.length) {
        index++;
      }
      const loopVar = input.slice(loopVarStart, index).trim();            
      tokens.push({ type: TokenType.LOOP_VARIABLE, value: loopVar });

      // Move past ':' and white space
      index += 2;

      // Find the array variable
      let arrayVarStart = index;
      while (input[index] !== ' ' && input[index] !== '\n' && index < input.length) {
        index++;
      }
      const arrayVar = input.slice(arrayVarStart, index).trim();
      tokens.push({ type: TokenType.COLON, value: ':' });
      tokens.push({ type: TokenType.ARRAY_LOOP, value: arrayVar });

      // Check if there's an index variable
      if (input[index] === ',') {
        index += 2; // Move past ',' and white space

        // Find the index variable
        let indexVarStart = index;
        while (input[index] !== ' ' && input[index] !== '\n' && index < input.length) {
          index++;
        }
        const indexVar = input.slice(indexVarStart, index).trim();
        tokens.push({ type: TokenType.INDEX_VARIABLE, value: indexVar });
      }

      continue;
    }

    if (input.startsWith('{@endForEach}', index)) {
      tokens.push({ type: TokenType.END_FOR_EACH_KEYWORD, value: '{@endForEach}' });
      index += 13; // Move index past '{@endForEach}'
      continue;
    }

    // Extract RAW_HTML token
    const htmlStart = index;
    while (!input.startsWith('{@', index) && index < input.length) {
      index++;
    }
    const html = input.slice(htmlStart, index);
    if (html.trim().length > 0) {
      tokens.push({ type: TokenType.RAW_HTML, value: html });
    }
  }

  return tokens;
}

// Test the lexer
//const input = '{@forEach item : items}\n  <h2>Index: {$index}, Item: {item}</h2>\n{@endForEach}';
//const tokens = forEachLexer(input);
//console.log(tokens);


function whileLexer(input) {
  const tokens = [];
  let index = 0;

  while (index < input.length) {
    if (input.startsWith('{@while', index)) {
      tokens.push({ type: TokenType.FOR_EACH_KEYWORD, value: '{@while' });
      index += 7; // Move index past '{@forEach'

      // Find the loop variable
      let loopVarStart = index;
      while (input[index] !== ':' && index < input.length) {
        index++;
      }
      const loopVar = input.slice(loopVarStart, index).trim();            
      tokens.push({ type: TokenType.LOOP_VARIABLE, value: loopVar });

      // Move past ':' and white space
      index += 2;

      // Find the array variable
      let arrayVarStart = index;
      while (input[index] !== ' ' && input[index] !== '\n' && index < input.length) {
        index++;
      }
      const arrayVar = input.slice(arrayVarStart, index).trim();
      tokens.push({ type: TokenType.COLON, value: ':' });
      tokens.push({ type: TokenType.ARRAY_LOOP, value: arrayVar });

      // Check if there's an index variable
      if (input[index] === ',') {
        index += 2; // Move past ',' and white space

        // Find the index variable
        let indexVarStart = index;
        while (input[index] !== ' ' && input[index] !== '\n' && index < input.length) {
          index++;
        }
        const indexVar = input.slice(indexVarStart, index).trim();
        tokens.push({ type: TokenType.INDEX_VARIABLE, value: indexVar });
      }

      continue;
    }

    if (input.startsWith('{@endwhile}', index)) {
      tokens.push({ type: TokenType.END_FOR_EACH_KEYWORD, value: '{@endForEach}' });
      index += 11; // Move index past '{@endForEach}'
      continue;
    }

    // Extract RAW_HTML token
    const htmlStart = index;
    while (!input.startsWith('{@', index) && index < input.length) {
      index++;
    }
    const html = input.slice(htmlStart, index);
    if (html.trim().length > 0) {
      tokens.push({ type: TokenType.RAW_HTML, value: html });
    }
  }

  return tokens;
}


//const input = '{@while item : items}\n  <h2>Index: {$index}, Item: {item}</h2>\n{@endwhile}';
//const tokens = whileLexer(input);
//console.log(tokens);


function customHandleLexer(input) {
    const tokens = [];
    let index = 0;

    while (index < input.length) {
        // Check for opening HTML tag
        if (input[index] === '<') {
            const tagStart = index;
            index++; // Move past '<'

            // Find the tag name
            let tagNameStart = index;
            while (input[index] !== ' ' && input[index] !== '>' && index < input.length) {
                index++;
            }
            const tagName = input.slice(tagNameStart, index);
            tokens.push({ type: 'HTML_TAG_OPEN', value: '<' + tagName + '>' });

            // Check for attributes
            while (input[index] !== '>' && index < input.length) {
                // Skip whitespace
                while (input[index] === ' ' && index < input.length) {
                    index++;
                }

                // Check if the next characters are an event handler
                if (input.startsWith('@', index)) {
                    let eventHandlerStart = index;
                    while (input[index] !== '=' && input[index] !== '>' && index < input.length) {
                        index++;
                    }
                    const eventHandler = input.slice(eventHandlerStart, index);
                    tokens.push({ type: 'EVENT_HANDLER', value: eventHandler });
                }

                // Move to the next character
                index++;
            }

            // Move past '>'
            if (index < input.length) {
                index++;
            }

            continue;
        }

        // Check for closing HTML tag
        if (input[index] === '<' && input[index + 1] === '/') {
            const tagEnd = input.indexOf('>', index);
            const tagName = input.slice(index + 2, tagEnd);
            tokens.push({ type: 'HTML_TAG_CLOSE', value: '</' + tagName + '>' });
            index = tagEnd + 1;
            continue;
        }

        // Extract raw HTML content
        let htmlStart = index;
        while (input[index] !== '<' && index < input.length) {
            index++;
        }
        const html = input.slice(htmlStart, index);
        if (html.trim().length > 0) {
            tokens.push({ type: 'RAW_HTML', value: html });
        }
    }

    return tokens;
}

const input = '<button @click="handleClick">Click me</button>';
const tokens = customHandleLexer(input);
console.log(tokens);


