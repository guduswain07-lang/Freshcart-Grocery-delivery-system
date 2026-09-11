import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  assignDeliveryPartner,
  getDashboardStats
} from '../controllers/orderController.ts';
import { protect, protectOptional, authorizeRoles } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/', protectOptional, createOrder);
router.get('/my-orders', protectOptional, getMyOrders);
router.get('/stats', protect, authorizeRoles('admin'), getDashboardStats);
router.get('/all', protect, authorizeRoles('admin'), getAllOrders);
router.get('/:id', protectOptional, getOrderById);
router.put('/:id/status', protect, updateOrderStatus);
router.put('/:id/assign', protect, authorizeRoles('admin'), assignDeliveryPartner);

export default router;
