//import fileBasedRoutes from '../../build/routes/fileBasedRoutes.js';
//import declaredRoutes from '../..build/routes/routes.js';



export default class Router {
  constructor(declaredRoutes, fileBasedRoutes) {
    this.declaredRoutes = declaredRoutes;
    this.fileBasedRoutes = fileBasedRoutes;
    this.basePath = window.location.origin;
    this.localStorageKey = 'Semantq.currentRoute';
  }

  // Essential route management methods
  setCurrentRoute(targetRoute) {
    localStorage.setItem(this.localStorageKey, targetRoute);
  }

  clearCurrentRoute() {
    localStorage.removeItem(this.localStorageKey);
  }

  isRouteBeingProcessed(targetRoute) {
    const currentRoute = localStorage.getItem(this.localStorageKey);
    return currentRoute === targetRoute;
  }

  // Route handling methods
  normalizePath(path) {
    return path.replace(/^\/|\/$/g, '');
  }

  sanitizeHref(href) {
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
      const goTo = filePath === '/' ? this.basePath : `${this.basePath}/${filePath}`;
      window.location.href = goTo;
    } else {
      this.handleRouteError(targetRoute);
    }
  }

  async handleDeclaredRoute(targetRoute) {
    const routeConfig = this.declaredRoutes.find(route => route.path === targetRoute);
    if (routeConfig && routeConfig.filePath) {
      const goTo = routeConfig.filePath === '/' ? this.basePath : `${this.basePath}/${routeConfig.filePath}`;
      window.location.href = goTo;
    } else {
      this.handleRouteError(targetRoute);
    }
  }

  handleRouteError(targetRoute) {
    console.error(`Route ${targetRoute} does not exist.`);
    const errorPage = this.fileBasedRoutes['/404'];
    if (errorPage) {
      window.location.href = errorPage;
    }
  }

  // Event handling
  interceptClicks() {
    document.addEventListener('click', (event) => {
      const anchor = event.target.closest('a[href]');
      if (anchor && !anchor.getAttribute('href').startsWith('#')) {
        const href = anchor.getAttribute('href');
        
        if (this.isCanonicalRoute(href)) {
          return; // Let browser handle external links
        }

        event.preventDefault();
        const targetRoute = this.sanitizeHref(href);

        if (!this.isRouteBeingProcessed(targetRoute)) {
          this.setCurrentRoute(targetRoute);
          if (this.isDeclaredRoute(targetRoute)) {
            this.handleDeclaredRoute(targetRoute);
          } else if (this.isFileBasedRoute(targetRoute)) {
            this.handleFileBasedRoute(targetRoute);
          } else {
            this.handleRouteError(targetRoute);
          }
        }
      }
    });
  }
}

// Initialize router
const router = new Router(declaredRoutes, fileBasedRoutes);
router.interceptClicks();

// Handle initial page load
window.addEventListener('load', () => {
  const targetRoute = router.sanitizeHref(window.location.pathname);
  if (!router.isRouteBeingProcessed(targetRoute)) {
    router.setCurrentRoute(targetRoute);
    if (router.isDeclaredRoute(targetRoute)) {
      router.handleDeclaredRoute(targetRoute);
    } else if (router.isFileBasedRoute(targetRoute)) {
      router.handleFileBasedRoute(targetRoute);
    }
  }
});

// Clean up on page unload
window.addEventListener('unload', () => {
  router.clearCurrentRoute();
});