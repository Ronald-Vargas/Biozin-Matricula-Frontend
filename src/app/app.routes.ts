import { Routes } from '@angular/router';
import { adminGuard, authGuard, profesorGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // ── Login
  {
    path: '',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },

  // ── Cambiar contraseña temporal
  {
    path: 'cambiar-contrasena-temporal',
    loadComponent: () =>
      import('./auth/change-temp-password/change-temp-password.component').then(
        (m) => m.ChangeTempPasswordComponent
      ),
  },

  // ── App (Main Layout) ──
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      // ── Rutas de Admin (solo administradores autenticados)
      {
        path: '',
        canActivate: [adminGuard],
        children: [
          {
            path: 'dashboard',
            loadComponent: () => import('./features/admin/dashboard/pages/dashboard.component')
              .then(m => m.DashboardComponent)
          },
          {
            path: 'estudiantes',
            loadChildren: () =>
              import('./features/admin/estudiantes/estudiantes.routes').then((m) => m.ESTUDIANTES_ROUTES),
          },
          {
            path: 'carreras',
            loadChildren: () =>
              import('./features/admin/carreras/carreras.routes').then((m) => m.CARRERAS_ROUTES),
          },
          {
            path: 'cursos',
            loadChildren: () =>
              import('./features/admin/cursos/cursos.routes').then((m) => m.CURSOS_ROUTES),
          },
          {
            path: 'asignaciones',
            loadChildren: () =>
              import('./features/admin/asignaciones/asignaciones.routes').then((m) => m.ASIGNACIONES_ROUTES),
          },
          {
            path: 'malla-curricular',
            loadChildren: () =>
              import('./features/admin/malla-curricular/malla-curricular.routes').then((m) => m.MALLA_CURRICULAR_ROUTES),
          },
          {
            path: 'profesores',
            loadChildren: () =>
              import('./features/admin/profesores/profesores.routes').then((m) => m.PROFESORES_ROUTES),
          },
          {
            path: 'periodos',
            loadChildren: () =>
              import('./features/admin/periodos/periodos.routes').then((m) => m.PERIODOS_ROUTES),
          },
          {
            path: 'oferta-academica',
            loadChildren: () =>
              import('./features/admin/OfertaAcademica/ofertas.routes').then((m) => m.OFERTA_ACADEMICA_ROUTES),
          },
          {
            path: 'ajustes',
            loadChildren: () =>
              import('./features/admin/Ajustes/ajustes.routes').then((m) => m.AJUSTES_ROUTES),
          },
          {
            path: 'aulas',
            loadChildren: () =>
              import('./features/admin/aulas/aulas.routes').then((m) => m.AULAS_ROUTES),
          },
          {
            path: 'finanzas',
            loadChildren: () =>
              import('./features/admin/finanzas/finanzas.routes').then((m) => m.FINANZAS_ROUTES),
          },
        ],
      },
      // ── Rutas de Estudiante (cualquier usuario autenticado)
      {
        path: 'portal',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./features/estudiante/portal.routes').then((m) => m.PORTAL_ROUTES),
      },
      // ── Rutas de Profesor
      {
        path: 'profesor',
        canActivate: [profesorGuard],
        loadChildren: () =>
          import('./features/Profesor/profesor.routes').then((m) => m.PROFESOR_ROUTES),
      },
    ],
  },

  // ── Fallback ──
  { path: '**', redirectTo: 'auth/login' },
];