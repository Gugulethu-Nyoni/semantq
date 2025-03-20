import path from 'path';
const rootDir = process.cwd();

export default {
  domain: process.env.DOMAIN || 'localhost',
  targetHost: process.env.TARGET_HOST || 'https://example.com',
  pageTitle: 'My Awesome Website',
  envFilePath: path.join(rootDir, '.env'),
  sitemap: true,
  base: '/', // Base path for the site (e.g., '/' or '/subdir/')

    globalComponents: {
    '$global': path.join(rootDir, 'src/components/global'),
  },

  lib: {
    '$lib': path.join(rootDir, 'lib'),
  },

  routes: {
    declaredRoutes: path.join(rootDir, 'build/routes/routes.js'),
    fileBasedRoutes: path.join(rootDir, 'build/routes/fileBasedRoutes.js'),
  },

  // New configuration for menu generation
  semantqNav: {
    enable: true, // Enable or disable framework menu generation
    containerClass: 'smq-menu-container', // Class name for the container div
    ulClass: 'smq-menu-list', // Class name for the ul element
    liClass: 'smq-menu-item', // Class name for the li elements
    excludeRoutes: [], // Routes to exclude from the menu
    hierarchical: true, // Enable hierarchical dropdown for nested routes
    customLinkTexts: {}, // e.g.'services/asia': 'Asia',
// 'products/europe': 'Europe Products',
// 'about-us/team': 'Our Team'
  },
};