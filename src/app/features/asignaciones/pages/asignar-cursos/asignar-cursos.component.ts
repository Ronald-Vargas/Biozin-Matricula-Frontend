
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Carrera } from '../../../carreras/models/carrera.model';
import { CarreraService } from '../../../carreras/services/carrera.service';
import { Curso } from '../../../cursos/models/curso.model';
import { CursoService } from '../../../cursos/services/curso.service';
import { CreateAsignacionDto } from '../../models/asignacion.model';
import { AsignacionService } from '../../services/asignacion.service';


@Component({
  selector: 'app-asignar-cursos',
  templateUrl: './asignar-cursos.component.html',
  styleUrls: ['./asignar-cursos.component.scss']
})
export class AsignarCursosComponent implements OnInit {
  carreras$!: Observable<Carrera[]>;
  cursos$!: Observable<Curso[]>;
  carreraSeleccionada?: Carrera;
  cursosConfig: Map<number, { seleccionado: boolean; semestre: number; obligatorio: boolean }> = new Map();
  mensajeExito = false;

  constructor(
    private carreraService: CarreraService,
    private cursoService: CursoService,
    private asignacionService: AsignacionService
  ) {}

  ngOnInit(): void {
    this.carreras$ = this.carreraService.getCarreras();
    this.cursos$ = this.cursoService.getCursos();
  }

  onCarreraSeleccionada(event: any): void {
    const id = Number(event.target.value);
    if (id) {
      this.carreraSeleccionada = this.carreraService.getCarreraById(id);
      this.cargarAsignacionesExistentes(id);
    } else {
      this.carreraSeleccionada = undefined;
      this.cursosConfig.clear();
    }
  }

  cargarAsignacionesExistentes(carreraId: number): void {
    const asignaciones = this.asignacionService.getAsignacionesByCarrera(carreraId);
    this.cursosConfig.clear();

    asignaciones.forEach(asig => {
      this.cursosConfig.set(asig.idCurso, {
        seleccionado: true,
        semestre: asig.semestre,
        obligatorio: asig.esObligatorio
      });
    });
  }

  toggleCurso(cursoId: number): void {
    const config = this.cursosConfig.get(cursoId);
    if (config) {
      this.cursosConfig.delete(cursoId);
    } else {
      this.cursosConfig.set(cursoId, {
        seleccionado: true,
        semestre: 1,
        obligatorio: true
      });
    }
  }

  estaSeleccionado(cursoId: number): boolean {
    return this.cursosConfig.has(cursoId);
  }

  getSemestre(cursoId: number): number {
    return this.cursosConfig.get(cursoId)?.semestre || 1;
  }

  getObligatorio(cursoId: number): boolean {
    return this.cursosConfig.get(cursoId)?.obligatorio || true;
  }

  actualizarSemestre(cursoId: number, semestre: number): void {
    const config = this.cursosConfig.get(cursoId);
    if (config) {
      config.semestre = semestre;
    }
  }

  actualizarObligatorio(cursoId: number, obligatorio: boolean): void {
    const config = this.cursosConfig.get(cursoId);
    if (config) {
      config.obligatorio = obligatorio;
    }
  }

  guardarAsignaciones(): void {
    if (!this.carreraSeleccionada) return;

    const asignaciones: CreateAsignacionDto[] = [];
    this.cursosConfig.forEach((config, cursoId) => {
      asignaciones.push({
        idCarrera: this.carreraSeleccionada!.id,
        idCurso: cursoId,
        semestre: config.semestre,
        esObligatorio: config.obligatorio
      });
    });

    this.asignacionService.createMultipleAsignaciones(this.carreraSeleccionada.id, asignaciones);
    
    this.mensajeExito = true;
    setTimeout(() => {
      this.mensajeExito = false;
    }, 3000);
  }
}
