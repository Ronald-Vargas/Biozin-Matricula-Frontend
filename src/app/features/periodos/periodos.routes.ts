import { Routes } from '@angular/router';

export const PERIODOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/periodos-list/periodos-list.component')
        .then(m => m.PeriodosListComponent)
  },
  {
    path: 'nuevo', 
    loadComponent: () =>
      import('./pages/periodo-form/periodo-form.component')
        .then(m => m.PeriodoFormComponent)
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./pages/periodo-form/periodo-form.component')
          .then(m => m.PeriodoFormComponent),
  }
];
