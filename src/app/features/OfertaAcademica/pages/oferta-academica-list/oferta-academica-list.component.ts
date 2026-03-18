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
  busqueda = '';
  mostrarModal = false;

  constructor(private ofertaService: OfertaAcademicaService) {}

  ngOnInit(): void {
    this.ofertaService.getAll().subscribe((ofertas) => {
      this.ofertas = ofertas;
      this.filtrar();
    });
  }


  filtrar(): void {
    let resultado = this.ofertas;

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