import fs from 'fs';
import parser from './parser.js';
import * as escodegen from 'escodegen';



// Load the custom syntax from a file or directly as a string
/*
const customSyntax = `@if ( name > firstname && abc > 345) <button @mouser={counter(param1, param2, param3)} @focus={(function(){ clickHandler() })()} @doubleclick={() => clickHandler()}class="main" id="23" @focus={counter}> Click Me </button> @endif
`;
*/

const customSyntax =`
 @if (loggedIn === true)

 { LoggedIn? 'Hi, you are logged in' : 'You need to login!' }

@endif

`;

// Parse the custom syntax and output the AST
try {
  const parsedAst = parser.parse(customSyntax);
  //console.log("AST output:", JSON.stringify(parsedAst, null, 2));


const dummyAST = {
  type: 'Program',
  start: 0,
  end: 1,
  body: [
    {
      type: 'IfStatement',
      start: 0,
      end: 57,
      test: {
        type: 'BinaryExpression',
        start: 5,
        end: 16,
        left: {
          type: 'Identifier',
          start: 5,
          end: 16,
          name: 'counter'
        },
        operator: '>',
        right: {
          type: 'Literal',
          start: 5,
          end: 16,
          value: 1,
          raw: '1'
        }
      },
      consequent: {
        type: 'BlockStatement',
        start: 21,
        end: 57,
        body: [
          {
            type: 'ExpressionStatement',
            start: 21,
            end: 57,
            expression: {
              type: 'ConditionalExpression',
              start: 21,
              end: 57,
              test: {
                type: 'BinaryExpression',
                start: 23,
                end: 36,
                left: {
                  type: 'Identifier',
                  start: 23,
                  end: 36,
                  name: 'counter'
                },
                operator: '===',
                right: {
                  type: 'Literal',
                  start: 23,
                  end: 36,
                  value: 1,
                  raw: '1'
                }
              },
              consequent: {
                type: 'Literal',
                start: 23,
                end: 34,
                value: 'time',
                raw: "'time'"
              },
              alternate: {
                type: 'Literal',
                start: 34,
                end: 45,
                value: 'times',
                raw: "'times'"
              }
            }
          }
        ]
      },
      alternate: null
    }
  ],
  sourceType: 'module'
};

  const generatedCode = escodegen.generate(dummyAST);
  console.log(generatedCode);

} catch (e) {
  console.error("Parsing error:", e.message);
}

// 