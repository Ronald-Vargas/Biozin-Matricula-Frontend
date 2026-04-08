import { Injectable } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { EstudianteService } from '../../estudiantes/services/estudiantes.services';
import { CarreraService } from '../../carreras/services/carrera.service';
import { CursoService } from '../../cursos/services/curso.service';
import { OfertaAcademicaService } from '../../OfertaAcademica/services/oferta-academica.service';

export interface DashboardStats {
  estudiantesActivos: number;
  carrerasActivas: number;
  cursosActivos: number;
  matriculasActivas: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {

  constructor(
    private estudianteService: EstudianteService,
    private carreraService: CarreraService,
    private cursoService: CursoService,
    private ofertaService: OfertaAcademicaService
  ) {}

  getStats(): Observable<DashboardStats> {
    return combineLatest([
      this.estudianteService.estudiantes$,
      this.carreraService.carreras$,
      this.cursoService.cursos$,
      this.ofertaService.ofertas$
    ]).pipe(
      map(([estudiantes, carreras, cursos, ofertas]) => ({
        estudiantesActivos: estudiantes.filter(e => e.estadoEstudiante).length,
        carrerasActivas: carreras.filter(c => c.estado).length,
        cursosActivos: cursos.filter(c => c.estado).length,
        matriculasActivas: ofertas
          .filter(o => o.estado)
          .reduce((sum, o) => sum + (o.matriculados ?? 0), 0)
      }))
    );
  }
}
