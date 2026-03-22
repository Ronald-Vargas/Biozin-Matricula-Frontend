import { Routes } from '@angular/router';

export const MALLA_CURRICULAR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/malla-curricular/malla-curricular.component')
        .then(m => m.MallaCurricularComponent)
  }
  
];