import { Router } from 'express';
import {
  getAssignedOrders,
  updateLocation,
  updateDeliveryStatus,
  getDeliveryByOrderId
} from '../controllers/deliveryController.ts';
import { protect, protectOptional, authorizeRoles } from '../middleware/authMiddleware.ts';

const router = Router();

router.get('/assigned', protect, authorizeRoles('delivery', 'admin'), getAssignedOrders);
router.post('/location', protect, authorizeRoles('delivery', 'admin'), updateLocation);
router.post('/status', protect, authorizeRoles('delivery', 'admin'), updateDeliveryStatus);
router.get('/track/:orderId', protectOptional, getDeliveryByOrderId);

export default router;
