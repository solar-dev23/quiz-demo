import express from 'express';
import questionController from '../controllers/question.controller';
import quizController from '../controllers/quiz.controller';
import { isAuthenticated } from '../middleware/auth';

const quizRoutes = () => {
  const router = express.Router();

  // Quiz Routes
  router.post('/', isAuthenticated, quizController.create);
  router.get('/', isAuthenticated, quizController.list);
  router.put('/:id', isAuthenticated, quizController.update);
  router.delete('/:id', isAuthenticated, quizController.remove);
  router.get('/:id', isAuthenticated, quizController.getOne);
  router.post('/:id/publish', isAuthenticated, quizController.publish);
  router.get('/publish/:pId', quizController.getPublished);
  router.post('/publish/:pId/start', quizController.start);
  router.post('/publish/:pId/result', quizController.evaluate);

  // Question Routes
  router.post('/:qzId/questions', isAuthenticated, questionController.create);
  router.get('/:qzId/questions', isAuthenticated, questionController.list);
  router.put('/:qzId/questions/:qsId', isAuthenticated, questionController.update);
  router.delete('/:qzId/questions/:qsId', isAuthenticated, questionController.remove);
  router.post('/:qzId/questions/reorder', isAuthenticated, questionController.reorder);

  return router;
};

export default quizRoutes;
