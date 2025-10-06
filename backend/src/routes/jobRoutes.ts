import { Router } from 'express';
import { addJob, applyJob, fetchJobs, myApplications } from '../controllers/jobController';
import { optionalAuth, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, fetchJobs);
router.post('/', requireAuth, requireRole('employer'), addJob);
router.post('/:id/apply', requireAuth, requireRole('student'), applyJob);
router.get('/me/applications', requireAuth, myApplications);

export default router;
