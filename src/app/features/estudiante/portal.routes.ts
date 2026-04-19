import { Routes } from '@angular/router';

export const PORTAL_ROUTES: Routes = [
  {
    path: 'inicio',
    loadComponent: () =>
      import('./pages/inicio/portal-inicio.component').then((m) => m.PortalInicioComponent),
  },
  {
    path: 'matricular',
    loadComponent: () =>
      import('./pages/matricular/portal-matricular.component').then((m) => m.PortalMatricularComponent),
  },
  {
    path: 'historial',
    loadComponent: () =>
      import('./pages/historial/portal-historial.component').then((m) => m.PortalHistorialComponent),
  },
  {
    path: 'pagos',
    loadComponent: () =>
      import('./pages/pagos/portal-pagos.component').then((m) => m.PortalPagosComponent),
  },
  {
    path: 'malla',
    loadComponent: () =>
      import('./pages/malla/portal-malla.component').then((m) => m.PortalMallaComponent),
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
];
