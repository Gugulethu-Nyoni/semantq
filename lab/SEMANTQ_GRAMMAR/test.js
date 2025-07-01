import parser from './semantqParser.js'; 

const customAST=
`

  <Component prop="myProp" />
	
`;

const ast = parser.parse(customAST); 
console.log(JSON.stringify(ast,null,2));
