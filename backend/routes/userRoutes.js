import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/userController.js';
import authMiddleware from '../middlewares/auth,middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login',authMiddleware, loginUser);
router.post('/logout',authMiddleware, logoutUser);

export default router;
