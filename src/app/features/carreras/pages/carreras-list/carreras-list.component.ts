import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AsignacionService } from '../../../asignaciones/services/asignacion.service';
import { PdfGeneratorService } from '../../../cursos/services/pdf-generator.service';
import { Carrera } from '../../models/carrera.model';
import { CarreraService } from '../../services/carrera.service';
import { CarreraFormComponent } from '../carrera-form/carreras-form.component';


@Component({
  selector: 'app-carreras-list',
  standalone: true,
  imports: [CarreraFormComponent, CommonModule],
  templateUrl: './carreras-list.html',
  styleUrls: ['./carreras-list.scss']
})

export class CarrerasListComponent implements OnInit {
  carreras$!: Observable<Carrera[]>;
  mostrarFormulario = false;

  constructor(
    private carreraService: CarreraService,
    private asignacionService: AsignacionService,
    private pdfService: PdfGeneratorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carreras$ = this.carreraService.getCarreras();
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  verDetalles(id: number): void {
    this.router.navigate(['/carreras', id]);
  }

  eliminarCarrera(id: number): void {
    if (confirm('¿Está seguro de eliminar esta carrera? También se eliminarán sus asignaciones.')) {
      this.carreraService.deleteCarrera(id);
      this.asignacionService.deleteAsignacionesByCarrera(id);
    }
  }

  toggleEstado(id: number): void {
    this.carreraService.toggleEstado(id);
  }

  generarPlanEstudios(carrera: Carrera): void {
    const malla = this.asignacionService.getMallaCurricular(carrera.id);
    if (malla) {
      this.pdfService.generarPlanEstudios(carrera, malla);
    } else {
      alert('No hay cursos asignados a esta carrera para generar el plan de estudios.');
    }
  }

  onCarreraCreada(): void {
    this.mostrarFormulario = false;
  }
}