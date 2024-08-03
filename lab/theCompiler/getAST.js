import * as acorn from 'acorn';
import fs from 'fs';
import path from 'path';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
//const filePath = path.resolve(__dirname, './sample.js');

const filePath = path.resolve(__dirname, './reactiveHeuristics.js');


const fileContent = fs.readFileSync(filePath, 'utf8');
const ast = acorn.parse(fileContent, {
  sourceType: 'module'
});

console.log(JSON.stringify(ast, null, 2));
