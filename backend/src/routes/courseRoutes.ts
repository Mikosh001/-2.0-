import { Router } from 'express';
import {
  fetchCourseById,
  fetchCourses,
  fetchLessons,
} from '../controllers/courseController';

const router = Router();

router.get('/', fetchCourses);
router.get('/:id', fetchCourseById);
router.get('/:id/lessons', fetchLessons);

export default router;
