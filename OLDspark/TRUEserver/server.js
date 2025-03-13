import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import errorHandler from './utils/errorHandler.js';
import net from 'net';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use(errorHandler);

// Check if port 3000 is available
const server = net.createServer();

server.once('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`⚠️  Port ${port} is already in use. Server not started.`);
    process.exit(1);
  } else {
    console.error('Unexpected error:', err);
  }
});

server.once('listening', () => {
  server.close(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  });
});

// Attempt to bind to the port
server.listen(port);
