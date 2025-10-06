import { Request, Response } from 'express';
import {
  adminCreateCourse,
  adminCreateLesson,
  adminCreateQuestion,
  adminDeleteCourse,
  adminDeleteLesson,
  adminDeleteQuestion,
  adminListCourses,
  adminListJobs,
  adminUpdateCourse,
  adminUpdateLesson,
  adminUpdateQuestion,
} from '../services/adminService';

export const listAdminCourses = async (_req: Request, res: Response) => {
  const courses = await adminListCourses();
  res.json(courses);
};

export const createAdminCourse = async (req: Request, res: Response) => {
  try {
    const course = await adminCreateCourse(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const updateAdminCourse = async (req: Request, res: Response) => {
  try {
    const course = await adminUpdateCourse(req.params.id, req.body);
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteAdminCourse = async (req: Request, res: Response) => {
  await adminDeleteCourse(req.params.id);
  res.status(204).send();
};

export const createAdminLesson = async (req: Request, res: Response) => {
  try {
    const lesson = await adminCreateLesson(req.params.courseId, req.body);
    res.status(201).json(lesson);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const updateAdminLesson = async (req: Request, res: Response) => {
  try {
    const lesson = await adminUpdateLesson(req.params.lessonId, req.body);
    res.json(lesson);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteAdminLesson = async (req: Request, res: Response) => {
  await adminDeleteLesson(req.params.lessonId);
  res.status(204).send();
};

export const createAdminQuestion = async (req: Request, res: Response) => {
  try {
    const question = await adminCreateQuestion(req.params.courseId, req.body);
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const updateAdminQuestion = async (req: Request, res: Response) => {
  try {
    const question = await adminUpdateQuestion(req.params.questionId, req.body);
    res.json(question);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteAdminQuestion = async (req: Request, res: Response) => {
  await adminDeleteQuestion(req.params.questionId);
  res.status(204).send();
};

export const listAdminJobs = async (_req: Request, res: Response) => {
  const jobs = await adminListJobs();
  res.json(jobs);
};
