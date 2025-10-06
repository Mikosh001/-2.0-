import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['DATABASE_URL', 'JWT_SECRET'];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Environment variable ${key} is not set. Using fallback dev value if available.`);
  }
});

export const env = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/prof20',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173'
};
