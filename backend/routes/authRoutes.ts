import { Router } from 'express';
import { registerUser, loginUser, getMe, getAllUsers, updateProfile } from '../controllers/authController.ts';
import { protect, authorizeRoles } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, authorizeRoles('admin'), getAllUsers);

export default router;
