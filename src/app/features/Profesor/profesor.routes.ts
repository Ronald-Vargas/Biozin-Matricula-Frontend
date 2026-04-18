import { Routes } from '@angular/router';

export const PROFESOR_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/profesor-dashboard.component').then(m => m.ProfesorDashboardComponent),
  },
  {
    path: 'mis-cursos',
    loadComponent: () =>
      import('./pages/mis-cursos/mis-cursos.component').then(m => m.MisCursosComponent),
  },
  {
    path: 'cursos/:idOferta/estudiantes',
    loadComponent: () =>
      import('./pages/estudiantes-curso/estudiantes-curso.component').then(m => m.EstudiantesCursoComponent),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
