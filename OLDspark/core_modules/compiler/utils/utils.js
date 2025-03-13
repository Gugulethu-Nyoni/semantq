import { parse } from 'acorn';

// Utility to generate a JavaScript AST from code
export function _jsAstGenerator(jsCode) {
  return parse(jsCode, { ecmaVersion: 'latest' });
}

// Utility to generate a unique element ID
export function _generateUniqueElementId() {
  const timestamp = Date.now().toString(36).substr(0, 3);
  let randomStr = Math.random().toString(36).substr(2, 5);

  while (randomStr.length < 5) {
    randomStr += Math.random().toString(36).substr(2, 1);
  }

  return `${timestamp}${randomStr}`;
}

// Utility to generate a placeholder span node
export function _generatePlaceHolderSpanNode(uniqueId) {
  return {
    start: 0,
    end: 22,
    type: 'Element',
    name: 'span',
    attributes: [
      {
        start: 6,
        end: 14,
        type: 'Attribute',
        name: 'id',
        value: [
          {
            start: 10,
            end: 13,
            type: 'Text',
            raw: uniqueId,
            data: uniqueId,
          },
        ],
      },
    ],
    children: [],
  };
}

// Utility to generate a placeholder variable AST
export function _generatePlaceHolderVariableAST(uniqueId) {
  return {
    type: 'VariableDeclaration',
    start: 0,
    end: 37,
    declarations: [
      {
        type: 'VariableDeclarator',
        start: 6,
        end: 36,
        id: {
          type: 'Identifier',
          start: 6,
          end: 26,
          name: 'placeHolderElementId',
        },
        init: {
          type: 'Literal',
          start: 28,
          end: 36,
          value: uniqueId,
          raw: `'${uniqueId}'`,
        },
      },
    ],
    kind: 'const',
  };
}

// Utility to generate a data span node
export function _generateDataSpan(dataAttribute) {
  return {
    start: 0,
    end: 33,
    type: 'Element',
    name: 'span',
    attributes: [
      {
        start: 6,
        end: 24,
        type: 'Attribute',
        name: dataAttribute,
        value: true,
      },
    ],
    children: [
      {
        start: 25,
        end: 26,
        type: 'Text',
        raw: ' ',
        data: ' ',
      },
    ],
  };
}

// Utility to generate random text
export function _generateRandomText() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let randomText = '';
  for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
    randomText += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomText;
}




