import fileBasedRoutes from '/build/routes/fileBasedRoutes.js';
import declaredRoutes from '/build/routes/routes.js';

export default class Router {
  constructor(declaredRoutes, fileBasedRoutes) {
    this.declaredRoutes = declaredRoutes;
    this.fileBasedRoutes = fileBasedRoutes;
    this.basePath = window.location.origin;
  }

  sanitizeHref(href) {
    return href.replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9\/-]/g, '');
  }

  isCanonicalRoute(href) {
    // Check if the href is an absolute URL (e.g., https://google.com)
    try {
      const url = new URL(href);
      return url.origin !== window.location.origin;
    } catch (e) {
      // If URL parsing fails, it's not a canonical route
      return false;
    }
  }

  isFileBasedRoute(targetRoute) {

    const isfileBased = this.fileBasedRoutes.hasOwnProperty(targetRoute);
    //alert(targetRoute, isfileBased);
    return isfileBased; 
  }

  isDeclaredRoute(targetRoute) {
    return this.declaredRoutes.some(route => route.path === targetRoute);
  }

  async handleFileBasedRoute(targetRoute) {
    const filePath = this.fileBasedRoutes[targetRoute];
    if (filePath) {
        console.log(`Navigating to file-based route: ${targetRoute} -> ${filePath}`);
        
        // Update URL in browser history without reloading
        history.pushState({}, "", `/${targetRoute}`);
        
        // Redirect to the file path without full page reload
        window.location.replace(filePath);
    } else {
        console.error(`File-based route not found: ${targetRoute}`);
        this.handleRouteError(targetRoute);
    }
}

async handleDeclaredRoute(targetRoute) {
    const routeConfig = this.declaredRoutes.find(route => route.path === targetRoute);
    if (routeConfig) {
        console.log(`Handling declared route: ${targetRoute}`);

        const filePath = routeConfig.filePath;
        if (filePath) {
            console.log(`Navigating to declared route: ${targetRoute} -> ${filePath}`);

            // Update URL in browser history without reloading
            history.pushState({}, "", `/${targetRoute}`);

            // Redirect to the file path without full page reload
            window.location.replace(filePath);
        } else {
            console.error(`File path not found for declared route: ${targetRoute}`);
            this.handleRouteError(targetRoute);
        }
    } else {
        console.error(`Declared route not found: ${targetRoute}`);
        this.handleRouteError(targetRoute);
    }
}


  handleRouteError(targetRoute) {
    console.error(`Route ${targetRoute} does not exist.`);
    // Optionally, redirect to a 404 page or display an error message
    const errorPage = this.fileBasedRoutes['/404'];
    if (errorPage) {
      window.location.href = errorPage;
    }
  }

  interceptClicks() {
    document.addEventListener('click', (event) => {
      const targetElement = event.target;
      if (targetElement.tagName === 'A' && targetElement.getAttribute('href') && !targetElement.getAttribute('href').startsWith('#')) {
        const href = targetElement.getAttribute('href');

        //alert(href);

        // Step 1: Check if the route is canonical
        if (this.isCanonicalRoute(href)) {
          console.log(`Canonical route detected: ${href}. Letting the browser handle it.`);
          return; // Let the browser handle the canonical route
        }

        event.preventDefault();

        const targetRoute = this.sanitizeHref(href);

              //  alert(targetRoute);


        if (this.isFileBasedRoute(targetRoute)) {
          this.handleFileBasedRoute(targetRoute);
        } else if (this.isDeclaredRoute(targetRoute)) {
          this.handleDeclaredRoute(targetRoute);
        } else {
          this.handleRouteError(targetRoute);
        }
      }
    });
  }
}

// Initialize the router
const router = new Router(declaredRoutes, fileBasedRoutes);
router.interceptClicks();

// Handle initial load
window.addEventListener('load', () => {
  const targetRoute = router.sanitizeHref(window.location.pathname);
  if (router.isFileBasedRoute(targetRoute)) {
    router.handleFileBasedRoute(targetRoute);
  } else if (router.isDeclaredRoute(targetRoute)) {
    router.handleDeclaredRoute(targetRoute);
  } else {
    router.handleRouteError(targetRoute);
  }
});

// Handle popstate (back/forward navigation)
window.addEventListener('popstate', () => {
  const targetRoute = router.sanitizeHref(window.location.pathname);
  if (router.isFileBasedRoute(targetRoute)) {
    router.handleFileBasedRoute(targetRoute);
  } else if (router.isDeclaredRoute(targetRoute)) {
    router.handleDeclaredRoute(targetRoute);
  } else {
    router.handleRouteError(targetRoute);
  }
});