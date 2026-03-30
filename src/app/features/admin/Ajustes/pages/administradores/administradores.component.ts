import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Administrador } from '../../model/administrados.model';
import { AdministradorListComponent } from './administrador-list/administrador-list.component';
import { AdministradorFormComponent } from './administrador-form/administrador-form.component';
import { AdministradorDetailComponent } from './administrador-detail/administrador-detail.component';

type Vista = 'list' | 'form' | 'detail';

@Component({
  selector: 'app-administradores',
  standalone: true,
  imports: [CommonModule, AdministradorListComponent, AdministradorFormComponent, AdministradorDetailComponent],
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.scss'],
})
export class AdministradoresComponent {
  @Input() visible = false;
  @Output() cerrar = new EventEmitter<void>();

  vista: Vista = 'list';
  adminSeleccionado: Administrador | null = null;

  abrirNuevo(): void {
    this.adminSeleccionado = null;
    this.vista = 'form';
  }

  abrirEditar(admin: Administrador): void {
    this.adminSeleccionado = admin;
    this.vista = 'form';
  }

  abrirDetalle(admin: Administrador): void {
    this.adminSeleccionado = admin;
    this.vista = 'detail';
  }

  volverALista(): void {
    this.vista = 'list';
    this.adminSeleccionado = null;
  }

  onCerrar(): void {
    this.vista = 'list';
    this.adminSeleccionado = null;
    this.cerrar.emit();
  }
}
