import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Curso } from '../../models/curso.model';
import { Router } from '@angular/router';
import { AsignacionService } from '../../../asignaciones/services/asignacion.service';
import { CursoService } from '../../services/curso.service';
import { CursoFormComponent } from '../curso-form/curso-form.component';

@Component({
  selector: 'aapp-cursos-list',
  standalone: true,
  imports: [CursoFormComponent, CommonModule],
  templateUrl: './cursos-list.html',
  styleUrls: ['./cursos-list.scss']
})

export class CursosListComponent implements OnInit {
  cursos$!: Observable<Curso[]>;
  mostrarFormulario = false;

  constructor(
    private cursoService: CursoService,
    private asignacionService: AsignacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cursos$ = this.cursoService.getCursos();
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  verDetalles(id: number): void {
    this.router.navigate(['/cursos', id]);
  }

  eliminarCurso(id: number): void {
    if (confirm('¿Está seguro de eliminar este curso? También se eliminarán sus asignaciones.')) {
      this.cursoService.deleteCurso(id);
    }
  }

  onCursoCreado(): void {
    this.mostrarFormulario = false;
  }
}
