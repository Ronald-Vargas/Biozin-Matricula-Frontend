import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalService } from '../../services/portal.service';
import { Pago } from '../../models/portal.models';

@Component({
  selector: 'app-portal-pagos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portal-pagos.html',
  styleUrls: ['./portal-pagos.scss'],
})
export class PortalPagosComponent implements OnInit {

  cargando = true;
  pagoSeleccionado: Pago | null = null;
  pagoConfirmado = false;
  procesando = false;
  metodoPago: 'tarjeta' | 'transferencia' = 'tarjeta';

  pagos: Pago[] = [];

  constructor(private portalService: PortalService) {}

  ngOnInit(): void {
    this.cargarPagos();
  }

  cargarPagos(): void {
    this.cargando = true;
    this.portalService.getPagos().subscribe({
      next: (res) => {
        this.cargando = false;
        if (!res.blnError) {
          this.pagos = res.valorRetorno || [];
        }
      },
      error: () => { this.cargando = false; },
    });
  }

  get pagosPendientes(): Pago[] {
    return this.pagos.filter((p) => p.estado === 'pendiente');
  }

  get pagosVencidos(): Pago[] {
    return this.pagos.filter((p) => p.estado === 'vencido');
  }

  get pagosRealizados(): Pago[] {
    return this.pagos.filter((p) => p.estado === 'pagado');
  }

  get totalPendiente(): number {
    return this.pagosPendientes.reduce((acc, p) => acc + p.monto, 0);
  }

  get totalVencido(): number {
    return this.pagosVencidos.reduce((acc, p) => acc + p.monto, 0);
  }

  get totalPagado(): number {
    return this.pagosRealizados.reduce((acc, p) => acc + p.monto, 0);
  }

  abrirPago(pago: Pago): void {
    this.pagoSeleccionado = pago;
    this.pagoConfirmado = false;
    this.metodoPago = 'tarjeta';
  }

  seleccionarMetodo(metodo: 'tarjeta' | 'transferencia'): void {
    this.metodoPago = metodo;
  }

  cancelarPago(): void {
    this.pagoSeleccionado = null;
    this.pagoConfirmado = false;
  }

  procesarPago(): void {
    if (!this.pagoSeleccionado) return;
    this.procesando = true;

    this.portalService.pagar(this.pagoSeleccionado.idPago).subscribe({
      next: (res) => {
        this.procesando = false;
        if (!res.blnError) {
          this.pagoConfirmado = true;
          this.cargarPagos();
        }
      },
      error: () => { this.procesando = false; },
    });
  }

  cerrarModal(): void {
    this.pagoSeleccionado = null;
    this.pagoConfirmado = false;
  }
}
