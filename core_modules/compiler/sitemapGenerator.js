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

    // Generate XML Sitemap
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const [key, route] of Object.entries(fileBasedRoutes)) {
      if (typeof route !== 'string') {
        console.warn(`Skipping invalid route for key "${key}":`, route);
        continue;
      }

      const normalizedRoute = route.replace(/^\//, ''); // Remove leading slash
      const url = `${targetHost}/${normalizedRoute}`; // Construct the full URL
      xml += `  <url>\n`;
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>\n`;

    // Save XML Sitemap
    const publicDir = path.join(process.cwd(), 'public');
    const xmlSitemapPath = path.join(publicDir, 'sitemap.xml');

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(xmlSitemapPath, xml, 'utf8');
    console.log(`XML sitemap generated successfully at ${xmlSitemapPath}`);

    // Generate HTML Sitemap
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML Sitemap - ${config.pageTitle}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
    h1 { color: #333; }
    ul { list-style-type: none; padding: 0; }
    li { margin: 10px 0; }
    a { color: #007BFF; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>HTML Sitemap</h1>
  <ul>
`;

    for (const [key, route] of Object.entries(fileBasedRoutes)) {
      const normalizedRoute = route.replace(/^\//, '');
      const url = `${targetHost}/${normalizedRoute}`;
      html += `    <li><a href="${url}">${key}</a></li>\n`;
    }

    // Add the script tag before the closing </body> tag
    html += `  </ul>
  <script src="./sitemap.js" type="module"></script>
</body>
</html>`;

    // Save HTML Sitemap
    const sitemapDir = path.join(process.cwd(), 'build/routes/sitemap');
    const htmlSitemapPath = path.join(sitemapDir, 'index.html');

    if (!fs.existsSync(sitemapDir)) {
      fs.mkdirSync(sitemapDir, { recursive: true });
    }

    fs.writeFileSync(htmlSitemapPath, html, 'utf8');
    console.log(`HTML sitemap generated successfully at ${htmlSitemapPath}`);

    // Generate sitemap.js
    const sitemapJsContent = `import Router from "/build/semantq/router.js";

async function pageJS() {
  console.log(Router);
}

async function main() {
  try {
    await new Promise((resolve) => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
      } else {
        resolve();
      }
    });

    console.log("DOM is ready");

    await pageJS();
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main();
`;

    const sitemapJsPath = path.join(sitemapDir, 'sitemap.js');
    fs.writeFileSync(sitemapJsPath, sitemapJsContent, 'utf8');
    console.log(`sitemap.js generated successfully at ${sitemapJsPath}`);
  } catch (err) {
    console.error('Error generating sitemaps:', err);
  }
};

export default generateSitemap;