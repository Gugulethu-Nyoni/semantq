import fs from 'fs';
import path from 'path';
import config from '../../semantq.config.js';

const generateSitemap = async () => {
  if (!config.sitemap) {
    console.log('Sitemap generation is disabled.');
    return;
  }

  try {
    // Dynamically import routes
    const fileBasedRoutesModule = await import(config.routes.fileBasedRoutes);
    const fileBasedRoutes = fileBasedRoutesModule.default;

    if (!fileBasedRoutes || typeof fileBasedRoutes !== 'object') {
      throw new Error('fileBasedRoutes is not a valid object.');
    }

    const targetHost = config.targetHost;
    const targetHostUrl = new URL(targetHost);
    const targetHostOrigin = targetHostUrl.origin;

    // Get navigation config with defaults
    const {
      excludeRoutes = [],
      includeRoutes = {},
      customLinkTexts = {},
      priorityRoutes = []
    } = config.semantqNav || {};

    // Merge all routes, giving priority to explicitly included routes
    const allRoutes = { ...fileBasedRoutes, ...includeRoutes };

    // Track processed URLs to prevent duplicates
    const processedUrls = new Set();

    // --- XML Sitemap Generation ---
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Process all routes for XML sitemap
    for (const [key, route] of Object.entries(allRoutes)) {
      if (typeof route !== 'string') {
        console.warn(`Skipping invalid route for key "${key}":`, route);
        continue;
      }

      // Skip excluded routes
      if (excludeRoutes.includes(key) || excludeRoutes.includes(route)) {
        continue;
      }

      // Handle URL construction
      let url;
      try {
        // For external URLs, skip if not matching our target host
        if (route.startsWith('http')) {
          const routeUrl = new URL(route);
          if (routeUrl.origin !== targetHostOrigin) {
            continue;
          }
          url = routeUrl.href;
        } else {
          // For internal routes
          url = new URL(
            route === '/' ? '' : route.replace(/^\/+/, '/'), 
            targetHostOrigin
          ).href;
        }
      } catch (e) {
        console.warn(`Invalid URL for route "${key}":`, route);
        continue;
      }

      // Skip if we've already processed this URL
      if (processedUrls.has(url)) continue;
      processedUrls.add(url);

      // Determine priority (higher for priority routes)
      const priority = priorityRoutes.includes(key) ? '1.0' : '0.8';

      xml += `  <url>\n`;
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>${priority}</priority>\n`;
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
    //console.log(`XML sitemap generated at ${xmlSitemapPath}`);

    // --- HTML Sitemap Generation ---
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML Sitemap - ${config.pageTitle}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
    h1 { color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    ul { list-style-type: none; padding: 0; }
    li { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
    a { color: #007BFF; text-decoration: none; font-size: 1.1em; }
    a:hover { text-decoration: underline; }
    .priority { background-color: #f0f8ff; padding: 2px 6px; border-radius: 4px; font-size: 0.8em; color: #0066cc; }
  </style>
</head>
<body>
  <h1>HTML Sitemap</h1>
  <ul>
`;

    // Reset processed URLs for HTML sitemap
    processedUrls.clear();

    // Sort routes with priority routes first
    const sortedRoutes = Object.entries(allRoutes).sort(([keyA], [keyB]) => {
      const isPriorityA = priorityRoutes.includes(keyA);
      const isPriorityB = priorityRoutes.includes(keyB);
      return isPriorityB - isPriorityA;
    });

    for (const [key, route] of sortedRoutes) {
      if (typeof route !== 'string') continue;

      // Skip excluded routes
      if (excludeRoutes.includes(key) || excludeRoutes.includes(route)) {
        continue;
      }

      // Handle URL construction
      let url, displayPath;
      try {
        // Skip external URLs
        if (route.startsWith('http')) {
          const routeUrl = new URL(route);
          if (routeUrl.origin !== targetHostOrigin) continue;
          url = routeUrl.pathname || '/';
          displayPath = routeUrl.pathname || '/';
        } else {
          url = route === '/' ? '/' : `/${route.replace(/^\/+/, '')}`;
          displayPath = url;
        }
      } catch (e) {
        continue;
      }

      // Skip duplicates
      if (processedUrls.has(url)) continue;
      processedUrls.add(url);

      // Get display text
      const displayText = customLinkTexts[key] || 
                         (key === '/' ? 'Home' : 
                         key.startsWith('/') ? key.slice(1) : key);

      // Add priority badge if applicable
      const priorityBadge = priorityRoutes.includes(key) 
        ? ' <span class="priority">Priority</span>' 
        : '';

      html += `    <li><a href="${url}">${displayText}</a>${priorityBadge}</li>\n`;
    }

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
    //console.log(`HTML sitemap generated at ${htmlSitemapPath}`);

    // Generate sitemap.js
    const sitemapJsContent = `import Router from "/build/semantq/router.js";

async function pageJS() {
  // Highlight current page in sitemap
  const currentPath = window.location.pathname;
  document.querySelectorAll('a[href]').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.style.fontWeight = 'bold';
      link.style.color = '#004080';
    }
  });
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
    await pageJS();
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main();
`;

    const sitemapJsPath = path.join(sitemapDir, 'sitemap.js');
    fs.writeFileSync(sitemapJsPath, sitemapJsContent, 'utf8');
    //console.log(`sitemap.js generated at ${sitemapJsPath}`);

  } catch (err) {
    console.error('Error generating sitemaps:', err);
    process.exit(1);
  }
};

export default generateSitemap;