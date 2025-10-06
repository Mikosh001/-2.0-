import { Router } from 'express';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { requireAuth } from '../../middleware/auth.js';
import { prisma } from '../../utils/prisma.js';

interface SessionState {
  courseId: string;
  userId: string;
  asked: Array<{ questionId: string; correct: boolean; skillTag: string; difficulty: number }>;
  currentDifficulty: number;
}

const sessions = new Map<string, SessionState>();

const router = Router();

router.post('/:courseId/start', requireAuth, async (req, res) => {
  const { courseId } = req.params;
  const questions = await prisma.question.findMany({ where: { quiz: { courseId } } });
  if (questions.length === 0) {
    return res.status(400).json({ message: 'Сұрақтар жоқ' });
  }
  const sessionId = randomUUID();
  const session: SessionState = {
    courseId,
    userId: req.user!.id,
    asked: [],
    currentDifficulty: 2
  };
  sessions.set(sessionId, session);

  const firstQuestion = await pickQuestion(session, questions);
  if (!firstQuestion) {
    return res.status(400).json({ message: 'Сұрақ табылмады' });
  }
  res.json({ sessionId, question: sanitizeQuestion(firstQuestion) });
});

const answerSchema = z.object({
  sessionId: z.string(),
  questionId: z.string(),
  choice: z.string()
});

router.post('/:courseId/answer', requireAuth, async (req, res) => {
  const parsed = answerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Қате жауап', issues: parsed.error.flatten() });
  }
  const { sessionId, questionId, choice } = parsed.data;
  const session = sessions.get(sessionId);
  if (!session || session.userId !== req.user!.id) {
    return res.status(404).json({ message: 'Сессия табылмады' });
  }
  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) {
    return res.status(404).json({ message: 'Сұрақ жоқ' });
  }
  const options = question.options as Array<{ text: string; isCorrect: boolean } & Record<string, unknown>>;
  const selected = options.find((o) => o.text === choice);
  const correct = Boolean(selected?.isCorrect);

  session.asked.push({
    questionId,
    correct,
    skillTag: question.skillTag,
    difficulty: question.difficulty
  });

  const difficulty = session.currentDifficulty;
  session.currentDifficulty = correct ? Math.min(3, difficulty + 1) : Math.max(1, difficulty - 1);

  const questions = await prisma.question.findMany({ where: { quiz: { courseId: session.courseId } } });
  const nextQuestion = await pickQuestion(session, questions);
  const finished = session.asked.length >= 10 || !nextQuestion;
  res.json({
    correct,
    finished,
    nextQuestion: finished ? null : sanitizeQuestion(nextQuestion)
  });
});

router.post('/:courseId/finish', requireAuth, async (req, res) => {
  const sessionId = req.body.sessionId as string;
  const session = sessions.get(sessionId);
  if (!session || session.userId !== req.user!.id) {
    return res.status(404).json({ message: 'Сессия табылмады' });
  }
  const asked = session.asked.slice(0, 10);
  const correctCount = asked.filter((a) => a.correct).length;
  const skillScore = asked.length ? correctCount / asked.length : 0;
  const perSkill: Record<string, { correct: number; total: number }> = {};
  asked.forEach((item) => {
    if (!perSkill[item.skillTag]) {
      perSkill[item.skillTag] = { correct: 0, total: 0 };
    }
    perSkill[item.skillTag].total += 1;
    if (item.correct) perSkill[item.skillTag].correct += 1;
  });

  let badgeLevel: 'Standard' | 'Advanced' | null = null;
  if (skillScore >= 0.8) {
    badgeLevel = 'Advanced';
  } else if (skillScore >= 0.5) {
    badgeLevel = 'Standard';
  }
  let badge = null;
  if (badgeLevel) {
    badge = await prisma.badge.create({
      data: {
        userId: session.userId,
        name: `Құзырет ${session.courseId}`,
        skillTag: topSkill(perSkill),
        level: badgeLevel
      }
    });
  }

  const remediation = Object.entries(perSkill)
    .filter(([, value]) => value.correct / value.total < 0.5)
    .map(([skill]) => skill);

  sessions.delete(sessionId);
  res.json({
    skill_score: skillScore,
    correct: correctCount,
    asked: asked.length,
    badge,
    remediation,
    perSkill,
    path_taken: asked
  });
});

async function pickQuestion(
  session: SessionState,
  questions: Awaited<ReturnType<typeof prisma.question.findMany>>
) {
  const order = [session.currentDifficulty, session.currentDifficulty - 1, session.currentDifficulty + 1]
    .filter((d) => d >= 1 && d <= 3)
    .filter((value, index, array) => array.indexOf(value) === index);

  for (const diff of order) {
    const candidates = questions.filter(
      (q) => q.difficulty === diff && !session.asked.find((a) => a.questionId === q.id)
    );
    if (candidates.length > 0) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }
  }
  return null;
}

function sanitizeQuestion(question: { id: string; text: string; options: unknown }) {
  const options = question.options as Array<{ text: string }>;
  return { id: question.id, text: question.text, options: options.map((o) => o.text) };
}

function topSkill(perSkill: Record<string, { correct: number; total: number }>) {
  return Object.entries(perSkill)
    .sort((a, b) => b[1].correct / b[1].total - a[1].correct / a[1].total)[0]?.[0] ?? 'skill';
}

export default router;
