import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import authRouter from './routes/auth.js';
import courseRouter from './routes/courses.js';
import quizRouter from './routes/quiz.js';
import badgeRouter, { publicRouter as badgePublicRouter } from './routes/badges.js';
import jobRouter from './routes/jobs.js';
import mentorRouter from './routes/mentors.js';
import adminRouter from './routes/admin.js';
import publicRouter from './routes/public.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

const authLimiter = rateLimit({ windowMs: 60 * 1000, max: 20, standardHeaders: true });
app.use('/auth', authLimiter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRouter);
app.use('/courses', courseRouter);
app.use('/quiz', quizRouter);
app.use('/me', badgeRouter);
app.use('/', badgePublicRouter);
app.use('/', publicRouter);
app.use('/jobs', jobRouter);
app.use('/mentors', mentorRouter);
app.use('/admin', adminRouter);

app.use(errorHandler);

export default app;
