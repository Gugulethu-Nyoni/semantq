import path from 'path';
const rootDir = process.cwd();

export default {
  domain: process.env.DOMAIN || 'localhost', // Local development domain
  targetHost: process.env.TARGET_HOST || 'https://example.com', // Live production domain
  pageTitle: 'My Awesome Website', // Default page title
  envFilePath: path.join(rootDir, '.env'), // Path to the .env file in the root of the project

  routes: {
    declaredRoutes: path.join(rootDir, 'build/routes/routes.js'),
    fileBasedRoutes: path.join(rootDir, 'build/routes/fileBasedRoutes.js'),
  },

  globalComponents: {
    '$global': path.join(rootDir, 'src/components/global'),
  },

  lib: {
    '$lib': path.join(rootDir, 'lib'),
  },
};