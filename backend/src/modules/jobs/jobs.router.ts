import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { prisma } from '../../utils/prisma.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const city = req.query.city as string | undefined;
  const skills = (req.query.skills as string | undefined)?.split(',').filter(Boolean) ?? [];
  const matchFor = req.query.matchFor as string | undefined;
  const mine = req.query.mine === 'true';

  const jobs = await prisma.job.findMany({
    where: {
      AND: [
        city ? { city: { contains: city, mode: 'insensitive' } } : {},
        skills.length
          ? {
              skillsRequired: {
                hasSome: skills
              }
            }
          : {},
        mine && req.user?.role === 'employer'
          ? {
              employerId: req.user!.id
            }
          : {}
      ]
    },
    include: { applications: true, employer: true }
  });

  if (matchFor === 'me') {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        badges: true,
        enrollments: { include: { course: true } }
      }
    });
    if (!user) {
      return res.status(404).json({ message: 'Пайдаланушы табылмады' });
    }
    const skillSet = new Set<string>();
    user.badges.forEach((badge) => skillSet.add(badge.skillTag));
    user.enrollments
      .filter((enrollment) => enrollment.progress >= 100)
      .forEach((enrollment) => enrollment.course.skills.forEach((skill) => skillSet.add(skill)));

    const scored = jobs.map((job) => {
      const required = job.skillsRequired;
      const intersection = required.filter((skill) => skillSet.has(skill));
      const score = required.length ? intersection.length / required.length : 0;
      return {
        ...job,
        matchScore: score,
        reason: intersection
      };
    });

    return res.json(scored.sort((a, b) => b.matchScore - a.matchScore));
  }

  res.json(jobs);
});

const jobSchema = z.object({
  title: z.string().min(3),
  city: z.string().min(2),
  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional(),
  skillsRequired: z.array(z.string()),
  description: z.string().min(10)
});

router.post('/', requireAuth, requireRole(['employer', 'admin']), async (req, res) => {
  const parsed = jobSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Қате вакансия', issues: parsed.error.flatten() });
  }
  const job = await prisma.job.create({
    data: {
      ...parsed.data,
      employerId: req.user!.id
    }
  });
  res.status(201).json(job);
});

router.post('/:id/apply', requireAuth, requireRole(['student']), async (req, res) => {
  const job = await prisma.job.findUnique({ where: { id: req.params.id } });
  if (!job) {
    return res.status(404).json({ message: 'Вакансия жоқ' });
  }
  const application = await prisma.application.create({
    data: {
      jobId: job.id,
      userId: req.user!.id
    }
  });
  res.status(201).json(application);
});

router.get('/me/applications', requireAuth, async (req, res) => {
  const applications = await prisma.application.findMany({
    where: { userId: req.user!.id },
    include: { job: true }
  });
  res.json(applications);
});

export default router;
