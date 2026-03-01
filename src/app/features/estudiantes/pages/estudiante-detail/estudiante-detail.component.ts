import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Estudiante } from '../../models/estudiantes.model';
import { EstudianteService } from '../../services/estudiantes.services';
import { CarreraService } from '../../../carreras/services/carrera.service';
import { Carrera } from '../../../carreras/models/carrera.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estudiante-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './estudiante-detail.html',
  styleUrl: './estudiante-detail.scss',
})
export class EstudianteDetailComponent implements OnInit {

  estudiante: Estudiante | null = null;
  carreras: Carrera[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private estudianteService: EstudianteService,
    private carreraService: CarreraService,
  ) {}

  ngOnInit(): void {
    this.carreraService.getCarreras().subscribe(c => this.carreras = c);
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.estudianteService.getEstudianteById(id).subscribe(est => {
      this.estudiante = est ?? null;
    });
  }

  getCarreraNombre(): string {
    if (!this.estudiante) return '';
    const c = this.carreras.find(c => c.idCarrera === this.estudiante!.idCarrera);
    return c?.nombre ?? this.estudiante.carreraNombre ?? '';
  }

  getCarreraCodigo(): string {
    if (!this.estudiante) return '';
    const c = this.carreras.find(c => c.idCarrera === this.estudiante!.idCarrera);
    return c?.codigo ?? this.estudiante.carreraCodigo ?? '';
  }

  getProgreso(): number {
    if (!this.estudiante) return 0;
    return Math.round((this.estudiante.creditosAprobados / this.estudiante.creditosTotales) * 100);
  }

  getIniciales(): string {
    if (!this.estudiante) return '';
    return (this.estudiante.nombre.charAt(0) + this.estudiante.apellidoPaterno.charAt(0)).toUpperCase();
  }

  getNombreCompleto(): string {
    if (!this.estudiante) return '';
    const est = this.estudiante;
    return `${est.nombre} ${est.apellidoPaterno} ${est.apellidoMaterno || ''}`.trim();
  }

  getEstadoClass(): string {
    if (!this.estudiante) return '';
    switch (this.estudiante.estadoEstudiante) {
      case 'Activo':   return 'badge-success';
      case 'Inactivo': return 'badge-warning';
      default:         return 'badge-primary';
    }
  }

  getEdad(): number {
    if (!this.estudiante?.fechaNacimiento) return 0;
    const hoy = new Date();
    const nac = new Date(this.estudiante.fechaNacimiento);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
  }

  editarEstudiante(): void {
    if (this.estudiante) {
      this.router.navigate(['/estudiantes/editar', this.estudiante.idEstudiante]);
    }
  }

  volver(): void {
    this.router.navigate(['/estudiantes']);
  }
}
