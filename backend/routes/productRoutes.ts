import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory
} from '../controllers/productController.ts';
import { protect, authorizeRoles } from '../middleware/authMiddleware.ts';

const router = Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.post('/categories', protect, authorizeRoles('admin'), createCategory);
router.get('/:id', getProductById);
router.post('/', protect, authorizeRoles('admin'), createProduct);
router.put('/:id', protect, authorizeRoles('admin'), updateProduct);
router.delete('/:id', protect, authorizeRoles('admin'), deleteProduct);

export default router;
