import { Routes } from '@angular/router';

export const CURSOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/cursos-list/cursos-list.component')
        .then(m => m.CursosListComponent)
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./pages/curso-form/curso-form.component')
        .then(m => m.CursoFormComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/curso-detail/curso-detail.component')
        .then(m => m.CursoDetailComponent)
  }
];
