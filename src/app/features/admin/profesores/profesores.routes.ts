import { Routes } from '@angular/router';

export const PROFESORES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/profesores-list/profesores-list.component')
        .then(m => m.ProfesoresListComponent)
  },
  {
    path: 'nuevo', 
    loadComponent: () =>
      import('./pages/profesor-form/profesor-form.component')
        .then(m => m.ProfesorFormComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/profesor-detail/profesor-detail.component')
        .then(m => m.ProfesorDetailComponent)
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./pages/profesor-form/profesor-form.component').then(m => m.ProfesorFormComponent),
  }
];
