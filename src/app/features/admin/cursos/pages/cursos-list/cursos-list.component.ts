import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Curso } from '../../models/curso.model';
import { CursoService } from '../../services/curso.service';
import { CursoFormComponent } from '../curso-form/curso-form.component';


@Component({
  selector: 'app-cursos-list',
  standalone: true,
  imports: [CursoFormComponent, CommonModule, FormsModule],
  templateUrl: './cursos-list.html',
  styleUrls: ['./cursos-list.scss']
})

export class CursosListComponent implements OnInit, OnDestroy {
  cursos: Curso[] = [];
  mostrarFormulario = false;
  cursoEditandoId: number | null = null;
  filtroNombre = '';
  filtroEstado = 'activo';
  private sub!: Subscription;

  constructor(
    private cursoService: CursoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.cursoService.getCursos().subscribe(data => {
      this.cursos = data;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get cursosFiltrados(): Curso[] {
    return this.cursos.filter(c => {
      const term = this.filtroNombre.toLowerCase();
      const matchNombre = !term || c.nombre.toLowerCase().includes(term) || c.codigo.toLowerCase().includes(term);
      const matchEstado =
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'activo' && c.estado === true) ||
        (this.filtroEstado === 'inactivo' && c.estado === false);
      return matchNombre && matchEstado;
    });
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroEstado = 'activo';
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.cursoEditandoId = null;
    }
  }

  verDetalles(id: number): void {
    this.router.navigate(['/cursos', id]);
  }

  toggleEstado(idCurso: number): void {
    this.cursoService.toggleEstado(idCurso);
  }

  onCursoCreado(): void {
    this.mostrarFormulario = false;
    this.cursoEditandoId = null;
  }

  editarCurso(id: number): void {
    this.cursoEditandoId = id;
    this.mostrarFormulario = true;
  }


  getToggleButtonConfig(estado: boolean): { icon: string; label: string; tooltip: string } {
    return estado
      ? { icon: '🗑️' , label: 'Desactivar', tooltip: 'Desactivar' }
      : { icon: '✅', label: 'Activar', tooltip: 'Activar' };
  }

  
}
