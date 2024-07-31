import fileBasedRoutes from '../../build/routes/fileBasedRoutes.json';
import declaredRoutes from '../../build/routes/routes.json'; // declared routes




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
        this.currentUrl=window.location.href; // full URL e.g http://localhost:5173/about
        this.basePath = window.location.origin; // basePath e.g: http://localhost:5173 
        this.currentRoute = window.location.pathname; // route e.g about


    }





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



async render(route) {


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







document.addEventListener('click', (event) => {
    const targetElement = event.target;
    if (targetElement.tagName === 'A' && targetElement.getAttribute('href')) {
        event.preventDefault(); // Prevent default link behavior
        alert("Clicked");
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






// if there is <a href click instance and the route has not been handled and we are not at the app base /

if (!router.isHandledByClickEvent && !router.routeHandled && window.location.pathname!=='/' && window.location.pathname!== this.currentRoute) {

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





