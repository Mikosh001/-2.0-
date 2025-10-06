import { Request, Response } from 'express';
import { listMentors } from '../services/mentorService';

export const fetchMentors = async (_req: Request, res: Response) => {
  const mentors = await listMentors();
  res.json(mentors);
};
