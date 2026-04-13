import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, map, Observable } from 'rxjs';
import { EstudianteService } from '../../estudiantes/services/estudiantes.services';
import { CarreraService } from '../../carreras/services/carrera.service';
import { CursoService } from '../../cursos/services/curso.service';
import { OfertaAcademicaService } from '../../OfertaAcademica/services/oferta-academica.service';
import { environment } from '../../../../environments/environment';

export interface DashboardStats {
  estudiantesActivos: number;
  carrerasActivas: number;
  cursosActivos: number;
  matriculasActivas: number;
}

export interface ActividadReciente {
  idLog: number;
  tipo: string;
  descripcion: string;
  icono: string;
  fecha: string;
}

export interface DistribucionCarrera {
  nombre: string;
  total: number;
  porcentaje: number;
  color: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private apiUrl = `${environment.apiUrl}/Administrador`;

  constructor(
    private http: HttpClient,
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

  getDistribucion(): Observable<DistribucionCarrera[]> {
    const COLORES = ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#f97316', '#ec4899'];

    return combineLatest([
      this.estudianteService.estudiantes$,
      this.carreraService.carreras$,
    ]).pipe(
      map(([estudiantes, carreras]) => {
        const activos = estudiantes.filter(e => e.estadoEstudiante);

        const conteo = new Map<number, number>();
        for (const e of activos) {
          if (e.idCarrera) conteo.set(e.idCarrera, (conteo.get(e.idCarrera) ?? 0) + 1);
        }

        const maximo = Math.max(...conteo.values(), 1);

        return carreras
          .filter(c => c.estado && conteo.has(c.idCarrera))
          .sort((a, b) => (conteo.get(b.idCarrera) ?? 0) - (conteo.get(a.idCarrera) ?? 0))
          .map((c, i) => ({
            nombre: c.nombre,
            total: conteo.get(c.idCarrera) ?? 0,
            porcentaje: Math.round(((conteo.get(c.idCarrera) ?? 0) / maximo) * 100),
            color: COLORES[i % COLORES.length],
          }));
      })
    );
  }

  getActividadReciente(): Observable<ActividadReciente[]> {
    return this.http.get<{ valorRetorno: ActividadReciente[] }>(`${this.apiUrl}/ActividadReciente`).pipe(
      map(res => res.valorRetorno ?? [])
    );
  }
}
