import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

function noSoloEspacios(control: AbstractControl): ValidationErrors | null {
  if (typeof control.value === 'string' && control.value.trim().length === 0 && control.value.length > 0) {
    return { soloEspacios: true };
  }
  return null;
}
import { Administrador } from '../../../model/administrados.model';
import { Subscription } from 'rxjs';
import { AdministradorService } from '../../../services/administrador.service';

@Component({
  selector: 'app-administrador-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './administrador-form.component.html',
  styleUrls: ['./administrador-form.component.scss'],
})
export class AdministradorFormComponent implements OnChanges, OnInit {
  @Input() admin: Administrador | null = null;
  @Output() cancelar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  guardando = false;
  mensajeError = '';
  private adminsExistentes: Administrador[] = [];
  private subAdmins?: Subscription;

  adminForm: FormGroup;

  get esEdicion(): boolean {
    return this.admin !== null;
  }

  constructor(private fb: FormBuilder, private adminService: AdministradorService) {
    this.adminForm = this.fb.group({
      identificacion: ['', [Validators.required, noSoloEspacios, Validators.maxLength(20)]],
      nombre: ['', [Validators.required, noSoloEspacios, Validators.maxLength(100)]],
      correo: ['', [Validators.required, noSoloEspacios, Validators.email, Validators.maxLength(100)]],
      telefono: ['', [Validators.maxLength(20)]],
    });
  }

  ngOnInit(): void {
    this.subAdmins = this.adminService.administradores$.subscribe(a => this.adminsExistentes = a);
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
    return this.adminForm.invalid;
  }

  guardar(): void {
    if (this.formInvalido) return;
    this.mensajeError = '';

    const { identificacion, nombre, correo, telefono } = this.adminForm.value;
    const otros = this.adminsExistentes.filter(a => a.idAdministrador !== this.admin?.idAdministrador);

    if (otros.some(a => a.identificacion === identificacion.trim())) {
      this.mensajeError = 'Ya existe un administrador registrado con esa identificación.';
      return;
    }
    if (otros.some(a => a.correo?.toLowerCase() === correo.toLowerCase())) {
      this.mensajeError = 'El correo electrónico ya está registrado en otro administrador.';
      return;
    }
    if (telefono?.trim() && otros.some(a => a.telefono === telefono.trim())) {
      this.mensajeError = 'El número de teléfono ya está registrado en otro administrador.';
      return;
    }

    this.guardando = true;

    if (this.esEdicion && this.admin) {
      const updated: Administrador = {
        ...this.admin,
        identificacion,
        nombreCompleto: nombre,
        correo,
        telefono,
      };

      this.adminService.modificar(updated).subscribe({
        next: (res) => {
          this.guardando = false;
          if (!res.blnError) {
            this.guardado.emit();
          } else {
            this.mensajeError = res.strMensajeRespuesta;
          }
        },
        error: () => {
          this.guardando = false;
          this.mensajeError = 'Error de conexión al actualizar el administrador. Intente nuevamente.';
        },
      });
    } else {
      this.adminService.insertar({
        identificacion,
        nombreCompleto: nombre,
        correo,
        telefono,
      }).subscribe({
        next: (res) => {
          this.guardando = false;
          if (!res.blnError) {
            this.guardado.emit();
          } else {
            this.mensajeError = res.strMensajeRespuesta;
          }
        },
        error: () => {
          this.guardando = false;
          this.mensajeError = 'Error de conexión al crear el administrador. Intente nuevamente.';
        },
      });
    }
  }

  get identificacion() { return this.adminForm.get('identificacion'); }
  get nombre() { return this.adminForm.get('nombre'); }
  get correo() { return this.adminForm.get('correo'); }
  get telefono() { return this.adminForm.get('telefono'); }
}
