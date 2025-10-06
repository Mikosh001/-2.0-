import { Response } from 'express';
import {
  answerQuizQuestion,
  finishQuizSession,
  startQuizSession,
} from '../services/quizService';
import { AuthenticatedRequest } from '../types';

export const startQuiz = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Аутентификация қажет' });
  }
  try {
    const result = await startQuizSession(req.params.courseId, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const answerQuiz = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await answerQuizQuestion(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const finishQuiz = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await finishQuizSession(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
