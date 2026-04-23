import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Estudiante, CarreraResumen } from '../../models/estudiantes.model';
import { EstudianteService, MallaResumen } from '../../services/estudiantes.services';
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

  carreraSeleccionada: CarreraResumen | null = null;
  mallaPorCarrera: MallaResumen | null = null;
  cargandoMalla = false;

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
      if (this.estudiante?.carreras?.length) {
        this.seleccionarCarrera(this.estudiante.carreras[0]);
      }
    });
  }

  seleccionarCarrera(carrera: CarreraResumen): void {
    if (this.carreraSeleccionada?.idCarrera === carrera.idCarrera) return;
    this.carreraSeleccionada = carrera;
    this.cargandoMalla = true;
    this.mallaPorCarrera = null;
    this.estudianteService.getMallaEstudiante(this.estudiante!.idEstudiante, carrera.idCarrera).subscribe({
      next: res => {
        this.cargandoMalla = false;
        if (!res.blnError && res.valorRetorno) {
          this.mallaPorCarrera = res.valorRetorno;
        }
      },
      error: () => { this.cargandoMalla = false; }
    });
  }

  getProgreso(): number {
    if (!this.mallaPorCarrera?.totalCreditos) return 0;
    return Math.round((this.mallaPorCarrera.creditosAprobados / this.mallaPorCarrera.totalCreditos) * 100);
  }



  getCarrerasTexto(): string {
    if (!this.estudiante) return '';
    return (this.estudiante.carreras ?? []).map(c => `${c.codigo} — ${c.nombre}`).join('\n') || 'Sin carrera';
  }

  getCarreraNombres(): string {
    if (!this.estudiante) return 'Sin carrera';
    return (this.estudiante.carreras ?? []).map(c => c.nombre).join(' / ') || 'Sin carrera';
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




  getEstadoClass(estadoEstudiante: boolean): string {
    return estadoEstudiante ? 'badge-active' : 'badge-inactive';
  }

}
