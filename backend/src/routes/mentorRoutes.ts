import { Router } from 'express';
import { fetchMentors } from '../controllers/mentorController';

const router = Router();

router.get('/', fetchMentors);

export default router;
