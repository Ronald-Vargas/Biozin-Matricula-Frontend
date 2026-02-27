// src/app/core/services/asignacion.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { Asignacion, CreateAsignacionDto, MallaCurricular, SemestreInfo, CursoMalla, PreformaMatricula, CursoPreforma } from '../models/asignacion.model';
import { CursoService } from '../../cursos/services/curso.service';
import { CarreraService } from '../../carreras/services/carrera.service';


@Injectable({
  providedIn: 'root'
})
export class AsignacionService {
  private asignaciones: Asignacion[] = [];
  private asignacionesSubject = new BehaviorSubject<Asignacion[]>([]);
  public asignaciones$ = this.asignacionesSubject.asObservable();

  // Costo por crédito (configurable)
  private readonly COSTO_POR_CREDITO = 150; // $150 por crédito

  constructor(
    private cursoService: CursoService,
    private carreraService: CarreraService
  ) {
    this.cargarDatosEjemplo();
  }

  getAsignaciones(): Observable<Asignacion[]> {
    return this.asignaciones$;
  }

  getAsignacionesByCarrera(idCarrera: number): Asignacion[] {
    return this.asignaciones.filter(a => a.idCarrera === idCarrera);
  }

  getAsignacionesByCurso(idCurso: number): Asignacion[] {
    return this.asignaciones.filter(a => a.idCurso === idCurso);
  }

  createAsignacion(dto: CreateAsignacionDto): Asignacion {
    const nuevaAsignacion: Asignacion = {
      id: Date.now(),
      ...dto
    };

    this.asignaciones.push(nuevaAsignacion);
    this.asignacionesSubject.next([...this.asignaciones]);
    return nuevaAsignacion;
  }

  createMultipleAsignaciones(carreraId: number, asignaciones: CreateAsignacionDto[]): void {
    // Eliminar asignaciones previas de esta carrera
    this.asignaciones = this.asignaciones.filter(a => a.idCarrera !== carreraId);

    // Agregar nuevas asignaciones
    asignaciones.forEach(dto => {
      const nuevaAsignacion: Asignacion = {
        id: Date.now() + Math.random(),
        ...dto
      };
      this.asignaciones.push(nuevaAsignacion);
    });

    this.asignacionesSubject.next([...this.asignaciones]);
  }

  deleteAsignacion(id: number): boolean {
    const index = this.asignaciones.findIndex(a => a.id === id);
    if (index !== -1) {
      this.asignaciones.splice(index, 1);
      this.asignacionesSubject.next([...this.asignaciones]);
      return true;
    }
    return false;
  }

  deleteAsignacionesByCarrera(idCarrera: number): void {
    this.asignaciones = this.asignaciones.filter(a => a.idCarrera !== idCarrera);
    this.asignacionesSubject.next([...this.asignaciones]);
  }









  // Obtener malla curricular completa de una carrera
  async getMallaCurricular(idCarrera: number): Promise<MallaCurricular | null> {
  const carrera = await firstValueFrom(this.carreraService.getCarreraById(idCarrera));
  if (!carrera) return null;

  const asignacionesCarrera = this.getAsignacionesByCarrera(idCarrera);
  
  const semestreMap = new Map<number, CursoMalla[]>();
  let creditosTotales = 0;

  asignacionesCarrera.forEach(asig => {
  });

  const semestres: SemestreInfo[] = [];
  for (let i = 1; i <= carrera.duracion; i++) {  
    const cursos = semestreMap.get(i) || [];
    const creditosSemestre = cursos.reduce((sum, c) => sum + c.creditos, 0);
    semestres.push({ numero: i, cursos, creditosSemestre });
  }

  return {
    carrera: carrera.nombre,
    semestres,
    creditosTotales
  };
}









  // Generar preforma de matrícula
  async generarPreformaMatricula(
  idCarrera: number,
  semestre: number,
  estudianteInfo: { codigo: string; nombre: string },
  periodo: string
): Promise<PreformaMatricula | null> {
  const carrera = await firstValueFrom(this.carreraService.getCarreraById(idCarrera));
  if (!carrera) return null;

    const asignacionesSemestre = this.asignaciones.filter(
      a => a.idCarrera === idCarrera && a.semestre === semestre
    );

    const cursosPreforma: CursoPreforma[] = [];
    let subtotal = 0;

    const cursos = await Promise.all(
      asignacionesSemestre.map(asig =>
        firstValueFrom(this.cursoService.getCursoById(asig.idCurso))
      )
    );

    for (const curso of cursos) {
      if (!curso) continue;

      const costo = curso.creditos * this.COSTO_POR_CREDITO;
      cursosPreforma.push({
        codigo: curso.codigo,
        nombre: curso.nombre,
        creditos: curso.creditos,
        costoPorCredito: this.COSTO_POR_CREDITO,
        costo
      });
      subtotal += costo;
    }

    // Calcular descuentos (ejemplo: 10% si tiene más de 5 cursos)
    const descuentos = cursosPreforma.length > 5 ? subtotal * 0.1 : 0;
    const total = subtotal - descuentos;

    return {
      estudiante: {
        codigo: estudianteInfo.codigo,
        nombre: estudianteInfo.nombre,
        carrera: carrera.nombre
      },
      periodo,
      cursos: cursosPreforma,
      subtotal,
      descuentos,
      total
    };
  }

  // Obtener cursos disponibles para un semestre específico
  getCursosPorSemestre(idCarrera: number, semestre: number): any[] {
    const asignaciones = this.asignaciones.filter(
      a => a.idCarrera === idCarrera && a.semestre === semestre
    );

    return asignaciones.map(asig => {
      const curso = this.cursoService.getCursoById(asig.idCurso);
      return {
        ...curso,
        esObligatorio: asig.esObligatorio,
        semestre: asig.semestre
      };
    }).filter(c => c !== undefined);
  }

  private cargarDatosEjemplo(): void {
    // Asignaciones para Ingeniería en Sistemas (id: 1)
    this.asignaciones = [
      // Semestre 1
      { id: 1, idCarrera: 1, idCurso: 101, semestre: 1, esObligatorio: true },
      { id: 2, idCarrera: 1, idCurso: 102, semestre: 1, esObligatorio: true },
      { id: 3, idCarrera: 1, idCurso: 103, semestre: 1, esObligatorio: true },
      
      // Semestre 2
      { id: 4, idCarrera: 1, idCurso: 104, semestre: 2, esObligatorio: true, prerequisitos: [101] },
      { id: 5, idCarrera: 1, idCurso: 105, semestre: 2, esObligatorio: true, prerequisitos: [102] },
      
      // Semestre 3
      { id: 6, idCarrera: 1, idCurso: 106, semestre: 3, esObligatorio: true, prerequisitos: [102] },
      { id: 7, idCarrera: 1, idCurso: 107, semestre: 3, esObligatorio: true, prerequisitos: [105] },
      
      // Semestre 4
      { id: 8, idCarrera: 1, idCurso: 108, semestre: 4, esObligatorio: true, prerequisitos: [105] },
      
      // Semestre 5
      { id: 9, idCarrera: 1, idCurso: 109, semestre: 5, esObligatorio: true, prerequisitos: [105, 106] },
      { id: 10, idCarrera: 1, idCurso: 110, semestre: 5, esObligatorio: false },

      // Asignaciones para Ingeniería Industrial (id: 2)
      { id: 11, idCarrera: 2, idCurso: 101, semestre: 1, esObligatorio: true },
      { id: 12, idCarrera: 2, idCurso: 103, semestre: 1, esObligatorio: true },
      { id: 13, idCarrera: 2, idCurso: 104, semestre: 2, esObligatorio: true, prerequisitos: [101] },
    ];

    this.asignacionesSubject.next([...this.asignaciones]);
  }
}
