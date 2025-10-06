import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import { signToken } from '../utils/jwt.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['student', 'employer', 'admin']).optional(),
  region: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 */
router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }
  const { email, password, name, role, region } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: 'Бұл email тіркелген' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      region,
      role: role ?? 'student',
    },
  });
  const token = signToken(user.id, user.role);
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login user
 */
router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Қате деректер' });
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Қате деректер' });
  }
  const token = signToken(user.id, user.role);
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
});

export default router;
