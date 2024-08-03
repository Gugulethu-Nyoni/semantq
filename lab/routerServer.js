import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Serve index.html for all routes under /router/*
app.get('/router/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'router', 'index.html'));
});

// Serve index.html for all other routes as well
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
