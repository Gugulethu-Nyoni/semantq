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



/* END HELPER FUNCTIONS */


    handleFileBasedRoute(targetRoute) {
    const route = './build/routes/' + targetRoute + '/' + '+page.smq.html';
    const placeholder = document.getElementById('dynamicComponentPlaceholder');
    placeholder.innerHTML='';


    const scriptSrc='./core_modules/reactive-binding/core.js';
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
    if (existingScript) {
        this.removeScript(scriptSrc);
    }



    loadComponent(route).then(() => {

    

        const script = document.createElement('script');
        script.src = './core_modules/reactive-binding/core.js';
        script.type = 'module';
        document.body.appendChild(script);
        
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

