import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { Periodo } from "../../models/periodos.model";
import { PeriodoService } from "../../services/periodos.services";



@Component({
  selector: 'app-periodo-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './periodo-form.html',
  styleUrl: './periodo-form.scss',
})


export class PeriodoFormComponent implements OnChanges {

  @Input() periodoEditar: Periodo | null = null;
  @Output() periodoCreado = new EventEmitter<void>();
  @Output() periodoActualizado = new EventEmitter<void>();

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['periodoEditar'] && this.periodoEditar) {
      this.periodoForm.patchValue({
        nombre: this.periodoEditar.nombre,
        fechaInicio: this.formatearFecha(this.periodoEditar.fechaInicio),
        fechaFin: this.formatearFecha(this.periodoEditar.fechaFin),
        fechaMatriculaInicio: this.formatearFecha(this.periodoEditar.fechaMatriculaInicio),
        fechaMatriculaFin: this.formatearFecha(this.periodoEditar.fechaMatriculaFin),
      });
    } else if (changes['periodoEditar'] && !this.periodoEditar) {
      this.periodoForm.reset();
    }
  }

  private formatearFecha(fecha: Date | string): string {
    if (!fecha) return '';
    return new Date(fecha).toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.periodoForm.valid) {
      if (this.periodoEditar) {
        const periodoActualizado: Periodo = {
          ...this.periodoEditar,
          ...this.periodoForm.value
        };
        this.periodoService.updatePeriodo(periodoActualizado).subscribe({
          next: (res) => {
            if (!res.blnError) {
              this.mensajeExito = true;
              setTimeout(() => {
                this.mensajeExito = false;
                this.periodoActualizado.emit();
              }, 2000);
            }
          },
          error: (err) => console.error('Error al actualizar periodo:', err)
        });
      } else {
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
  }

  get nombre() { return this.periodoForm.get('nombre'); }
  get fechaInicio() { return this.periodoForm.get('fechaInicio'); }
  get fechaFin() { return this.periodoForm.get('fechaFin'); }
  get fechaMatriculaInicio() { return this.periodoForm.get('fechaMatriculaInicio'); }
  get fechaMatriculaFin() { return this.periodoForm.get('fechaMatriculaFin'); }
}
