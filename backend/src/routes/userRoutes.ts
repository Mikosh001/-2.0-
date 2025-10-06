import { Router } from 'express';
import { me, myEnrollments, publicProfile } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/:id/public', publicProfile);
router.use(requireAuth);
router.get('/me', me);
router.get('/me/enrollments', myEnrollments);

export default router;
