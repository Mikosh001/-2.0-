import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, register } from '../controllers/authController';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

export default router;
