import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

function noSoloEspacios(control: AbstractControl): ValidationErrors | null {
  if (typeof control.value === 'string' && control.value.trim().length === 0 && control.value.length > 0) {
    return { soloEspacios: true };
  }
  return null;
}
import { RouterModule } from "@angular/router";
import { Periodo } from "../../models/periodos.model";
import { PeriodoService } from "../../services/periodos.services";

function fechaFinNoAnterior(inicioKey: string, finKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const inicio = group.get(inicioKey)?.value;
    const fin = group.get(finKey)?.value;
    if (inicio && fin && fin < inicio) {
      return { [finKey + 'Invalida']: true };
    }
    return null;
  };
}

function matriculaEnRangoPeriodo(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const inicioPeriodo = group.get('fechaInicio')?.value;
    const finPeriodo = group.get('fechaFin')?.value;
    const inicioMatricula = group.get('fechaMatriculaInicio')?.value;
    const finMatricula = group.get('fechaMatriculaFin')?.value;
    if (inicioPeriodo && finPeriodo && inicioMatricula && finMatricula) {
      if (inicioMatricula < inicioPeriodo || finMatricula > finPeriodo) {
        return { matriculaFueraDeRango: true };
      }
    }
    return null;
  };
}

@Component({
  selector: 'app-periodo-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './periodo-form.html',
  styleUrl: './periodo-form.scss',
})


export class PeriodoFormComponent implements OnChanges, OnInit {

  @Input() periodoEditar: Periodo | null = null;
  @Output() periodoCreado = new EventEmitter<void>();
  @Output() periodoActualizado = new EventEmitter<void>();

  periodoForm: FormGroup;
  mensajeExito = false;
  mensajeError = '';
  private periodosExistentes: Periodo[] = [];

  constructor(
    private fb: FormBuilder,
    private periodoService: PeriodoService
  ) {
    this.periodoForm = this.fb.group({
      nombre: ['', [Validators.required, noSoloEspacios, Validators.minLength(5), Validators.maxLength(100)]],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      fechaMatriculaInicio: ['', Validators.required],
      fechaMatriculaFin: ['', Validators.required]
    }, {
      validators: [
        fechaFinNoAnterior('fechaInicio', 'fechaFin'),
        fechaFinNoAnterior('fechaMatriculaInicio', 'fechaMatriculaFin'),
        matriculaEnRangoPeriodo()
      ]
    });
  }

  ngOnInit(): void {
    this.periodoService.getPeriodos().subscribe(p => this.periodosExistentes = p);
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
    this.mensajeError = '';
    if (this.periodoForm.valid) {
      const nombre = this.periodoForm.value.nombre;
      const otros = this.periodosExistentes.filter(p => p.idPeriodo !== this.periodoEditar?.idPeriodo);
      if (otros.some(p => p.nombre.toLowerCase() === nombre.trim().toLowerCase())) {
        this.mensajeError = `Ya existe un periodo con el nombre "${nombre.trim()}".`;
        return;
      }

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
            } else {
              this.mensajeError = res.strMensajeRespuesta || 'No se pudo actualizar el periodo. Verifique que el nombre no esté duplicado.';
            }
          },
          error: (err) => { this.mensajeError = err?.error?.strMensajeRespuesta || err?.error?.message || 'Error al actualizar el periodo. Intente nuevamente.'; }
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
            } else {
              this.mensajeError = res.strMensajeRespuesta || 'No se pudo crear el periodo. Verifique que el nombre no esté duplicado.';
            }
          },
          error: (err) => { this.mensajeError = err?.error?.strMensajeRespuesta || err?.error?.message || 'Error al crear el periodo. Intente nuevamente.'; }
        });
      }
    }
  }

  get nombre() { return this.periodoForm.get('nombre'); }
  get fechaInicio() { return this.periodoForm.get('fechaInicio'); }
  get fechaFin() { return this.periodoForm.get('fechaFin'); }
  get fechaMatriculaInicio() { return this.periodoForm.get('fechaMatriculaInicio'); }
  get fechaMatriculaFin() { return this.periodoForm.get('fechaMatriculaFin'); }

  get fechaFinInvalida() { return this.periodoForm.hasError('fechaFinInvalida'); }
  get fechaMatriculaFinInvalida() { return this.periodoForm.hasError('fechaMatriculaFinInvalida'); }
  get matriculaFueraDeRango() { return this.periodoForm.hasError('matriculaFueraDeRango'); }
}
