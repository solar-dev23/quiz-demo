import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth.slice';
import { quizReducer } from './quiz.slice';
import { questionReducer } from './question.slice';

export * from './auth.slice';
export * from './quiz.slice';
export * from './question.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    question: questionReducer,
  },
});
