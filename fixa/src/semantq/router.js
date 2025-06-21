export default class Router {
  constructor(declaredRoutes, fileBasedRoutes) {
    this.declaredRoutes = declaredRoutes;
    this.fileBasedRoutes = fileBasedRoutes;
    this.basePath = window.location.origin;
    this.localStorageKey = 'Semantq.currentRoute';
  }

  // Normalize path by removing leading/trailing slashes
  normalizePath(path) {
    return path.replace(/^\/|\/$/g, '');
  }

  cleanUrl(targetRoute) {
    return targetRoute.replace(/build\/routes/g, '');
  }

  sanitizeHref(href) {
    // Remove domain if it's a local URL
    const localHref = href.replace(this.basePath, '');
    return localHref.replace(/[\s<>'"\x00-\x1F\x7F]/g, '');
  }

  isCanonicalRoute(href) {
    try {
      const url = new URL(href, this.basePath);
      return url.origin !== this.basePath;
    } catch (e) {
      return false;
    }
  }

  isFileBasedRoute(targetRoute) {
    const normalizedRoute = this.normalizePath(targetRoute);
    return Object.keys(this.fileBasedRoutes).some(
      route => this.normalizePath(route) === normalizedRoute
    );
  }

  isDeclaredRoute(targetRoute) {
    const normalizedRoute = this.normalizePath(targetRoute);
    return this.declaredRoutes.some(
      route => this.normalizePath(route.path) === normalizedRoute
    );
  }

  async handleFileBasedRoute(targetRoute) {
    const normalizedRoute = this.normalizePath(targetRoute);
    const foundRoute = Object.entries(this.fileBasedRoutes).find(
      ([route]) => this.normalizePath(route) === normalizedRoute
    );

    if (foundRoute) {
      const [route, filePath] = foundRoute;
      console.log(`Navigating to file-based route: ${route} -> ${filePath}`);
      
      const goTo = filePath === '/' ? this.basePath : `${this.basePath}/${filePath}`;
      console.log("Going to:", goTo);
      window.location.href = goTo;
    } else {
      console.error(`File-based route not found: ${targetRoute}`);
      this.handleRouteError(targetRoute);
    }
  }

  // ... rest of your methods remain the same ...

  interceptClicks() {
    document.addEventListener('click', (event) => {
      const anchor = event.target.closest('a[href]');
      
      if (anchor && !anchor.getAttribute('href').startsWith('#')) {
        const href = anchor.getAttribute('href');
        
        if (this.isCanonicalRoute(href)) {
          console.log(`Canonical route detected: ${href}. Letting the browser handle it.`);
          return;
        }

        event.preventDefault();
        const targetRoute = this.sanitizeHref(href);

        if (this.isRouteBeingProcessed(targetRoute)) {
          console.log(`Route ${targetRoute} is already being processed. Skipping.`);
          return;
        }

        this.setCurrentRoute(targetRoute);

        if (this.isDeclaredRoute(targetRoute)) {
          this.handleDeclaredRoute(targetRoute);
        } else if (this.isFileBasedRoute(targetRoute)) {
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
router.interceptClicks();

// Handle initial load
window.addEventListener('load', () => {
  const targetRoute = router.sanitizeHref(window.location.pathname);
  
  if (router.isRouteBeingProcessed(targetRoute)) {
    console.log(`Route ${targetRoute} is already being processed. Skipping.`);
    return;
  }

  router.setCurrentRoute(targetRoute);

  if (router.isDeclaredRoute(targetRoute)) {
    router.handleDeclaredRoute(targetRoute);
  } else if (router.isFileBasedRoute(targetRoute)) {
    router.handleFileBasedRoute(targetRoute);
  } else {
    router.handleRouteError(targetRoute);
  }
});

window.addEventListener('unload', () => {
  router.clearCurrentRoute();
});