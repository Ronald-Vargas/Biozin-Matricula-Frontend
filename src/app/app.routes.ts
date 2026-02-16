import { Routes } from '@angular/router';

export const routes: Routes = [
   // ── Login (sin layout) ──
  {
     path: '',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },

  // ── App (con layout sidebar + header) ──
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/pages/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'estudiantes',
        loadChildren: () =>
          import('./features/estudiantes/estudiantes.routes').then((m) => m.ESTUDIANTES_ROUTES),
      },
      {
        path: 'carreras',
        loadChildren: () =>
          import('./features/carreras/carreras.routes').then((m) => m.CARRERAS_ROUTES),
      },
      {
        path: 'cursos',
        loadChildren: () =>
          import('./features/cursos/cursos.routes').then((m) => m.CURSOS_ROUTES),
      },
      {
        path: 'asignaciones',
        loadChildren: () =>
          import('./features/asignaciones/asignaciones.routes').then((m) => m.ASIGNACIONES_ROUTES),
      },
    ],
  },

  // ── Fallback ──
  { path: '**', redirectTo: 'auth/login' },
];