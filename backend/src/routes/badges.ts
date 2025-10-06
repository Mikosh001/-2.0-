import { Router } from 'express';
import QRCode from 'qrcode';
import { prisma } from '../config/prisma.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

const meRouter = Router();

meRouter.get('/badges', requireAuth, async (req: AuthRequest, res) => {
  const badges = await prisma.badge.findMany({ where: { userId: req.user!.id } });
  res.json(badges);
});

meRouter.get('/applications', requireAuth, async (req: AuthRequest, res) => {
  const apps = await prisma.application.findMany({
    where: { userId: req.user!.id },
    include: { job: true },
  });
  res.json(apps);
});

meRouter.get('/enrollments', requireAuth, async (req: AuthRequest, res) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: req.user!.id },
    include: { course: true },
  });
  res.json(enrollments);
});

meRouter.post('/portfolio', requireAuth, async (req: AuthRequest, res) => {
  const { portfolioUrl } = req.body as { portfolioUrl?: string };
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { portfolioUrl },
    select: { id: true, portfolioUrl: true },
  });
  res.json(user);
});

const publicRouter = Router();

publicRouter.get('/badge/:id/qrcode', async (req, res) => {
  const badge = await prisma.badge.findUnique({ where: { id: req.params.id }, include: { user: true } });
  if (!badge) {
    return res.status(404).json({ message: 'Бейдж табылмады' });
  }
  const profileUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/u/${badge.userId}`;
  const dataUrl = await QRCode.toDataURL(profileUrl);
  res.json({ url: dataUrl });
});

export default meRouter;
export { publicRouter };
