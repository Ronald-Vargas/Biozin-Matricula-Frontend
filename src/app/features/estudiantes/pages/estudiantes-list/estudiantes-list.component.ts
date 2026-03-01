import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Estudiante } from '../../models/estudiantes.model';
import { combineLatest, Subscription } from 'rxjs';
import { EstudianteService } from '../../services/estudiantes.services';
import { CarreraService } from '../../../carreras/services/carrera.service';


@Component({
  selector: 'app-estudiantes-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './estudiantes-list.html',
  styleUrls: ['./estudiantes-list.scss'],
})


export class EstudiantesListComponent implements OnInit, OnDestroy {

  estudiantes: Estudiante[] = [];
  estudiantesFiltrados: Estudiante[] = [];
  terminoBusqueda = '';
  filtroActivo: 'todos' | 'Activo' | 'Inactivo' = 'todos';

  private sub?: Subscription;

  constructor(
    private estudianteService: EstudianteService,
    private carreraService: CarreraService,
    private router: Router,
  ) {}



  ngOnInit(): void {
    this.sub = combineLatest([
      this.estudianteService.getEstudiantes(),
      this.carreraService.getCarreras(),
    ]).subscribe(([estudiantes, carreras]) => {
      this.estudiantes = estudiantes.map(est => {
        const carrera = carreras.find(c => c.idCarrera === est.idCarrera);
        return {
          ...est,
          carreraNombre: carrera?.nombre ?? '',
          carreraCodigo: carrera?.codigo ?? '',
        };
      });
      this.aplicarFiltros();
    });
  }



  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }





  nuevoEstudiante(): void {
    this.router.navigate(['/estudiantes/nuevo']);
  }


  buscar(): void {
    this.aplicarFiltros();
  }


  filtrar(filtro: 'todos' | 'Activo' | 'Inactivo'): void {
    this.filtroActivo = filtro;
    this.aplicarFiltros();
  }


  private aplicarFiltros(): void {
    let result = [...this.estudiantes];

    if (this.filtroActivo !== 'todos') {
      result = result.filter(e => e.estadoEstudiante === this.filtroActivo);
    }

    if (this.terminoBusqueda) {
      const term = this.terminoBusqueda.toLowerCase();
      result = result.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        p.apellidoPaterno.toLowerCase().includes(term) ||
        p.apellidoMaterno?.toLowerCase().includes(term) ||
        p.cedula.toString().includes(term) ||
        p.carreraNombre.toLowerCase().includes(term)
      );
    }

    this.estudiantesFiltrados = result;
  }



  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Activo':   return 'badge-success';
      case 'Inactivo': return 'badge-warning';
      default:         return 'badge-primary';
    }
  }


  verDetalle(est: Estudiante): void {
    this.router.navigate(['/estudiantes', est.idEstudiante]);
  }
  
  editarEstudiante(est: Estudiante): void {
    this.router.navigate(['/estudiantes/editar', est.idEstudiante]);
  }



  eliminarEstudiante(est: Estudiante): void {
    if (confirm('¿Está seguro de eliminar este estudiante?')) {
      this.estudianteService.deleteEstudiante(est.idEstudiante).subscribe();
    }
  }


  getIniciales(est: Estudiante): string {
    return (est.nombre.charAt(0) + est.apellidoPaterno.charAt(0)).toUpperCase();
  }


  getNombreCompleto(est: Estudiante): string {
    return `${est.nombre} ${est.apellidoPaterno} ${est.apellidoMaterno || ''}`.trim();
  }

}
