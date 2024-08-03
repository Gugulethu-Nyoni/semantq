import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios'; // Add axios for making requests to external APIs

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Parse JSON bodies in requests
app.use(express.json());

// Serve index.html for root URL
app.get('/', (req, res) => {
    res.sendFile(path.join('index.html'), { root: __dirname });
});

// Handle dynamic routes for HTML files in the "semantiq" directory
app.get('/apiProxy/*', (req, res) => {
    const page = req.params[0];
    res.sendFile(path.join('docs', `${page}`), { root: __dirname });
});

// Handle API requests
app.all('/api', (req, res) => {
    const { method, endPoint, queryParams, body } = req.body;
    const url = `${endPoint}${Object.keys(queryParams).length ? '?' : ''}${new URLSearchParams(queryParams).toString()}`;

    axios({
        method,
        url,
        data: body,
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error making API request' });
        });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});