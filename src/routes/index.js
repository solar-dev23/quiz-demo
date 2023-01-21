import React, { Fragment, Suspense } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { LinearProgress } from '@mui/material';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import SignIn from '../pages/signin';
import SignUp from '../pages/signup';
import Home from '../pages/home';
import Quiz from '../pages/quiz';
import PublicQuiz from '../pages/public-quiz';
import NotFound from '../pages/not-found';
import { history } from '../helpers';

const routes = [
  {
    path: '/signin',
    type: 'public',
    elem: <SignIn />,
  },
  {
    path: '/signup',
    type: 'public',
    elem: <SignUp />,
  },
  {
    path: '/',
    type: 'private',
    elem: <Home />,
  },
  {
    path: '/quizzes/:id',
    type: 'private',
    elem: <Quiz />,
  },
  {
    path: '/quizzes/public/:pId',
    type: 'public',
    elem: <PublicQuiz />,
  },
];

const CustomRouter = () => {
  // init custom history object to allow navigation from
  // anywhere in the react app (inside or outside components)
  history.navigate = useNavigate();
  history.location = useLocation();

  return (
    <Suspense fallback={<LinearProgress />}>
      <Routes>
        {routes.map((route, i) => {
          if (route.type === 'private') {
            return (
              <Route
                key={i}
                path={route.path}
                element={<PrivateRoute>{route.elem}</PrivateRoute>}
              />
            );
          } else if (route.type === 'public') {
            return (
              <Route key={i} path={route.path} element={<PublicRoute>{route.elem}</PublicRoute>} />
            );
          } else {
            return <Fragment key={i}>{route.elem}</Fragment>;
          }
        })}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default CustomRouter;
