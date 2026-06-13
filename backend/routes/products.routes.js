import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

router.get('/', async (req, res) => {
  const query = {};
  
  if (typeof req.query.category === 'string') {
    query.category = req.query.category;
  }

  const products = await Product.find(query);
  return res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);

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

  const newProduct = new Product({
    name,
    description,
    image,
    price,
    stock,
    category,
  });

  await newProduct.save();
  return res.status(201).json(newProduct);
});

router.put('/:id', async (req, res) => {
  const { name, description, image, price, stock, category } = req.body ?? {};
  const updateData = {};

  if (typeof name === 'string') updateData.name = name;
  if (typeof description === 'string') updateData.description = description;
  if (typeof price === 'number') updateData.price = price;
  if (typeof image === 'string') updateData.image = image;
  if (typeof stock === 'number') updateData.stock = stock;
  if (typeof category === 'string') updateData.category = category;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  if (!product) return res.status(404).json({ error: 'Product not found' });
  return res.json(product);
});

router.delete('/:id', async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  
  if (!product) return res.status(404).json({ error: 'Product not found' });
  return res.status(204).send();
});

export default router;
