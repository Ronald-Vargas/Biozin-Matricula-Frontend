import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Pago {
  id: number;
  concepto: string;
  monto: number;
  fechaVencimiento: string;
  fechaPago: string | null;
  estado: 'pagado' | 'pendiente' | 'vencido';
  periodo: string;
}

@Component({
  selector: 'app-portal-pagos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portal-pagos.html',
  styleUrls: ['./portal-pagos.scss'],
})
export class PortalPagosComponent {

  pagoSeleccionado: Pago | null = null;
  pagoConfirmado = false;

  pagos: Pago[] = [
    {
      id: 1,
      concepto: 'Matrícula — Período 2026-1',
      monto: 25000,
      fechaVencimiento: '2026-02-10',
      fechaPago: null,
      estado: 'pendiente',
      periodo: '2026-1',
    },
    {
      id: 2,
      concepto: 'Cursos — Cuota 1/3 (2026-1)',
      monto: 113333,
      fechaVencimiento: '2026-02-28',
      fechaPago: null,
      estado: 'pendiente',
      periodo: '2026-1',
    },
    {
      id: 3,
      concepto: 'Matrícula — Período 2025-2',
      monto: 25000,
      fechaVencimiento: '2025-07-10',
      fechaPago: '2025-07-08',
      estado: 'pagado',
      periodo: '2025-2',
    },
    {
      id: 4,
      concepto: 'Cursos — Cuota 1/3 (2025-2)',
      monto: 113333,
      fechaVencimiento: '2025-07-31',
      fechaPago: '2025-07-29',
      estado: 'pagado',
      periodo: '2025-2',
    },
    {
      id: 5,
      concepto: 'Cursos — Cuota 2/3 (2025-2)',
      monto: 113333,
      fechaVencimiento: '2025-09-30',
      fechaPago: '2025-09-28',
      estado: 'pagado',
      periodo: '2025-2',
    },
    {
      id: 6,
      concepto: 'Cursos — Cuota 3/3 (2025-2)',
      monto: 113333,
      fechaVencimiento: '2025-11-30',
      fechaPago: '2025-11-27',
      estado: 'pagado',
      periodo: '2025-2',
    },
  ];

  get pagosPendientes(): Pago[] {
    return this.pagos.filter((p) => p.estado === 'pendiente' || p.estado === 'vencido');
  }

  get pagosRealizados(): Pago[] {
    return this.pagos.filter((p) => p.estado === 'pagado');
  }

  get totalPendiente(): number {
    return this.pagosPendientes.reduce((acc, p) => acc + p.monto, 0);
  }

  get totalPagado(): number {
    return this.pagosRealizados.reduce((acc, p) => acc + p.monto, 0);
  }

  abrirPago(pago: Pago): void {
    this.pagoSeleccionado = pago;
    this.pagoConfirmado = false;
  }

  cancelarPago(): void {
    this.pagoSeleccionado = null;
    this.pagoConfirmado = false;
  }

  procesarPago(): void {
    this.pagoConfirmado = true;
    if (this.pagoSeleccionado) {
      const pago = this.pagos.find((p) => p.id === this.pagoSeleccionado!.id);
      if (pago) {
        pago.estado = 'pagado';
        pago.fechaPago = new Date().toISOString().split('T')[0];
      }
    }
  }

  cerrarModal(): void {
    this.pagoSeleccionado = null;
    this.pagoConfirmado = false;
  }
}
