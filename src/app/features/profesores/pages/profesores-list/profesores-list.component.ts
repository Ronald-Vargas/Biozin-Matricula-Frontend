import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Profesor } from '../../models/profesores.model';
import { ProfesorService } from '../../services/profesores.services';


@Component({
  selector: 'app-profesores-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profesores-list.html',
  styleUrls: ['./profesores-list.scss'],
})
export class ProfesoresListComponent implements OnInit, OnDestroy {

  profesores: Profesor[] = [];
  filtroNombre = '';
  filtroEstado = 'todos';

  private sub?: Subscription;

  constructor(
    private profesorService: ProfesorService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.sub = this.profesorService.getProfesores().subscribe(profesores => {
      this.profesores = profesores;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }


  get profesoresFiltrados(): Profesor[] {
      return this.profesores.filter(c => {
        const term = this.filtroNombre.toLowerCase();
        const matchNombre = !term || c.nombre.toLowerCase().includes(term) || c.cedula.toLowerCase().includes(term) || c.especialidad.toLowerCase().includes(term);
        const matchEstado =
          this.filtroEstado === 'todos' ||
          (this.filtroEstado === 'activo' && c.estado === true) ||
          (this.filtroEstado === 'inactivo' && c.estado === false);
        return matchNombre && matchEstado;
      });
    }



  verDetalles(id: number): void {
    this.router.navigate(['/profesores', id]);
  }

  editarProfesor(id: number): void {
    this.router.navigate(['/profesores/editar', id]);
  }

  toggleEstado(idProfesor: number): void {
    this.profesorService.toggleEstado(idProfesor);
  }

  getIniciales(prof: Profesor): string {
    return (prof.nombre.charAt(0) + prof.apellidoPaterno.charAt(0)).toUpperCase();
  }

  getNombreCompleto(prof: Profesor): string {
    return `${prof.nombre} ${prof.apellidoPaterno} ${prof.apellidoMaterno || ''}`.trim();
  }

    filtrar(estado: string): void {
    this.filtroEstado = estado;
  }

  getEstadoClass(estado: boolean): string {
    return estado ? 'badge-active' : 'badge-inactive';
  }

  getToggleButtonConfig(estado: boolean): { icon: string; tooltip: string } {
    return estado
      ? { icon: '🗑️', tooltip: 'Desactivar' }
      : { icon: '✅', tooltip: 'Activar' };
  }
}
