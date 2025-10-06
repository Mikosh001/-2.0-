import { Router } from 'express';
import { badgeQr, listBadges } from '../controllers/badgeController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/me', requireAuth, listBadges);
router.get('/:id/qrcode', requireAuth, badgeQr);

export default router;
