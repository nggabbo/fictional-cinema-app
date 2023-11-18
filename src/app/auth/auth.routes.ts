import { Routes } from '@angular/router';

export default [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page'),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
] as Routes;
