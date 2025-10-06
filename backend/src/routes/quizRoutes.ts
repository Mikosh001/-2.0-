import { Router } from 'express';
import { answerQuiz, finishQuiz, startQuiz } from '../controllers/quizController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/:courseId/start', requireAuth, startQuiz);
router.post('/:courseId/answer', requireAuth, answerQuiz);
router.post('/:courseId/finish', requireAuth, finishQuiz);

export default router;
