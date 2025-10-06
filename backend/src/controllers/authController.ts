import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/authService';

export const register = async (req: Request, res: Response) => {
  try {
    const { user, token } = await registerUser(req.body);
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        region: user.region,
      },
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { user, token } = await loginUser(req.body);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        region: user.region,
      },
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
