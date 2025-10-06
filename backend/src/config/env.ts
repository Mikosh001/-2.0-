import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

if (!env.databaseUrl) {
  console.warn('DATABASE_URL is not set. Prisma may fail to connect.');
}
