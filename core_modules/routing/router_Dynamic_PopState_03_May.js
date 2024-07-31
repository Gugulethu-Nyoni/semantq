import fileBasedRoutes from '../../build/routes/fileBasedRoutes.js';
import declaredRoutes from '../../build/routes/routes.js';

class Router {
    constructor(declaredRoutes, fileBasedRoutes) {
        this.declaredRoutes = declaredRoutes;
        this.fileBasedRoutes = fileBasedRoutes;
        this.isHandledByClickEvent = false;
        this.routeHandled = false;
        this.currentUrl = window.location.href;
        this.basePath = window.location.origin;
        this.currentRoute = window.location.pathname;
        this.indexFile = null;
        this.indexFileHash = null;
        this.storageKey = "currentRouteState";
        this.globalStorageKey = "smqState";
        
         // set to clear these storage values

        //localStorage.setItem('routeEvent', '');
        //localStorage.setItem('routeAction', '');


        localStorage.setItem('routeEvent', 'initialLoad');
        localStorage.setItem('routeAction', 'initialLoaded');


       // localStorage.setItem(this.storageKey, this.currentRoute);

       
    }



    isCanonicalUrl(url) {
        const pattern = new RegExp(
            '^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$',
            'i'
        );
        return !!pattern.test(url);
    }

    async calculateHash(content) {
        const encoder = new TextEncoder();
        const data = encoder.encode(content);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    async calculateIndexFileHash() {
        try {
            const response = await fetch(this.indexFile);
            if (!response.ok) {
                throw new Error('Failed to fetch index file');
            }
            const content = await response.text();
            const hash = await this.calculateHash(content);
            this.indexFileHash = hash;
            console.log('Hash of index file:', hash);
        } catch (error) {
            console.error('Error calculating hash:', error);
        }
    }


  

    isDeclaredRoute(routePath) {
        //alert("inside is declared");

    //routePath=routePath;

    const foundRoute = this.declaredRoutes.find(route => route.path === routePath);

    //alert(JSON.stringify(foundRoute));

    // {"path":"about","component":"About","exact":true}

    if (foundRoute) {
        return true;
    }

    
    return false;

    }


matchDynamicRoute(declaredRoute, targetRoute) {
  const paramRegex = /:([a-zA-Z0-9]+)/g;
  const regex = new RegExp('^' + declaredRoute.path.replace(paramRegex, '(.+)') + '$');
  //alert(regex);
  return regex.test(targetRoute);
}


isDynamicRoute(routePath) {
    //alert("Inside Dynamic: " + routePath);
    //alert("init1"+routePath);

    //routePath.replace(/^\//, '');

    routePath=routePath.replace(/^\/+/g, '');

    //alert("init2"+routePath);

    const declaredRoute = this.declaredRoutes.find(route => {
        // Check if routePath matches the beginning of declared route path
        const routeRegex = new RegExp(`^${route.path.replace(/:[^\s/]+/g, '([^/]+)')}$`);
        return routeRegex.test(routePath);
    });

    //alert("found or what? " + JSON.stringify(declaredRoute));

    if (declaredRoute) {
        // Match found
        return true;
    }

    // No match found
    return false;
}

    





    isFileBasedRoute(targetRoute) {

// file based routes don't have /
        if (targetRoute.startsWith("/") && targetRoute!=='/') {
            
            targetRoute = targetRoute.slice(1);
          }


        return this.fileBasedRoutes.hasOwnProperty(targetRoute);
    }


    handleRouteError(targetRoute)
        {
          console.log(`Route ${targetRoute} is not declared.`);
          console.log(`Route ${targetRoute} does not have corresponding files.`);
            // Example usage with both parameters
          let errorRoute = true;
          this.handleFileBasedRoute(targetRoute, errorRoute);

        } 



    async fetchComponentDefinition(routeFile) {

        //alert("render routeFile:" + routeFile);

        const response = await fetch(routeFile);
        const html = await response.text();
        const routeFileHash = await this.calculateHash(html);

        if (routeFileHash === this.indexFileHash && routeFile !== null) {
            //alert("3 conds");
            const errorFile = '../../build/routes/' + '+404.smq';
            const response = await fetch(errorFile);
            const html = await response.text();
            return html;
        } 

        else if (routeFileHash === this.indexFileHash && routeFile === null) {
            //alert(html);
            return html;

        }

        else {
            return html;
        }



    }




    async render(route, resourceId) {

     alert("do we have pop route:"+route);
     alert("do we have resource id in render:"+resourceId);


        const placeholder = document.getElementById('dynamicComponentPlaceholder');

        // Add a 'data-resource-id' attribute to the placeholder element if resourceId is provided
    if (resourceId !== undefined) {
        placeholder.setAttribute('data-resource-id', resourceId);

        // also add to storage
        
       const existingData = localStorage.getItem('smqState');
console.log("existing data:" + existingData);

const parsedData = JSON.parse(existingData || '{}'); // parse the object or initialize with an empty object

if (!parsedData['componentDataId']) {
  parsedData['componentDataId'] = [{ newState: resourceId }];
}

Object.values(parsedData).forEach((value) => {
  value.map((item) => {
    if (item.key === 'componentDataId') {
      item.newState = resourceId; // update the newState value
    }
  });
});

localStorage.setItem('smqState', JSON.stringify(parsedData, null, 2));

}


        const existingScripts = document.querySelectorAll('script[scope="component-js"]');
        for (const script of existingScripts) {
            script.remove();
        }

        try {
            const componentDefinition = await this.fetchComponentDefinition(route);
            const template = document.createElement('template');
            template.innerHTML = componentDefinition.trim();
            const clone = template.content.cloneNode(true);

            const scripts = clone.querySelectorAll('script');


            if(scripts) { 
            for (const script of scripts) {
                const newScript = document.createElement('script');
                newScript.setAttribute('scope', 'component-js');
                newScript.setAttribute('type', 'module');

                // Check if resourceId is not null

                if (script.src) {
                    await fetch(script.src)
                        .then(response => response.text())
                        .then(scriptSource => {
                            newScript.textContent = scriptSource;
                            document.head.appendChild(newScript);
                        });
                } else {

                    if (resourceId !== undefined) {
                    // Create a string that defines the let statement
                    const letStatement = `let componentDataId = ${resourceId};`;

                    // Append the let statement to the script content
                    const existingScriptContent = script.textContent || script.innerText;
                    const newScriptContent = `${letStatement}\n${existingScriptContent}`;
                    newScript.textContent = newScriptContent;
                    //newScript.textContent = script.textContent;
                    document.head.appendChild(newScript);

                    // Update elements with data-bind attribute
  const boundElements = clone.querySelectorAll(`[data-bind="componentDataId"]`);
  if (boundElements.length > 0) {
  boundElements.forEach((element) => {
    
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    element.value = resourceId;
  } else {
    element.textContent = resourceId;
  }


  });
  //console.log("Updated bound elements");
}

                    //alert("added let statement");
                } else {

                    newScript.textContent = script.textContent;
                    document.head.appendChild(newScript);
                }
                }



            }
        }

        if (!scripts && resourceId)
         {

            // Create a script element
    const scriptElement = document.createElement('script');
    
    // Set the content of the script element
    scriptElement.textContent = `let resourceId = "${resourceId}";`;

    // Append the script element to the document head
    document.head.appendChild(scriptElement);


        }







            for (const script of scripts) {
                script.remove();
            }

            placeholder.appendChild(clone);
            this.routeHandled = true;
            this.isHandledByClickEvent = false;
            

        } catch (error) {
            console.error(error);
        }



// function wrapper

    }





    handleFileBasedRoute(targetRoute) {
       //alert(targetRoute);

    
    let storageRoute;

       if (targetRoute==='/') {

        storageRoute =  targetRoute;
        //alert("/ is true ");

        window.location.href=this.basePath;
        //return;


       } else {

        storageRoute = '/' + targetRoute;



       }


        window.history.pushState({}, "", targetRoute);
        localStorage.setItem(this.storageKey, storageRoute);

        let fileRoute;

        if (targetRoute!=='/')  {

        fileRoute = '../../build/routes/' + targetRoute + '/' + '+page.smq.html';

               } else if( targetRoute==='/' ) {

        fileRoute = null;

               } 


               //alert("actual fileRoute:"+fileRoute);



        const placeholder = document.getElementById('dynamicComponentPlaceholder');
        placeholder.innerHTML = '';


        const scriptTags = document.querySelectorAll('script');
        scriptTags.forEach(script => {
            if (script.getAttribute('scope') === 'framework') {
                script.remove();
            }
        });

        const linkTags = document.querySelectorAll('link[rel="stylesheet"][scope="framework"]');
        linkTags.forEach(link => {
          link.remove();
        });
        

        this.render(fileRoute).then(() => {

            const existingScripts = document.body.querySelectorAll('script[src="./core_modules/semantq.js"]');

            if (existingScripts.length === 0) {
                const script = document.createElement('script');
                //script.src = './core_modules/reactive-binding/core.js';
                script.src = './core_modules/semantq.js';
                script.type = 'module';
                script.setAttribute('scope', 'framework');
                script.defer = true;
                document.body.appendChild(script);
            }
// targetRoute
//alert(targetRoute);

if (targetRoute==='/demos') {

// Create link element for stylesheet
const link = document.createElement('link');
link.rel = 'stylesheet';
link.setAttribute('scope','framework');
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/default.min.css';

// Create script element for highlight.js library
const script = document.createElement('script');
script.setAttribute('scope', 'framework');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/highlight.min.js';

// Append elements to the head of the document
document.head.appendChild(link);
document.head.appendChild(script);



}



return;



        });
    }





handleDeclaredRoute(targetRoute, popScope) {
       
alert(popScope);

       if (targetRoute==='/' || targetRoute==='/home' ) {
        alert("home route matched:"+targetRoute);

        window.location.href=this.basePath;


       }


       if (popScope==='null') {

        window.history.pushState({}, "", targetRoute);
       // const storageRoute = targetRoute;

    }

   localStorage.setItem(this.storageKey, targetRoute);


        


        //alert("inside declared now:"+targetRoute);

const paramRegex = /\/:([0-9]+)/g; // matching routes with :12 etc variables

    // Check if targetRoute contains a dynamic variable
    const dynamicMatch = targetRoute.match(paramRegex);



    let resourceId;
    let resourcePath;
    let declaredRoute;
    let fetchDynamicRoute;
    let routePath=targetRoute;
    let resource;

    if (dynamicMatch) {

        alert("matched yona");

        // Extract the dynamic variable (resourceId)
        resourceId = dynamicMatch[0].substring(2); // Remove leading ":"
        
        //alert("do we have the resoucerid?"+resourceId);
        // Remove the dynamic variable from the targetRoute
        resourcePath = targetRoute.replace(paramRegex, '');
        routePath=resourcePath;


        fetchDynamicRoute = this.declaredRoutes.find(route => {
        // Check if routePath matches the beginning of declared route path
        const routeRegex = new RegExp(`^${route.path.replace(/:[^\s/]+/g, '([^/]+)')}$`);
        if (routeRegex.test(targetRoute)) {
        declaredRoute = route; 

        //alert(JSON.stringify(declaredRoute,null,2)); 
    }

    });


        
    }


    


alert(JSON.stringify(declaredRoute,null,2));
alert("things"+resourceId+"and"+routePath);


if (!dynamicMatch) {

declaredRoute = this.declaredRoutes.find(route => route.path === targetRoute);

   
}

alert("declaredRoute: "+declaredRoute);


        //const path =declaredRoute['path'];

        let fileRoute;

        if (declaredRoute.hasOwnProperty('component')) {
            //alert("component key is there");
        const resource=declaredRoute['component'];
        
        fileRoute = '../../build/components/' + declaredRoute['component'].replace('/','') + '.smq'; //Button.smq

        //alert(fileRoute);




        } 

        if (declaredRoute.hasOwnProperty('page')) {
        alert("Page resource Here");
        const resource=declaredRoute['page'];
        const targetRouteLowercase = routePath.toLowerCase();

        //fileRoute = '../../build/routes/' + targetRouteLowercase.replace('/','') + '/' + '+page.smq.html';
        fileRoute = '../../build/routes/' + targetRouteLowercase.replace(/^\/+/,'') + '/' + '+page.smq.html';



        }


//alert("going route:" +fileRoute);

        const placeholder = document.getElementById('dynamicComponentPlaceholder');
        placeholder.innerHTML = '';
        const scriptTags = document.querySelectorAll('script');

        scriptTags.forEach(script => {
            if (script.getAttribute('scope') === 'framework') {
               script.remove();
            }
        });

        //alert("Check here" +fileRoute + resourceId);

        this.render(fileRoute, resourceId).then(() => {

           
            const existingScripts = document.body.querySelectorAll('script[src="./core_modules/semantq.js"]');
            if (existingScripts.length === 0) {
                const script = document.createElement('script');
                script.src = '/core_modules/semantq.js';
                script.type = 'module';
                script.setAttribute('scope', 'framework');
                script.defer = true;
                document.body.appendChild(script);
            }

            

/*
    const script = document.createElement('script');
    script.src = './core_modules/semantq.js';
    script.type = 'module';
    script.setAttribute('scope', 'framework');
    script.defer = true;
    
    // Append the script to the end of the body
    document.body.appendChild(script);
*/
    return; 



        });
    }









}








const router = new Router(declaredRoutes, fileBasedRoutes);
const indexFile = router.basePath + '/index.html';
router.calculateIndexFileHash();

alert("click state 1: "+router.isHandledByClickEvent);


document.addEventListener('click', (event) => {
    const targetElement = event.target;
    if (targetElement.tagName === 'A' && targetElement.getAttribute('href')) {
        event.preventDefault();
        router.isHandledByClickEvent = true;
        localStorage.setItem('routeEvent', 'click');
        localStorage.setItem('routeAction', 'clicked');
        const targetRoute = targetElement.getAttribute('href');

        //alert(targetRoute);

        switch (true) {
            case router.isCanonicalUrl(targetRoute):
                window.location.href = targetRoute;
                break;
            case router.isDeclaredRoute(targetRoute):
                alert("declared");
                router.handleDeclaredRoute(targetRoute);
                break;
            case router.isDynamicRoute(targetRoute):
                alert("click dynamic"+targetRoute);
                router.handleDeclaredRoute(targetRoute);
                break;

            case router.isFileBasedRoute(targetRoute):
                alert('file based');
                router.handleFileBasedRoute(targetRoute);
                break;
            default:
                let errorRoute = 'errorRoute';
                router.handleFileBasedRoute(errorRoute);
                break;
        }

        //return;
    }

//return;
});

const routeEvent = localStorage.getItem('routeEvent');

//alert(routeEvent);

//alert("click state 2: "+router.isHandledByClickEvent);

let targetRoute=window.location.pathname;
let currentUrl = localStorage.getItem('currentRouteState');

 if (targetRoute !=='/') {

targetRoute=targetRoute.replace(/^\/+/g, '');

}

if (currentUrl!=='/') {

currentUrl= currentUrl.replace('//','');


}

alert("targetRoute : "+targetRoute +" currentUrl: "+currentUrl);




if (routeEvent!=='click' &&  targetRoute!==currentUrl) {

    alert("OOO targetRoute : "+targetRoute +" currentUrl: "+currentUrl);


    alert("This pop state should pass")

window.addEventListener('popstate', handleURLChange);
window.addEventListener('load', handleURLChange);

}


function handleURLChange(event) {
let targetRoute=window.location.pathname;


  switch (true) {
            case router.isCanonicalUrl(targetRoute):
                window.location.href = targetRoute;
                break;
            case router.isDeclaredRoute(targetRoute):
                alert("declared");
                router.handleDeclaredRoute(targetRoute);
                break;
            case router.isDynamicRoute(targetRoute):
                alert("dynamic");
                targetRoute=targetRoute.replace(/^\/+/g, '');
                const popScope=true;
                router.handleDeclaredRoute(targetRoute, popScope);
                break;

            case router.isFileBasedRoute(targetRoute):
                alert('file based');
                router.handleFileBasedRoute(targetRoute);
                break;
            default:
                let errorRoute = 'errorRoute';
                router.handleFileBasedRoute(errorRoute);
                break;
        }

    
}



//console.log('URL changed to: ' + currentUrl);

/*
window.addEventListener('popstate', function(event) {
    alert("anything");
  const newUrl = window.location.href;
  if (newUrl !== currentUrl) {
    currentUrl = newUrl;
    // Handle the URL change here
    const targetRoute = window.location.pathname;
    alert(targetRoute);
    console.log('URL changed to: ' + newUrl);
  }
});

*/

//retrievedRouteState = '/' + retrievedRouteState;

//alert();

/*
if (!router.isHandledByClickEvent && !router.routeHandled && window.location.pathname !== '/' && window.location.pathname !== retrievedRouteState) 

*/






//alert("handler:"+router.isHandledByClickEvent);

/*
function handleRouting() {
    if (!router.isHandledByClickEvent && !router.routeHandled) {
        let targetRoute = window.location.pathname;

        if (targetRoute !== '/') {
            targetRoute = targetRoute.replace('/', '');
        }

        alert("inside home handler unclicked ");
        router.routeHandled = true;

        switch (true) {
            case router.isCanonicalUrl(targetRoute):
                window.location.href = targetRoute;
                break;
            case router.isDeclaredRoute(targetRoute):
                router.handleDeclaredRoute(targetRoute);
                break;
            case router.isFileBasedRoute(targetRoute):
                router.handleFileBasedRoute(targetRoute);
                break;
            default:
                let errorRoute = 'errorRoute';
                alert(targetRoute);
                //return;
router.handleFileBasedRoute(errorRoute);
                break;
        }
    }

    return; // This will terminate the function execution after the switch block
}

// Call the function when needed

    if (!router.isHandledByClickEvent && !router.routeHandled ) {

handleRouting();


}

*/

