import express from 'express';

import authRoutes from './auth.routes';
import quizRoutes from './quiz.routes';

const routes = () => {
  const router = express.Router();

  router.use('/auth', authRoutes());
  router.use('/quizzes', quizRoutes());

  return router;
};

export default routes;
