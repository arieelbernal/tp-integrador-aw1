import { Router } from 'express';
import { readFile, writeFile } from 'node:fs/promises';

const router = Router();

const usersUrl = new URL('../data/users.json', import.meta.url);
const salesUrl = new URL('../data/sales.json', import.meta.url);

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
  const users = await readJson(usersUrl);
  return res.json(users);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const users = await readJson(usersUrl);
  const user = users.find((u) => u.id === id);

  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const { password, ...userWithoutPassword } = user;
  return res.json(userWithoutPassword);
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

  const users = await readJson(usersUrl);

  if (users.some((u) => u.email === email)) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const newUser = {
    id: nextId(users),
    name,
    email,
    password,
    phone: phone || '',
    address: address || '',
    active: true,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeJson(usersUrl, users);

  const { password: _, ...userWithoutPassword } = newUser;
  return res.status(201).json(userWithoutPassword);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const users = await readJson(usersUrl);
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (user.active === false) {
    return res.status(403).json({ error: 'User account is inactive' });
  }

  const { password: _, ...userWithoutPassword } = user;
  return res.json(userWithoutPassword);
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const patch = req.body ?? {};

  const users = await readJson(usersUrl);
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });

  const user = users[idx];

  const updated = {
    ...user,
    ...(typeof patch.name === 'string' ? { name: patch.name } : {}),
    ...(typeof patch.email === 'string' ? { email: patch.email } : {}),
    ...(typeof patch.password === 'string' ? { password: patch.password } : {}),
    ...(typeof patch.phone === 'string' ? { phone: patch.phone } : {}),
    ...(typeof patch.address === 'string' ? { address: patch.address } : {}),
  };

  users[idx] = updated;
  await writeJson(usersUrl, users);

  const { password: _, ...userWithoutPassword } = updated;
  return res.json(userWithoutPassword);
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  const [users, sales] = await Promise.all([
    readJson(usersUrl),
    readJson(salesUrl),
  ]);

  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const relatedSales = sales.filter((v) => v.userId === id);
  if (relatedSales.length > 0) {
    return res.status(409).json({
      error: 'Cannot delete user: has associated sales',
      sales: relatedSales.map((v) => v.id),
    });
  }

  const updatedUsers = users.filter((u) => u.id !== id);
  await writeJson(usersUrl, updatedUsers);

  return res.status(204).send();
});

export default router;
