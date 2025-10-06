import { Router } from 'express';
import { prisma } from '../config/prisma.js';

const router = Router();

router.get('/', async (_req, res) => {
  const mentors = await prisma.mentor.findMany({ include: { user: true } });
  res.json(mentors);
});

export default router;
