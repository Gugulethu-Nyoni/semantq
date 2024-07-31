import fileBasedRoutes from '../../build/routes/fileBasedRoutes.json';
import declaredRoutes from '../../build/routes/routes.json';


/*
const declaredRoutes = [
    {
        "path": "/",
        "component": "Home",
        "exact": true
    },
    {
        "path": "/about",
        "component": "About"
    },
    {
        "path": "/blog",
        "component": "Blog",
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
];

*/
/*
const fileBasedRoutes = {
    "about": "about",
    "services": "services",
    "play": "play",
    "services/sa": "services/sa",
    "services/sa/gauteng": "services/sa/gauteng",
    "contacts": "contacts"
};
*/



class Router {


    constructor(declaredRoutes,fileBasedRoutes) {
        /*
        if (!routes) 
        {
            throw 'Error: Routes parameter is mandatory.';
        }
        this.routes = routes;
        */
        //this.initEventListeners();
        ///   
        this.declaredRoutes = declaredRoutes;
        this.fileBasedRoutes = fileBasedRoutes;
        this.isHandledByClickEvent=false;
        this.routeHandled=false;

    }


/*

    generateFileBasedRoutes(basePath) 

    {
        const routesPath = path.join(process.cwd(), basePath);

        try {
            this.traverseDirectory(routesPath, '');
        } catch (err) {
            console.error('Error reading directory:', err);
        }
    }

    traverseDirectory(directoryPath, relativePath) 

    {
        const files = fs.readdirSync(directoryPath);

        files.forEach(file => {
            const filePath = path.join(directoryPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                const newRelativePath = path.join(relativePath, file);
                this.fileBasedRoutes[newRelativePath] = newRelativePath;
                this.traverseDirectory(filePath, newRelativePath);
            }
        });
    }


loadDeclaredRoutes(routesFilePath) 
{
    try {
      const routesContent = fs.readFileSync(routesFilePath, 'utf8');
      const routesConfig = JSON.parse(routesContent);
      this.declaredRoutes = routesConfig.map(route => route.path);
    } catch (err) {
      console.error('Error loading declared routes:', err);
    }
}

*/







/* START HANDLING ROUTES NOW */

// CHECKING ROUTES 


// CASE 1: VALID URLs (external)

isValidURL(url) {
    // Regular expression to validate URL
    const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
        'i'
    );

    return !!pattern.test(url);
}



// CASE 2: DECLARED ROUTES 

    isDeclaredRoute(routePath) 
        { 

        //alert("Module for Declared routes under devt. thanks.");
        //return;

            return this.declaredRoutes.includes(routePath);
        }


// CASE 3:  FILE BASED ROUTES

    isFileBasedRoute(targetRoute)
        {
            console.log(this.fileBasedRoutes);
            return this.fileBasedRoutes.hasOwnProperty(targetRoute);
        }


// CASE 4: HANDLE ROUTE ERROR

    handleRouteError(targetRoute)
        {
          console.log(`Route ${targetRoute} is not declared.`);
          console.log(`Route ${targetRoute} does not have corresponding files.`);
            // Example usage with both parameters
          let errorRoute = true;
          this.handleFileBasedRoute(targetRoute, errorRoute);

        } 


/// HANDLE ROUTES NOW 

    handleDeclaredRoute (targetRoute)
      {
        alert("declared route");

      }


/* START HELPER FUNCTIONS */

// Function to check if a script tag with a specific src attribute exists and remove it if it does
removeScript(src) {

// Select all script elements in the document
const scriptTags = document.querySelectorAll('script');

// Iterate over each script element
scriptTags.forEach(script => {
    // Check if the script has the attribute scope="framework"
    if (script.getAttribute('scope') === 'framework') {
        // Remove the script element from the DOM
        script.remove();
    }
});

    /*
    const scriptTag = document.querySelector(`script[src="${src}"]`);
    if (scriptTag) {
        scriptTag.parentNode.removeChild(scriptTag);
        console.log(`Script with src "${src}" removed.`);
    } else {
        console.log(`Script with src "${src}" not found.`);
    }

    */
}




// Function to fetch the component definition
    async fetchComponentDefinition(route) {
        const response = await fetch(route);
        const html = await response.text();
        return html;
    }

   

   async extractAndExecuteScriptTags(container) {
    // Get all script elements within the container
const scriptElements = container.querySelectorAll('script');

    // Iterate over each script element
for (const scriptElement of scriptElements) {
        // Check if the script is an external script (has a src attribute)
if (scriptElement.src) {
            // Load the script source asynchronously
await fetch(scriptElement.src)
                .then(response => response.text())
                .then(scriptSource => {
                    // Create a new script element and set its content to the fetched script source
const newScript = document.createElement('script');
                    newScript.textContent = scriptSource;

                    // Append the new script element to the head of the document
document.head.appendChild(newScript);
                })
                .catch(error => console.error('Error loading script:', error));
        } else {
            // Execute inline script directly
(new Function(scriptElement.textContent))();
        }
    }
}


// Call the function with the container element where the component is located
//extractAndExecuteScriptTags(document.getElementById('dynamicComponentPlaceholder'));


/*
async routeFileExists(route) {
  const notFoundRoute = '../../build/routes/+404.smq';

  try {
    const response = await fetch(route);

    console.log("response"+response);


    if (!response.ok) {
      // If the file does not exist, assign the 404 error file route
        alert("Ayikho");
      return notFoundRoute;
    }
    // If the file exists, return the original route
    return route;
  } catch (error) {
    // Handle any fetch errors here
    console.error("Error:", error);
    return notFoundRoute; // Return the 404 error file route on fetch error
  }
}

*/



async render(route) {
    //this.routeHandled= true;

    const placeholder = document.getElementById('dynamicComponentPlaceholder');

    // Remove existing component script tags
const existingScripts = document.querySelectorAll('script[scope="component-js"]');
    for (const script of existingScripts) {
        script.remove();
    }

    try {
        // Wait for fetchComponentDefinition to resolve
const componentDefinition = await this.fetchComponentDefinition(route);

        const template = document.createElement('template');
        template.innerHTML = componentDefinition.trim();
        const clone = template.content.cloneNode(true);

        // Extract scripts from the component
const scripts = clone.querySelectorAll('script');
        for (const script of scripts) {
            const newScript = document.createElement('script');
            newScript.setAttribute('scope', 'component-js');
            newScript.setAttribute('type', 'module');

            if (script.src) {
                // Load external script asynchronously
await fetch(script.src)
                    .then(response => response.text())
                    .then(scriptSource => {
                        newScript.textContent = scriptSource;
                        document.head.appendChild(newScript);
                    });
            } else {
                newScript.textContent = script.textContent;
                document.head.appendChild(newScript);
            }
        }

        // Remove script elements from the clone before appending
for (const script of scripts) {
            script.remove();
        }

        // Append the component HTML (excluding scripts) to the placeholder
placeholder.appendChild(clone);
        alert("log 1");
        this.routeHandled = true; // Set routeHandled to true after handling the route

    } catch (error) {
        console.error(error);
    }
}







 handleFileBasedRoute(targetRoute) {

/*
if (this.routeHandled === true) {

    return; 
}
*/


alert (this.routeHandled);
alert (targetRoute);



  let route;

        window.history.pushState({}, "", targetRoute);
    // Define route here or pass it as an argument to loadComponent

        if (targetRoute==='errorRoute')
        {

            console.log("invoking render error page");


            const route = '../../build/routes/' + '+404.smq';

            this.render(route);
            return;
            /*
            .then(() => {
                this.routeHandled = true;
                return; 

            }); 
            */
            

        }
         else 
        
        {

        const route = '../../build/routes/' + targetRoute + '/' + '+page.smq.html';

        }

//route= await this.routeFileExists(route);

//alert(route);
//console.log("Route:"+route);
//return;

/*
.then(parsedRoute => {
    // Handle the parsed route
    console.log("Parsed Route:", parsedRoute);
    // Call your router logic here
    // handleRoute(parsedRoute);
  });     
*/


            const placeholder = document.getElementById('dynamicComponentPlaceholder');
            placeholder.innerHTML = '';

            //const src='./core_modules/reactive-binding/core.js';
            // Select all script elements in the document
const scriptTags = document.querySelectorAll('script');

// Iterate over each script element
scriptTags.forEach(script => {
    // Check if the script has the attribute scope="framework"
    if (script.getAttribute('scope') === 'framework') {
        // Remove the script element from the DOM
        script.remove();
    }
});


   //render(route);

   this.render(route)
    .then(() => {

       alert("rendered");
        alert("log 2");
        /* AND CORE JS IF NOT THERE */

    const existingScripts = document.head.querySelectorAll('script[src="./core_modules/reactive-binding/core.js"]');
        if (existingScripts.length === 0) {
            // Append the script to the <head> element
            const script = document.createElement('script');
            script.src = './core_modules/reactive-binding/core.js';
            script.type = 'module';
            script.setAttribute('scope', 'framework');
            script.defer = true;
            document.head.appendChild(script);

            return;
        }
        /* END ADD CORE JS */



    });
        
}



/* END HANDLING ROUTES */


// so we have file based routing and declarative routes enabled 
    // class wrapper nothing below 
}





const router = new Router(declaredRoutes,fileBasedRoutes);

// GET ALL FILE BASED ROUTES BASED ON SUBDIRECTORIES IN ROUTES
//router.generateFileBasedRoutes('../../build/routes');


/// DECLARED ROUTES 


//const routesFilePath = path.join(__dirname, 'build/routes/routes.js');
//const routesFilePath = new URL('../../build/routes/routes.js', import.meta.url);

//router.loadDeclaredRoutes(routesFilePath);

// Now you can use the isRouteDeclared method to check if a route is declared:
//const requestedRoute = '/about';

/* ADD AN EVENT LISTENER HERE THAT WILL INTERCEPT CLICKS */

// Initialize event listener to intercept clicks

//let isHandledByClickEvent = false;




if (router.routeHandled === false) {


document.addEventListener('click', (event) => {
    const targetElement = event.target;
    alert("Clicked ");
    if (targetElement.tagName === 'A' && targetElement.getAttribute('href')) {
        event.preventDefault(); // Prevent default link behavior
        router.isHandledByClickEvent = true; 
        //router.routeHandled = true;
        const targetRoute = targetElement.getAttribute('href');

        switch (true) {
            case router.isValidURL(targetRoute):
                // pathName is a valid URL - must be external
                window.location.href = targetRoute;
                break;
            case router.isDeclaredRoute(targetRoute):
                // Target route is declared in routes configuration
                router.handleDeclaredRoute(targetRoute);
                alert("declared true");
                break;
            case router.isFileBasedRoute(targetRoute):
                // Target route is declared in routes configuration
                    alert("File Based ");

                router.handleFileBasedRoute(targetRoute);
                return;
                break;
            default:
                // If not external or declared, assume it's a file-based route
                router.handleRouteError(targetRoute);
        }

        
    }
});


}




// if there is <a href click instance and the route has not been handled and we are not at the app base /

if (!router.isHandledByClickEvent && !router.routeHandled && window.location.pathname!=='/') {

let targetRoute = window.location.pathname; 
alert(targetRoute);

targetRoute = targetRoute.replace('/','');

console.log("within error area");

switch (true) {
            case router.isValidURL(targetRoute):
                // pathName is a valid URL - must be external
                window.location.href = targetRoute;
                break;
            case router.isDeclaredRoute(targetRoute):
                // Target route is declared in routes configuration
                router.handleDeclaredRoute(targetRoute);
                alert("declared true");
                break;
            case router.isFileBasedRoute(targetRoute):
                // Target route is declared in routes configuration
                router.handleFileBasedRoute(targetRoute);
                break;
            default:
                // If not external or declared, assume it's a file-based route
                let errorRoute='errorRoute';
                alert("ERRORING");
                //we need the fileBasedRoute handler to render the 404 file
                router.handleFileBasedRoute(errorRoute);
                //router.handleRouteError(targetRoute);

}

}




// Listen to popstate events
/*
window.addEventListener('popstate', (event) => {
  // If the URL change was not handled by the click event listener
  if (!isHandledByClickEvent) {
    // Process the URL change from the popstate event
    //processURL(event.target.location.pathname);

    

    alert("handle pop state events");
  }

  // Reset the flag for the next URL change
  isHandledByClickEvent = false;
});
*/






//console.log(router.declaredRoutes);


// Log the file-based routes to verify
//console.log(router.fileBasedRoutes);

