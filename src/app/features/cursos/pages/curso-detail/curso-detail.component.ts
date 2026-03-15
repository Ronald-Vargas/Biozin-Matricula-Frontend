import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignacionService } from '../../../asignaciones/services/asignacion.service';
import { Curso } from '../../models/curso.model';
import { CursoService } from '../../services/curso.service';
import { CommonModule } from '@angular/common';
import { first } from 'rxjs';

@Component({
  selector: 'app-curso-detail',
  imports: [CommonModule],
  templateUrl: './curso-detail.html',
  styleUrl: './curso-detail.scss',
})
export class CursoDetailComponent implements OnInit {
  curso?: Curso;
  prerequisitoCurso?: Curso;
  cargando = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cursoService.getCursoById(id).subscribe({
      next: (curso) => {
        this.curso = curso;
        if (curso?.idCursoRequisito) {
          this.cursoService.cursos$.pipe(first()).subscribe(cursos => {
            this.prerequisitoCurso = cursos.find(c => c.idCurso === curso.idCursoRequisito);
          });
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener curso:', err);
        this.cargando = false;
        this.error = true;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/cursos']);
  }
}