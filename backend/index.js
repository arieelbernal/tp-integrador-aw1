import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { connectDB } from './config/database.js';
import productsRouter from './routes/products.routes.js';
import usersRouter from './routes/users.routes.js';
import salesRouter from './routes/sales.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.json({
    name: 'tp-integrador-aw1',
    description: 'E-commerce API',
    routes: {
      users: '/api/users',
      products: '/api/products',
      sales: '/api/sales',
    },
  });
});

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/sales', salesRouter);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
