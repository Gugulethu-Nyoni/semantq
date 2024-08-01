/*
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
        
        localStorage.setItem('routeEvent', 'initialLoad');
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
        const foundRoute = this.declaredRoutes.find(route => route.path === routePath);
        if (foundRoute) {
            return true;
        }
        return false;
    }

    matchDynamicRoute(declaredRoute, targetRoute) {
        const paramRegex = /:([a-zA-Z0-9]+)/g;
        const regex = new RegExp('^' + declaredRoute.path.replace(paramRegex, '(.+)') + '$');
        return regex.test(targetRoute);
    }

    isDynamicRoute(routePath) {
        routePath = routePath.replace(/^\/+/g, '');
        const declaredRoute = this.declaredRoutes.find(route => {
            const routeRegex = new RegExp(`^${route.path.replace(/:[^\s/]+/g, '([^/]+)')}$`);
            return routeRegex.test(routePath);
        });
        if (declaredRoute) {
            return true;
        }
        return false;
    }

    isFileBasedRoute(targetRoute) {
        if (targetRoute.startsWith("/") && targetRoute !== '/') {
            targetRoute = targetRoute.slice(1);
        }
        return this.fileBasedRoutes.hasOwnProperty(targetRoute);
    }

    handleRouteError(targetRoute) {
        console.log(`Route ${targetRoute} is not declared.`);
        console.log(`Route ${targetRoute} does not have corresponding files.`);
        let errorRoute = true;
        this.handleFileBasedRoute(targetRoute, errorRoute);
    } 

    async fetchComponentDefinition(routeFile) {
        const response = await fetch(routeFile);
        const html = await response.text();
        const routeFileHash = await this.calculateHash(html);
        if (routeFileHash === this.indexFileHash && routeFile !== null) {
            const errorFile = '../../build/routes/' + '+404.smq';
            const response = await fetch(errorFile);
            const html = await response.text();
            return html;
        } else if (routeFileHash === this.indexFileHash && routeFile === null) {
            return html;
        } else {
            return html;
        }
    }

    async render(route, resourceId) {
        const placeholder = document.getElementById('dynamicComponentPlaceholder');
        if (resourceId !== undefined) {
            placeholder.setAttribute('data-resource-id', resourceId);
            const existingData = localStorage.getItem('smqState');
            const parsedData = JSON.parse(existingData || '{}');
            if (!parsedData['componentDataId']) {
                parsedData['componentDataId'] = [{ newState: resourceId }];
            }
            Object.values(parsedData).forEach((value) => {
                value.map((item) => {
                    if (item.key === 'componentDataId') {
                        item.newState = resourceId;
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
            if (scripts) {
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
                        if (resourceId !== undefined) {
                            const letStatement = `let componentDataId = ${resourceId};`;
                            const existingScriptContent = script.textContent || script.innerText;
                            const newScriptContent = `${letStatement}\n${existingScriptContent}`;
                            newScript.textContent = newScriptContent;
                            document.head.appendChild(newScript);
                            const boundElements = clone.querySelectorAll(`[data-bind="componentDataId"]`);
                            if (boundElements.length > 0) {
                                boundElements.forEach((element) => {
                                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                                        element.value = resourceId;
                                    } else {
                                        element.textContent = resourceId;
                                    }
                                });
                            }
                        } else {
                            newScript.textContent = script.textContent;
                            document.head.appendChild(newScript);
                        }
                    }
                }
            }
            if (!scripts && resourceId) {
                const scriptElement = document.createElement('script');
                scriptElement.textContent = `let resourceId = "${resourceId}";`;
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
    }

    handleFileBasedRoute(targetRoute, popScope, searchParams) {
        let storageRoute;
        if (targetRoute === '/') {
            storageRoute = targetRoute;
            window.location.href = this.basePath;
        } else {
            storageRoute = '/' + targetRoute;
        }
        if (popScope === undefined) {
            let pushStatePath = targetRoute;
            if (searchParams) {
                pushStatePath = targetRoute + "?" + searchParams;
            }
            window.history.pushState({}, "", pushStatePath);
        }
        localStorage.setItem(this.storageKey, targetRoute);
        let fileRoute;
        if (targetRoute !== '/') {
            fileRoute = '../../build/routes/' + targetRoute + '/' + '+page.smq.html';
        } else if (targetRoute === '/') {
            fileRoute = null;
        }
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
                script.src = './core_modules/semantq.js';
                script.type = 'module';
                script.setAttribute('scope', 'framework');
                script.defer = true;
                document.body.appendChild(script);
            }
            if (targetRoute === '/demos') {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.setAttribute('scope', 'framework');
                link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/default.min.css';
                const script = document.createElement('script');
                script.setAttribute('scope', 'framework');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/highlight.min.js';
                document.head.appendChild(link);
                document.head.appendChild(script);
            }
            return;
        });
    }

    handleDeclaredRoute(targetRoute, popScope, searchParams) {
        if (targetRoute === '/' || targetRoute === '/home') {
            window.location.href = this.basePath;
        }
        if (popScope === undefined) {
            let pushStatePath = targetRoute;
            if (searchParams) {
                pushStatePath = targetRoute + "?" + searchParams;
            }
            window.history.pushState({}, "", pushStatePath);
        }
        localStorage.setItem(this.storageKey, targetRoute);
        const paramRegex = /\/:([0-9]+)/g;
        const dynamicMatch = targetRoute.match(paramRegex);
        let resourceId;
        let resourcePath;
        let declaredRoute;
        let fetchDynamicRoute;
        let routePath = targetRoute;
        let resource;
        if (dynamicMatch) {
            resourceId = dynamicMatch[0].substring(2);
            resourcePath = targetRoute.replace(paramRegex, '');
            routePath = resourcePath;
            fetchDynamicRoute = this.declaredRoutes.find(route => {
                const routeRegex = new RegExp(`^${route.path.replace(/:[^\s/]+/g, '([^/]+)')}$`);
                if (routeRegex.test(targetRoute)) {
                    declaredRoute = route;
                }
            });
        }
        if (!dynamicMatch) {
            declaredRoute = this.declaredRoutes.find(route => route.path === targetRoute);
        }
        let fileRoute;
        if (declaredRoute.hasOwnProperty('component')) {
            const resource = declaredRoute['component'];
            fileRoute = '../../build/components/' + declaredRoute['component'].replace('/', '') + '.smq';
        }
        if (declaredRoute.hasOwnProperty('page')) {
            const resource = declaredRoute['page'];
            const targetRouteLowercase = routePath.toLowerCase();
            fileRoute = '../../build/routes/' + targetRouteLowercase.replace(/^\/+/, '') + '/' + '+page.smq.html';
        }
        const placeholder = document.getElementById('dynamicComponentPlaceholder');
        placeholder.innerHTML = '';
        const scriptTags = document.querySelectorAll('script');
        scriptTags.forEach(script => {
            if (script.getAttribute('scope') === 'framework') {
                script.remove();
            }
        });
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
            return; 
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
        localStorage.setItem('routeEvent', 'click');
        let popScope = undefined;
        let rawTargetRoute = targetElement.getAttribute('href');
        let targetRoute = rawTargetRoute;
        const searchParams = targetRoute.split('?')[1] || '';
        const regex = /\?.*$/;
        targetRoute = targetRoute.replace(regex, '');

        switch (true) {
            case router.isCanonicalUrl(rawTargetRoute):
                window.location.href = rawTargetRoute;
                break;
            case router.isDeclaredRoute(targetRoute):
                router.handleDeclaredRoute(targetRoute, popScope, searchParams);
                break;
            case router.isDynamicRoute(targetRoute):
                targetRoute = targetRoute.replace(/^\/+/g, '');
                router.handleDeclaredRoute(targetRoute, popScope, searchParams);
                break;
            case router.isFileBasedRoute(targetRoute):
                router.handleFileBasedRoute(targetRoute, popScope, searchParams);
                break;
            default:
                let errorRoute = 'errorRoute';
                router.handleFileBasedRoute(errorRoute);
                break;
        }
    }
});

const routeEvent = localStorage.getItem('routeEvent');

let targetRoute = window.location.pathname;
let currentUrl = localStorage.getItem('currentRouteState');

if (targetRoute !== '/') {
    targetRoute = targetRoute.replace(/^\/+/g, '');
}

if (currentUrl !== '/') {
    currentUrl = currentUrl.replace('//', '');
}

if (routeEvent !== 'click' && targetRoute !== currentUrl) {
    window.addEventListener('popstate', handleURLChange);
    window.addEventListener('load', handleURLChange);
}

function handleURLChange(event) {
    let targetRoute = window.location.pathname;
    const popScope = true;
    const searchParams = targetRoute.split('?')[1] || '';
    const regex = /\?.*$/;
    targetRoute = targetRoute.replace(regex, '');
    switch (true) {
        case router.isCanonicalUrl(targetRoute):
            window.location.href = targetRoute;
            break;
        case router.isDeclaredRoute(targetRoute):
            router.handleDeclaredRoute(targetRoute, popScope, searchParams);
            break;
        case router.isDynamicRoute(targetRoute):
            targetRoute = targetRoute.replace(/^\/+/g, '');
            router.handleDeclaredRoute(targetRoute, popScope, searchParams);
            break;
        case router.isFileBasedRoute(targetRoute):
            router.handleFileBasedRoute(targetRoute, popScope, searchParams);
            break;
        default:
            let errorRoute = 'errorRoute';
            router.handleFileBasedRoute(errorRoute);
            break;
    }
}
*/

let indexFileHash ='';

async function calculateHash(content: string): Promise<string> {
    // Convert the content to an ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(content);

    // Create a hash of the content
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert the hash ArrayBuffer to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

// Function to fetch the content of a file
async function fetchFileContent(filePath: string): Promise<string> {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error('File not found');
        }
        const html = await response.text();
        return html;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Propagate the error
    }
}

// Example usage:
// make this dynamic 
const indexFile = 'http://localhost:5173/index.html'; // Replace with your file path

fetchFileContent(indexFile)
    .then(html => {
        // Call the hash function with the file content
        return calculateHash(html);
    })
    .then(hash => {

        indexFileHash=hash;
        //console.log('Hash of the file content:', hash);
    })
    .catch(error => {
        console.error('Error fetching or hashing file:', error);
    });




// Define the array of routes
const routes: string[] = ['/','about', 'contacts','binder']; // Use a watcher to log new file-based routes

// Define the root URL dynamically
const root: string = 'http://localhost:5173/';
const routesBase: string = root + 'src/routes/';

// Initialize pathName variable
let pathName: string = '';

// Function to validate URL format
function isValidURL(url: string): boolean {
    // Regular expression to validate URL
    const pattern: RegExp = new RegExp(
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


function createRouteErrorAlert(routeName) {
    // Create the alert markup
    const alertMarkup = `
        <div id="routeErrorAlert" class="hidden">
            <div class="alert-overlay"></div>
            <div class="alert-content">
                <h3><span id="routeErrorTitle">Route Error</span></h3>
                <p id="routeErrorMessage">Route ${routeName} is undefined as there are no corresponding files for the route.</p>
                <button id="confirmButton">OK</button>
            </div>
        </div>
    `;

    // Create the container div with the specified class name
    const container = document.createElement('div');
    container.className = 'routeErrorContainer';
    container.innerHTML = alertMarkup;

    // Append the alert to the document body
    document.body.appendChild(container);

    // Access elements after they are appended to the DOM
    const alert = document.getElementById('routeErrorAlert');
    const confirmButton = document.getElementById('confirmButton');

    // Remove the hidden class to display the alert
    alert.classList.remove('hidden');

    // Define the click event listener function
    function confirmButtonClickHandler() {
        // Hide the main container by setting its display property to 'none'
        container.style.display = 'none';
        
        // Remove the event listener
        confirmButton.removeEventListener('click', confirmButtonClickHandler);
    }

    // Add click event listener to confirmButton
    confirmButton.addEventListener('click', confirmButtonClickHandler);
}




// Event listener for click events on document
document.addEventListener('click', (event: MouseEvent) => {
  const href = (event.target as HTMLAnchorElement)?.closest('a')?.href;
      if (href) {
        // Extract pathName from href

        if (href === root) 
        
        {
          window.location.href = root;
          return; 
        }


        pathName = href.replace(root, '');

        

        // Remove both leading and trailing slashes from the pathName
        if (pathName.startsWith('/') && pathName.endsWith('/')) {
            pathName = pathName.slice(1, -1);
        } else if (pathName.startsWith('/')) {
            pathName = pathName.slice(1);
        } else if (pathName.endsWith('/')) {
            pathName = pathName.slice(0, -1);
        }

        // Check if the pathName is included in the routes array
        if (routes.includes(pathName)) {
            event.preventDefault();
            // Handle the custom pathName
            handlePath(href);
        } else {
            if (isValidURL(pathName)) {
                // pathName is a valid URL - must be external
                window.location.href = pathName;
            } else {
                event.preventDefault();
                // Route is not an internal URL but not defined
                //alert("Route: " + pathName + " is not defined!");

                createRouteErrorAlert(pathName);
            }
        }
    }
});

// Function to handle the path
function handlePath(href: string): void {
    let newURL = '';

    // Construct the new URL
    if (root.endsWith('/') && !root.includes('http')) {
        newURL = root.replace('/', '') + pathName;
    } else {
        newURL = `${root}${pathName}`;
    }

    // Update the browser history
    window.history.pushState({}, "", newURL);

    // Construct the full path to the JavaScript file
    const fullPath: string = `${routesBase}${pathName}/${pathName}.js`;

    // Fetch and evaluate the JavaScript file
    if (fullPath) {
        fetch(fullPath)
            .then(response => response.text())
            .then(jsCode => {
                alert("within");
                eval(jsCode);
            })
            .catch(error => {
                console.error('Error fetching JavaScript file:', error);
                // Render the 404 error page
                render404Page();
            });
    } else {
        // Fetch the 404 error page
        const errorPath: string = `${routesBase}/+404.smq`;
        fetch(errorPath)
            .then(response => response.text())
            .then(html => {
                // Render the 404 error page
                renderErrorPage(html);
            })
            .catch(error => {
                console.error('Error fetching 404 page:', error);
                // Render the 404 error page
                render404Page();
            });
    }
}

// Function to render the 404 error page
function render404Page(): void {
    alert('404 Error');
}

// Function to render an error page with custom HTML content
function renderErrorPage(htmlContent: string): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Extract script content
    const script = doc.querySelector('script');
    const scriptContent = script ? script.textContent : '';

    // Extract style content
    const style = doc.querySelector('style');
    const styleContent = style ? style.textContent : '';

    // Create and append the script element without wrapping the JS code
    const newScript = document.createElement('script');
    newScript.textContent = scriptContent;
    document.head.appendChild(newScript);

    // Create and append the style element
    const newStyle = document.createElement('style');
    newStyle.textContent = styleContent;
    document.head.appendChild(newStyle);

    // Replace the entire <body> content with the fetched HTML
    document.body.innerHTML = doc.body.innerHTML;
}

