// transpile.js

import { readFile as fsReadFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import Anatomique from './anatomique.js';

// Emulate __dirname for ESM
const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, 'main.ast');

export async function loadASTAndTranspile() {
    try {
        const rawData = await fsReadFile(filePath, 'utf8');

        // parse the AST JSON
        const astBlocks = JSON.parse(rawData);
        const { jsAST, cssAST, customAST } = astBlocks;

        // Initialize your transpiler
        const transpile = new Anatomique(jsAST, cssAST, customAST, filePath);

        // Assuming your class has a traverse() method to start processing
        //transpile.traverse();

    } catch (error) {
        console.error('Error reading or processing AST file:', error);
    }
}

loadASTAndTranspile();
