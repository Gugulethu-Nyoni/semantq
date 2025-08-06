import * as fs from 'fs';
import * as path from 'path';
import config from '../../semantq.config.js';

const fileBasedRoutes = await import(config.routes.fileBasedRoutes).then(module => module.default || module);
const declaredRoutes = await import(config.routes.declaredRoutes).then(module => module.default || module);

export default function generateMenu(declaredRoutes, fileBasedRoutes, menuConfig) {
  if (!declaredRoutes || !fileBasedRoutes || !menuConfig) return '';

  const { containerClass, ulClass, liClass, excludeRoutes = [], hierarchical, parentMenuDisplay, customLinkTexts = {} } = menuConfig;

  if (!Array.isArray(declaredRoutes)) {
    throw new TypeError('declaredRoutes must be an array');
  }

  const declaredRoutesFormatted = declaredRoutes.reduce((acc, route) => {
    acc[route.path] = route.filePath;
    return acc;
  }, {});

  const cleanedFileBasedRoutes = { ...fileBasedRoutes };
  declaredRoutes.forEach(route => {
    const matchingKey = Object.keys(cleanedFileBasedRoutes).find(
      key => cleanedFileBasedRoutes[key] === route.filePath
    );
    if (matchingKey) delete cleanedFileBasedRoutes[matchingKey];
  });

  const allRoutes = { ...cleanedFileBasedRoutes, ...declaredRoutesFormatted };
  const routeKeys = Object.keys(allRoutes).filter(route => !excludeRoutes.includes(route));

  const sortedRoutes = [...routeKeys].sort((a, b) => {
    if (a === '/') return -1;
    if (b === '/') return 1;

    const partsA = a.split('/').filter(p => p !== '');
    const partsB = b.split('/').filter(p => p !== '');

    const depthA = partsA.length;
    const depthB = partsB.length;

    if (depthA !== depthB) return depthA - depthB;
    return a.localeCompare(b);
  });

  const createMenuStructure = (routes) => {
    const menu = {};
    routes.forEach(route => {
      if (route === '/') {
        menu['/'] = { children: {}, route: '/', isHome: true };
        return;
      }
      const parts = route.split('/').filter(p => p !== '');
      let currentLevel = menu;
      let currentPath = '';

      parts.forEach((part, index) => {
        currentPath = `${currentPath}/${part}`;
        
        if (!currentLevel[part]) {
          currentLevel[part] = {
            children: {},
            route: currentPath,
            isLeaf: index === parts.length - 1
          };
        }
        
        if (index < parts.length - 1) {
          currentLevel = currentLevel[part].children;
        }
      });
    });
    return menu;
  };

  const menuStructure = hierarchical ? createMenuStructure(sortedRoutes) : sortedRoutes;

  const getLinkText = (route) => {
    if (route === '/') return 'Home';
    if (customLinkTexts[route]) return customLinkTexts[route];

    const parts = route.split('/').filter(p => p !== '');
    const lastPart = parts.pop();
    if (!lastPart) return '';

    return lastPart
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const generateHTML = (structure, parentRoute = '', isTopLevel = true) => {
    if (Array.isArray(structure)) {
      const listClass = `${ulClass} ${isTopLevel ? (parentMenuDisplay === 'inline' ? 'inline-parent' : 'stacked-parent') : ''}`;

      const homeItem = structure.find(r => r === '/');
      const otherItems = structure.filter(r => r !== '/');
      const sortedItems = homeItem ? [homeItem, ...otherItems] : otherItems;

      return `<ul class="${listClass}">${sortedItems.map(route => {
        const linkText = getLinkText(route);
        return `<li class="${liClass}"><a href="${route}">${linkText}</a></li>`;
      }).join('')}</ul>`;
    } else {
      const listClass = `${ulClass} ${isTopLevel ? (parentMenuDisplay === 'inline' ? 'inline-parent' : 'stacked-parent') : ''}`;

      let itemsHTML = '';
      const sortedKeys = Object.keys(structure).sort((a, b) => {
        if (a === '/') return -1;
        if (b === '/') return 1;
        return a.localeCompare(b);
      });

      itemsHTML = sortedKeys.map(key => {
        const value = structure[key];
        const fullRoute = value.route;
        const linkText = getLinkText(key === '/' ? '/' : fullRoute);
        const hasChildren = Object.keys(value.children).length > 0;

        const linkHref = key === '/' ? '/' : fullRoute;

        return `
          <li class="${liClass} ${hasChildren ? 'has-dropdown' : ''}">
            <a href="${linkHref}">${linkText}</a>
            ${hasChildren ? generateHTML(value.children, fullRoute, false) : ''}
          </li>
        `;
      }).join('');

      return `<ul class="${listClass}">${itemsHTML}</ul>`;
    }
  };

  const menuHTML = generateHTML(menuStructure);

  return `
    <div class="${containerClass}">
      <label for="semantq-menu-toggle" class="semantq-burger-icon">
        <span></span>
        <span></span>
        <span></span>
      </label>
      <input type="checkbox" id="semantq-menu-toggle" class="semantq-menu-toggle" />
      ${menuHTML}
    </div>
  `;
}

const semantqNavCss = `
<style>
/* Base Reset - Scoped to our component only */
.semantq-nav-container,
.semantq-nav-container * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Container Styles */
.semantq-nav-container {
  font-family: 'Arial', sans-serif;
  background: #f8f9fa;
  padding: 10px;
  position: relative;
}

/* List Base Styles */
.semantq-nav-list {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}

/* Menu Item Styles */
.semantq-nav-item {
  position: relative;
}

.semantq-nav-item a {
  text-decoration: none;
  color: #333;
  padding: 10px 15px;
  display: block;
  transition: all 0.2s ease;
  white-space: nowrap;
  border-radius: 4px;
}

.semantq-nav-item a:hover {
  background: #e9ecef;
  color: #007bff;
}

/* Dropdown Indicators */
.semantq-nav-item.has-dropdown > a::after {
  content: '▸';
  margin-left: 8px;
  font-size: 14px;
  transition: transform 0.2s ease;
  display: inline-block;
}

.semantq-nav-item.has-dropdown:hover > a::after {
  transform: rotate(90deg);
}

/* INLINE MODE (Horizontal) */
.semantq-nav-list.inline-parent {
  flex-direction: row;
  gap: 15px;
}

.semantq-nav-list.inline-parent .semantq-nav-item.has-dropdown > ul {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  border: 1px solid #ddd;
  min-width: 200px;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: 0;
  transform: translateY(-10px);
}

.semantq-nav-list.inline-parent .semantq-nav-item.has-dropdown:hover > ul {
  display: block;
  opacity: 1;
  transform: translateY(0);
}

.semantq-nav-list.inline-parent .semantq-nav-item.has-dropdown > ul .semantq-nav-item.has-dropdown > ul {
  top: 0;
  left: 100%;
  margin-left: 1px;
}

/* STACKED MODE (Vertical) */
.semantq-nav-list.stacked-parent {
  flex-direction: column;
  gap: 5px;
}

.semantq-nav-list.stacked-parent .semantq-nav-item.has-dropdown > ul {
  max-height: 0;
  overflow: hidden;
  position: relative;
  border: none;
  margin-left: 15px;
  padding-top: 5px;
  box-shadow: none;
  transition: max-height 0.3s ease-in-out;
  opacity: 1;
  transform: none;
}

.semantq-nav-list.stacked-parent .semantq-nav-item.has-dropdown:hover > ul {
  max-height: 500px;
}

/* MOBILE STYLES */
@media (max-width: 768px) {
  .semantq-nav-list {
    flex-direction: column !important;
    display: none !important;
    gap: 5px;
    width: 100%;
    background: #f8f9fa;
    border-top: 1px solid #ddd;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 999;
  }

  .semantq-menu-toggle:checked ~ .semantq-nav-list {
    display: flex !important;
  }

  .semantq-nav-item.has-dropdown > ul {
    position: static !important;
    margin-left: 20px;
    border-left: 2px solid #ddd !important;
    max-height: 0;
    overflow: hidden;
    background: #e9ecef;
    transition: max-height 0.3s ease-in-out;
  }
  
  .semantq-nav-item.has-dropdown:hover > ul {
    max-height: 500px !important;
  }

  /* Burger Icon */
  .semantq-burger-icon {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 24px;
    cursor: pointer;
    padding: 5px 0;
    z-index: 1001;
  }

  .semantq-burger-icon span {
    width: 100%;
    height: 3px;
    background: #333;
    transition: all 0.3s ease;
    transform-origin: center;
  }

  .semantq-menu-toggle {
    position: absolute;
    opacity: 0;
    height: 0;
    width: 0;
  }

  .semantq-menu-toggle:checked + .semantq-burger-icon span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .semantq-menu-toggle:checked + .semantq-burger-icon span:nth-child(2) {
    opacity: 0;
  }

  .semantq-menu-toggle:checked + .semantq-burger-icon span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }
}

/* Desktop-specific styles */
@media (min-width: 769px) {
  .semantq-burger-icon,
  .semantq-menu-toggle {
    display: none;
  }
  
  .semantq-nav-list {
    display: flex !important;
  }
  
  .semantq-nav-list.inline-parent {
    flex-direction: row !important;
  }
  
  .semantq-nav-list.stacked-parent {
    flex-direction: column !important;
  }
}
</style>
`;

const menuConfig = {
  ...config.semantqNav,
  containerClass: 'semantq-nav-container',
  ulClass: 'semantq-nav-list',
  liClass: 'semantq-nav-item',
  customLinkTexts: {
    '/': 'Home',
    ...config.semantqNav.customLinkTexts
  }
};

const menuHTML = generateMenu(declaredRoutes, fileBasedRoutes, menuConfig);

const semantqNavComponent = `
${semantqNavCss}
@html
${menuHTML}
`;

const outputPath = path.join(config.globalComponents['$global'], 'SemantqNav.smq');
fs.writeFileSync(outputPath, semantqNavComponent, 'utf-8');