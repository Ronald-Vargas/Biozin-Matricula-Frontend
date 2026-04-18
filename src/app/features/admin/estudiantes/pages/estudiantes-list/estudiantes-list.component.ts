import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Estudiante } from '../../models/estudiantes.model';
import { combineLatest, Subscription } from 'rxjs';
import { EstudianteService } from '../../services/estudiantes.services';
import { CarreraService } from '../../../carreras/services/carrera.service';
import { Carrera } from '../../../carreras/models/carrera.model';


@Component({
  selector: 'app-estudiantes-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './estudiantes-list.html',
  styleUrls: ['./estudiantes-list.scss'],
})


export class EstudiantesListComponent implements OnInit, OnDestroy {

  estudiantes: Estudiante[] = [];
  carreras: Carrera[] = [];
  filtroNombre = '';
  filtroEstado = 'activo';
  filtroCarrera = 0;

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
      this.carreras = carreras;
      this.estudiantes = estudiantes.map(est => {
        const carrera = carreras.find(c => c.idCarrera === est.idCarrera);
        return {
          ...est,
          carreraNombre: carrera?.nombre ?? '',
          carreraCodigo: carrera?.codigo ?? '',
        };
      });
    });
  }



  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }


  

  get estudiantesFiltrados(): Estudiante[] {
    return this.estudiantes.filter(c => {
      const term = this.filtroNombre.toLowerCase();
      const matchNombre = !term || c.nombre.toLowerCase().includes(term) || c.cedula.toLowerCase().includes(term) || c.emailInstitucional.toLowerCase().includes(term);
      const matchEstado =
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'activo' && c.estadoEstudiante === true) ||
        (this.filtroEstado === 'inactivo' && c.estadoEstudiante === false);
      const matchCarrera = !this.filtroCarrera || c.idCarrera === this.filtroCarrera;
      return matchNombre && matchEstado && matchCarrera;
    });
  }




  nuevoEstudiante(): void {
    this.router.navigate(['/estudiantes/nuevo']);
  }


  filtrar(estado: string): void {
    this.filtroEstado = estado;
  }



  getEstadoClass(estado: boolean): string {
    return estado ? 'badge-active' : 'badge-inactive';
  }

  toggleEstado(idProfesor: number): void {
    this.estudianteService.toggleEstado(idProfesor);
  }


  verDetalle(est: Estudiante): void {
    this.router.navigate(['/estudiantes', est.idEstudiante]);
  }
  
  editarEstudiante(est: Estudiante): void {
    this.router.navigate(['/estudiantes/editar', est.idEstudiante]);
  }


  getIniciales(est: Estudiante): string {
    return (est.nombre.charAt(0) + est.apellidoPaterno.charAt(0)).toUpperCase();
  }


  getNombreCompleto(est: Estudiante): string {
    return `${est.nombre} ${est.apellidoPaterno} ${est.apellidoMaterno || ''}`.trim();
  }

  getToggleButtonConfig(estado: boolean): { icon: string; tooltip: string } {
    return estado
      ? { icon: '🗑️', tooltip: 'Desactivar' }
      : { icon: '✅', tooltip: 'Activar' };
  }

}
