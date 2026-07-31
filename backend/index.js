import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { connectDB } from './config/database.js';
import productsRouter from './routes/products.routes.js';
import usersRouter from './routes/users.routes.js';
import salesRouter from './routes/sales.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { HttpError } from './utils/httpError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

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

app.use((req, res, next) => {
  next(new HttpError(404, 'Recurso no encontrado'));
});

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
