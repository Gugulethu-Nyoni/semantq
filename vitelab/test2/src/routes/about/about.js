import layoutInit from './+layout.js';
import Formique from 'svelte-formique';



layoutInit();


console.log('login and npm ');
//console.log(layoutInit);
alert("About Page Page Loaded");
console.log("About Page Page Loaded")



const formSchema= [
['email', 'email', 'Email',{required: true}],
['password','password', 'Password', {required:true}],
['submit','submit','submit'] 

]; 

const formParams = {
method: 'POST',
action: 'submit.js',
id: 'loginForm',
submitOnPage: true
}


const formSettings = {
	requiredIndicator: true,

}

const form = new Formique(formSchema, formParams, formSettings); 

