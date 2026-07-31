import Product from '../models/Product.js';
import Sale from '../models/Sale.js';
import { HttpError } from '../utils/httpError.js';

export async function listProducts(category) {
  const query = {};

  if (typeof category === 'string') {
    query.category = category;
  }

  return Product.find(query);
}

export async function getProductById(id) {
  const product = await Product.findById(id);
  if (!product) throw new HttpError(404, 'Producto no encontrado');
  return product;
}

export async function createProduct(data) {
  const { name, description, image, price, stock, category } = data ?? {};

  if (
    typeof name !== 'string' ||
    typeof description !== 'string' ||
    typeof price !== 'number' ||
    typeof image !== 'string' ||
    typeof stock !== 'number' ||
    typeof category !== 'string'
  ) {
    throw new HttpError(400, 'Datos inválidos. Se requieren los campos: name, description, image, price, stock, category');
  }

  const newProduct = new Product({ name, description, image, price, stock, category });
  await newProduct.save();
  return newProduct;
}

export async function updateProduct(id, data) {
  const { name, description, image, price, stock, category } = data ?? {};
  const updateData = {};

  if (typeof name === 'string') updateData.name = name;
  if (typeof description === 'string') updateData.description = description;
  if (typeof price === 'number') updateData.price = price;
  if (typeof image === 'string') updateData.image = image;
  if (typeof stock === 'number') updateData.stock = stock;
  if (typeof category === 'string') updateData.category = category;

  const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
  if (!product) throw new HttpError(404, 'Producto no encontrado');
  return product;
}

export async function deleteProduct(id) {
  const product = await Product.findById(id);
  if (!product) throw new HttpError(404, 'Producto no encontrado');

  const relatedSales = await Sale.find({ 'items.productId': id });
  if (relatedSales.length > 0) {
    throw new HttpError(409, 'No se puede eliminar el producto: tiene ventas asociadas', {
      sales: relatedSales.map((v) => v.id),
    });
  }

  await Product.findByIdAndDelete(id);
}
