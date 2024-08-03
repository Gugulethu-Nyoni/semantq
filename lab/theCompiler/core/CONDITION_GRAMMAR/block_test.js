import escodegen from 'escodegen';



const ast =
{
  type: 'Program',
  body: [
    {
      type: 'IfStatement',
      test: {
        type: 'BinaryExpression',
        operator: 'in',
        left: {
          type: 'Literal',
          value: 'property',
          raw: "'property'"
        },
        right: {
          type: 'Identifier',
          name: 'obj',
          start: 20,
          end: 23
        }
      },
      consequent: {
        type: 'BlockStatement',
        body: []
      },
      alternate: null
    }
  ],
  sourceType: 'module'
};




const options = {
  format: {
    indent: {
      style: 'tab'
    }
  }
};

const code = escodegen.generate(ast, options);
console.log(code);


