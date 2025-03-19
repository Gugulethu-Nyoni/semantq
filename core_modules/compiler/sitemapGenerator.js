import fs from 'fs';
import path from 'path';
import config from '../../semantq.config.js';

const generateSitemap = async () => {
  // Check if sitemap generation is enabled
  if (!config.sitemap) {
    console.log('Sitemap generation is disabled.');
    return;
  }

  try {
    // Dynamically import the fileBasedRoutes module
    const fileBasedRoutesModule = await import(config.routes.fileBasedRoutes);
    console.log('Imported fileBasedRoutes module:', fileBasedRoutesModule);

    // Access the default export
    const fileBasedRoutes = fileBasedRoutesModule.default;
    console.log('fileBasedRoutes:', JSON.stringify(fileBasedRoutes, null, 2));

    // Check if fileBasedRoutes is defined
    if (!fileBasedRoutes || typeof fileBasedRoutes !== 'object') {
      throw new Error('fileBasedRoutes is not a valid object.');
    }

    // Get the target host from the config
    const targetHost = config.targetHost;

    // Start building the XML structure
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Iterate through the fileBasedRoutes object
    for (const [key, route] of Object.entries(fileBasedRoutes)) {
      // Ensure the route is a string
      if (typeof route !== 'string') {
        console.warn(`Skipping invalid route for key "${key}":`, route);
        continue;
      }

      // Normalize the route by removing leading slashes
      const normalizedRoute = route.replace(/^\//, ''); // Remove leading slash
      const url = `${targetHost}/${normalizedRoute}`; // Construct the full URL
      xml += `  <url>\n`;
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`; // Use current date as last modified
      xml += `    <changefreq>weekly</changefreq>\n`; // Change frequency
      xml += `    <priority>0.8</priority>\n`; // Priority
      xml += `  </url>\n`;
    }

    xml += `</urlset>\n`;

    // Define the path to save the sitemap
    const publicDir = path.join(process.cwd(), 'public');
    const sitemapPath = path.join(publicDir, 'sitemap.xml');

    // Ensure the public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Save the sitemap file
    fs.writeFileSync(sitemapPath, xml, 'utf8');
    console.log(`Sitemap generated successfully at ${sitemapPath}`);
  } catch (err) {
    console.error('Error generating sitemap:', err);
  }
};

export default generateSitemap;