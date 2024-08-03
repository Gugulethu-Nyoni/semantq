import fs from 'fs';
import parser from './if_grammar.js';

// Load the content from a file (e.g., 'input.html')
const fileContents = fs.readFileSync('input.html', 'utf-8');

// Step 1: Find potential @if instances
const ifRegex = /@if\s*\(.*?\)/g;
let match;

while ((match = ifRegex.exec(fileContents)) !== null) {
  const startIndex = match.index;
  const endIndex = ifRegex.lastIndex;

  // Step 2: Check for content and @endif
  const remainingContent = fileContents.substring(endIndex);
  const endifIndex = remainingContent.indexOf('@endif');
  const hasContent = remainingContent.trim().length > 0;
  const hasEndif = endifIndex !== -1;

  if (hasContent && hasEndif) {
    // Extract the content between @if and @endif
    const matchContent = remainingContent.substring(0, endifIndex);
    const completeMatch = fileContents.substring(startIndex, endIndex + endifIndex + 7); // 7 is the length of '@endif'

    // Step 3: Validate the match
    try {
      const result = parser.parse(completeMatch);
      console.log("Validated AST:", JSON.stringify(result, null, 2));
    } catch (e) {
      console.error("Validation error:", e.message);
    }
  } else {
    console.error("Invalid @if syntax: missing content or @endif");
  }
}
