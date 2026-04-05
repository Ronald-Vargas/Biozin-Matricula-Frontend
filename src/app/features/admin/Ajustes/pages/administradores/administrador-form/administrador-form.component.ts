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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['admin']) {
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

  get formInvalido(): boolean {
    if (this.adminForm.invalid) return true;
    if (!this.esEdicion ) return true;
    if (this.esEdicion) return true;
    return false;
  }

  guardar(): void {
    if (this.formInvalido) return;
    this.guardando = true;

    const { identificacion, nombre, correo, telefono } = this.adminForm.value;

    if (this.esEdicion && this.admin) {

      const updated: Administrador = {
        ...this.admin,
        identificacion,
        nombreCompleto: nombre,
        correo,
        telefono,
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
}
