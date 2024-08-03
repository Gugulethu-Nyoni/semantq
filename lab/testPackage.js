import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();



// Serve index.html for root URL
app.get('/', (req, res) => {
    res.sendFile(path.join('index.html'), { root: __dirname });
});


// Handle dynamic routes for HTML files in the "semantiq" directory
app.get('/testPackage/*', (req, res) => {
    const page = req.params[0];
    res.sendFile(path.join('testPackage', `${page}`), { root: __dirname });
});

/*

// Handle dynamic routes for HTML files in the "semantiq" directory
app.get('/router/*', (req, res) => {
    const page = req.params[0];
    res.sendFile(path.join('router', `${page}`), { root: __dirname });
});

*/




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
