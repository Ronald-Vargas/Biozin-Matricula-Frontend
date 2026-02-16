import { Routes } from '@angular/router';

export const ESTUDIANTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/estudiantes-list/estudiantes-list.component')
        .then(m => m.EstudiantesListComponent)
  },
  {
    path: 'nuevo', 
    loadComponent: () =>
      import('./pages/estudiante-form/estudiante-form.component')
        .then(m => m.EstudianteFormComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/estudiante-detail/estudiante-detail.component')
        .then(m => m.EstudianteDetailComponent)
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./pages/estudiante-form/estudiante-form.component').then(m => m.EstudianteFormComponent),
  }
];
