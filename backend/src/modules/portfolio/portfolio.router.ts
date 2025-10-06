import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../../middleware/auth.js';
import { prisma } from '../../utils/prisma.js';

const router = Router();

router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { badges: true, enrollments: { include: { course: true } } }
  });
  res.json(user);
});

router.put('/me', requireAuth, async (req, res) => {
  const schema = z.object({
    portfolioUrl: z
      .union([z.string().url(), z.string().min(3)])
      .optional(),
    region: z.string().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Қате деректер', issues: parsed.error.flatten() });
  }
  const updated = await prisma.user.update({ where: { id: req.user!.id }, data: parsed.data });
  res.json(updated);
});

router.get('/public/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      name: true,
      region: true,
      portfolioUrl: true,
      badges: true
    }
  });
  if (!user) {
    return res.status(404).json({ message: 'Профиль жоқ' });
  }
  res.json(user);
});

export default router;
