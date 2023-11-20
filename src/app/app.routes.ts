import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.page'),
  },
  {
    path: 'movies',
    loadChildren: () => import('./movies/movies.routes'),
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
