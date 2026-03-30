import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Administrador } from '../../../model/administrados.model';
import { AdministradorService } from '../../../services/administrador.service';

@Component({
  selector: 'app-administrador-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './administrador-list.component.html',
  styleUrls: ['./administrador-list.component.scss'],
})
export class AdministradorListComponent implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  @Output() nuevo = new EventEmitter<void>();
  @Output() editar = new EventEmitter<Administrador>();
  @Output() verDetalle = new EventEmitter<Administrador>();

  busqueda = '';
  filtroEstado = 'activo';
  admins: Administrador[] = [];
  adminAEliminar: Administrador | null = null;

  constructor(private adminService: AdministradorService) {}

  ngOnInit(): void {
    this.adminService.administradores$.subscribe(lista => {
      this.admins = lista;
    });
  }

  get adminsFiltrados(): Administrador[] {
    const term = this.busqueda.toLowerCase();
    return this.admins.filter(a => {
      const matchBusqueda = !term ||
        a.nombreCompleto.toLowerCase().includes(term) ||
        a.correo.toLowerCase().includes(term);
      const matchEstado =
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'activo' && a.activo === true) ||
        (this.filtroEstado === 'inactivo' && a.activo === false);
      return matchBusqueda && matchEstado;
    });
  }

  filtrar(estado: string): void {
    this.filtroEstado = estado;
  }

  toggleEstado(id: number): void {
    this.adminService.toggleEstado(id);
  }

  confirmarEliminar(admin: Administrador): void {
    this.adminAEliminar = admin;
  }

  eliminar(): void {
    if (!this.adminAEliminar) return;
    this.adminService.eliminar(this.adminAEliminar.idAdministrador).subscribe({
      next: () => { this.adminAEliminar = null; }
    });
  }

  cancelarEliminar(): void {
    this.adminAEliminar = null;
  }

  getEstadoClass(activo: boolean): string {
    return activo ? 'badge-active' : 'badge-inactive';
  }

  getToggleTooltip(activo: boolean): string {
    return activo ? 'Desactivar' : 'Activar';
  }
}
