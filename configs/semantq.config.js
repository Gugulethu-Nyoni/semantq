import path from 'path';

const rootDir = process.cwd();

export default {
  domain: process.env.DOMAIN || 'localhost',
  targetHost: process.env.TARGET_HOST || 'https://example.com',
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
    excludeRoutes: [],
    hierarchical: true,
    parentMenuDisplay: 'stacked',
    customLinkTexts: {},
  },

  database: {
    adapter: 'mysql', // can be 'supabase', 'mysql', 'mongodb', 'sqlite'
    config: {
      host: process.env.DB_MYSQL_HOST || 'localhost',
      port: parseInt(process.env.DB_MYSQL_PORT || '3306', 10),
      user: process.env.DB_MYSQL_USER || 'root',
      password: process.env.DB_MYSQL_PASSWORD || 'your_mysql_password',
      database: process.env.DB_MYSQL_NAME || 'your_database_name',
      connectionLimit: parseInt(process.env.DB_MYSQL_POOL_LIMIT || '10', 10),
      waitForConnections: true,
      queueLimit: 0,
    },
  },

  supabase: {
    config: {
      url: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
      anonKey: process.env.SUPABASE_ANON_KEY || 'your_supabase_anon_key',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_supabase_service_role_key',
      dbConnectionString:
        process.env.SUPABASE_DB_CONNECTION_STRING || 'postgresql://user:pass@host:5432/dbname',
      cliAccessToken: process.env.SUPABASE_CLI_ACCESS_TOKEN || 'your_supabase_cli_token',
      projectId: process.env.SUPABASE_PROJECT_ID || 'your_supabase_project_id',
    },
  },

  email: {
    config: {
      resend: {
        apiKey: process.env.RESEND_API_KEY || 'your_resend_api_key',
      },
    },
  },

  server: {
    port: 3002,
  },

  packages: {
    autoMount: true,
  },
};
