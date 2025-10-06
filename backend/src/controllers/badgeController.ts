import { Response } from 'express';
import { generateBadgeQr, getUserBadges } from '../services/badgeService';
import { AuthenticatedRequest } from '../types';

export const listBadges = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Аутентификация қажет' });
  }
  const badges = await getUserBadges(req.user.id);
  res.json(badges);
};

export const badgeQr = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Аутентификация қажет' });
  }
  try {
    const url = await generateBadgeQr(
      req.params.id,
      req.user.id,
      req.headers.origin ?? 'http://localhost:5173',
    );
    res.json({ qrCodeUrl: url });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
