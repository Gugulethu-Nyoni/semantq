import fileBasedRoutes from './fileBasedRoutes.js';
import declaredRoutes from './routes.js';

export default class Router {
  constructor(declaredRoutes, fileBasedRoutes) {
    this.declaredRoutes = declaredRoutes;
    this.fileBasedRoutes = fileBasedRoutes;
    this.isHandledByClickEvent = false;
    this.routeHandled = false;
    this.currentUrl = window.location.href;
    this.basePath = window.location.origin;
    this.currentRoute = window.location.pathname;
    this.loadedLayoutModules = {}; // For layout modules
    this.loadedModules = {}; // For loaded modules
    this.routesBase = './routes'; // Base directory for routes
  }

  // Check if a route is a file-based route
  isFileBasedRoute(targetRoute) {
    return this.fileBasedRoutes.hasOwnProperty(targetRoute);
  }

  // Check if a route is a declared route
  isDeclaredRoute(targetRoute) {
    return this.declaredRoutes.some(route => route.path === targetRoute);
  }

  // Handle file-based routes
  async handleFileBasedRoute(targetRoute) {
    console.log(`Handling file-based route: ${targetRoute}`);


    if (targetRoute === 'home' || targetRoute === '/' ) {
    window.location.href = '/';
    return;
  }


    // Construct the path to the +page.html file
    const pagePath = `${this.routesBase}/${targetRoute}/+page.html`;
    console.log("ROUTE",pagePath);

    // Fetch and render the +page.html file
    try {
      const response = await fetch(pagePath);
      if (!response.ok) throw new Error('Failed to fetch page');
      const html = await response.text();

      // Inject the HTML into the #app element
      const placeholder = document.getElementById('app');
      placeholder.innerHTML = html;

      // Check for layout files
      await this.handleLayout(targetRoute);

      // Handle scoped CSS and JS (if any)
      this.handleScopedAssets(html);
    } catch (error) {
      console.error(`Error handling file-based route ${targetRoute}:`, error);
      this.handleRouteError(targetRoute);
    }
  }

  async handleLayout(targetRoute) {
  console.log(`Checking for layout files for route: ${targetRoute}`);

  // Split the route into parts
  const routeParts = targetRoute.split('/').filter(part => part !== '');

  // Start from the current route directory and move backward
  for (let i = routeParts.length; i >= 1; i--) {
    const currentPath = `/${routeParts.slice(0, i).join('/')}`;
    const layoutPath = `${this.routesBase}${currentPath}/+layout.js`;
    console.log(`Checking for layout at: ${layoutPath}`);

    const layoutModule = await this.loadLayoutModule(layoutPath);
    if (layoutModule) {
      console.log(`Layout module found at: ${layoutPath}`);
      if (layoutModule.layoutInit) {
        layoutModule.layoutInit();
      }
      return; // Stop searching once a layout is found
    }
  }

  console.log(`No layout module found for route: ${targetRoute}`);
}




  // Load a layout module
  async loadLayoutModule(layoutPath) {
    try {
      const module = await import(/* @vite-ignore */ layoutPath);
      return module;
    } catch (error) {
      console.warn(`Failed to load layout module: ${layoutPath}`, error);
      return null;
    }
  }

  // Handle scoped CSS and JS
  handleScopedAssets(html) {
    const template = document.createElement('template');
    template.innerHTML = html;

    // Handle scoped CSS
    template.content.querySelectorAll('style').forEach(style => {
      const newStyle = document.createElement('style');
      newStyle.setAttribute('scope', 'component-css');
      newStyle.textContent = style.textContent;
      document.head.appendChild(newStyle);
    });

    // Handle scoped JS
    const script = template.content.querySelector('script[type="module"]');
    if (script) {
      const newScript = document.createElement('script');
      newScript.type = 'module';
      newScript.textContent = script.textContent;
      document.body.appendChild(newScript);
    }
  }

  // Handle route errors
  handleRouteError(targetRoute) {
    console.error(`Route ${targetRoute} does not exist.`);
    // Optionally, redirect to a 404 page or display an error message
  }

  // Intercept click events
  interceptClicks() {
    document.addEventListener('click', (event) => {
      const targetElement = event.target;
      if (targetElement.tagName === 'A' && targetElement.getAttribute('href') && !targetElement.getAttribute('href').startsWith('#')) {
        event.preventDefault();
        this.isHandledByClickEvent = true;

            const rawTargetRoute = targetElement.getAttribute('href');
            const targetRoute = rawTargetRoute.replace(/^\/+|\/+$/g, '');


        alert(targetRoute);


        // Handle the "home" term
      if (targetRoute === 'home') {
        window.location.href = '/';
        return;
      }

        if (this.isFileBasedRoute(targetRoute)) {
          this.handleFileBasedRoute(targetRoute);
        } else if (this.isDeclaredRoute(targetRoute)) {
          this.handleDeclaredRoute(targetRoute);
        } else {
                   // alert(targetRoute);

          this.handleRouteError(targetRoute);
        }
      }
    });
  }

  // Handle declared routes (if needed)
  async handleDeclaredRoute(targetRoute) {
    console.log(`Handling declared route: ${targetRoute}`);
    // Implement logic for declared routes if necessary
  }
}

// Initialize the router
const router = new Router(declaredRoutes, fileBasedRoutes);
router.interceptClicks();

// Handle initial load
window.addEventListener('load', () => {
  const targetRoute = window.location.pathname.replace(/^\/+/, '');
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
  const targetRoute = window.location.pathname.replace(/^\/+/, '');
  if (router.isFileBasedRoute(targetRoute)) {
    router.handleFileBasedRoute(targetRoute);
  } else if (router.isDeclaredRoute(targetRoute)) {
    router.handleDeclaredRoute(targetRoute);
  } else {
    router.handleRouteError(targetRoute);
  }
});