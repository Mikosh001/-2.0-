import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const courseQuerySchema = z.object({
  skill: z.string().optional(),
});

router.get('/', async (req, res) => {
  const parsed = courseQuerySchema.safeParse(req.query);
  const where = parsed.success && parsed.data.skill
    ? {
        skills: {
          has: parsed.data.skill,
        },
      }
    : undefined;
  const courses = await prisma.course.findMany({
    where,
    include: {
      lessons: {
        orderBy: { order: 'asc' },
        take: 3,
      },
    },
  });
  res.json(courses);
});

router.get('/:id', async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
    include: { lessons: { orderBy: { order: 'asc' } }, quizzes: true },
  });
  if (!course) {
    return res.status(404).json({ message: 'Курс табылмады' });
  }
  res.json(course);
});

router.get('/:id/lessons', requireAuth, async (req, res) => {
  const lessons = await prisma.lesson.findMany({
    where: { courseId: req.params.id },
    orderBy: { order: 'asc' },
  });
  res.json(lessons);
});

export default router;
