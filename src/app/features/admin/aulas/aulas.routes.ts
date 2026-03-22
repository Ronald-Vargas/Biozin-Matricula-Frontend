import { Routes } from '@angular/router';

export const AULAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/aulas-list/aulas-list.component').then((m) => m.AulasListComponent),
  },
];
