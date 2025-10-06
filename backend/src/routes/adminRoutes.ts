import { Router } from 'express';
import {
  createAdminCourse,
  createAdminLesson,
  createAdminQuestion,
  deleteAdminCourse,
  deleteAdminLesson,
  deleteAdminQuestion,
  listAdminCourses,
  listAdminJobs,
  updateAdminCourse,
  updateAdminLesson,
  updateAdminQuestion,
} from '../controllers/adminController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.use(requireAuth, requireRole('admin'));

router.get('/courses', listAdminCourses);
router.post('/courses', createAdminCourse);
router.put('/courses/:id', updateAdminCourse);
router.delete('/courses/:id', deleteAdminCourse);

router.post('/courses/:courseId/lessons', createAdminLesson);
router.put('/lessons/:lessonId', updateAdminLesson);
router.delete('/lessons/:lessonId', deleteAdminLesson);

router.post('/courses/:courseId/questions', createAdminQuestion);
router.put('/questions/:questionId', updateAdminQuestion);
router.delete('/questions/:questionId', deleteAdminQuestion);

router.get('/jobs', listAdminJobs);

export default router;
