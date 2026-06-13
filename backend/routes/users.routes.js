import { Router } from 'express';
import User from '../models/User.js';
import Sale from '../models/Sale.js';

const router = Router();

router.get('/', async (req, res) => {
  const users = await User.find().select('-password');
  return res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json(user);
});

router.post('/', async (req, res) => {
  const { name, email, password, phone, address } = req.body ?? {};

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return res.status(400).json({
      error: 'Invalid body. Requires {name, email, password}',
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const newUser = new User({
    name,
    email,
    password,
    phone: phone || '',
    address: address || '',
  });

  await newUser.save();

  const userWithoutPassword = newUser.toObject();
  delete userWithoutPassword.password;
  return res.status(201).json(userWithoutPassword);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (!user.active) {
    return res.status(403).json({ error: 'User account is inactive' });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = user.generateToken();
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  
  return res.json({ user: userWithoutPassword, token });
});

router.put('/:id', async (req, res) => {
  const { name, email, password, phone, address } = req.body ?? {};
  const updateData = {};

  if (typeof name === 'string') updateData.name = name;
  if (typeof email === 'string') updateData.email = email;
  if (typeof password === 'string') updateData.password = password;
  if (typeof phone === 'string') updateData.phone = phone;
  if (typeof address === 'string') updateData.address = address;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  ).select('-password');

  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json(user);
});

router.delete('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const relatedSales = await Sale.find({ userId: req.params.id });
  if (relatedSales.length > 0) {
    return res.status(409).json({
      error: 'Cannot delete user: has associated sales',
      sales: relatedSales.map((v) => v.id),
    });
  }

  await User.findByIdAndDelete(req.params.id);
  return res.status(204).send();
});

export default router;
