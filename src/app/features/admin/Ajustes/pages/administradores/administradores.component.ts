import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Administrador {
  id: number;
  nombre: string;
  usuario: string;
  correo: string;
  telefono: string;
}

@Component({
  selector: 'app-administradores',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.scss'],
})
export class AdministradoresComponent {
  @Input() visible = false;
  @Output() cerrar = new EventEmitter<void>();

  busqueda = '';
  mostrandoFormulario = false;
  guardando = false;
  adminAEliminar: Administrador | null = null;

  adminForm: FormGroup;

  admins: Administrador[] = [
    { id: 1, nombre: 'Administrador General', usuario: '1', correo: 'soporte@biozin.edu', telefono: '87776655' },
    { id: 2, nombre: 'Juan Delgado', usuario: 'jdelgado_admin', correo: 'juan.delgado@biozin.edu', telefono: '+506 8800-1234' },
    { id: 3, nombre: 'María Castro', usuario: 'mcastro_admin', correo: 'm.castro@biozin.edu', telefono: '+506 8811-9876' },
  ];

  constructor(private fb: FormBuilder) {
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

  contrasenasIguales(group: FormGroup) {
    const pass = group.get('contrasena')?.value;
    const confirm = group.get('confirmarContrasena')?.value;
    return pass === confirm ? null : { noCoinciden: true };
  }

  get adminsFiltrados(): Administrador[] {
    const term = this.busqueda.toLowerCase();
    if (!term) return this.admins;
    return this.admins.filter(
      (a) =>
        a.nombre.toLowerCase().includes(term) ||
        a.usuario.toLowerCase().includes(term) ||
        a.correo.toLowerCase().includes(term)
    );
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
    const { identificacion, nombre, usuario, correo, telefono } = this.adminForm.value;
    const nuevoAdmin: Administrador = {
      id: Date.now(),
      nombre,
      usuario,
      correo,
      telefono,
    };
    this.admins = [...this.admins, nuevoAdmin];
    this.mostrandoFormulario = false;
    this.adminForm.reset();
  }

  confirmarEliminar(admin: Administrador): void {
    this.adminAEliminar = admin;
  }

  eliminar(): void {
    if (!this.adminAEliminar) return;
    this.admins = this.admins.filter((a) => a.id !== this.adminAEliminar!.id);
    this.adminAEliminar = null;
  }

  cancelarEliminar(): void {
    this.adminAEliminar = null;
  }

  get identificacion() { return this.adminForm.get('identificacion'); }
  get nombre() { return this.adminForm.get('nombre'); }
  get usuario() { return this.adminForm.get('usuario'); }
  get correo() { return this.adminForm.get('correo'); }
  get telefono() { return this.adminForm.get('telefono'); }
  get contrasena() { return this.adminForm.get('contrasena'); }
  get confirmarContrasena() { return this.adminForm.get('confirmarContrasena'); }
}