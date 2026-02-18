import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfertaAcademicaService } from '../../services/oferta-academica.service';
import { OfertaAcademica } from '../../models/oferta-academica.model';
import { OfertaAcademicaFormComponent } from '../oferta-academica-form/oferta-academica-form.component';

@Component({
  selector: 'app-oferta-academica-list',
  standalone: true,
  imports: [CommonModule, FormsModule, OfertaAcademicaFormComponent],
  templateUrl: './oferta-academica-list.component.html',
  styleUrls: ['./oferta-academica-list.component.scss'],
})


export class OfertaAcademicaListComponent implements OnInit {
  
  ofertas: OfertaAcademica[] = [];
  ofertasFiltradas: OfertaAcademica[] = [];
  periodos: { id: string; nombre: string }[] = [];
  periodoSeleccionado = '';
  busqueda = '';
  mostrarModal = false;

  constructor(private ofertaService: OfertaAcademicaService) {}

  ngOnInit(): void {
    this.ofertaService.getAll().subscribe((ofertas) => {
      this.ofertas = ofertas;
      this.actualizarPeriodos();
      this.filtrar();
    });
  }

  private actualizarPeriodos(): void {
    const map = new Map<string, string>();
    this.ofertas.forEach((o) => map.set(o.periodoId, o.periodoNombre));
    this.periodos = Array.from(map, ([id, nombre]) => ({ id, nombre }));

    // Seleccionar el primer período si no hay selección
    if (!this.periodoSeleccionado && this.periodos.length > 0) {
      this.periodoSeleccionado = this.periodos[0].id;
    }
  }

  filtrar(): void {
    let resultado = this.ofertas;

    // Filtrar por período
    if (this.periodoSeleccionado) {
      resultado = resultado.filter((o) => o.periodoId === this.periodoSeleccionado);
    }

    // Filtrar por búsqueda
    if (this.busqueda.trim()) {
      const termino = this.busqueda.toLowerCase();
      resultado = resultado.filter(
        (o) =>
          o.cursoNombre.toLowerCase().includes(termino) ||
          o.cursoCodigo.toLowerCase().includes(termino) ||
          o.profesorNombre.toLowerCase().includes(termino) ||
          o.aula.toLowerCase().includes(termino)
      );
    }

    this.ofertasFiltradas = resultado;
  }

  seleccionarPeriodo(periodoId: string): void {
    this.periodoSeleccionado = periodoId;
    this.filtrar();
  }

  getPorcentajeOcupacion(oferta: OfertaAcademica): number {
    if (oferta.cupoMaximo === 0) return 0;
    return Math.round((oferta.matriculados / oferta.cupoMaximo) * 100);
  }

  getClaseProgreso(oferta: OfertaAcademica): string {
    const porcentaje = this.getPorcentajeOcupacion(oferta);
    if (porcentaje >= 85) return 'high';
    if (porcentaje >= 50) return 'mid';
    return 'low';
  }

  getCuposDisponibles(oferta: OfertaAcademica): number {
    return Math.max(0, oferta.cupoMaximo - oferta.matriculados);
  }

  toggleEstado(oferta: OfertaAcademica): void {
    this.ofertaService.toggleEstado(oferta.id);
  }

  eliminar(oferta: OfertaAcademica): void {
    if (confirm(`¿Eliminar la oferta de "${oferta.cursoNombre}"?`)) {
      this.ofertaService.eliminar(oferta.id);
    }
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  onOfertaCreada(): void {
    this.filtrar();
  }

  formatPrecio(precio: number): string {
    return '₡' + precio.toLocaleString('es-CR');
  }
}