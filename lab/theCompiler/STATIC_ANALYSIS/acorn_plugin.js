import { Parser } from 'acorn';
import acornPluginReactive from './acorn-plugin-reactive.js';

const CustomParser = Parser.extend(acornPluginReactive);

/*
const parser = CustomParser.parse('$: console.log("Reactive expression");', {
  ecmaVersion: 'latest', // Adjust ecmaVersion as per your needs
});
*/

const parser = Parser('$: console.log("Reactive expression");', {
  ecmaVersion: 'latest', // Adjust ecmaVersion as per your needs
});

console.log(JSON.stringify(parser, null, 2));
