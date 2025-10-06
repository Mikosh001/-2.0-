import { Router } from 'express';
import QRCode from 'qrcode';
import { requireAuth } from '../../middleware/auth.js';
import { prisma } from '../../utils/prisma.js';
import { env } from '../../config/env.js';

const router = Router();

router.get('/me', requireAuth, async (req, res) => {
  const badges = await prisma.badge.findMany({ where: { userId: req.user!.id } });
  res.json(badges);
});

router.get('/:id/qrcode', requireAuth, async (req, res) => {
  const badge = await prisma.badge.findUnique({ where: { id: req.params.id } });
  if (!badge || badge.userId !== req.user!.id) {
    return res.status(404).json({ message: 'Бейдж табылмады' });
  }
  const profileUrl = `${env.frontendUrl}/u/${badge.userId}`;
  const qr = await QRCode.toDataURL(profileUrl);
  await prisma.badge.update({ where: { id: badge.id }, data: { qrCodeUrl: qr } });
  res.json({ url: qr });
});

export default router;
