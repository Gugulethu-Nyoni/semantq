import fileBasedRoutes from '/build/routes/fileBasedRoutes.js';
import declaredRoutes from '/build/routes/routes.js';

export default class Router {
  constructor(declaredRoutes, fileBasedRoutes) {
  this.declaredRoutes = declaredRoutes;
  this.fileBasedRoutes = fileBasedRoutes;
  this.basePath = window.location.origin; // Don't modify it here
  this.localStorageKey = 'Semantq.currentRoute';
  this.tempParams = null;
}


  cleanUrl(targetRoute) {
    return targetRoute.replace(/build\/routes/g, ''); // Remove /build/routes
  }

/*
  sanitizeHref(href) {
    return href.replace(/[\s<>'"\x00-\x1F\x7F]/g, '');
  }
*/

sanitizeHref(href) {
  try {
    const url = new URL(href, window.location.origin);

    // Extract query parameters and store them
    const params = Object.fromEntries(url.searchParams.entries());
    this.tempParams = Object.keys(params).length > 0 ? params : null;

    // Get the pathname and remove any trailing slashes
    let sanitizedPath = url.pathname.replace(/\/+$/, '');

    // Remove /build/routes if present
    sanitizedPath = sanitizedPath.replace(/build\/routes/g, '');

    // Ensure the path starts with a slash if it's not the root
    if (sanitizedPath && sanitizedPath[0] !== '/') {
      sanitizedPath = '/' + sanitizedPath;
    }

    return sanitizedPath;
  } catch (e) {
    console.error("Error sanitizing href:", e);
    // Fallback logic
    const pathWithoutQuery = href.split('?')[0].split('#')[0];
    return pathWithoutQuery.replace(/[\s<>'"\x00-\x1F\x7F]/g, '');
  }
}

  
  isCanonicalRoute(href) {
    try {
      const url = new URL(href);
      return url.origin !== window.location.origin;
    } catch (e) {
      return false;
    }
  }

  isFileBasedRoute(targetRoute) {
    return this.fileBasedRoutes.hasOwnProperty(targetRoute);
  }

  isDeclaredRoute(targetRoute) {
    return this.declaredRoutes.some(route => route.path === targetRoute);
  }

  // Inside your Router class

async handleFileBasedRoute(targetRoute) {
  console.group('handleFileBasedRoute');
  console.log('Input targetRoute:', targetRoute);
  
  const filePath = this.fileBasedRoutes[targetRoute];
  console.log('Resolved filePath from fileBasedRoutes:', filePath);
  
  if (filePath) {
    console.log(`Navigating to file-based route: ${targetRoute} -> ${filePath}`);

    console.log('Before manipulation - filePath:', filePath, 'basePath:', this.basePath);
    
    const pathToJoin = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    console.log('After removing leading slash - pathToJoin:', pathToJoin);
    
    const url = new URL(pathToJoin, this.basePath);
    console.log('URL object created:', url);

    // Append stored parameters before navigating
    if (this.tempParams) {
      Object.entries(this.tempParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      console.log('Re-appended temporary parameters:', this.tempParams);
      this.tempParams = null; // Clear the parameters after use
    }
    
    const goTo = url.href;
    console.log('Final href to navigate to:', goTo);

    console.log("Going to:", goTo);
    window.location.href = goTo;
  } else {
    console.error(`File-based route not found: ${targetRoute}`);
    this.handleRouteError(targetRoute);
  }
  console.groupEnd();
}

async handleDeclaredRoute(targetRoute) {
  console.group('handleDeclaredRoute');
  console.log('Input targetRoute:', targetRoute);
  
  const routeConfig = this.declaredRoutes.find(route => route.path === targetRoute);
  console.log('Found routeConfig:', routeConfig);
  
  if (routeConfig) {
    console.log(`Handling declared route: ${targetRoute}`);

    const filePath = routeConfig.filePath;
    console.log('Resolved filePath from routeConfig:', filePath);
    
    if (filePath) {
      console.log(`Navigating to declared route: ${targetRoute} -> ${filePath}`);

      console.log('Before manipulation - filePath:', filePath, 'basePath:', this.basePath);
      
      const pathToJoin = filePath.startsWith('/') ? filePath.substring(1) : filePath;
      console.log('After removing leading slash - pathToJoin:', pathToJoin);
      
      const url = new URL(pathToJoin, this.basePath);
      console.log('URL object created:', url);

      // Append stored parameters before navigating
      if (this.tempParams) {
        Object.entries(this.tempParams).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
        console.log('Re-appended temporary parameters:', this.tempParams);
        this.tempParams = null; // Clear the parameters after use
      }
      
      const goTo = url.href;
      console.log('Final href to navigate to:', goTo);

      console.log("Going to:", goTo);
      window.location.href = goTo;
    } else {
      console.error(`File path not found for declared route: ${targetRoute}`);
      this.handleRouteError(targetRoute);
    }
  } else {
    console.error(`Declared route not found: ${targetRoute}`);
    this.handleRouteError(targetRoute);
  }
  console.groupEnd();
}


  handleRouteError(targetRoute) {
    console.error(`Route ${targetRoute} does not exist.`);
    const errorPage = this.fileBasedRoutes['/404'];
    if (errorPage) {
      window.location.href = errorPage;
    }
  }

  // Check if the route is already being processed
  isRouteBeingProcessed(targetRoute) {
    const currentRoute = localStorage.getItem(this.localStorageKey);
    return currentRoute === targetRoute;
  }

  // Set the current route in localStorage
  setCurrentRoute(targetRoute) {
    localStorage.setItem(this.localStorageKey, targetRoute);
  }

  // Clear the current route from localStorage
  clearCurrentRoute() {
    localStorage.removeItem(this.localStorageKey);
  }

interceptClicks() {
  document.addEventListener('click', (event) => {
    // Find the nearest parent anchor (works for direct clicks or nested elements)
    const anchor = event.target.closest('a[href]');
    
    if (anchor && !anchor.getAttribute('href').startsWith('#')) {
      const href = anchor.getAttribute('href');
      console.log("Route flow --1", href);
      console.log("Route flow 0)): raw", href);

      if (this.isCanonicalRoute(href)) {
        console.log("Route flow 0: isCanonicalRoute", href);
        console.log(`Canonical route detected: ${href}. Letting the browser handle it.`);
        return;
      }

      event.preventDefault();

      const targetRoute = this.sanitizeHref(href);
      console.log("Route flow 1: isNoTCanonicalRoute", targetRoute);

      // Skip if the route is already being processed
      if (this.isRouteBeingProcessed(targetRoute)) {
        console.log("Route flow 2: processedAlready", targetRoute);
        console.log(`Route ${targetRoute} is already being processed. Skipping.`);
        return;
      }

      // Set the current route in localStorage
      this.setCurrentRoute(targetRoute);

      // Prioritize declared routes over file-based routes
      if (this.isDeclaredRoute(targetRoute)) {
        console.log("Route flow 3: isDeclared", targetRoute);
        this.handleDeclaredRoute(targetRoute);
      } else if (this.isFileBasedRoute(targetRoute)) {
        console.log("Route flow 3: isFBased", targetRoute);
        this.handleFileBasedRoute(targetRoute);
      } else {
        this.handleRouteError(targetRoute);
      }
    }
  });
}

}




// Initialize the router
const router = new Router(declaredRoutes, fileBasedRoutes);
console.log('File based routes:', fileBasedRoutes); // Log 15
console.log('Declared routes:', declaredRoutes); // Log 16
router.interceptClicks();

// Handle initial load
/*
window.addEventListener('load', () => {
  const targetRoute = router.sanitizeHref(window.location.pathname);

  // Skip if the route is already being processed
  if (router.isRouteBeingProcessed(targetRoute)) {
    console.log(`Route ${targetRoute} is already being processed. Skipping.`);
    return;
  }

  // Set the current route in localStorage
  router.setCurrentRoute(targetRoute);

  // Prioritize declared routes over file-based routes
  if (router.isDeclaredRoute(targetRoute)) {
    router.handleDeclaredRoute(targetRoute);
  } else if (router.isFileBasedRoute(targetRoute)) {
    router.handleFileBasedRoute(targetRoute);
  } else {
    router.handleRouteError(targetRoute);
  }
});
*/

// Clear the current route when the page is unloaded
window.addEventListener('unload', () => {
  router.clearCurrentRoute();
});