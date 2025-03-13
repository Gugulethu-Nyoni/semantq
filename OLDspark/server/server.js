import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(express.json());

// 🔄 Automatically load all routes from the `routes` folder
const routesPath = path.join(__dirname, 'server/routes');
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith('Routes.js')) {
    const route = `./server/routes/${file}`;
    import(route).then((module) => {
      const routeName = file.replace('Routes.js', '').toLowerCase();
      app.use(`/api/${routeName}`, module.default);
      console.log(`✅ Loaded route: /api/${routeName}`);
    }).catch((err) => console.error(`❌ Failed to load ${file}:`, err));
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('🟢 MongoDB connected'))
  .catch(err => console.error('🔴 MongoDB connection error:', err));

// Supabase Connection
export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Default route
app.get('/', (req, res) => res.send('API is running 🚀'));

// Start server
app.listen(PORT, () => console.log(`🟢 Server running on port ${PORT}`));
