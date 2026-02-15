import { Routes } from '@angular/router';

export const ASIGNACIONES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/asignaciones-list/asignaciones-list.component')
        .then(m => m.AsignacionesListComponent)
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./pages/asignaciones-form/asignaciones-form.component')
        .then(m => m.AsignacionesFormComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/asignaciones-detail/asignaciones-detail.component')
        .then(m => m.AsignacionesDetailComponent)
  }
];