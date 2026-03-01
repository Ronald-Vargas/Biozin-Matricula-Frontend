import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Curso } from '../../models/curso.model';
import { CursoService } from '../../services/curso.service';
import { CursoFormComponent } from '../curso-form/curso-form.component';


@Component({
  selector: 'app-cursos-list',
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

  toggleEstado(idCurso: number): void {
    this.cursoService.toggleEstado(idCurso );
  }

  onCursoCreado(): void {
    this.mostrarFormulario = false;
  }


}