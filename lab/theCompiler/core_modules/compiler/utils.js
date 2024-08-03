import fs from 'fs';
import path from 'path';
import glob from 'glob';

// Function to determine the syntax type
export function determineSyntaxType(input) {
  if (input.includes('{@if')) {
    return 'if';
  }
  throw new Error('Unknown syntax type');
}

// Function to read files recursively
export function readFilesRecursively(directory, extension) {
  const pattern = path.join(directory, `**/*.${extension}`);
  return glob.sync(pattern);
}

// Function to save output files
export function saveFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf-8');
}
