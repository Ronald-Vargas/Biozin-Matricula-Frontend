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
  profesoresFiltrados: Profesor[] = [];
  terminoBusqueda = '';
  filtroActivo: 'todos' | 'activo' | 'inactivo' = 'todos';

  private sub?: Subscription;

  constructor(
    private profesorService: ProfesorService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.sub = this.profesorService.getProfesores().subscribe(profesores => {
      this.profesores = profesores;
      this.aplicarFiltros();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  buscar(): void {
    this.aplicarFiltros();
  }

  filtrar(filtro: 'todos' | 'activo' | 'inactivo'): void {
    this.filtroActivo = filtro;
    this.aplicarFiltros();
  }

  private aplicarFiltros(): void {
    let result = [...this.profesores];

    if (this.filtroActivo !== 'todos') {
      result = result.filter(e => e.estado === this.filtroActivo);
    }

    if (this.terminoBusqueda) {
      const term = this.terminoBusqueda.toLowerCase();
      result = result.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        p.apellidoPaterno.toLowerCase().includes(term) ||
        p.cedula.toString().includes(term) ||
        p.especialidad.toLowerCase().includes(term)
      );
    }

    this.profesoresFiltrados = result;
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Activo':   return 'badge-success';
      case 'Inactivo': return 'badge-warning';
      default:         return 'badge-primary';
    }
  }
  

  verDetalles(id: number): void {
    this.router.navigate(['/profesores', id]);
  }

  editarProfesor(id: number): void {
    this.router.navigate(['/profesores/editar', id]);
  }

  eliminaProfesor(idProfesor: number): void {
    if (confirm('¿Está seguro de eliminar este profesor?')) {
      this.profesorService.deleteProfesor(idProfesor).subscribe();
    }
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
}
