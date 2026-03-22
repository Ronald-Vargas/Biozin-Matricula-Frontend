import { Routes } from '@angular/router';

export const ASIGNACIONES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/asignar-cursos.component')
        .then(m => m.AsignarCursosComponent)
  }
  
];