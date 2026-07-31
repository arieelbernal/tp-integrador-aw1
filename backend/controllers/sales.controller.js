import * as salesService from '../services/sales.service.js';

export async function getAllSales(req, res, next) {
  try {
    const sales = await salesService.listSales(req.query.userId);
    return res.json(sales);
  } catch (err) {
    return next(err);
  }
}

export async function getSaleById(req, res, next) {
  try {
    const sale = await salesService.getSaleById(req.params.id);
    return res.json(sale);
  } catch (err) {
    return next(err);
  }
}

export async function createSale(req, res, next) {
  try {
    const { items, total } = req.body ?? {};
    const sale = await salesService.createSale(req.user.userId, items, total);
    return res.status(201).json(sale);
  } catch (err) {
    return next(err);
  }
}

export async function updateSale(req, res, next) {
  try {
    const sale = await salesService.updateSale(req.params.id, req.user.userId, req.body);
    return res.json(sale);
  } catch (err) {
    return next(err);
  }
}

export async function cancelSale(req, res, next) {
  try {
    await salesService.cancelSale(req.params.id, req.user.userId);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}
