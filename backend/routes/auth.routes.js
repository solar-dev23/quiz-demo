import express from 'express';
import authController from '../controllers/auth.controller';

const authRoutes = () => {
  const router = express.Router();

  router.post('/login', authController.login);
  router.post('/signup', authController.signup);

  return router;
};

export default authRoutes;
