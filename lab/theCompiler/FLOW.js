
/*

const customSyntaxComponent=...file reader ...
const validSmq = validate(customSyntaxComponent);
const ast = parse(validSmq);
//then create component instance - to track dependencies/ intended behavior 

const component = new Component(ast);

const renderer= options.generate === 'ssr' ? SSRRenderer(component) : DomRenderer(component);

*/



/*

Static Analysis 


1. note variables and their values
2. note function names
3. variable re-assignments 
4. variables in the js that are used in the html block are reaction / means variable that only occurs on the js / module are not reactive in this component
5. variable changes in runtime must be updated in elements and logic blocks 





*/

script:
 
 let a = 5;
 let b = 2;

end:

 style:

 h2 {font-size: 4em }

 end:


 content: 
 <h2> Hello World </h2> 

 @if (a > b) 
 
 <div class="main" id="2324" @click={dgdfdfd} @mouseover={do} >  
 	<p> Hi there </p>  
 </div> 

 @endif




Code Transformation

1. Identify variables and build key: value object with variable names and their initial values - go into the js block and identify let, const and var variables - pick up their inital values - note values could be literals ('1', '2' or "John") or expressions e.g. arrow functions etc - so you may want to pick everything on the right into `literal or expression`;
2. Identify reactive elements - you an either implement the $: or something else 
3. lift logic blocks (if, while, etc) form html and replace them with unique id <div> s that you can recreate their conditional contents and place them exactly where they be located in the html

4. Use a    placeholderCounter to ensure you have unique IDs for each div you create for dynamic content e.g.

     let placeholderCounter = 0;

     const div = createElement.('div');

     div.id ="dynamic-content" + placeholderCounter++; 
     div.class = "main-div";
     div.innerText = `<h2> counter: ${counter} </h2>`;

     document.body.appendChild(div);







 

design custom syntax 
validate it 
transpile it // AST analysis 



Proof of Concept 

custom syntax 
validation 
get - ast - html_eq / js_eq

Static Analysis
Optimisation - tree shaking
Transformation 


read the ast and regular build js and html 


Build a reader 
index= 0;
advanced = index ++;

eat 

reader 

const = a + b; 
let name="John";


*/

