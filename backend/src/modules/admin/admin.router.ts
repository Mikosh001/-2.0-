import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { prisma } from '../../utils/prisma.js';

const router = Router();

router.use(requireAuth, requireRole(['admin']));

const lessonSchema = z.object({
  courseId: z.string(),
  type: z.enum(['video', 'task', 'sim']),
  title: z.string(),
  videoUrl: z.string().url().optional(),
  contentMd: z.string().optional(),
  order: z.number().int()
});

router.post('/lessons', async (req, res) => {
  const parsed = lessonSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Қате сабақ', issues: parsed.error.flatten() });
  }
  const lesson = await prisma.lesson.create({ data: parsed.data });
  res.status(201).json(lesson);
});

router.put('/lessons/:id', async (req, res) => {
  const parsed = lessonSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Қате сабақ', issues: parsed.error.flatten() });
  }
  const lesson = await prisma.lesson.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(lesson);
});

router.delete('/lessons/:id', async (req, res) => {
  await prisma.lesson.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

const questionSchema = z.object({
  quizId: z.string(),
  text: z.string(),
  skillTag: z.string(),
  difficulty: z.number().int().min(1).max(3),
  options: z.array(z.object({ text: z.string(), isCorrect: z.boolean() }))
});

router.post('/questions', async (req, res) => {
  const parsed = questionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Қате сұрақ', issues: parsed.error.flatten() });
  }
  const question = await prisma.question.create({ data: parsed.data });
  res.status(201).json(question);
});

router.put('/questions/:id', async (req, res) => {
  const parsed = questionSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Қате сұрақ', issues: parsed.error.flatten() });
  }
  const question = await prisma.question.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(question);
});

router.delete('/questions/:id', async (req, res) => {
  await prisma.question.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

const badgeSchema = z.object({
  userId: z.string(),
  name: z.string(),
  skillTag: z.string(),
  level: z.enum(['Standard', 'Advanced'])
});

router.post('/badges', async (req, res) => {
  const parsed = badgeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Қате бейдж', issues: parsed.error.flatten() });
  }
  const badge = await prisma.badge.create({ data: parsed.data });
  res.status(201).json(badge);
});

router.delete('/badges/:id', async (req, res) => {
  await prisma.badge.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

router.delete('/jobs/:id', async (req, res) => {
  await prisma.job.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
