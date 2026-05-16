import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import productsRouter from './routes/products.routes.js';
import usersRouter from './routes/users.routes.js';
import salesRouter from './routes/sales.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

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
