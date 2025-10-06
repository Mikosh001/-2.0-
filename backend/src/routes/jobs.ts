import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { AuthRequest, requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

const jobFilters = z.object({
  city: z.string().optional(),
  skills: z.union([z.string(), z.array(z.string())]).optional(),
  matchFor: z.string().optional(),
});

router.get('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const parsed = jobFilters.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() });
    }
    const { city, skills, matchFor } = parsed.data;
    if (matchFor === 'me') {
      if (!req.user) {
        return res.status(401).json({ message: 'Аутентификация қажет' });
      }
      const student = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          badges: true,
          enrollments: {
            include: { course: true },
          },
        },
      });
      if (!student) {
        return res.status(404).json({ message: 'Пайдаланушы табылмады' });
      }
      const skillSet = new Set<string>();
      student.badges.forEach((b) => skillSet.add(b.skillTag));
      student.enrollments
        .filter((e) => e.progress >= 100)
        .forEach((enrollment) => enrollment.course.skills.forEach((s) => skillSet.add(s)));
      const jobs = await prisma.job.findMany();
      const enriched = jobs.map((job) => {
        const matches = job.skillsRequired.filter((skill) => skillSet.has(skill));
        const score = job.skillsRequired.length
          ? matches.length / job.skillsRequired.length
          : matches.length > 0
          ? 1
          : 0;
        return { ...job, score, matches };
      });
      return res.json(enriched.sort((a, b) => b.score - a.score));
    }
    const skillsArray = skills
      ? Array.isArray(skills)
        ? skills
        : (skills as string).split(',').map((s) => s.trim())
      : undefined;
    const jobs = await prisma.job.findMany({
      where: {
        city: city || undefined,
        ...(skillsArray
          ? {
              skillsRequired: {
                hasSome: skillsArray,
              },
            }
          : {}),
      },
      include: { employer: true },
    });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, requireRole('employer'), async (req: AuthRequest, res) => {
  const schema = z.object({
    title: z.string(),
    city: z.string(),
    salaryMin: z.number().optional(),
    salaryMax: z.number().optional(),
    skillsRequired: z.array(z.string()).min(1),
    description: z.string(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }
  const job = await prisma.job.create({
    data: {
      employerId: req.user!.id,
      ...parsed.data,
    },
  });
  res.status(201).json(job);
});

router.post('/:id/apply', requireAuth, requireRole('student'), async (req: AuthRequest, res) => {
  const job = await prisma.job.findUnique({ where: { id: req.params.id } });
  if (!job) {
    return res.status(404).json({ message: 'Вакансия табылмады' });
  }
  const existing = await prisma.application.findFirst({
    where: { jobId: job.id, userId: req.user!.id },
  });
  if (existing) {
    return res.status(409).json({ message: 'Бұрын өтінім берілген' });
  }
  const application = await prisma.application.create({
    data: {
      jobId: job.id,
      userId: req.user!.id,
    },
  });
  res.status(201).json(application);
});

router.get('/employer/manage', requireAuth, requireRole('employer'), async (req: AuthRequest, res) => {
  const jobs = await prisma.job.findMany({
    where: { employerId: req.user!.id },
    include: { applications: { include: { user: true } } },
  });
  res.json(jobs);
});

export default router;
