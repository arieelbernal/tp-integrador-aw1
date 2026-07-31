import * as productsService from '../services/products.service.js';

export async function getAllProducts(req, res, next) {
  try {
    const products = await productsService.listProducts(req.query.category);
    return res.json(products);
  } catch (err) {
    return next(err);
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await productsService.getProductById(req.params.id);
    return res.json(product);
  } catch (err) {
    return next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = await productsService.createProduct(req.body);
    return res.status(201).json(product);
  } catch (err) {
    return next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await productsService.updateProduct(req.params.id, req.body);
    return res.json(product);
  } catch (err) {
    return next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    await productsService.deleteProduct(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}
