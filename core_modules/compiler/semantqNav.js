import * as fs from 'fs';
import * as path from 'path';
import config from '../../semantq.config.js';
const fileBasedRoutes = await import(config.routes.fileBasedRoutes).then(module => module.default || module);
const declaredRoutes = await import(config.routes.declaredRoutes).then(module => module.default || module);

//import fileBasedRoutes from config.routes.fileBasedRoutes;
//import declaredRoutes from config.routes.declaredRoutes;

//const fileBasedRoutes = await import(config.routes.fileBasedRoutes);
//const declaredRoutes = await import(config.routes.declaredRoutes);

//console.log(fileBasedRoutes);
//console.log(declaredRoutes);
/*
import fileBasedRoutes from config.routes.fileBasedRoutes;
import declaredRoutes from config.routes.declaredRoutes;


// Dynamically import fileBasedRoutes and declaredRoutes
const fileBasedRoutes = await import(config.routes.fileBasedRoutes).then(module => module.default || module);
const declaredRoutes = await import(config.routes.declaredRoutes).then(module => module.default || module);
*/

// Use ES imports to load the route files

//console.log("Nav Module");

export default function generateMenu(declaredRoutes, fileBasedRoutes, menuConfig) {
 //console.log(menuConfig); 
//return;

  if (!declaredRoutes || !fileBasedRoutes || !menuConfig) return; 

 const { containerClass, ulClass, liClass, excludeRoutes, hierarchical, parentMenuDisplay, customLinkTexts } = menuConfig;

/*
const containerClass = menuConfig?.containerClass;
const ulClass = menuConfig?.ulClass;
const liClass = menuConfig?.liClass;
const excludeRoutes = menuConfig?.excludeRoutes;
const hierarchical = menuConfig?.hierarchical;
const parentMenuDisplay = menuConfig?.parentMenuDisplay;
const customLinkTexts = menuConfig?.customLinkTexts;
*/


//console.log("HERE",containerClass);

if (!Array.isArray(declaredRoutes)) {
  throw new TypeError('declaredRoutes must be an array');
}
  // Step 1: Reformat declaredRoutes into a flat object
// 1. Convert declaredRoutes array into an object (like fileBasedRoutes)
const declaredRoutesFormatted = declaredRoutes.reduce((acc, route) => {
  acc[route.path] = route.filePath;
  return acc;
}, {});


// Step 2: Clean up fileBasedRoutes by removing entries that match declaredRoutes filePath values
const cleanedFileBasedRoutes = { ...fileBasedRoutes };
declaredRoutes.forEach(route => {
  // Find the key in fileBasedRoutes that matches the filePath in declaredRoutes
  const matchingKey = Object.keys(cleanedFileBasedRoutes).find(
    key => cleanedFileBasedRoutes[key] === route.filePath
  );
  // If a matching key is found, remove it from fileBasedRoutes
  if (matchingKey) {
    delete cleanedFileBasedRoutes[matchingKey];
  }
});

// Step 3: Combine cleanedFileBasedRoutes and declaredRoutesFormatted, with declaredRoutes taking precedence
const routes = { ...cleanedFileBasedRoutes, ...declaredRoutesFormatted };

//console.log(routes);

  // Filter out excluded routes
  const filteredRoutes = Object.keys(routes).filter(route => !excludeRoutes.includes(route));

  // Function to create hierarchical menu structure
  const createMenuStructure = (routes) => {
    const menu = {};
    routes.forEach(route => {
      const parts = route.split('/');
      let currentLevel = menu;
      parts.forEach(part => {
        if (!currentLevel[part]) {
          currentLevel[part] = {};
        }
        currentLevel = currentLevel[part];
      });
    });
    return menu;
  };

  const menuStructure = hierarchical ? createMenuStructure(filteredRoutes) : filteredRoutes;

  // Function to generate HTML from menu structure
  const generateHTML = (structure, parentRoute = '') => {
    if (Array.isArray(structure)) {
      // Handle flat menu structure
      return `<ul class="${ulClass}">${structure.map(route => {
        const href = route.startsWith('http') ? route : route; // Keep external URLs as-is
        const linkText = getLinkText(route);
        return `<li class="${liClass}"><a href="${route}">${linkText}</a></li>`;
      }).join('')}</ul>`;
    } else {
      // Handle hierarchical menu structure
      return `<ul class="${ulClass} ${parentMenuDisplay === 'inline' ? 'inline-parent' : 'stacked-parent'}">${Object.keys(structure).map(key => {
        const fullRoute = parentRoute ? `${parentRoute}/${key}` : key;
        const href = routes[fullRoute] || fullRoute; // Use the route path as href
        const linkText = getLinkText(fullRoute);
        const children = structure[key];
        const hasChildren = Object.keys(children).length > 0;

        return `<li class="${liClass} ${hasChildren ? 'has-dropdown' : ''}"><a href="/${fullRoute}">${linkText}</a>${hasChildren ? generateHTML(children, fullRoute) : ''}</li>`;
      }).join('')}</ul>`;
    }
  };
  // Function to get the link text for a route
  const getLinkText = (route) => {
    // 1. Check if custom link text is defined
    if (customLinkTexts && customLinkTexts[route]) {
      return customLinkTexts[route];
    }

    // 2. Check if the route is declared and use the filePath value
    const declaredRoute = declaredRoutes.find(r => r.path === route);
    if (declaredRoute) {
      return declaredRoute.filePath
        .split('/')
        .pop()
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
    }

    // 3. Use the route value from fileBasedRoutes
    return route
      .split('/')
      .pop()
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const menuHTML = generateHTML(menuStructure);

  // Append burger icon and checkbox
  return `
    <div class="${containerClass}">
      <label for="menu-toggle" class="burger-icon">
        <span></span>
        <span></span>
        <span></span>
      </label>
      <input type="checkbox" id="menu-toggle" class="menu-toggle" />
      ${menuHTML}
    </div>
  `;
}

const semantqNavCss = `
@style
/* General Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Base Styles for Menu */
.semantq-nav-container {
  font-family: 'Arial', sans-serif;
  background: #f8f9fa;
  padding: 10px;
}

.semantq-nav-list {
  list-style: none;
  display: flex;
  gap: 20px;
}

.semantq-nav-item {
  position: relative;
}

.semantq-nav-item a {
  text-decoration: none;
  color: #333;
  padding: 10px 15px;
  display: block;
  transition: background 0.3s ease, color 0.3s ease;
}

.semantq-nav-item a:hover {
  background: #007bff;
  color: #fff;
}

/* Dropdown Indicators */
.semantq-nav-item.has-dropdown > a::after {
  content: '▸';
  margin-left: 8px;
  font-size: 14px;
  transition: transform 0.3s ease;
}

/* Rotate arrow when dropdown is open */
.semantq-nav-item.has-dropdown:hover > a::after {
  transform: rotate(90deg);
}

/* Dropdown Styles */
.semantq-nav-item.has-dropdown > ul {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  border: 1px solid #ddd;
  min-width: 200px;
  z-index: 1000;
}

.semantq-nav-item.has-dropdown:hover > ul {
  display: block;
}

/* Second and Third-Level Dropdowns */
.semantq-nav-item.has-dropdown > ul .semantq-nav-item.has-dropdown > ul {
  top: 0;
  left: 100%;
  margin-left: 1px;
}

/* Inline Mode */
.semantq-nav-container .inline-parent {
  flex-direction: row;
}

.semantq-nav-container .inline-parent .semantq-nav-item.has-dropdown > ul {
  top: 100%;
  left: 0;
}

/* Stacked Mode */
.semantq-nav-container .stacked-parent {
  flex-direction: column;
}

.semantq-nav-container .stacked-parent .semantq-nav-item.has-dropdown > ul {
  position: static;
  border: none;
  margin-left: 20px;
}

/* Mobile Styles */


@media (max-width: 768px) {
  .semantq-nav-container {
    position: relative;
  }

  .semantq-nav-list {
    flex-direction: column;
    display: none;
  }

  .semantq-nav-container.menu-open .semantq-nav-list {
    display: flex;
    flex-direction: column; /* Force stacked on mobile */
  }

  .semantq-nav-item.has-dropdown > ul {
    position: static;
    display: none;
    margin-left: 20px;
  }

  .semantq-nav-item.has-dropdown:hover > ul {
    display: block;
  }

  /* Burger Icon */
  .burger-icon {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 24px;
    cursor: pointer;
  }

  .burger-icon span {
    width: 100%;
    height: 3px;
    background: #333;
    transition: all 0.3s ease;
  }

  .menu-toggle {
    display: none;
  }

  .menu-toggle:checked ~ .semantq-nav-list {
    display: flex;
    flex-direction: column;
  }

  .menu-toggle:checked + .burger-icon span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .menu-toggle:checked + .burger-icon span:nth-child(2) {
    opacity: 0;
  }

  .menu-toggle:checked + .burger-icon span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }
}

/* Smooth Transitions */
.semantq-nav-item.has-dropdown > ul {
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: 0;
  transform: translateY(-10px);
}

.semantq-nav-item.has-dropdown:hover > ul {
  opacity: 1;
  transform: translateY(0);
}

@media (min-width: 769px) {
  .menu-toggle {
    display: none;
  }
}
  @end
`;
 
const menuConfig = config.semantqNav;

//console.log("This",menuConfig);

//console.log(config.semantqNav);
const menuHTML = generateMenu(declaredRoutes, fileBasedRoutes, menuConfig);
//document.getElementById('semantq-nav-container').innerHTML = menuHTML;
//console.log(menuHTML);


// 

const semantqNavComponent = `
  ${semantqNavCss}
  @html \n
  ${menuHTML}
`; 
// here write outputs (semantqNavComponent) config.globalComponents path 

// Write the output to the globalComponents path
const outputPath = path.join(config.globalComponents['$global'], 'SemantqNav.smq');
fs.writeFileSync(outputPath, semantqNavComponent, 'utf-8');
