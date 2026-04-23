import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Administrador } from '../../../model/administrados.model';
import { AdministradorService } from '../../../services/administrador.service';

@Component({
  selector: 'app-administrador-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './administrador-detail.component.html',
  styleUrls: ['./administrador-detail.component.scss'],
})
export class AdministradorDetailComponent {
  @Input() admin!: Administrador;
  @Output() cerrar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<Administrador>();

  reenviandoCredenciales = false;
  mensajeReenvio = '';
  errorReenvio = '';

  constructor(private adminService: AdministradorService) {}

  reenviarCredenciales(): void {
    if (!this.admin || this.reenviandoCredenciales) return;
    this.reenviandoCredenciales = true;
    this.mensajeReenvio = '';
    this.errorReenvio = '';
    this.adminService.reenviarCredenciales(this.admin.idAdministrador).subscribe({
      next: res => {
        this.reenviandoCredenciales = false;
        if (res.blnError) this.errorReenvio = res.strMensajeRespuesta;
        else this.mensajeReenvio = 'Credenciales reenviadas correctamente.';
      },
      error: () => {
        this.reenviandoCredenciales = false;
        this.errorReenvio = 'Error de conexión al reenviar credenciales.';
      }
    });
  }

  getIniciales(): string {
    if (!this.admin) return '';
    const parts = this.admin.nombreCompleto.trim().split(' ');
    return ((parts[0]?.charAt(0) ?? '') + (parts[1]?.charAt(0) ?? '')).toUpperCase();
  }

  getEstadoClass(activo: boolean): string {
    return activo ? 'badge-active' : 'badge-inactive';
  }
}
