import { Routes } from '@angular/router';

export const FINANZAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/finanzas.component').then(m => m.FinanzasComponent),
  },
];
