import { Routes } from '@angular/router';

export const AJUSTES_ROUTES: Routes = [
     {
    path: '',
    loadComponent: () =>
      import('./pages/ajustes/ajustes.component').then((m) => m.AjustesComponent),
  },
];