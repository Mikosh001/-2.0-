import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../../utils/prisma.js';
import { env } from '../../config/env.js';
import { authLimiter } from '../../middleware/rateLimit.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['student', 'employer']).default('student'),
  region: z.string().optional()
});

router.post('/register', authLimiter, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Деректер дұрыс емес', issues: parsed.error.flatten() });
  }
  const { email, password, name, role, region } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: 'Пайдаланушы бар' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, name, role, region }
  });
  const token = jwt.sign(
    { userId: user.id, role: user.role, email: user.email, name: user.name },
    env.jwtSecret,
    { expiresIn: '7d' }
  );
  return res.status(201).json({ token, user: { id: user.id, role: user.role, name: user.name } });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post('/login', authLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Деректер дұрыс емес', issues: parsed.error.flatten() });
  }
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Қате мәлімет' });
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Қате мәлімет' });
  }
  const token = jwt.sign(
    { userId: user.id, role: user.role, email: user.email, name: user.name },
    env.jwtSecret,
    { expiresIn: '7d' }
  );
  return res.json({ token, user: { id: user.id, role: user.role, name: user.name } });
});

export default router;
