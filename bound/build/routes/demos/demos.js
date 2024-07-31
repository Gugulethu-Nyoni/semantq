
    // Function to create the component markup
    function createComponentMarkup() {
      import supabase from './supabase.js'; 


let name="John";
let age=45;
let heading="Hello World";

// get users from database


import { DataGrid } from './core_modules/datagrid/datagrid.js';


async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, email')
    .limit(100);

  if (error) {
    console.error('An error occurred:', error);
    return [];
  }

  return data;
}

(async () => {
  const userData = await getUsers();
  console.log(userData);

  const columns = [
    { name: 'id', header: 'ID' },
    { name: 'username', header: 'Username' },
    { name: 'email', header: 'Email',
      actions: [

      {
      label:'View',
      url: 'user/:{id}/profile',
      class: 'user-view',
      id: 'view-{id}',

      },
        {
          label: 'Edit',
          url: 'user/:{id}/edit',
          class: 'edit',
          id: 'edit-{id}',
        },
        {
          label: 'Delete',
          url: 'user/:{id}/delete',
          class: 'delete',
          id: 'delete-{id}',
          confirm: true,
        },
      ],
    },
  ];

const dataGrid = new DataGrid(userData, columns, 10);


})();



/*  OUTBOUT API CALL 1 */

let params; 

// RUN POST api call to fakestoreapi.com to create a product 
// Define the parameters
params = {
  method: 'POST', // HTTP method (GET, POST)
  endPoint: 'https://fakestoreapi.com/products', // API endpoint URL
  queryParams: { // Query parameters (if any)
    apiKey:null,
 
  },
  body: JSON.stringify(
                {
                    title: 'test product',
                    price: 13.5,
                    description: 'lorem ipsum set',
                    image: 'https://i.pravatar.cc',
                    category: 'electronic'
                }
            ) // Request body (if applicable)
};

// Make the request to the proxy server
fetch('http://localhost:3000/api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(params)
})
  .then(response => response.json())
  .then(apiData => {
    // Handle response data
    //console.log("client side response:");
    //console.log(apiData);
    const apiDataHolder=document.getElementById('apiData');
    apiDataHolder.innerText=JSON.stringify(apiData,null,2);

  })
  .catch(error => {
    // Handle errors
    console.error('Error:', error);
  });




/*  OUTBOUT API CALL 2 */

// RUN a GET api call to exchangerate-api.com to get realtime USD exachage rates
// Define the parameters
params = {
  method: 'GET', // HTTP method (GET, POST)
  endPoint: 'https://v6.exchangerate-api.com/v6/a0d331a7f4e730eebefe6b16/latest/USD', // API endpoint URL
  queryParams: { // Query parameters (if any)
    apiKey:null,
 
  },
  
};

// Make the request to the proxy server
fetch('http://localhost:3000/api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(params)
})
  .then(response => response.json())
  .then(forexApiData => {
    // Handle response data
    //console.log("client side response:");
    //console.log(apiData);

    const conversionRates = forexApiData.conversion_rates;
    const top10Rates = Object.keys(conversionRates).slice(0, 10).reduce((acc, key) => {
      acc[key] = conversionRates[key];
      return acc;
    }, {});

    const forexApiDataHolder=document.getElementById('apiData2');
    //forexApiDataHolder.innerText=JSON.stringify(forexApiData,null,2);
    forexApiDataHolder.innerText = JSON.stringify(top10Rates, null, 2);


  })
  .catch(error => {
    // Handle errors
    console.error('Error:', error);
  });



const queryString = window.location.search;
if (queryString) {
const urlParams = new URLSearchParams(queryString);
const product = urlParams.get('product')

alert(product);

}
    }

    // Immediately-invoked function expression (IIFE) to execute the createComponentMarkup function
    (function() {
      createComponentMarkup();
    })();
  
    // Add encapsulated styles
    const style = document.createElement('style');
    style.textContent = `
      
.container {
  display: grid;
  grid-template-columns: repeat(2, minmax(200px, 1fr));
  gap: 10px; /* Grid gap for spacing between elements */
  margin-top: 100px;
  padding: 4%;
}


.item {
  background-color: #f8f9fa;
  border: 1px solid #CCC;
  padding: 20px;
  word-wrap: break-word;
  overflow: scroll;

}


pre {
    margin: 0; /* Remove default margins */
}

code {
    word-wrap: break-word; /* Break long lines of code */
}

span {color: red;}



/* DATA GRID CSS */

#dataTable {
    width: 100%;
    border-collapse: collapse;
  }

  #dataTable th,
  #dataTable td {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }

  #dataTable tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  #dataTable th {
    background-color: #333;
    color: #ffffff;
  }

  @media only screen and (max-width: 700px) {
    #dataTable {
      border: 0;
    }

    #dataTable th,
    #dataTable td {
      border: 0;
      border-bottom: 1px solid #dddddd;
      padding: 5px;
    }

    #dataTable th {
      display: none;
    }

    #dataTable tr td:first-child {
      width: 40%;
      font-weight: bold;
    }

    #dataTable tr td:last-child {
      width: 60%;
    }
  }
  #pagination {margin-top: 0.5em}

  .user-view {background-color: #3ea60d; border-radius:10px; padding: 0.5em; color: #fff; text-decoration: none; font-size: 11px;}

  
  .edit {background-color: #0275d8; border-radius:10px; padding: 0.5em; color: #fff; text-decoration: none; font-size: 11px;}
  
  .delete {background-color: #d9534f; border-radius:10px; padding: 0.5em; color: #fff; text-decoration: none; font-size: 11px;}



/* highligh JS css */

.hljs {
    background-color: #202034;
    color: #D0D0E0;
}

.hljs-tag,
.hljs-string {
    color: #FF7ACC; /* Bright pink for HTML tags and strings */
}

.hljs-name.hljs-name {
    color: #FF7ACC !important; /* Bright pink for HTML inner keywords */
}

.hljs-attr {
    color: #FF55FF; /* Purple for HTML attributes */
}

.hljs-comment {
    color: #C9C9D6; /* Light color for comments */
}

.hljs-function {
    color: #66D9EF; /* Blue for JavaScript function names */
}

.hljs-keyword {
    color: #F92672; /* Red for JavaScript keywords */
}

.hljs-variable {
    color: #A6E22E; /* Green for JavaScript variables */
}

.hljs-string {
    color: #E6DB74; /* Yellow for JavaScript strings */
}

.hljs-number {
    color: #AE81FF; /* Purple for JavaScript numbers */
}

.hljs-selector-tag {
    color: #F92672; /* Red for CSS selector tags */
}

.hljs-selector-id {
    color: #A6E22E; /* Green for CSS selector IDs */
}

.hljs-selector-class {
    color: #FD971F; /* Orange for CSS selector classes */
}

.hljs-tag .hljs-attr, .hljs-tag .hljs-name {
    color: #F92672;
}

.hljs-section, .hljs-title {
    color: #d6b211;
    font-weight: 700;
}

.main-header {
    
    text_align:center;
}

    `;
    document.head.appendChild(style);

    // Add encapsulated HTML
      const container = document.createElement('div');
      container.id = 'componentContainer';
      document.body.appendChild(container);
      componentContainer.innerHTML = `<div class="container">

<div class="item">

<h3> Installation </h3>
cd to your preferred location and run: semantiq create projectname <br>
<pre><code class="language-javascript"> <projectname> </projectname></code></pre> (without &lt;&gt;) is the name of project/directory 

</div> 


<div class="item">

<pre><code class="language-javascript">
cd to your preferred location and run: semantiq create projectname
</code>
<pre></pre></pre></div> 




<div class="item">

<h3> Install Node Packages </h3>
cd to newly created project (projectname without &lt;&gt;) and run: npm install <br>
This will install all the required node packages / dependencies required for semantiq to run. 

</div> 


<div class="item">

<pre><code class="language-javascript">
cd projectname  &amp;&amp; npm install 

</code>
<pre></pre></pre></div> 




<div class="item">
<h3> Run the app </h3>
cd into projectname and run npm run dev <br>

Your should see something like:
<pre><code class="language-javascript"> 
VITE v5.2.8  ready in 897 ms
[1] 
[1]   ➜  Local:   http://localhost:5173/
[1]   ➜  Network: use --host to expose
</code>
</pre>
If you see the above, Congratulations, your Semantiq app is set up. Now go ahead and build something awesome! 

</div>

<div class="item">

<pre><code class="language=javascript">
cd into projectname and run: npm run dev
</code>
</pre>

</div> 



<div class="item">

<h3> Project Setup </h3> 
The most important directory is the src. In it are sub directories for routes and components. <br>

Semantiq enables file based routing as well as declared routes. See section below on Routing:  


</div>

<div class="item"> 

<pre><code>
examples
build
core_modules
counter.js
docs
index.html
main.js
package.json
public
semantiq.svg
src
style.css
tests
tsconfig.json
vite.config.js

<code>
</code></code></pre><code><code>

</code></code></div><code><code>







</code></code></div>
<code><code> 








<div class="container" style="margin-top: -116px">




<div class="item">
<h3> Routing </h3>
Semantiq Supports two routing approaches, file based and declared routes. 
<h4> File Based Routes </h4>

<h4> Option 1: Create directories and files manually. </h4>  <br>  create directories/sub directories and files in the <code> ./src directory. </code> e.g. to create an about page route, go inside ./src/routes and create the about directory. Inside the about directory - create the +page.smq file - this is the entry file for that route - if it doesn't exist and there nor route declared for the "about" path in declared routes (./src/routes/routes.json) the app will yield a Page not found 404 error. 

<br> 

<h4> Option 2: Use the command line. </h4> <br> To create the "about" page route as in the example above go to your terminal and cd to your project directory. The run this command: <br> 
npm run semantiq make:route about   

</div>


<div class="item"> 
<pre><code class="language-javascript">
npm run semantiq make:route about
</code>
</pre>



</div>



<div class="item"> 
<h3> Declared Routes </h3>

In the file <pre> <code> ./src/routes.json </code></pre><code> </code> you can declare routes by defining the path, that matches the href value in your links. e.g. if you have a link like: <br> <pre> <code class="language-javascript">  &lt;a href="/about"&gt; About Us &lt;/a&gt;  </code> </pre> About <br> Then the path in your route definition will be: <br> "path": "/about" <br> 
Next, you need to define the page or component to be rendered/displayed for that resource. (page or component)e.g. <br>

"page": "about" <br>
This will display the <pre> <code class="language-javascript"> ./src/routes/about/+page.smq file. </code> </pre> +page.smq file is a required file as it is the entry file in file based routing. <br> <br>

So for pages located directly in ./src/routes you do not need to define the full path, just the name of that route is sufficient. However if it is a nested route like: <br> <pre> <code class="language-javascript"> ./src/routes/services/marketing </code> </pre> <br>, and you intend to define the route for .../marketing you will need to define the route resource as : "page": "services/marketing" <br>. <br>  As you may have noted, page or component resources to be rendered against defined paths must be referenced relative to the ./src/routes path for pages and ./src/components for components. <br> <br>

To render components define the resource as: <br> "component": "About" <br> this will render the <pre> <code> ./src/components/About.smq </code></pre><code> </code>component. <br>
For nested components you will need to define the full path to the component relative to the ./src/components directory e.g. for the path defined as <pre> <code class="language-javascript"> "path": "about/contacts" </code></pre><code class="language-javascript"> </code> to render the respective component, the resource (data to be rendered) must be defined as "component": "about/Contacts" <br> This resource definition means that there is a Contacts.smq file located in the about sub directory within the components directory e.g. <br> <pre><code class="language-javascript"> ./src/components/about/Contacts.smq </code> </pre> <br>

<h4> The "exact": true parameter (optional) </h4> <br>

true means that the route will only match if the path is an exact match of the target route, without any additional parameters or trailing characters, etc.
In other words, if exact is set to true, the route will only match if the URL is exactly: <br> /home <br>  and not if it's <br> <pre> <code> /home/something or /home?query=param. </code> </pre> <br> 
By setting exact to true, you're telling the router to only match the exact path specified, without any flexibility or partial matching.
Here are some examples to illustrate this: <br>

<pre><code class="language-javascript">

    With exact: true: <br>
        /home matches <br>
        /home/something doesn't match <br>
        /home?query=param doesn't match <br>
    With exact: false (or omitted): <br>
        /home matches <br>
        /home/something matches <br>
        /home?query=param matches <br>

</code>
</pre> 

</div>

<div class="item"> 
<pre><code class="language-javascript">
[
  {
    "path": "/",
    "page": "home",
    "exact": true
  },
  {
    "path": "/about",
    "component": "About"
  },
  {
    "path": "/blog/:postid/",
    "component": "blog/Post",
    "children": [
      {
        "path": ":postId",
        "component": "Post"
      }
    ]
  },
  {
    "path": "/contact",
    "component": "Contact"
  }
]

</code>
</pre>
</div>






<div class="item"> 
<h3> Semantiq Syntax </h3>
</div>


<div class="item"> 
<pre><code class="language-javascript">
script: 
//your js here (optional)

style:
/* your css here (optional) */

content:
 html here

</code>
</pre>

</div>









<div class="item"> 

<h3> Global State Management with 2 Way Binding and Reactivity </h3>

<h4> <span data-bind="heading">Hello World</span> </h4>

My name is <span data-bind="name">John</span>. 

I am <span data-bind="age">45</span> years old.


</div>


<div class="item">

<h3> JS </h3>
<pre><code class="language-javascript">

let name="John";
let age=45;
let heading="Hello World";

</code>

</pre>


<h3> html </h3>

<pre><code class="language-html">
&lt;input type="text" data-bind="heading" placeholder="Heading" /&gt; &lt;br/&gt;
&lt;input type="text" data-bind="name" placeholder="Name" /&gt; &lt;br/&gt;
&lt;input type="number" data-bind="age" placeholder="Age" /&gt;
</code>
</pre>


<h4> Play around with these inputs to change the heading, name and age and watch as the corresponding on left block update in real time. <br>
If you have other pages and components with elements subscribed ot bound to these variables they will also be updated and re-rendered "automagically" without any page refresh. </h4>



<input type="text" data-bind="heading" placeholder="You can change the heading value here" value="Hello World"> <br>

<input type="text" data-bind="name" placeholder="You can change the name value here" value="John"> <br>

<input type="number" data-bind="age" placeholder="You can change the age value here" value="45">

</div>







<div class="item">

Supabase Adapter for full stack development <br>

<h3> Fetching users from the database </h3>
<br>
(A paginated, sortable, searchable datatable without an external library)

<div id="dataGrid"></div>



</div>


<div class="item">
<h3> JS </h3>

<pre><code class="language-javascript">


import { DataGrid } from './core_modules/datagrid/datagrid.js';


async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, email')
    .limit(100);

  if (error) {
    console.error('An error occurred:', error);
    return [];
  }

  return data;
}

(async () =&gt; {
  const userData = await getUsers();
  console.log(userData);

  const columns = [
    { name: 'id', header: 'ID' },
    { name: 'username', header: 'Username' },
    { name: 'email', header: 'Email',
      actions: [
        {
          label: 'Edit',
          url: 'edit/',
          class: 'edit',
          id: 'edit-',
        },
        {
          label: 'Delete',
          url: 'delete/',
          class: 'delete',
          id: 'delete-',
          confirm: true,
        },
      ],
    },
  ];

const dataGrid = new DataGrid(userData, columns, 10);


})();




</code>
</pre>

<h3> Html </h3>

<pre><code class="language-html">

&lt;div id="dataGrid"&gt;
&lt;/div&gt;

</code>
</pre>

</div> 












<div class="item">

<h3> Outbound API Calls </h3>

<p> POST Api call to create a product on: https://fakestoreapi.com/products </p>

<br>
Results:<br>
<div id="apiData">
</div>


<p> A GET Api call to get realtime USD exchange rate from: exchangerate-api.com </p>

<br>
Results:<br>
<div id="apiData2">
</div>


</div>



<div class="item">


<pre><code class="language-javascript">

// RUN POST api call to fakestoreapi.com to create a product 
// Define the parameters
const params = {
  method: 'POST', // HTTP method (GET, POST)
  endPoint: 'https://fakestoreapi.com/products', // API endpoint URL
  queryParams: { // Query parameters (if any)
    apiKey:null,
 
  },
  body: JSON.stringify(
                {
                    title: 'test product',
                    price: 13.5,
                    description: 'lorem ipsum set',
                    image: 'https://i.pravatar.cc',
                    category: 'electronic'
                }
            ) // Request body (if applicable)
};

// Make the request to the proxy server
fetch('http://localhost:3000/api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(params)
})
  .then(response =&gt; response.json())
  .then(apiData =&gt; {
    // Handle response data
    //console.log("client side response:");
    //console.log(apiData);
    const apiDataHolder=document.getElementById('apiData');
    apiDataHolder.innerText=JSON.stringify(apiData,null,2);

  })
  .catch(error =&gt; {
    // Handle errors
    console.error('Error:', error);
  });

</code>
</pre>

<h3> Second API Call </h3>

<pre><code class="language-javascript">
// RUN a GET api call to exchangerate-api.com to get realtime USD exachage rates
// Define the parameters
const params = {
  method: 'GET', // HTTP method (GET, POST)
  endPoint: 'https://v6.exchangerate-api.com/v6/a0d331a7f4e730eebefe6b16/latest/USD', // API endpoint URL
  queryParams: { // Query parameters (if any)
    apiKey:null,
 
  },
  
};

// Make the request to the proxy server
fetch('http://localhost:3000/api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(params)
})
  .then(response =&gt; response.json())
  .then(forexApiData =&gt; {
    // Handle response data
    //console.log("client side response:");
    //console.log(apiData);
    const forexApiDataHolder=document.getElementById('apiData2');
    forexApiDataHolder.innerText=JSON.stringify(forexApiData,null,2);

  })
  .catch(error =&gt; {
    // Handle errors
    console.error('Error:', error);
  });



</code>
</pre>

</div>




<!-- CONTAINER WRAPPER -->


</div>
</code></code>
<nook name="demosheader"> </nook>`;
  