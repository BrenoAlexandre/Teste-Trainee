import { lazy } from 'react';
import { IRoute } from './types';

const Home = lazy(() => import('../pages/Home'));
const Users = lazy(() => import('../pages/Users/List'));
const Actions = lazy(() => import('../pages/Users/Actions'));
const Error = lazy(() => import('../pages/Error'));

export const routes: IRoute[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/funcionarios',
    component: Users,
  },
  {
    path: '/funcionarios/acao/:id?',
    component: Actions,
  },
  {
    path: '*',
    component: Error,
    public: true,
  },
];
