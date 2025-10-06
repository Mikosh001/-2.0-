import { NextFunction, Request, Response } from 'express';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const status = typeof err === 'object' && err && 'status' in err ? Number((err as any).status) : 500;
  res.status(status || 500).json({ message: 'Сервер қатесі', detail: err instanceof Error ? err.message : err });
};
