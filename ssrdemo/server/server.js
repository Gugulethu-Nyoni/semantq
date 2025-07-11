import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files (like index.html and client.js)
app.use(express.static(path.join(__dirname, 'public')));

// Hardcoded product data
const products = [
  { id: 1, name: 'Product A', price: 100 },
  { id: 2, name: 'Product B', price: 150 },
  { id: 3, name: 'Product C', price: 200 }
];

// SSR route for /products
app.get('/products', (req, res) => {
  let productListHTML = '<ul>';
  products.forEach(product => {
    productListHTML += `<li>${product.name} - R${product.price}</li>`;
  });
  productListHTML += '</ul>';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>SSR Product List</title>
      </head>
      <body>
        <h1>Server Rendered Product List</h1>
        ${productListHTML}
        <p><a href="/">Back to Home</a></p>

        <script src="/client.js"></script>
      </body>
    </html>
  `;
  res.send(html);
});

// Start server
app.listen(3000, () => {
  console.log('✅ SSR server running at http://localhost:3000');
});

