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

    // Create sitemap directory
    const sitemapDir = path.join(process.cwd(), 'build/routes/sitemap');
    if (!fs.existsSync(sitemapDir)) {
      fs.mkdirSync(sitemapDir, { recursive: true });
    }

    // Save XML Sitemap to the same location as HTML sitemap
    const xmlSitemapPath = path.join(sitemapDir, 'sitemap.xml');
    fs.writeFileSync(xmlSitemapPath, xml, 'utf8');
    //console.log(`XML sitemap generated at ${xmlSitemapPath}`);

    // --- Styled XML Sitemap Viewer Generation ---
    let styledSitemapHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>XML Sitemap - ${config.pageTitle}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      padding: 40px; 
      max-width: 1000px; 
      margin: 0 auto; 
      background: white;
      color: #333;
    }
    h1 { 
      color: #1a1a1a; 
      border-bottom: 2px solid #007cba; 
      padding-bottom: 15px;
      margin-bottom: 30px;
    }
    .url-entry { 
      background: #f8f9fa; 
      margin: 15px 0; 
      padding: 20px; 
      border-radius: 8px;
      border-left: 4px solid #007cba;
    }
    .url-loc { 
      font-size: 1.2em; 
      font-weight: 600; 
      color: #007cba;
      margin-bottom: 10px;
    }
    .url-meta { 
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      margin-top: 10px;
    }
    .meta-item {
      background: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 0.9em;
    }
    .priority-high { color: #d63638; font-weight: bold; }
    .priority-normal { color: #00a32a; }
    .nav-links { 
      margin: 30px 0; 
      display: flex; 
      gap: 15px;
      flex-wrap: wrap;
    }
    .nav-button {
      padding: 10px 20px;
      background: #007cba;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    .nav-button:hover {
      background: #005a87;
    }
    .nav-button.secondary {
      background: #6c757d;
    }
    .nav-button.secondary:hover {
      background: #545b62;
    }
    .info-text {
      background: #e7f3ff;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
      border-left: 4px solid #007cba;
    }
  </style>
</head>
<body>
  <h1>XML Sitemap</h1>
  
  <div class="info-text">
    <strong>About this sitemap:</strong> This is a user-friendly view of our XML sitemap. 
    Search engines should use the <a href="/sitemap.xml">raw XML version</a> for optimal crawling.
  </div>

  <div class="nav-links">
    <a href="/sitemap" class="nav-button">HTML Sitemap</a>
    <a href="/sitemap.xml" class="nav-button secondary">Raw XML Version</a>
    <a href="/" class="nav-button secondary">Back to Home</a>
  </div>

  <div class="sitemap-content">
`;

    // Generate styled URL entries
    const urlEntries = [];
    for (const [key, route] of Object.entries(allRoutes)) {
      if (typeof route !== 'string') continue;

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
        continue;
      }

      // Skip if we've already processed this URL
      if (processedUrls.has(url)) continue;
      processedUrls.add(url);

      // Determine priority (higher for priority routes)
      const priority = priorityRoutes.includes(key) ? '1.0' : '0.8';
      const priorityClass = priority === '1.0' ? 'priority-high' : 'priority-normal';

      urlEntries.push(`
    <div class="url-entry">
      <div class="url-loc">
        <a href="${url}" target="_blank">${url}</a>
      </div>
      <div class="url-meta">
        <div class="meta-item"><strong>Last Modified:</strong> ${new Date().toISOString().split('T')[0]}</div>
        <div class="meta-item"><strong>Change Frequency:</strong> Weekly</div>
        <div class="meta-item"><strong>Priority:</strong> <span class="${priorityClass}">${priority}</span></div>
      </div>
    </div>
      `);
    }

    styledSitemapHTML += urlEntries.join('');
    styledSitemapHTML += `
  </div>

  <div class="nav-links">
    <a href="/sitemap" class="nav-button">HTML Sitemap</a>
    <a href="/sitemap.xml" class="nav-button secondary">Raw XML Version</a>
    <a href="/" class="nav-button secondary">Back to Home</a>
  </div>
</body>
</html>`;

    // Save the styled sitemap page
    const styledSitemapPath = path.join(sitemapDir, 'styled.html');
    fs.writeFileSync(styledSitemapPath, styledSitemapHTML, 'utf8');
    //console.log(`Styled XML sitemap generated at ${styledSitemapPath}`);

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
    .nav-links { margin: 20px 0; display: flex; gap: 10px; }
    .nav-button { padding: 8px 16px; background: #007BFF; color: white; text-decoration: none; border-radius: 4px; }
    .nav-button:hover { background: #0056b3; }
  </style>
</head>
<body>
  <h1>HTML Sitemap</h1>
  
  <div class="nav-links">
    <a href="/sitemap/styled.html" class="nav-button">XML Sitemap View</a>
    <a href="/sitemap.xml" class="nav-button">Raw XML</a>
    <a href="/" class="nav-button">Home</a>
  </div>

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
  
  <div class="nav-links">
    <a href="/sitemap/styled.html" class="nav-button">XML Sitemap View</a>
    <a href="/sitemap.xml" class="nav-button">Raw XML</a>
    <a href="/" class="nav-button">Home</a>
  </div>

  <script src="./sitemap.js" type="module"></script>
</body>
</html>`;

    // Save HTML Sitemap
    const htmlSitemapPath = path.join(sitemapDir, 'index.html');
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