import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import authRouter from './modules/auth/auth.router.js';
import coursesRouter from './modules/courses/courses.router.js';
import quizRouter from './modules/quiz/quiz.router.js';
import badgesRouter from './modules/badges/badges.router.js';
import jobsRouter from './modules/jobs/jobs.router.js';
import mentorsRouter from './modules/mentors/mentors.router.js';
import portfolioRouter from './modules/portfolio/portfolio.router.js';
import adminRouter from './modules/admin/admin.router.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRouter);
app.use('/courses', coursesRouter);
app.use('/quiz', quizRouter);
app.use('/badges', badgesRouter);
app.use('/jobs', jobsRouter);
app.use('/mentors', mentorsRouter);
app.use('/portfolio', portfolioRouter);
app.use('/admin', adminRouter);

app.use('/openapi.json', (_req, res) => {
  res.sendFile('openapi.json', { root: process.cwd() + '/backend' });
});

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`API listening on port ${env.port}`);
});
