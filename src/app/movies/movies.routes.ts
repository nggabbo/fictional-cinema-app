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
        path: 'add',
        loadComponent: () =>
          import('./components/add-movie/add-movie.component'),
      },
      {
        path: '**',
        redirectTo: 'list',
        pathMatch: 'full',
      },
    ],
  },
] as Routes;
