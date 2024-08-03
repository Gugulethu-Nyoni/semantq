


check variables that can mutate or reassigned - etc - work out initial state  and final state after event based on dependency graph



Assignment Expressions: Identify where variables are assigned new values (= operator).

Update Expressions: Detect increment (++), decrement (--), and other compound assignment operators (+=, -=, etc.).

Function Calls and Arguments: Track function calls and their arguments, as they can alter state or be dependent on other expressions.

Control Flow Statements: Handle if statements, loops (for, while, do-while), and switch cases to understand how they affect variable states and dependencies.


// Example AST traversal using Acorn (a JavaScript parser)
const acorn = require("acorn");
const walk = require("acorn-walk");

const code = `
  let a = 10;
  let b = a + 5;
  b++;
  function foo(x) {
    return x * 2;
  }
  let c = foo(b);
`;

const ast = acorn.parse(code, { ecmaVersion: 2020 });

const stateChanges = [];

// Traverse AST to detect assignments and function calls
walk.simple(ast, {
  VariableDeclarator(node) {
    stateChanges.push({ type: 'assignment', variable: node.id.name });
  },
  UpdateExpression(node) {
    stateChanges.push({ type: 'update', variable: node.argument.name });
  },
  CallExpression(node) {
    stateChanges.push({ type: 'call', function: node.callee.name });
    node.arguments.forEach(arg => {
      if (arg.type === 'Identifier') {
        stateChanges.push({ type: 'argument', variable: arg.name });
      }
    });
  }
});

// Output state changes
console.log(stateChanges);


[
  { type: 'assignment', variable: 'a' },    // Detected assignment of 'a'
  { type: 'assignment', variable: 'b' },    // Detected assignment of 'b'
  { type: 'update', variable: 'b' },        // Detected update of 'b' (b++)
  { type: 'call', function: 'foo' },        // Detected function call to 'foo'
  { type: 'argument', variable: 'b' },      // Detected argument 'b' passed to 'foo'
  { type: 'assignment', variable: 'c' },    // Detected assignment of 'c'
];


VariableDeclaration
AssignmentExpression
UpdateExpression
FunctionDeclaration
if
for
while
do-while
switch



Object and array mutations:

let obj = { prop: 1 };
obj.prop = 2;      // Object property update

let arr = [1, 2, 3];
arr[0] = 10;       // Array element update
arr.push(4);       // Array method mutation


Destructuring Assignments:

let { a, b } = { a: 1, b: 2 };
a = 10;           // Destructuring with assignment

let [x, y] = [1, 2];
x = 5;            // Array destructuring



const esprima = require('esprima');

const code = `
let x = 10;
function increment() {
  x++;
}
increment();
if (x > 10) {
  x = 0;
}
for (let i = 0; i < 10; i++) {
  x += i;
}
`;

const ast = esprima.parseScript(code);

function findStateChanges(node) {
  switch (node.type) {
    case 'VariableDeclaration':
    case 'AssignmentExpression':
    case 'UpdateExpression':
    case 'FunctionDeclaration':
    case 'IfStatement':
    case 'ForStatement':
    case 'WhileStatement':
    case 'DoWhileStatement':
    case 'SwitchStatement':
      console.log(`State-altering expression: ${node.type}`, node);
      break;
  }
  // Traverse child nodes
  for (let key in node) {
    if (node[key] && typeof node[key] === 'object') {
      findStateChanges(node[key]);
    }
  }
}

findStateChanges(ast);


Pipeline must do all logic blocks first - block_transformers

then - basic_transformers



1. AssignmentExpression with no other state altering expression that involve the variable 


JS:

let counter = 5;

HTML: 
<p> Counter: {counter} </p>

Transpilation:

check if in there are any state altering expressions in the depedency graph if there is none: 

ReactiveExpressions or FunctionDeclaration

varibleName: expressionTypes sub object

replace {counter} with: <span id="uniqueid" />

add this js code:

const target = document.getElementById('uniqueid');
target.textContent=counter;



2. Variable Declaration plus AssignmentExpression

let counter = 1; 

counter = 5; 

HTML:

<p> Counter: {counter} </p>


Transpilation:

check if in there are any state altering expressions in the depedency graph if there is none: 


replace {counter} with: <span id="uniquid" />

add this js code:

const target = document.getElementById('uniqueid');
target.textContent=counter;


3. VariableDeclaration plus UpdateExpression // can also add AssignmentExpression


let counter = 0 ;

counter = 6; 

counter ++; // or ++ counter; or counter +=1;


HTML:

<p> Counter: {counter} </p>


Transpilation:

check if in there are any state altering expressions in the depedency graph if there is none: 


replace {counter} with: <span id="uniquid" />

add this js code:

const target = document.getElementById('uniqueid');
target.textContent=counter;



4. 

let counter = 0;

function incrementer()
{

counter +=1;

}

HTML:

<p> Counter: {counter} </p>


<button onclick="incrementer()"> + </button>


// TRANSPILE 

// 1. handle initial rendering

1. replace {counter} - get the the parent note - outerhtml that includes {counter} with <span id="known-unique-id" />
2. get getElementById: const elem = document.getElementById(unqueid);
3. elem.textContent=counter;


// 2. Handle reactivity 

// create a reRender function 

function reRenderCounter () {

const elem= document.getElementById(unqueid);
elem.textContent=counter;

}

// 3. append reRender function call to the main function 

function incrementer()
{

counter +=1;
// append reRender function call here 

reRenderCounter();

}











EXAMPLES:

JS:
let num = 1;

while (num < 10) {

num ++;

}


HTML:

<h1> Num: { num } </h1> 


Transpiled to: 

let num = 1;
let html = document.querySelector('h1');

while (num < 10) {
  num++;
  html.textContent = `Num: ${num}`;
}



