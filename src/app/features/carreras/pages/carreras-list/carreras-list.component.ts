import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AsignacionService } from '../../../asignaciones/services/asignacion.service';
import { PdfGeneratorService } from '../../../cursos/services/pdf-generator.service';
import { Carrera } from '../../models/carrera.model';
import { CarreraService } from '../../services/carrera.service';
import { CarreraFormComponent } from '../carrera-form/carreras-form.component';


@Component({
  selector: 'app-carreras-list',
  standalone: true,
  imports: [CarreraFormComponent, CommonModule, FormsModule],
  templateUrl: './carreras-list.html',
  styleUrls: ['./carreras-list.scss']
})

export class CarrerasListComponent implements OnInit, OnDestroy {
  carreras: Carrera[] = [];
  mostrarFormulario = false;
  carreraEditandoId: number | null = null;
  filtroNombre = '';
  filtroEstado = 'todos';
  private sub!: Subscription;

  constructor(
    private carreraService: CarreraService,
    private asignacionService: AsignacionService,
    private pdfService: PdfGeneratorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.carreraService.getCarreras().subscribe(data => {
      this.carreras = data;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get carrerasFiltradas(): Carrera[] {
    return this.carreras.filter(c => {
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
    this.filtroEstado = 'todos';
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.carreraEditandoId = null;
    }
  }

  verDetalles(id: number): void {
    this.router.navigate(['/carreras', id]);
  }

  toggleEstado(id: number): void {
    this.carreraService.toggleEstado(id);
  }

  onCarreraCreada(): void {
    this.mostrarFormulario = false;
    this.carreraEditandoId = null;
  }

  editarCarrera(id: number): void {
    this.carreraEditandoId = id;
    this.mostrarFormulario = true;
  }

  async generarPlanEstudios(carrera: Carrera): Promise<void> {
    const malla = await this.asignacionService.getMallaCurricular(carrera.idCarrera);
    if (malla) {
      this.pdfService.generarPlanEstudios(carrera, malla);
    } else {
      alert('No hay cursos asignados a esta carrera para generar el plan de estudios.');
    }
  }
}
