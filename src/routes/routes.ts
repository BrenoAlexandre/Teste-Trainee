import { lazy } from 'react';
import { IRoute } from './types';

const Home = lazy(() => import('../pages/Login'));
const Users = lazy(() => import('../pages/Users/List'));
const Actions = lazy(() => import('../pages/Users/Actions'));
const Error = lazy(() => import('../pages/Error'));

export const routes: IRoute[] = [
  {
    path: '/',
    component: Home,
    isPublic: true,
    adminOnly: false,
  },
  {
    path: '/funcionarios',
    component: Users,
    isPublic: false,
    adminOnly: false,
    redirectTo: '/',
  },
  {
    path: '/funcionarios/acao',
    component: Actions,
    isPublic: false,
    adminOnly: true,
    redirectTo: '/funcionarios',
  },
  {
    path: '/funcionarios/acao/:id',
    component: Actions,
    isPublic: false,
    adminOnly: true,
    redirectTo: '/funcionarios',
  },
  {
    path: '*',
    component: Error,
    isPublic: true,
    adminOnly: false,
  },
];
