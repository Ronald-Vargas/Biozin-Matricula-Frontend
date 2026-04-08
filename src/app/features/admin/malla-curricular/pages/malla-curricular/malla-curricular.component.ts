
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first, forkJoin } from 'rxjs';
import { Carrera } from '../../../carreras/models/carrera.model';
import { CarreraService } from '../../../carreras/services/carrera.service';
import { MallaCurricular, SemestreInfo, CursoMalla } from '../../../asignaciones/models/asignacion.model';
import { AsignacionService } from '../../../asignaciones/services/asignacion.service';
import { CursoService } from '../../../cursos/services/curso.service';
import { CommonModule, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-malla-curricular',
  templateUrl: './malla-curricular.component.html',
  imports: [CommonModule, AsyncPipe],
  styleUrls: ['./malla-curricular.component.scss']
})
export class MallaCurricularComponent implements OnInit {
  carreras$!: Observable<Carrera[]>;
  mallaCurricular?: MallaCurricular | null;
  cargando = false;

  constructor(
    private carreraService: CarreraService,
    private asignacionService: AsignacionService,
    private cursoService: CursoService
  ) {}

  ngOnInit(): void {
    this.carreras$ = this.carreraService.getCarrerasActivas();
  }

  onCarreraSeleccionada(event: any): void {
    const id = Number(event.target.value);
    if (!id) {
      this.mallaCurricular = undefined;
      return;
    }

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
}
