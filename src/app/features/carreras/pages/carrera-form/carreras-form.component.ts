import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarreraService } from '../../services/carrera.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carreras-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './carreras-form.html',
  styleUrl: './carreras-form.scss',
})
export class CarreraFormComponent {

  @Output() carreraCreada = new EventEmitter<void>();
  carreraForm: FormGroup;
  mensajeExito = false;

  constructor(
    private fb: FormBuilder,
    private carreraService: CarreraService
  ) {
    this.carreraForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', Validators.required],
      duracion: ['', [Validators.required, Validators.min(1), Validators.max(15)]]
    });
  }

  onSubmit(): void {
    if (this.carreraForm.valid) {
      this.carreraService.createCarrera(this.carreraForm.value).subscribe({
        next: (res) => {
          if (!res.blnError) {
            this.mensajeExito = true;
            setTimeout(() => {
              this.mensajeExito = false;
              this.carreraForm.reset();
              this.carreraCreada.emit();
            }, 2000);
          }
        },
        error: (err) => console.error('Error al crear carrera:', err)
      });
    }
  }

  get codigo() { return this.carreraForm.get('codigo'); }
  get nombre() { return this.carreraForm.get('nombre'); }
  get descripcion() { return this.carreraForm.get('descripcion'); }
  get duracion() { return this.carreraForm.get('duracion'); }
}