import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetallePago, ResumenFinanzas } from '../models/finanzas.model';
import { FinanzasService } from '../services/finanzas.service';
import { PeriodoService } from '../../periodos/services/periodos.services';
import { Periodo } from '../../periodos/models/periodos.model';

@Component({
  selector: 'app-finanzas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './finanzas.component.html',
  styleUrls: ['./finanzas.component.scss'],
})
export class FinanzasComponent implements OnInit {

  periodos: Periodo[] = [];
  selectedPeriodoId: number | 'actual' = 'actual';

  resumen: ResumenFinanzas | null = null;
  detalles: DetallePago[] = [];
  resumenTodos: ResumenFinanzas[] = [];

  cargandoResumen = false;
  cargandoDetalles = false;
  cargandoTodos = false;

  filtroEstado = 'todos';
  filtroBusqueda = '';

  vistaActual: 'resumen' | 'detalles' | 'historico' = 'resumen';

  constructor(
    private finanzasService: FinanzasService,
    private periodoService: PeriodoService,
  ) {}

  ngOnInit(): void {
    this.periodoService.getPeriodos().subscribe(periodos => {
      this.periodos = periodos;
    });
    this.cargarResumen();
    this.cargarHistorico();
  }

  onPeriodoChange(): void {
    this.cargarResumen();
    if (this.vistaActual === 'detalles' && this.selectedPeriodoId !== 'actual') {
      this.cargarDetalles();
    }
  }

  cargarResumen(): void {
    this.cargandoResumen = true;
    this.resumen = null;

    const obs = this.selectedPeriodoId === 'actual'
      ? this.finanzasService.getResumenPeriodoActual()
      : this.finanzasService.getResumenPorPeriodo(this.selectedPeriodoId as number);

    obs.subscribe({
      next: res => { this.resumen = res; this.cargandoResumen = false; },
      error: () => { this.cargandoResumen = false; }
    });
  }

  cargarDetalles(): void {
    const id = this.idPeriodoActivo;
    if (id === null) return;
    this.cargandoDetalles = true;
    this.finanzasService.getDetallesPorPeriodo(id).subscribe({
      next: detalles => { this.detalles = detalles; this.cargandoDetalles = false; },
      error: () => { this.cargandoDetalles = false; }
    });
  }

  cargarHistorico(): void {
    this.cargandoTodos = true;
    this.finanzasService.getResumenTodosPeriodos().subscribe({
      next: res => { this.resumenTodos = res; this.cargandoTodos = false; },
      error: () => { this.cargandoTodos = false; }
    });
  }

  cambiarVista(vista: 'resumen' | 'detalles' | 'historico'): void {
    this.vistaActual = vista;
    if (vista === 'detalles' && this.detalles.length === 0) {
      this.cargarDetalles();
    }
  }

  get idPeriodoActivo(): number | null {
    if (this.selectedPeriodoId === 'actual') {
      return this.resumen?.idPeriodo ?? null;
    }
    return this.selectedPeriodoId as number;
  }

  get detallesFiltrados(): DetallePago[] {
    return this.detalles.filter(d => {
      const matchEstado = this.filtroEstado === 'todos' || d.estado === this.filtroEstado;
      const term = this.filtroBusqueda.toLowerCase();
      const matchBusqueda = !term ||
        d.nombreEstudiante.toLowerCase().includes(term) ||
        d.carnetEstudiante.toLowerCase().includes(term) ||
        d.concepto.toLowerCase().includes(term);
      return matchEstado && matchBusqueda;
    });
  }

  get totalDetallesFiltrados(): number {
    return this.detallesFiltrados.reduce((sum, d) => sum + d.monto, 0);
  }

  getEstadoClass(estado: string): string {
    const map: Record<string, string> = {
      pagado: 'badge-pagado',
      pendiente: 'badge-pendiente',
      vencido: 'badge-vencido',
    };
    return map[estado] ?? 'badge-pendiente';
  }

  getEstadoLabel(estado: string): string {
    const map: Record<string, string> = {
      pagado: 'Pagado',
      pendiente: 'Pendiente',
      vencido: 'Vencido',
    };
    return map[estado] ?? estado;
  }

  getBarWidth(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  get totalGeneral(): number {
    return (this.resumen?.totalRecaudado ?? 0) + (this.resumen?.totalPendiente ?? 0) + (this.resumen?.totalVencido ?? 0);
  }

  getIniciales(nombreCompleto: string): string {
    const partes = nombreCompleto.trim().split(' ').filter(p => p.length > 0);
    if (partes.length === 0) return '?';
    if (partes.length === 1) return partes[0][0].toUpperCase();
    return (partes[0][0] + partes[1][0]).toUpperCase();
  }
}
