import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CursoService } from '../../services/curso.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-curso-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './curso-form.html',
  styleUrl: './curso-form.scss',
})




export class CursoFormComponent {

  @Output() cursoCreado = new EventEmitter<void>();
  cursoForm: FormGroup;
  mensajeExito = false;

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService
  ) {
    this.cursoForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', Validators.required],
      creditos: ['', [Validators.required, Validators.min(1), Validators.max(15)]]
    });
  }

  onSubmit(): void {
    if (this.cursoForm.valid) {
      this.cursoService.createCurso(this.cursoForm.value).subscribe({
        next: (res) => {
          if (!res.blnError) {
            this.mensajeExito = true;
            setTimeout(() => {
              this.mensajeExito = false;
              this.cursoForm.reset();
              this.cursoCreado.emit();
            }, 2000);
          }
        },
        error: (err) => console.error('Error al crear curso:', err)
      });
    }
  }

  get codigo() { return this.cursoForm.get('codigo'); }
  get nombre() { return this.cursoForm.get('nombre'); }
  get descripcion() { return this.cursoForm.get('descripcion'); }
  get creditos() { return this.cursoForm.get('creditos'); }
}