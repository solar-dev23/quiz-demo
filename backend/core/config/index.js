import { config as dotenv } from 'dotenv';

dotenv();

const config = {
  dbHost: process.env.dbHost || 'localhost',
  dbPort: process.env.dbPort || '27017',
  dbName: process.env.dbName || 'quiz',
  dbUser: process.env.dbUser || 'root',
  dbPassword: process.env.dbPassword || '',

  serverHost: process.env.serverHost || '0.0.0.0',
  serverPort: process.env.serverPort || 4000,

  JWT_SECRET: process.env.JWT_SECRET || 'JWT_SECRET',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '2h',
  SALT_WORK_FACTOR: process.env.SALT_WORK_FACTOR || 10,
};

export default config;
