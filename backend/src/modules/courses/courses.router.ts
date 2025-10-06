import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../utils/prisma.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const skill = req.query.skill as string | undefined;
  const search = req.query.search as string | undefined;
  const courses = await prisma.course.findMany({
    where: {
      AND: [
        skill
          ? {
              skills: {
                has: skill
              }
            }
          : {},
        search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { summary: { contains: search, mode: 'insensitive' } }
              ]
            }
          : {}
      ]
    },
    include: {
      lessons: true
    }
  });
  res.json(courses);
});

router.get('/:id', async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
    include: { lessons: true, quizzes: true }
  });
  if (!course) {
    return res.status(404).json({ message: 'Курс табылмады' });
  }
  res.json(course);
});

router.get('/:id/lessons', async (req, res) => {
  const lessons = await prisma.lesson.findMany({
    where: { courseId: req.params.id },
    orderBy: { order: 'asc' }
  });
  res.json(lessons);
});

const courseSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  summary: z.string().min(10),
  skills: z.array(z.string()),
  durationWeeks: z.number().min(1)
});

router.post('/', requireAuth, requireRole(['admin']), async (req, res) => {
  const parsed = courseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Қате курс', issues: parsed.error.flatten() });
  }
  const course = await prisma.course.create({ data: parsed.data });
  res.status(201).json(course);
});

export default router;
