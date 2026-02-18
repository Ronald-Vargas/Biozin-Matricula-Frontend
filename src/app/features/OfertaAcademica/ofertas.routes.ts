import { Routes } from '@angular/router';

export const OFERTA_ACADEMICA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/oferta-academica-list/oferta-academica-list.component')
    .then((m) => m.OfertaAcademicaListComponent),
  },
];
