import { Request, Response } from 'express';
import { getCourse, getLessonsByCourse, listCourses } from '../services/courseService';

export const fetchCourses = async (req: Request, res: Response) => {
  const { skill, search } = req.query;
  const courses = await listCourses({
    skill: typeof skill === 'string' ? skill : undefined,
    search: typeof search === 'string' ? search : undefined,
  });
  res.json(courses);
};

export const fetchCourseById = async (req: Request, res: Response) => {
  const course = await getCourse(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Курс табылмады' });
  }
  res.json(course);
};

export const fetchLessons = async (req: Request, res: Response) => {
  const lessons = await getLessonsByCourse(req.params.id);
  res.json(lessons);
};
