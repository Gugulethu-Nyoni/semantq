import path from 'path';
const rootDir = process.cwd();

export default {
  domain: process.env.DOMAIN || 'localhost',
  targetHost: process.env.TARGET_HOST || 'http://localhost:3000',
  pageTitle: 'My Awesome Website',
  metaDescription: 'My Awesome Website',
  metaKeywords: 'Awesome this, awesome that',
  envFilePath: path.join(rootDir, '.env'),
  sitemap: true,
  base: '/',

  components: {
    '$components': path.join(rootDir, 'src/components'),
  },

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
  semantqNav: {
    enable: true,
    containerClass: 'semantq-nav-container',
    ulClass: 'semantq-nav-list',
    liClass: 'semantq-nav-item',
    priorityRoutes: ['/home'],
    excludeRoutes: ['/404'],
    includeRoutes: {
      '/sitemap': '/sitemap',
      '/home': '/'
    },
    hierarchical: true,
    parentMenuDisplay: 'inline', // stacked or inline
    customLinkTexts: {
      badmin: 'User Dashboard',

    },
  },
  };
