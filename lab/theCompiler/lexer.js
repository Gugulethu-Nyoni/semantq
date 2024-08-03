// Step 1: Lexical Analysis

// Define token types
const TokenType = {
  Identifier: 'Identifier',
  Keyword: 'Keyword',
  Operator: 'Operator',
  Literal: 'Literal',
  Punctuation: 'Punctuation',
  EOF: 'EOF' // End-of-file token
};

// Define keywords for your language
const Keywords = new Set([
  'let', 'const', 'function', 'if', 'else', // Add more keywords as needed
]);

// Define operators for your language
const Operators = new Set([
  '+', '-', '*', '/', '=', '==', '!=', '<', '>', '<=', '>=', // Add more operators as needed
]);

// Define punctuation characters
const Punctuation = new Set([
  '(', ')', '{', '}', ',', ';', ':', // Add more punctuation characters as needed
]);

// Define a function to tokenize input code
function tokenize(input) {
  const tokens = [];
  let cursor = 0;

  while (cursor < input.length) {
    const char = input[cursor];
    let token;

    // Check for whitespace and skip it
    if (/\s/.test(char)) {
      cursor++;
      continue;
    }

    // Identify token type based on the current character
    if (char === '$') {
      token = { type: TokenType.Keyword, value: '$' }; // Reactive declaration
    } else if (Keywords.has(char)) {
      token = { type: TokenType.Keyword, value: char };
    } else if (Operators.has(char)) {
      token = { type: TokenType.Operator, value: char };
    } else if (Punctuation.has(char)) {
      token = { type: TokenType.Punctuation, value: char };
    } else if (/[a-zA-Z_]/.test(char)) {
      token = scanIdentifier(input, cursor);
    } else if (/\d/.test(char)) {
      token = scanNumber(input, cursor);
    } else {
      throw new Error(`Unexpected character at position ${cursor}: ${char}`);
    }

    tokens.push(token);
    cursor += token.value.length;
  }

  // Add EOF token to mark the end of input
  tokens.push({ type: TokenType.EOF, value: '' });

  return tokens;
}

// Helper function to scan identifiers (variable names)
function scanIdentifier(input, start) {
  let cursor = start;
  while (/[a-zA-Z0-9_]/.test(input[cursor])) {
    cursor++;
  }
  const value = input.substring(start, cursor);
  return { type: TokenType.Identifier, value };
}

// Helper function to scan numbers (integer literals)
function scanNumber(input, start) {
  let cursor = start;
  while (/\d/.test(input[cursor])) {
    cursor++;
  }
  const value = input.substring(start, cursor);
  return { type: TokenType.Literal, value };
}

// Example usage:
const inputCode = `
let counter = 5;
  let foo = 5;
  const increment = () => counter++;
  const decrement = () => counter--;
  const incrementFoo = () => foo++;
  
  $: quadruple = double * 2;
  $: double = counter * 2 + bar;
  
  $: bar = foo + 5;

`;





const tokens = tokenize(inputCode);
console.log(tokens);
