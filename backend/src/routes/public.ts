import { Router } from 'express';
import { prisma } from '../config/prisma.js';

const router = Router();

router.get('/u/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: { id: true, name: true, region: true, badges: true, portfolioUrl: true },
  });
  if (!user) return res.status(404).json({ message: 'Профиль табылмады' });
  res.json(user);
});

export default router;
