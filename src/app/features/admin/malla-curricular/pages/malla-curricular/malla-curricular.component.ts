
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first, forkJoin } from 'rxjs';
import { Carrera } from '../../../carreras/models/carrera.model';
import { CarreraService } from '../../../carreras/services/carrera.service';
import { MallaCurricular, SemestreInfo, CursoMalla } from '../../../asignaciones/models/asignacion.model';
import { AsignacionService } from '../../../asignaciones/services/asignacion.service';
import { CursoService } from '../../../cursos/services/curso.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-malla-curricular',
  templateUrl: './malla-curricular.component.html',
  imports: [CommonModule],
  styleUrls: ['./malla-curricular.component.scss']
})
export class MallaCurricularComponent implements OnInit {
  carreras$!: Observable<Carrera[]>;
  carrerasList: Carrera[] = [];
  carreraSeleccionada?: Carrera;
  carreraComboAbierto = false;
  busquedaCarrera = '';
  mallaCurricular?: MallaCurricular | null;
  cargando = false;

  constructor(
    private carreraService: CarreraService,
    private asignacionService: AsignacionService,
    private cursoService: CursoService
  ) {}

  ngOnInit(): void {
    this.carreras$ = this.carreraService.getCarrerasActivas();
    this.carreras$.subscribe(carreras => this.carrerasList = carreras);
  }

  get carreraSeleccionadaTexto(): string {
    return this.carreraSeleccionada
      ? `${this.carreraSeleccionada.codigo} - ${this.carreraSeleccionada.nombre}`
      : 'Sin selección';
  }

  get carrerasFiltradas(): Carrera[] {
    const filtradas = this.carrerasList.filter(carrera =>
      this.coincideBusqueda(`${carrera.codigo} ${carrera.nombre} ${carrera.descripcion ?? ''}`, this.busquedaCarrera)
    );

    if (!this.carreraSeleccionada || filtradas.some(c => c.idCarrera === this.carreraSeleccionada?.idCarrera)) {
      return filtradas;
    }

    return [this.carreraSeleccionada, ...filtradas];
  }

  toggleCarreraCombo(): void {
    this.carreraComboAbierto = !this.carreraComboAbierto;
  }

  cerrarComboCarrera(): void {
    this.carreraComboAbierto = false;
  }

  seleccionarCarrera(carrera?: Carrera): void {
    this.busquedaCarrera = '';
    this.carreraComboAbierto = false;

    if (!carrera) {
      this.carreraSeleccionada = undefined;
      this.mallaCurricular = undefined;
      return;
    }

    this.carreraSeleccionada = carrera;
    this.cargarMalla(carrera.idCarrera);
  }

  carreraDetalleTexto(carrera: Carrera): string {
    return `${carrera.duracion} periodos`;
  }

  actualizarBusquedaCarrera(event: Event): void {
    this.busquedaCarrera = (event.target as HTMLInputElement).value;
  }

  private cargarMalla(id: number): void {
    this.cargando = true;
    this.mallaCurricular = undefined;

    forkJoin({
      carreras: this.carreraService.carreras$.pipe(first()),
      cursos: this.cursoService.cursos$.pipe(first()),
      asignaciones: this.asignacionService.getAsignacionesByCarrera(id)
    }).subscribe({
      next: ({ carreras, cursos, asignaciones }) => {
        const carrera = carreras.find(c => c.idCarrera === id);
        const cursosMap = new Map(cursos.map(c => [c.idCurso, c]));

        const semestreMap = new Map<number, CursoMalla[]>();
        for (const asig of asignaciones) {
          const curso = cursosMap.get(asig.idCurso);
          if (!curso || !curso.estado) continue;

          const prerequisitoIds = asig.prerequisitos?.length
            ? asig.prerequisitos
            : (curso.idCursoRequisito ? [curso.idCursoRequisito] : []);

          const prerequisitos = prerequisitoIds
            .map(pid => {
              const c = cursosMap.get(pid);
              return c ? `${c.codigo} - ${c.nombre}` : undefined;
            })
            .filter((c): c is string => !!c);

          const cursoMalla: CursoMalla = {
            codigo: curso.codigo,
            nombre: curso.nombre,
            creditos: curso.creditos,
            prerequisitos
          };

          if (!semestreMap.has(asig.semestre)) {
            semestreMap.set(asig.semestre, []);
          }
          semestreMap.get(asig.semestre)!.push(cursoMalla);
        }

        const semestres: SemestreInfo[] = Array.from(semestreMap.entries())
          .sort(([a], [b]) => a - b)
          .map(([numero, cursosMalla]) => ({
            numero,
            cursos: cursosMalla,
            creditosSemestre: cursosMalla.reduce((sum, c) => sum + c.creditos, 0)
          }));

        this.mallaCurricular = {
          carrera: carrera ? `${carrera.codigo} - ${carrera.nombre}` : 'Carrera desconocida',
          semestres,
          creditosTotales: semestres.reduce((sum, s) => sum + s.creditosSemestre, 0)
        };
        this.cargando = false;
      },
      error: () => {
        this.mallaCurricular = null;
        this.cargando = false;
      }
    });
  }

  private coincideBusqueda(texto: string, busqueda: string): boolean {
    const filtro = this.normalizar(busqueda);
    if (!filtro) return true;

    const textoNormalizado = this.normalizar(texto);
    return filtro.split(/\s+/).every(parte => textoNormalizado.includes(parte));
  }

  private normalizar(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
