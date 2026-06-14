import { Router } from 'express';
import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, async (req, res) => {
  const query = { active: true };
  
  if (req.query.userId) {
    query.userId = req.query.userId;
  }

  const sales = await Sale.find(query).populate('userId', 'name email');
  return res.json(sales);
});

router.get('/:id', authenticateToken, async (req, res) => {
  const sale = await Sale.findById(req.params.id).populate('userId', 'name email');

  if (!sale) return res.status(404).json({ error: 'Sale not found' });
  return res.json(sale);
});

router.post('/', authenticateToken, async (req, res) => {
  const { items, total } = req.body ?? {};

  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    typeof total !== 'number'
  ) {
    return res.status(400).json({
      error: 'Invalid body. Requires {items: [{productId, quantity, price}], total}',
    });
  }

  const userId = req.user.userId;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return res.status(404).json({ error: `Product with id ${item.productId} not found` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ 
        error: `Insufficient stock for product ${product.name}` 
      });
    }
  }

  const newSale = new Sale({
    userId,
    items,
    total,
    active: true,
  });

  await newSale.save();

  for (const item of items) {
    await Product.findByIdAndUpdate(
      item.productId,
      { $inc: { stock: -item.quantity } }
    );
  }

  return res.status(201).json(newSale);
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const sale = await Sale.findById(req.params.id);
  if (!sale) return res.status(404).json({ error: 'Sale not found' });

  if (sale.userId.toString() !== req.user.userId) {
    return res.status(403).json({ error: 'You can only cancel your own orders' });
  }

  for (const item of sale.items) {
    await Product.findByIdAndUpdate(
      item.productId,
      { $inc: { stock: item.quantity } }
    );
  }

  sale.active = false;
  await sale.save();

  return res.status(204).send();
});

export default router;
