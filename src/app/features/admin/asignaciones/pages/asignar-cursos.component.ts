
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Carrera } from '../../carreras/models/carrera.model';
import { CarreraService } from '../../carreras/services/carrera.service';
import { Curso } from '../../cursos/models/curso.model';
import { CursoService } from '../../cursos/services/curso.service';
import { Asignacion, CreateAsignacionDto } from '../models/asignacion.model';
import { AsignacionService } from '../services/asignacion.service';


@Component({
  selector: 'app-asignar-cursos',
  imports: [AsyncPipe, CommonModule, FormsModule],
  templateUrl: './asignar-cursos.component.html',
  styleUrls: ['./asignar-cursos.component.scss']
})
export class AsignarCursosComponent implements OnInit {

  carreras$!: Observable<Carrera[]>;
  cursos$!: Observable<Curso[]>;
  cursosList: Curso[] = [];
  carreraSeleccionada?: Carrera;
  cursosConfig: Map<number, { seleccionado: boolean; semestre: number }> = new Map();
  filtroCurso = '';
  mensajeExito = false;
  mensajeError = false;
  erroresPrerequisitos: string[] = [];
  cargandoAsignaciones = false;
  guardando = false;

  constructor(
    private carreraService: CarreraService,
    private cursoService: CursoService,
    private asignacionService: AsignacionService
  ) {}

  ngOnInit(): void {
    this.carreras$ = this.carreraService.getCarrerasActivas();
    this.cursos$ = this.cursoService.getCursosActivos();
    this.cursos$.subscribe(cursos => this.cursosList = cursos);
  }

  onCarreraSeleccionada(event: any): void {
    const id = Number(event.target.value);
    if (id) {
      this.carreraService.getCarreraById(id).subscribe(carrera => {
        this.carreraSeleccionada = carrera;
        if (carrera) {
          this.cargarAsignacionesExistentes(id);
        }
      });
    } else {
      this.carreraSeleccionada = undefined;
      this.cursosConfig.clear();
    }
  }

  cargarAsignacionesExistentes(carreraId: number): void {
    this.cargandoAsignaciones = true;
    this.cursosConfig.clear();

    this.asignacionService.getAsignacionesByCarrera(carreraId).subscribe({
      next: (asignaciones: Asignacion[]) => {
        asignaciones.forEach(asig => {
          this.cursosConfig.set(asig.idCurso, {
            seleccionado: true,
            semestre: asig.semestre
          });
        });
        this.cargandoAsignaciones = false;
      },
      error: () => {
        this.cargandoAsignaciones = false;
      }
    });
  }

  get cursosFiltrados(): Curso[] {
    const termino = this.filtroCurso.toLowerCase().trim();
    if (!termino) return this.cursosList;
    return this.cursosList.filter(c =>
      c.nombre.toLowerCase().includes(termino) ||
      c.codigo.toLowerCase().includes(termino)
    );
  }

  toggleCurso(cursoId: number): void {
    if (this.cursosConfig.has(cursoId)) {
      this.cursosConfig.delete(cursoId);
    } else {
      this.cursosConfig.set(cursoId, {
        seleccionado: true,
        semestre: 1
      });
    }
  }

  estaSeleccionado(cursoId: number): boolean {
    return this.cursosConfig.has(cursoId);
  }

  getSemestre(cursoId: number): number {
    return this.cursosConfig.get(cursoId)?.semestre || 1;
  }


  actualizarSemestre(cursoId: number, semestre: number): void {
    const config = this.cursosConfig.get(cursoId);
    if (config) {
      const duracion = this.carreraSeleccionada?.duracion ?? semestre;
      config.semestre = Math.min(Math.max(1, semestre), duracion);
      this.validarPrerequisitos();
    }
  }

  validarPrerequisitos(): void {
    this.erroresPrerequisitos = [];
    const duracion = this.carreraSeleccionada?.duracion;

    for (const [cursoId, config] of this.cursosConfig.entries()) {
      const curso = this.cursosList.find(c => c.idCurso === cursoId);

      if (duracion && config.semestre > duracion) {
        this.erroresPrerequisitos.push(
          `"${curso?.nombre}" está asignado al semestre ${config.semestre}, pero la carrera solo tiene ${duracion} semestres.`
        );
        continue;
      }

      if (!curso?.idCursoRequisito) continue;

      const reqConfig = this.cursosConfig.get(curso.idCursoRequisito);
      if (!reqConfig) continue;

      if (config.semestre <= reqConfig.semestre) {
        const requisito = this.cursosList.find(c => c.idCurso === curso.idCursoRequisito);
        this.erroresPrerequisitos.push(
          `"${curso.nombre}" (semestre ${config.semestre}) debe estar en un semestre posterior a su prerequisito "${requisito?.nombre}" (semestre ${reqConfig.semestre}).`
        );
      }
    }
  }


  guardarAsignaciones(): void {
    if (!this.carreraSeleccionada || this.guardando) return;

    this.validarPrerequisitos();
    if (this.erroresPrerequisitos.length > 0) return;

    const asignaciones: CreateAsignacionDto[] = [];
    this.cursosConfig.forEach((config, cursoId) => {
      asignaciones.push({
        idCarrera: this.carreraSeleccionada!.idCarrera,
        idCurso: cursoId,
        semestre: config.semestre
      });
    });

    this.guardando = true;
    this.asignacionService.createMultipleAsignaciones(this.carreraSeleccionada.idCarrera, asignaciones).subscribe({
      next: (res) => {
        this.guardando = false;
        if (!res.blnError) {
          this.mensajeExito = true;
          setTimeout(() => { this.mensajeExito = false; }, 3000);
        } else {
          this.mensajeError = true;
          setTimeout(() => { this.mensajeError = false; }, 3000);
        }
      },
      error: () => {
        this.guardando = false;
        this.mensajeError = true;
        setTimeout(() => { this.mensajeError = false; }, 3000);
      }
    });
  }
}
