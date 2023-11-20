import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./movies.page'),
    children: [
      {
        path: 'list',
        loadComponent: () =>
          import('./components/movies-list/movies-list.component'),
      },
      {
        path: '**',
        redirectTo: 'list',
        pathMatch: 'full',
      },
    ],
  },
] as Routes;
