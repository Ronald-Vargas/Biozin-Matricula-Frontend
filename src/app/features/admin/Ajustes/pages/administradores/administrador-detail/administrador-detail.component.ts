import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Administrador } from '../../../model/administrados.model';

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

  getIniciales(): string {
    if (!this.admin) return '';
    const parts = this.admin.nombreCompleto.trim().split(' ');
    return ((parts[0]?.charAt(0) ?? '') + (parts[1]?.charAt(0) ?? '')).toUpperCase();
  }

  getEstadoClass(activo: boolean): string {
    return activo ? 'badge-active' : 'badge-inactive';
  }
}
