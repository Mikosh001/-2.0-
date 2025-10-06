import { Router } from 'express';
import adminRoutes from './adminRoutes';
import authRoutes from './authRoutes';
import badgeRoutes from './badgeRoutes';
import courseRoutes from './courseRoutes';
import jobRoutes from './jobRoutes';
import mentorRoutes from './mentorRoutes';
import quizRoutes from './quizRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/quiz', quizRoutes);
router.use('/badges', badgeRoutes);
router.use('/jobs', jobRoutes);
router.use('/mentors', mentorRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);

export default router;
