import { Routes } from '@angular/router';
import { AuthGuard } from '@shared/guards';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.page'),
  },
  {
    path: 'movies',
    loadChildren: () => import('./movies/movies.routes'),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'movies',
    pathMatch: 'full',
  },
];
