/**
 * AppConfig
 * 
 * Application runtime configuration object.
 * 
 * ENV can either be set dynamically based on the window location
 * or manually for testing/dev purposes by assigning a fixed value:
 * 
 * Example:
 *   ENV: 'development'
 *   ENV: 'production'
 * 
 * BASE_URLS can also be customized with different backend endpoints
 * as needed (e.g., using 127.0.0.1 instead of localhost, or pointing
 * to a staging server):
 * 
 * Example:
 *   BASE_URLS: {
 *     development: 'http://localhost:3003',
 *     production: 'https://api.botaniqsa.com'
 *   }
 */
const AppConfig = {
  ENV: (typeof window !== 'undefined' && window.location.hostname.includes('localhost'))
    ? 'development'
    : 'production',

  BASE_URLS: {
    development: 'http://localhost:3003/@semantq/auth',
    production: 'https://example.com'
  },

  DASHBOARD: 'dashboard',

  /**
   * Returns the base API URL for the current environment
   */
  get BASE_URL() {
    return this.BASE_URLS[this.ENV] || this.BASE_URLS.development;
  }
};

export default AppConfig;
