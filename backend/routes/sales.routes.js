import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import * as salesController from '../controllers/sales.controller.js';

const router = Router();

router.get('/', authenticateToken, salesController.getAllSales);
router.get('/:id', authenticateToken, salesController.getSaleById);
router.post('/', authenticateToken, salesController.createSale);
router.put('/:id', authenticateToken, salesController.updateSale);
router.delete('/:id', authenticateToken, salesController.cancelSale);

export default router;
