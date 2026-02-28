import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PeriodoService } from "../../services/periodos.services";



@Component({
  selector: 'app-periodo-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './periodo-form.html',
  styleUrl: './periodo-form.scss',
})


export class PeriodoFormComponent {

  @Output() periodoCreado = new EventEmitter<void>();
  periodoForm: FormGroup;
  mensajeExito = false;

  constructor(
    private fb: FormBuilder,
    private periodoService: PeriodoService
  ) {
    this.periodoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      fechaMatriculaInicio: ['', Validators.required],
      fechaMatriculaFin: ['', Validators.required]
    });
   }
    




  onSubmit(): void {
    if (this.periodoForm.valid) {
      this.periodoService.createPeriodo(this.periodoForm.value).subscribe({
        next: (res) => {
          if (!res.blnError) {
            this.mensajeExito = true;
            setTimeout(() => {
              this.mensajeExito = false;
              this.periodoForm.reset();
              this.periodoCreado.emit();
            }, 2000);
          }
        },
        error: (err) => console.error('Error al crear periodo:', err)
      });
    }
  }

  get nombre() { return this.periodoForm.get('nombre'); }
  get fechaInicio() { return this.periodoForm.get('fechaInicio'); }
  get fechaFin() { return this.periodoForm.get('fechaFin'); }
  get fechaMatriculaInicio() { return this.periodoForm.get('fechaMatriculaInicio'); }
  get fechaMatriculaFin() { return this.periodoForm.get('fechaMatriculaFin'); }
}