import express from 'express';
import supabase from './supabase.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 4000;


// Get the file path using fileURLToPath
const filePath = fileURLToPath(import.meta.url);
const dirname = path.dirname(filePath);

// Add CORS middleware to allow cross-origin requests
app.use(cors());

// Serve the root directory as static files
app.use(express.static(dirname));

// Serve the ./views folder as static files
app.use(express.static(path.join(dirname, 'views')));

// Serve the directory containing authState.js as static files
app.use(express.static(path.join(dirname, 'path', 'to', 'authState.js')));



// Set up routes for email signup, login, and social authentication
app.get('/signup', (req, res) => {
  // Email signup logic
});

app.get('/login', (req, res) => {
  // Email login logic
});

app.get('/auth/provider', (req, res) => {
  // Social authentication logic
});

// Start the server
app.listen(port, () => console.log(`Server started on http://localhost:${port}`));