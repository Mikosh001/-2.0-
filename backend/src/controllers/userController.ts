import { Response } from 'express';
import { getMe, getMyEnrollments, getPublicProfile } from '../services/userService';
import { AuthenticatedRequest } from '../types';

export const me = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Аутентификация қажет' });
  const profile = await getMe(req.user.id);
  res.json(profile);
};

export const myEnrollments = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Аутентификация қажет' });
  const enrollments = await getMyEnrollments(req.user.id);
  res.json(enrollments);
};

export const publicProfile = async (req: AuthenticatedRequest, res: Response) => {
  const profile = await getPublicProfile(req.params.id);
  if (!profile) return res.status(404).json({ message: 'Профиль табылмады' });
  res.json(profile);
};
