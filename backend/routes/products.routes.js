import { Router } from 'express';
import { readFile, writeFile } from 'node:fs/promises';

const router = Router();

const productsUrl = new URL('../data/products.json', import.meta.url);

async function readJson(url) {
  const raw = await readFile(url, 'utf8');
  return JSON.parse(raw);
}

async function writeJson(url, data) {
  await writeFile(url, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function nextId(items) {
  const maxId = items.reduce((max, it) => (it.id > max ? it.id : max), 0);
  return maxId + 1;
}

router.get('/', async (req, res) => {
  const products = await readJson(productsUrl);

  if (typeof req.query.category === 'string') {
    return res.json(products.filter((p) => p.category === req.query.category));
  }

  return res.json(products);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const products = await readJson(productsUrl);
  const product = products.find((p) => p.id === id);

  if (!product) return res.status(404).json({ error: 'Product not found' });
  return res.json(product);
});

router.post('/', async (req, res) => {
  const { name, description, image, price, stock, category } = req.body ?? {};

  if (
    typeof name !== 'string' ||
    typeof description !== 'string' ||
    typeof price !== 'number' ||
    typeof image !== 'string' ||
    typeof stock !== 'number' ||
    typeof category !== 'string'
  ) {
    return res.status(400).json({
      error: 'Invalid body. Requires {name, description, image, price, stock, category}',
    });
  }

  const products = await readJson(productsUrl);

  const newProduct = {
    id: nextId(products),
    name,
    description,
    image,
    price,
    stock,
    category,
  };

  products.push(newProduct);
  await writeJson(productsUrl, products);

  return res.status(201).json(newProduct);
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const patch = req.body ?? {};

  const products = await readJson(productsUrl);
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });

  const product = products[idx];

  const updated = {
    ...product,
    ...(typeof patch.name === 'string' ? { name: patch.name } : {}),
    ...(typeof patch.description === 'string' ? { description: patch.description } : {}),
    ...(typeof patch.price === 'number' ? { price: patch.price } : {}),
    ...(typeof patch.image === 'string' ? { image: patch.image } : {}),
    ...(typeof patch.stock === 'number' ? { stock: patch.stock } : {}),
    ...(typeof patch.category === 'string' ? { category: patch.category } : {}),
  };

  products[idx] = updated;
  await writeJson(productsUrl, products);

  return res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const products = await readJson(productsUrl);
  const idx = products.findIndex((p) => p.id === id);
  
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });

  products.splice(idx, 1);
  await writeJson(productsUrl, products);

  return res.status(204).send();
});

export default router;
