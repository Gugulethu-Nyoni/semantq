import fileBasedRoutes from '../../build/routes/fileBasedRoutes.js';
import declaredRoutes from '../../build/routes/routes.js';
//import path from 'path';



export default class Router {
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
        this.loadedLayoutModules = {}; // For layout modules
        this.loadedModules = {};  // Store loaded modules
        this.routesBase ='/build/routes';

        
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
            //console.log('Hash of index file:', hash);
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
        //console.log(html);
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
const rawRoute = route;
    // HANDLE LAYOUT IF ANY
    if (typeof route === 'string') {


if (!route) {
  console.error('Route is null or undefined.');
  return;
}

// Normalize route to remove extra slashes
route = route.replace(/\/+/g, '/'); 

// Remove any trailing file names (e.g., "+page.html")
route = route.replace(/\+page\.html$/, ''); 

// Extract route parts
const routeParts = route.split('/');
const routesIndex = routeParts.indexOf('routes');

// Ensure "routes" exists in the path
if (routesIndex === -1 || routesIndex + 1 >= routeParts.length) {
  console.error('Invalid route structure:', route);
  return;
}

// Get base directory (e.g., "admin" from "/routes/admin/users")
const routeBaseDir = routeParts[routesIndex + 1];

// Get current directory (e.g., "users" from "/routes/admin/users"), if it exists
const routeDir = (routeParts.length > routesIndex + 2 && !routeParts[routesIndex + 2].startsWith('+')) 
  ? routeParts[routesIndex + 2] 
  : null;

// **Prepend "build/" before "routes/" to construct the correct path**
const layoutScriptInRouteDir = routeDir ? `/build/routes/${routeBaseDir}/${routeDir}/+layout.js` : null;
const layoutScriptInBaseDir = `/build/routes/${routeBaseDir}/+layout.js`;

// Clean up paths
const cleanPath = (path) => path ? path.replace(/\/+/g, '/') : null;

console.log('Looking for layout scripts in:', cleanPath(layoutScriptInRouteDir), cleanPath(layoutScriptInBaseDir));

// Helper function to check if a file exists using fetch
async function fileExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

let layoutModule = null;

// Function to safely import a module
async function safeImport(modulePath) {
  try {
    return await import(/* @vite-ignore */ modulePath);
  } catch (error) {
    console.warn(`Failed to import module: ${modulePath}`, error);
    return null; // Return null if the module cannot be imported
  }
}

// Check for layout script in the current route directory first
if (layoutScriptInRouteDir && await fileExists(cleanPath(layoutScriptInRouteDir))) {
  console.log(`Layout script found in route directory: ${cleanPath(layoutScriptInRouteDir)}`);
  layoutModule = await safeImport(cleanPath(layoutScriptInRouteDir));
} 
// If not found, check in the base route directory
else if (await fileExists(cleanPath(layoutScriptInBaseDir))) {
  console.log(`Layout script found in base route directory: ${cleanPath(layoutScriptInBaseDir)}`);
  layoutModule = await safeImport(cleanPath(layoutScriptInBaseDir));
} 
// Fallback if no script is found
else {
  console.log('No layout script found. Skipping layout import.');
}

// Store the loaded layout module only if found
if (layoutModule) {

// delete first if exists 

    delete this.loadedLayoutModules[route];

  this.loadedLayoutModules[route] = layoutModule;

  // If the layout module has an init function, run it
  if (layoutModule?.layoutInit) {
    console.log("Running layout init...");
    layoutModule.layoutInit();
  } else {
    console.warn(`No layoutInit() function found in layout module for route: ${route}`);
  }
} else {
  console.log(`No valid layout module found for ${route}. Proceeding without a layout.`);
}







    }




    // END HANDLE LAYOUT

    const placeholder = document.getElementById('app');
    //console.log("IKHONA", placeholder);

    if (resourceId !== undefined) {
        placeholder.setAttribute('data-resource-id', resourceId);

        const existingData = JSON.parse(localStorage.getItem('smqState') || '{}');

        if (!existingData['componentDataId']) {
            existingData['componentDataId'] = [{ newState: resourceId }];
        }

        Object.values(existingData).forEach((value) => {
            value.forEach((item) => {
                if (item.key === 'componentDataId') {
                    item.newState = resourceId;
                }
            });
        });

        localStorage.setItem('smqState', JSON.stringify(existingData, null, 2));
    }

    // Remove existing scoped JS and CSS
    document.querySelectorAll('script[scope="component-js"]').forEach(script => script.remove());
    document.querySelectorAll('style[scope="component-css"]').forEach(style => style.remove());

    try {
        if (typeof rawRoute === 'string') {
            const componentDefinition = await this.fetchComponentDefinition(rawRoute);
            const template = document.createElement('template');
            template.innerHTML = componentDefinition.trim();
            const clone = template.content.cloneNode(true);
            placeholder.appendChild(clone);

            //console.log("HTML LOGGED!");

            if (resourceId !== undefined) {
                const scriptElement = document.createElement('script');
                scriptElement.textContent = `window.resourceId = "${resourceId}";`;
                document.body.appendChild(scriptElement);
            }

            // Handle scoped styles
            clone.querySelectorAll('style').forEach((style) => {
                const newStyle = document.createElement('style');
                newStyle.setAttribute('scope', 'component-css');
                newStyle.textContent = style.textContent;
                document.head.appendChild(newStyle);
            });

            // Store the module script content
            const script = clone.querySelector('script[type="module"]');
            if (script) {
                delete this.loadedModules[rawRoute];
                this.loadedModules[rawRoute] = script.textContent;
            }

            const scriptPath = rawRoute.replace('+page.html', `${rawRoute.split('/').slice(-2, -1)[0]}.js`);
           console.log("ROUTE", scriptPath);

            const module = await import(/* @vite-ignore */ scriptPath);
            //console.log("Loaded module:", module);

            this.loadedModules[route] = module;

            if (module.init) {
                console.log("Init function detected. Running it now...");
                module.init();
            } else {
                console.warn(`No init() function found in module for route: ${rawRoute}`);
            }
        }

        this.routeHandled = true;
        this.isHandledByClickEvent = false;
    } catch (error) {
        console.error('Error rendering component:', error);
    }
}









    handleFileBasedRoute(targetRoute, popScope, searchParams) {
        console.log(targetRoute, "fileBased");
        let storageRoute;
        if (targetRoute === '/' || targetRoute === 'home'  ) {
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
            fileRoute = '../../build/routes/' + targetRoute + '/' + '+page.html';
        } else if (targetRoute === '/') {
            fileRoute = null;
        }
        const placeholder = document.getElementById('app');
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
                //document.body.appendChild(script);
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
                console.log(targetRoute, "Declared");

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
            fileRoute = '../../build/routes/' + targetRouteLowercase.replace(/^\/+/, '') + '/' + '+page.html';
        }
        const placeholder = document.getElementById('app');
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
    if (targetElement.tagName === 'A' && targetElement.getAttribute('href') && !targetElement.getAttribute('href').startsWith('#')) {
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
