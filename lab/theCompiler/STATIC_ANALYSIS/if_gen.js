import * as escodegen from 'escodegen';

// Define your AST
const ast = {
  type: 'Program',
  body: [
    {
      type: 'IfStatement',
      test: {
        type: 'Literal',
        value: true,
        raw: 'true'
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

// Generate JavaScript code from AST
try {
  const generatedCode = escodegen.generate(ast);
  console.log(generatedCode);
} catch (error) {
  console.error('Error generating code:', error.message);
}
