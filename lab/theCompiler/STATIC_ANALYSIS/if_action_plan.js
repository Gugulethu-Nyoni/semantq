<script>
Let counter = 0; 


function handlerClick()
{

counter ++;

}

</script>



@if (counter)

<button @click={handlerClick} class="main"> 

Clicked: {counter} {counter > 1 ? 'times' : 'time'} 

</button> 

@endif

let text = `Clicked: ${counter} ${counter > 1 ? 'times' : 'time'}`;
button.textContent = text;

Actions Plan

this workflow comes after custom syntax has been validated - so no validation to be done here


1. walk over the ast
2. check if if block exists
3. look for EventHandler nodes - tranfrom these from handlerClick to handlerClick() - if they dont have the () already - via ast


1. Get the AST of the custom syntax 
2. get the consequent body of the if the block 
// 3. catch js code and html seperately consequentHtml consequentJs (from AST)
4. transform custom html to regular html e.g.  @click={handlerClick} becomes onclick="handlerClick()" {counter} becomes <span data-bind="counter"> </span>  // or rather let js recreate all regular html elements
5.  consequentHtml should be handled by componentBuilder class that creates all necessary lifecycle functions for hamdling transforming component custom and declarative syntax to regular, efficient and optimized js 


example - execution 

const button = document.createElement('button');
button.className = 'main';

let counter = 1; // assume this is your counter variable

let text = `Clicked: ${counter} ${counter > 1 ? 'times' : 'time'}`;
button.textContent = text;

button.addEventListener('click', handlerClick);

document.body.appendChild(button); // append the button to the page



