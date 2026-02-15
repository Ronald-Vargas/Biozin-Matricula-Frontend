import { Routes } from '@angular/router';

export const CARRERAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/carreras-list/carreras-list.component')
        .then(m => m.CarrerasListComponent)
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./pages/carrera-form/carreras-form.component')
        .then(m => m.CarreraFormComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/carrera-detail/carreras-detail.component')
        .then(m => m.CarrerasDetailComponent)
  }
];