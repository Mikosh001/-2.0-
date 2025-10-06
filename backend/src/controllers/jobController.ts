import { Request, Response } from 'express';
import {
  applyToJob,
  createJob,
  listApplications,
  listJobs,
  listJobsForUser,
} from '../services/jobService';
import { AuthenticatedRequest } from '../types';

export const fetchJobs = async (req: AuthenticatedRequest, res: Response) => {
  const { city, skills, matchFor } = req.query;
  try {
    if (matchFor === 'me') {
      if (!req.user) {
        return res.status(401).json({ message: 'Аутентификация қажет' });
      }
      const jobs = await listJobsForUser(req.user.id);
      return res.json(jobs);
    }
    const skillsArray = typeof skills === 'string' ? skills.split(',') : undefined;
    const jobs = await listJobs({
      city: typeof city === 'string' ? city : undefined,
      skills: skillsArray,
    });
    res.json(jobs);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const addJob = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Аутентификация қажет' });
  try {
    const job = await createJob(req.body, req.user.id);
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const applyJob = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Аутентификация қажет' });
  try {
    const application = await applyToJob(req.params.id, req.user.id);
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const myApplications = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Аутентификация қажет' });
  const applications = await listApplications(req.user.id, req.user.role);
  res.json(applications);
};
