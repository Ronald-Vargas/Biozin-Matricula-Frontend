import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Administrador } from '../../model/administrados.model';
import { AdministradorService } from '../../services/administrador.service';


@Component({
  selector: 'app-administradores',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.scss'],
})
export class AdministradoresComponent implements OnInit {
  @Input() visible = false;
  @Output() cerrar = new EventEmitter<void>();

  busqueda = '';
  filtroEstado = 'activo';
  mostrandoFormulario = false;
  guardando = false;
  adminAEliminar: Administrador | null = null;

  adminForm: FormGroup;
  admins: Administrador[] = [];

  constructor(private fb: FormBuilder, private adminService: AdministradorService) {
    this.adminForm = this.fb.group({
      identificacion: ['', [Validators.required, Validators.maxLength(20)]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      usuario: ['', [Validators.required, Validators.maxLength(50)]],
      correo: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      telefono: ['', [Validators.maxLength(20)]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]],
    }, { validators: this.contrasenasIguales });
  }

  ngOnInit(): void {
    this.adminService.administradores$.subscribe(lista => {
      this.admins = lista;
    });
  }

  contrasenasIguales(group: FormGroup) {
    const pass = group.get('contrasena')?.value;
    const confirm = group.get('confirmarContrasena')?.value;
    return pass === confirm ? null : { noCoinciden: true };
  }

  get adminsFiltrados(): Administrador[] {
    const term = this.busqueda.toLowerCase();
    return this.admins.filter(a => {
      const matchBusqueda = !term ||
        a.nombreCompleto.toLowerCase().includes(term) ||
        a.usuario.toLowerCase().includes(term) ||
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

  getEstadoClass(activo: boolean): string {
    return activo ? 'badge-active' : 'badge-inactive';
  }

  getToggleButtonConfig(activo: boolean): { icon: string; tooltip: string } {
    return activo
      ? { icon: '🗑️', tooltip: 'Desactivar' }
      : { icon: '✅', tooltip: 'Activar' };
  }

  abrirFormulario(): void {
    this.adminForm.reset();
    this.mostrandoFormulario = true;
  }

  cancelarFormulario(): void {
    this.mostrandoFormulario = false;
    this.adminForm.reset();
  }

  agregarAdmin(): void {
    if (this.adminForm.invalid) return;
    const { identificacion, nombre, usuario, correo, telefono, contrasena } = this.adminForm.value;

    this.guardando = true;
    this.adminService.insertar({
      identificacion,
      nombreCompleto: nombre,
      usuario,
      correo: correo,
      telefono,
      Contraseña: contrasena,
    }).subscribe({
      next: () => {
        this.mostrandoFormulario = false;
        this.adminForm.reset();
        this.guardando = false;
      },
      error: () => {
        this.guardando = false;
      }
    });
  }

  get identificacion() { return this.adminForm.get('identificacion'); }
  get nombre() { return this.adminForm.get('nombre'); }
  get usuario() { return this.adminForm.get('usuario'); }
  get correo() { return this.adminForm.get('correo'); }
  get telefono() { return this.adminForm.get('telefono'); }
  get contrasena() { return this.adminForm.get('contrasena'); }
  get confirmarContrasena() { return this.adminForm.get('confirmarContrasena'); }
}

