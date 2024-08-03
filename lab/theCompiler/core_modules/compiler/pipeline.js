import * as ifSyntax from './syntax/if.js';
import { determineSyntaxType, readFilesRecursively, saveFile } from './utils.js';

const syntaxModules = {
  'if': ifSyntax,
};

console.log("Within Pipeline");


export function runPipeline(input) {
  const syntaxType = determineSyntaxType(input);
  const module = syntaxModules[syntaxType];
  
  const tokens = module.lex(input);
  const ast = module.parse(tokens);
  module.validate(ast);
  const transformedOutput = module.transform(ast);
  const compiledCode = module.compile(transformedOutput);
  
  return compiledCode;
}

export function processFiles(sourceDir, destDir, extension) {
  const files = readFilesRecursively(sourceDir, extension);
  files.forEach(file => {
    const input = fs.readFileSync(file, 'utf-8');
    const compiledCode = runPipeline(input); // Call runPipeline for each file
    const relativePath = path.relative(sourceDir, file);
    const destPath = path.join(destDir, `${relativePath}.html`);
    saveFile(destPath, compiledCode);
  });
}