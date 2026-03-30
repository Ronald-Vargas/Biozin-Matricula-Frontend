import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as bcrypt from 'bcryptjs';
import { Administrador } from '../../../model/administrados.model';
import { AdministradorService } from '../../../services/administrador.service';

@Component({
  selector: 'app-administrador-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './administrador-form.component.html',
  styleUrls: ['./administrador-form.component.scss'],
})
export class AdministradorFormComponent implements OnChanges {
  @Input() admin: Administrador | null = null;
  @Output() cancelar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  guardando = false;
  mostrarCambioContrasena = false;
  errorContrasenaActual = false;

  adminForm: FormGroup;
  passwordForm: FormGroup;
  cambioContrasenaForm: FormGroup;

  get esEdicion(): boolean {
    return this.admin !== null;
  }

  constructor(private fb: FormBuilder, private adminService: AdministradorService) {
    this.adminForm = this.fb.group({
      identificacion: ['', [Validators.required, Validators.maxLength(20)]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      correo: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      telefono: ['', [Validators.maxLength(20)]],
    });

    this.passwordForm = this.fb.group({
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]],
    }, { validators: this.contrasenasIguales });

    this.cambioContrasenaForm = this.fb.group({
      contrasenaActual: ['', [Validators.required]],
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarNueva: ['', [Validators.required]],
    }, { validators: this.nuevasContrasenasIguales });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['admin']) {
      this.mostrarCambioContrasena = false;
      this.errorContrasenaActual = false;
      this.cambioContrasenaForm.reset();
      this.passwordForm.reset();

      if (this.admin) {
        this.adminForm.patchValue({
          identificacion: this.admin.identificacion,
          nombre: this.admin.nombreCompleto,
          correo: this.admin.correo,
          telefono: this.admin.telefono,
        });
      } else {
        this.adminForm.reset();
      }
    }
  }

  contrasenasIguales(group: FormGroup) {
    const pass = group.get('contrasena')?.value;
    const confirm = group.get('confirmarContrasena')?.value;
    return pass === confirm ? null : { noCoinciden: true };
  }

  nuevasContrasenasIguales(group: FormGroup) {
    const nueva = group.get('nuevaContrasena')?.value;
    const confirm = group.get('confirmarNueva')?.value;
    return nueva === confirm ? null : { noCoinciden: true };
  }

  toggleCambioContrasena(): void {
    this.mostrarCambioContrasena = !this.mostrarCambioContrasena;
    this.errorContrasenaActual = false;
    if (!this.mostrarCambioContrasena) {
      this.cambioContrasenaForm.reset();
    }
  }

  get formInvalido(): boolean {
    if (this.adminForm.invalid) return true;
    if (!this.esEdicion && this.passwordForm.invalid) return true;
    if (this.esEdicion && this.mostrarCambioContrasena && this.cambioContrasenaForm.invalid) return true;
    return false;
  }

  guardar(): void {
    if (this.formInvalido) return;
    this.guardando = true;
    this.errorContrasenaActual = false;

    const { identificacion, nombre, usuario, correo, telefono } = this.adminForm.value;

    if (this.esEdicion && this.admin) {
      // Enviar contraseña vacía por defecto: el backend NO la toca si llega vacía
      let nuevaContrasena = '';

      if (this.mostrarCambioContrasena) {
        const { contrasenaActual, nuevaContrasena: nueva } = this.cambioContrasenaForm.value;

        if (!bcrypt.compareSync(contrasenaActual, this.admin.contraseña)) {
          this.errorContrasenaActual = true;
          this.guardando = false;
          return;
        }
        nuevaContrasena = nueva;
      }

      const updated: Administrador = {
        ...this.admin,
        identificacion,
        nombreCompleto: nombre,
        correo,
        telefono,
        contraseña: nuevaContrasena,
      };

      this.adminService.modificar(updated).subscribe({
        next: () => { this.guardando = false; this.guardado.emit(); },
        error: () => { this.guardando = false; },
      });
    } else {
      this.adminService.insertar({
        identificacion,
        nombreCompleto: nombre,
        correo,
        emailInstitucional: identificacion + '@admin.biozin.edu.cr',
        telefono,
        contraseña: this.passwordForm.get('contrasena')!.value,
      }).subscribe({
        next: () => { this.guardando = false; this.guardado.emit(); },
        error: () => { this.guardando = false; },
      });
    }
  }

  get identificacion() { return this.adminForm.get('identificacion'); }
  get nombre() { return this.adminForm.get('nombre'); }
  get correo() { return this.adminForm.get('correo'); }
  get telefono() { return this.adminForm.get('telefono'); }
  get contrasena() { return this.passwordForm.get('contrasena'); }
  get confirmarContrasena() { return this.passwordForm.get('confirmarContrasena'); }
  get contrasenaActual() { return this.cambioContrasenaForm.get('contrasenaActual'); }
  get nuevaContrasena() { return this.cambioContrasenaForm.get('nuevaContrasena'); }
  get confirmarNueva() { return this.cambioContrasenaForm.get('confirmarNueva'); }
}
