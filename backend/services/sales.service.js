import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { HttpError } from '../utils/httpError.js';

export async function listSales(userId) {
  const query = { active: true };

  if (userId) {
    query.userId = userId;
  }

  return Sale.find(query).populate('userId', 'name email');
}

export async function getSaleById(id) {
  const sale = await Sale.findById(id).populate('userId', 'name email');
  if (!sale) throw new HttpError(404, 'Venta no encontrada');
  return sale;
}

export async function createSale(userId, items, total) {
  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    typeof total !== 'number'
  ) {
    throw new HttpError(400, 'Datos inválidos. Se requieren los campos: items: [{productId, quantity, price}], total');
  }

  const user = await User.findById(userId);
  if (!user) throw new HttpError(404, 'Usuario no encontrado');

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new HttpError(404, `No se encontró el producto con id ${item.productId}`);
    }
    if (product.stock < item.quantity) {
      throw new HttpError(400, `Stock insuficiente para el producto ${product.name}`);
    }
  }

  const newSale = new Sale({ userId, items, total, active: true });
  await newSale.save();

  for (const item of items) {
    await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
  }

  return newSale;
}

export async function updateSale(id, userId, data) {
  const sale = await Sale.findById(id);
  if (!sale) throw new HttpError(404, 'Venta no encontrada');

  if (sale.userId.toString() !== userId) {
    throw new HttpError(403, 'Solo podés actualizar tus propios pedidos');
  }

  if (!sale.active) {
    throw new HttpError(400, 'No se puede actualizar un pedido cancelado');
  }

  const { items, total } = data ?? {};

  if (items !== undefined) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new HttpError(400, 'Datos inválidos. items debe ser un arreglo no vacío');
    }

    const reserved = new Map();
    for (const item of sale.items) {
      reserved.set(item.productId.toString(), item.quantity);
    }

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new HttpError(404, `No se encontró el producto con id ${item.productId}`);
      }
      const availableStock = product.stock + (reserved.get(item.productId.toString()) || 0);
      if (availableStock < item.quantity) {
        throw new HttpError(400, `Stock insuficiente para el producto ${product.name}`);
      }
    }

    for (const item of sale.items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
    }
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    sale.items = items;
  }

  if (total !== undefined) {
    if (typeof total !== 'number') {
      throw new HttpError(400, 'total debe ser un número');
    }
    sale.total = total;
  }

  await sale.save();
  return sale;
}

export async function cancelSale(id, userId) {
  const sale = await Sale.findById(id);
  if (!sale) throw new HttpError(404, 'Venta no encontrada');

  if (sale.userId.toString() !== userId) {
    throw new HttpError(403, 'Solo podés cancelar tus propios pedidos');
  }

  for (const item of sale.items) {
    await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
  }

  sale.active = false;
  await sale.save();
}
