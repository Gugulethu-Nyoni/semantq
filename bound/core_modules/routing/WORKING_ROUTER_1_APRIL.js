import fileBasedRoutes from '../../build/routes/fileBasedRoutes.json';
import declaredRoutes from '../../build/routes/routes.json';

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

        localStorage.setItem(this.storageKey, this.currentRoute);

       
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

    routePath=routePath;

    const foundRoute = this.declaredRoutes.find(route => route.path === routePath);

    //alert(JSON.stringify(foundRoute));

    // {"path":"about","component":"About","exact":true}

    if (foundRoute) {
        return true;
    }

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




    async render(route) {

        
        const placeholder = document.getElementById('dynamicComponentPlaceholder');
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

            for (const script of scripts) {
                const newScript = document.createElement('script');
                newScript.setAttribute('scope', 'component-js');
                newScript.setAttribute('type', 'module');

                if (script.src) {
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

            for (const script of scripts) {
                script.remove();
            }

            placeholder.appendChild(clone);
            this.routeHandled = true;
            this.isHandledByClickEvent = false;
            

        } catch (error) {
            console.error(error);
        }
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







        });
    }





handleDeclaredRoute(targetRoute) {
       

       if (targetRoute==='/' || targetRoute==='/home' ) {
        //alert(targetRoute);

        window.location.href=this.basePath;


       }


        window.history.pushState({}, "", targetRoute);
       // const storageRoute = targetRoute;
        localStorage.setItem(this.storageKey, targetRoute);


        const routePath=targetRoute;

        const declaredRoute = this.declaredRoutes.find(route => route.path === routePath);

        //const path =declaredRoute['path'];

        let fileRoute;

        if (declaredRoute.hasOwnProperty('component')) {
            //alert("component key is there");
        const resource=declaredRoute['component'];
        
        fileRoute = '../../build/components/' + declaredRoute['component'].replace('/','') + '.smq'; //Button.smq

        //alert(fileRoute);




        } 

        if (declaredRoute.hasOwnProperty('page')) {
            //alert("Here");
        const resource=declaredRoute['page'];
        const targetRouteLowercase = targetRoute.toLowerCase();

        fileRoute = '../../build/routes/' + targetRouteLowercase.replace('/','') + '/' + '+page.smq.html';




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

        this.render(fileRoute).then(() => {

          /*  
            const existingScripts = document.head.querySelectorAll('script[src="./core_modules/semantq.js"]');
            if (existingScripts.length === 0) {
                const script = document.createElement('script');
                script.src = './core_modules/semantq.js';
                script.type = 'module';
                script.setAttribute('scope', 'framework');
                script.defer = true;
                document.head.appendChild(script);
            }

            */


    const script = document.createElement('script');
    script.src = './core_modules/semantq.js';
    script.type = 'module';
    script.setAttribute('scope', 'framework');
    script.defer = true;
    
    // Append the script to the end of the body
    //document.body.appendChild(script);


        });
    }









}









const router = new Router(declaredRoutes, fileBasedRoutes);
const indexFile = router.basePath + '/index.html';
router.calculateIndexFileHash();

document.addEventListener('click', (event) => {
    const targetElement = event.target;
    if (targetElement.tagName === 'A' && targetElement.getAttribute('href')) {
        event.preventDefault();
        router.isHandledByClickEvent = true;
        const targetRoute = targetElement.getAttribute('href');

        //alert(targetRoute);

        switch (true) {
            case router.isCanonicalUrl(targetRoute):
                window.location.href = targetRoute;
                break;
            case router.isDeclaredRoute(targetRoute):
                //alert("declared");
                router.handleDeclaredRoute(targetRoute);
                break;
            case router.isFileBasedRoute(targetRoute):
                //alert('file based');
                router.handleFileBasedRoute(targetRoute);
                break;
            default:
                let errorRoute = 'errorRoute';
                router.handleFileBasedRoute(errorRoute);
                break;
        }
    }

return;
});

let retrievedRouteState = localStorage.getItem(router.storageKey);
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

