import * as fs from 'fs';
import * as path from 'path';
import config from '../../semantq.config.js';

const fileBasedRoutes = await import(config.routes.fileBasedRoutes).then(module => module.default || module);
const declaredRoutes = await import(config.routes.declaredRoutes).then(module => module.default || module);


// generateMenu.js
function generateMenu(routes = {}, config = {}) {
 if (!config || config.enable === false) return '';

 // Helper to detect full canonical URLs (moved up)
 const isFullUrl = (url) => url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');


 // --- helpers ---
 const capWords = (s = '') =>
  s
   .replace(/[-_]/g, ' ')
   .split(' ')
   .filter(Boolean)
   .map(w => w.charAt(0).toUpperCase() + w.slice(1))
   .join(' ');

 const isExcluded = path =>
  (config.excludeRoutes || []).some(ex => {
   if (ex === '/') return path === '/';
   return path === ex || path.startsWith(ex + '/');
  });

 // clone so we don't mutate caller's object
 const normalizedRoutes = { ...routes };

 // merge includeRoutes (always add/override; includeRoutes take precedence)
 if (config.includeRoutes) {
  for (const [k, v] of Object.entries(config.includeRoutes)) {
   normalizedRoutes[k] = v;
  }
 }

 // decide which paths to include:
 const includedPaths = Object.keys(normalizedRoutes).filter(path => {
  if (config.includeRoutes && Object.prototype.hasOwnProperty.call(config.includeRoutes, path)) return true;
  return !isExcluded(path);
 });

 // priorityRoutes used globally for ordering within lists
 const priorityRoutes = Array.isArray(config.priorityRoutes) ? config.priorityRoutes : [];

 // Sort includedPaths so higher-level building is stable (priority first, then alpha)
 includedPaths.sort((a, b) => {
  const ai = priorityRoutes.indexOf(a);
  const bi = priorityRoutes.indexOf(b);
  if (ai !== -1 && bi === -1) return -1;
  if (bi !== -1 && ai === -1) return 1;
  if (ai !== -1 && bi !== -1) return ai - bi;
  return a.localeCompare(b);
 });

 // --- build tree structure keyed by last-segment ---
 // special-case the root path '/' into a distinct key '__root'
 const tree = {};
 includedPaths.forEach(path => {
    const href = normalizedRoutes[path];

  if (path === '/') {
   // root node stored at __root so it doesn't collide with real segments
   tree['__root'] = { __path: '/', __href: href || '/' };
   return;
  }
    
    // 🛑 FINAL SURGICAL FIX: Handle external URLs without splitting 🛑
    if (isFullUrl(href)) {
        // External URLs are treated as flat items at the root level of the menu.
        // We use the *path* key (e.g., 'https://github.com/yourrepo') to derive the menu segment name.
        // Split by '/' to get segments, filter empty, then use the last segment as the key.
        const parts = path.split('/').filter(Boolean);
        const menuKey = parts.length > 0 ? parts.pop() : 'external-link'; 
        
        // Add the node directly to the root of the tree
        tree[menuKey] = { __path: path, __href: href };
        return; // Skip the regular traversal logic
    }
    // 🛑 END FINAL SURGICAL FIX 🛑
    
    // Original logic for internal, file-based/declared routes
  const parts = path.split('/').filter(Boolean);
  let current = tree;
  parts.forEach((part, idx) => {
   const nodePath = '/' + parts.slice(0, idx + 1).join('/');
   if (!current[part]) {
    // In generateMenu function, modify the href handling:
    const nodeHref = Object.prototype.hasOwnProperty.call(normalizedRoutes, nodePath)
     ? normalizedRoutes[nodePath]
     : nodePath; // Use the path itself if no specific route mapping exists

    current[part] = { __path: nodePath, __href: nodeHref };
   }
   current = current[part];
  });
 });

 // sortedKeys respects priorityRoutes by comparing each node's __path
 const sortedKeys = obj => Object.keys(obj)
  .filter(k => !k.startsWith('__'))
  .sort((a, b) => {
   const pa = obj[a] && obj[a].__path ? obj[a].__path : '';
   const pb = obj[b] && obj[b].__path ? obj[b].__path : '';
   const ai = priorityRoutes.indexOf(pa);
   const bi = priorityRoutes.indexOf(pb);
   if (ai !== -1 && bi === -1) return -1;
   if (bi !== -1 && ai === -1) return 1;
   if (ai !== -1 && bi !== -1) return ai - bi;
   return a.localeCompare(b);
  });

 // ensure __root is returned first if present and prioritized
 function sortedKeysWithRoot(obj) {
  const keys = [];
  if (obj['__root']) {
   // treat root as a logical item: we want it first if included in priorityRoutes or generally first
   const rootPath = obj['__root'].__path; // '/'
   const rootPriorityIndex = priorityRoutes.indexOf(rootPath);
   // if root explicitly prioritized and at position 0 we still want it first; else still include it before others
   keys.push('__root');
  }
  return keys.concat(sortedKeys(obj));
 }

 // flatten tree (pre-order), using sortedKeys so priority is kept
 function flattenTree(obj, out = []) {
  const keys = sortedKeysWithRoot(obj);
  for (const key of keys) {
   const node = obj[key];
   // skip if malformed
   if (!node || !node.__href) continue;
   // key for display: use special name for root
   const displayKey = key === '__root' ? 'home' : key;
   out.push({ key: displayKey, href: node.__href, path: node.__path });
   // descend (use child keys)
   const childKeys = sortedKeys(node);
   if (childKeys.length) {
    const childObj = {};
    for (const ck of childKeys) childObj[ck] = node[ck];
    flattenTree(childObj, out);
   }
  }
  return out;
 }

 // recursive renderer for hierarchical menus
 function buildNestedList(obj, depth = 0) {
  const ulClass = `${config.ulClass || 'nav-list'} ${config.parentMenuDisplay || 'stacked'}${depth > 0 ? ' submenu' : ''}`;
  let html = `<ul class="${ulClass}">`;
  const keys = sortedKeysWithRoot(obj);
  for (const key of keys) {
   const node = obj[key];
   if (!node) continue;
   const isRoot = key === '__root';
   const nodeKeyForText = isRoot ? 'home' : key;
   const text = (config.customLinkTexts && config.customLinkTexts[nodeKeyForText]) ? config.customLinkTexts[nodeKeyForText] : capWords(nodeKeyForText);
   const childKeys = sortedKeys(node);
   const hasChildren = childKeys.length > 0;
   const liClasses = [config.liClass || 'nav-item'];
   if (hasChildren) liClasses.push('has-children');

   html += `<li class="${liClasses.join(' ')}">`;
   html += `<a href="${node.__href}">${text}</a>`;

   if (hasChildren) {
    html += buildNestedList(node, depth + 1);
   }
   html += `</li>`;
  }
  html += `</ul>`;
  return html;
 }

 // --- final assembly ---
 let content = '';
 if (config.hierarchical) {
  content = buildNestedList(tree, 0);
 } else {
  const flat = flattenTree(tree, []);
  // If priorityRoutes includes the root '/', we already ensured root is first in flattenTree order
  const ulClass = `${config.ulClass || 'nav-list'} ${config.parentMenuDisplay || 'stacked'}`;
  content = `<ul class="${ulClass}">`;
  for (const item of flat) {
   // item.key is 'home' for root; respects customLinkTexts
   const text = (config.customLinkTexts && config.customLinkTexts[item.key]) ? config.customLinkTexts[item.key] : capWords(item.key);
   content += `<li class="${config.liClass || 'nav-item'}"><a href="${item.href}">${text}</a></li>`;
  }
  content += `</ul>`;
 }

 return `<nav class="${config.containerClass || 'nav-container'}">${content}</nav>`;
}


const menuHTML = generateMenu(fileBasedRoutes, config.semantqNav);
//console.log(menuHTML);



const semantqNavCss = `
  @style
/* semantq-nav.css - responsive navigation with infinite dropdowns */
:root {
  /* Navigation-specific variables with global.css fallbacks */
  --nav-font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif);
  --nav-color-text: var(--color-secondary, #e558a4);
  --nav-color-bg: var(--color-light, #ffffff);
  --nav-color-hover: var(--color-light-semi, #f2f2f2);
  --nav-color-border: var(--color-light-semi, #e6e6e6);
  --nav-shadow: var(--shadow-primary, 0 6px 18px rgba(0,0,0,0.08));
  --nav-transition: var(--transition-base, all 0.3s ease);
  --nav-radius: var(--radius-medium, 12px);
}

.semantq-nav-container {
  width: 100%;
  font-family: var(--nav-font-family);
  position: relative;
}

.semantq-nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.semantq-nav-item {
  position: relative;
}

.semantq-nav-item a {
  display: block;
  padding: 10px 14px;
  color: var(--nav-color-text);
  text-decoration: none;
  transition: var(--nav-transition);
}

.semantq-nav-item a:hover {
  background: var(--nav-color-hover);
}

/* Stacked (Vertical) */
.semantq-nav-list.stacked {
  display: block;
}

.semantq-nav-list.stacked > .semantq-nav-item {
  border-bottom: 1px solid var(--nav-color-border);
}

/* Inline (Horizontal) */
.semantq-nav-list.inline {
  display: flex;
  gap: 4px;
  align-items: center;
}

.semantq-nav-list.inline > .semantq-nav-item {
  border-right: 1px solid var(--nav-color-border);
}

.semantq-nav-list.inline > .semantq-nav-item:last-child {
  border-right: none;
}

/* Submenu Base */
.semantq-nav-list .submenu {
  display: none;
  margin: 0;
  padding: 0;
}

/* Stacked Submenu */
.semantq-nav-list.stacked .submenu {
  padding-left: 12px;
}

/* Inline Submenu - Dropdown */
.semantq-nav-list.inline .submenu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background: var(--nav-color-bg);
  box-shadow: var(--nav-shadow);
  z-index: 999;
  border-radius: var(--nav-radius);
}

/* Active States (unchanged structure) */
.semantq-nav-list.stacked .semantq-nav-item:hover > .submenu,
.semantq-nav-list.stacked .semantq-nav-item:focus-within > .submenu,
.semantq-nav-list.inline .semantq-nav-item:hover > .submenu,
.semantq-nav-list.inline .semantq-nav-item:focus-within > .submenu {
  display: block;
}

/* Nested Submenus */
.semantq-nav-list.inline .submenu .submenu {
  top: 0;
  left: 100%;
}

/* Items with Children */
.has-children > a {
  position: relative;
  padding-right: 28px;
}

/* Arrow Indicator */
.has-children > a::after {
  content: '▾';
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8em;
  transition: var(--nav-transition);
  pointer-events: none;
}

.has-children.open > a::after {
  transform: translateY(-50%) rotate(-180deg);
}

/* Burger Menu */
.burger {
  display: none;
  border: none;
  background: transparent;
  padding: 12px 8px;
  cursor: pointer;
  margin-left: auto;
}

.burger .bar {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--nav-color-text);
  margin: 4px 0;
  transition: var(--nav-transition);
}

/* Mobile Styles (fully preserved) */
@media (max-width: 768px) {
  .semantq-nav-container {
    display: flex;
    flex-direction: column;
  }
  
  .semantq-nav-list.inline, 
  .semantq-nav-list.stacked {
    display: none;
    flex-direction: column;
    gap: 0;
    width: 100%;
  }

  .semantq-nav-container.mobile-open .semantq-nav-list.inline,
  .semantq-nav-container.mobile-open .semantq-nav-list.stacked {
    display: flex;
  }

  .burger { 
    display: block; 
  }

  .burger.active .bar:nth-child(1) {
    transform: translateY(6px) rotate(45deg);
  }
  .burger.active .bar:nth-child(2) {
    opacity: 0;
  }
  .burger.active .bar:nth-child(3) {
    transform: translateY(-6px) rotate(-45deg);
  }

  .semantq-nav-list.inline .submenu,
  .semantq-nav-list.stacked .submenu {
    position: static;
    box-shadow: none;
    padding-left: 20px;
  }

  .semantq-nav-list.inline > .semantq-nav-item {
    border-right: none;
    border-bottom: 1px solid var(--nav-color-border);
  }

  .semantq-nav-item a { 
    padding: 14px 16px; 
  }
  
  .semantq-nav-list.inline, 
  .semantq-nav-list.stacked {
    transition: max-height 0.3s ease, opacity 0.2s ease;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
  }
  
  .semantq-nav-container.mobile-open .semantq-nav-list.inline,
  .semantq-nav-container.mobile-open .semantq-nav-list.stacked {
    max-height: 1000px;
    opacity: 1;
  }
}
  @end
`;

const menuJS = `
@script
// Mobile burger menu toggle
// Initialize the navigation system
function initResponsiveNavigation() {
  // Create and setup burger menu
  function initBurgerMenu() {
    const container = document.querySelector('.semantq-nav-container');
    if (!container) return;

    const burger = document.createElement('button');
    burger.className = 'burger';
    burger.innerHTML = \`
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    \`;
    
    burger.addEventListener('click', () => {
      container.classList.toggle('mobile-open');
      burger.classList.toggle('active');
    });

    container.insertBefore(burger, container.firstChild);
  }

  // Initialize dropdown functionality
  function initDropdowns() {
    const container = document.querySelector('.semantq-nav-container');
    if (!container) return;

    const dropdownParents = container.querySelectorAll('.has-children');
    
    dropdownParents.forEach(parent => {
      const link = parent.querySelector('a');
      if (link) {
        link.addEventListener('click', function(e) {
          // On mobile, prevent default for parents with submenus
          if (window.innerWidth <= 768 && parent.querySelector('.submenu')) {
            e.preventDefault();
            parent.classList.toggle('open');
          }
        });
      }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      if (!container.contains(e.target)) {
        dropdownParents.forEach(parent => {
          parent.classList.remove('open');
        });
      }
    });
  }

  // Handle window resize
  function handleResize() {
    if (window.innerWidth > 768) {
      const container = document.querySelector('.semantq-nav-container');
      if (container) {
        container.classList.remove('mobile-open');
        const burger = container.querySelector('.burger');
        if (burger) burger.classList.remove('active');
      }
    }
  }

  // Initialize everything
  initBurgerMenu();
  initDropdowns();
  window.addEventListener('resize', handleResize);
}

// Initialize when DOM is loaded
$onMount(() => {
  initResponsiveNavigation();
});

@end
`;


const semantqNavComponent = `
${menuJS}
${semantqNavCss}
@html
${menuHTML}
`;

const outputPath = path.join(config.globalComponents['$global'], 'SemantqNav.smq');
fs.writeFileSync(outputPath, semantqNavComponent, 'utf-8');


