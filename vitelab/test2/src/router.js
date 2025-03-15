import fileBasedRoutes from './fileBasedRoutes.js';
import declaredRoutes from './routes.js';

export default class Router {
  constructor(declaredRoutes, fileBasedRoutes) {
    this.declaredRoutes = declaredRoutes;
    this.fileBasedRoutes = fileBasedRoutes;
    this.basePath = window.location.origin;
  }

  sanitizeHref(href) {
    return href.replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9\/-]/g, '');
  }

  isFileBasedRoute(targetRoute) {
    return this.fileBasedRoutes.hasOwnProperty(targetRoute);
  }

  isDeclaredRoute(targetRoute) {
    return this.declaredRoutes.some(route => route.path === targetRoute);
  }

  handleFileBasedRoute(targetRoute) {
    const filePath = this.fileBasedRoutes[targetRoute];
    if (filePath) {
      window.location.href = filePath;
    } else {
      console.error(`File-based route not found: ${targetRoute}`);
      this.handleRouteError(targetRoute);
    }
  }

  handleDeclaredRoute(targetRoute) {
    const routeConfig = this.declaredRoutes.find(route => route.path === targetRoute);
    if (routeConfig) {
      console.log(`Handling declared route: ${targetRoute}`);
      // Implement logic for declared routes if necessary
    } else {
      console.error(`Declared route not found: ${targetRoute}`);
      this.handleRouteError(targetRoute);
    }
  }

  handleRouteError(targetRoute) {
    console.error(`Route ${targetRoute} does not exist.`);
    // Optionally, redirect to a 404 page or display an error message
  }

  interceptClicks() {
    document.addEventListener('click', (event) => {
      const targetElement = event.target;
      if (targetElement.tagName === 'A' && targetElement.getAttribute('href') && !targetElement.getAttribute('href').startsWith('#')) {
        event.preventDefault();

        const rawTargetRoute = targetElement.getAttribute('href');
        const targetRoute = this.sanitizeHref(rawTargetRoute);

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