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


const fileBasedRoutes = {
    "about": "about",
    "services": "services",
    "services/sa": "services/sa",
    "services/sa/gauteng": "services/sa/gauteng",
    "contacts": "contacts"
};




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
        } 


/// HANDLE ROUTES NOW 

    handleDeclaredRoute (targetRoute)
      {
        alert("declared route");

      }


/* START HELPER FUNCTIONS */

// Function to check if a script tag with a specific src attribute exists and remove it if it does
removeScript(src) {
    const scriptTag = document.querySelector(`script[src="${src}"]`);
    if (scriptTag) {
        scriptTag.parentNode.removeChild(scriptTag);
        console.log(`Script with src "${src}" removed.`);
    } else {
        console.log(`Script with src "${src}" not found.`);
    }
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

    try {
        // Wait for fetchComponentDefinition to resolve
const componentDefinition = await this.fetchComponentDefinition(route);

        const template = document.createElement('template');
        template.innerHTML = componentDefinition.trim();
        const clone = template.content.cloneNode(true);
        placeholder.appendChild(clone);
                console.log("log 1");

                // Create a new script element
const newScript = document.createElement('script');
// Set the script content to display an alert
newScript.textContent = 'alert("We are here now")';
// Append the script element to the head of the document
document.head.appendChild(newScript);




    } catch (error) {
        console.error(error);
    }
}



    






    handleFileBasedRoute(targetRoute) {
    // Define route here or pass it as an argument to loadComponent
const route = '../../build/routes/' + targetRoute + '/' + '+page.smq.html';
            const placeholder = document.getElementById('dynamicComponentPlaceholder');
            placeholder.innerHTML = '';

            const src='./core_modules/reactive-binding/core.js';

            const script = document.head.querySelector('script[src="' + src + '"]');
   
   //render(route);

   this.render(route)
    .then(() => {
       //alert("rendered");
        console.log("log 2");
        /* AND CORE JS IF NOT THERE */

    const existingScripts = document.head.querySelectorAll('script[src="./core_modules/reactive-binding/core.js"]');
        if (existingScripts.length === 0) {
            // Append the script to the <head> element
            const script = document.createElement('script');
            script.src = './core_modules/reactive-binding/core.js';
            script.type = 'module';
            script.defer = true;
            document.head.appendChild(script);
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
document.addEventListener('click', (event) => {
    const targetElement = event.target;
    if (targetElement.tagName === 'A' && targetElement.getAttribute('href')) {
        event.preventDefault(); // Prevent default link behavior
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
                router.handleFileBasedRoute(targetRoute);
                break;
            default:
                // If not external or declared, assume it's a file-based route
                router.handleRouteError(targetRoute);
        }
    }
});











//console.log(router.declaredRoutes);


// Log the file-based routes to verify
//console.log(router.fileBasedRoutes);

