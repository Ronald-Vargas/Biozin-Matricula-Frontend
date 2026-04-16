import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Aula } from '../../models/aula.model';
import { AulaService } from '../../services/aula.service';

@Component({
  selector: 'app-aula-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './aula-form.component.html',
  styleUrl: './aula-form.component.scss',
})


export class AulaFormComponent implements OnChanges, OnInit {

  @Input() aulaEditar: Aula | null = null;
  @Output() aulaCreada = new EventEmitter<void>();
  @Output() aulaActualizada = new EventEmitter<void>();

  aulaForm: FormGroup;
  mensajeExito = false;
  mensajeError = '';
  guardando = false;
  private aulasExistentes: Aula[] = [];

  constructor(private fb: FormBuilder, private aulaService: AulaService) {
    this.aulaForm = this.fb.group({
      numeroAula: ['', [Validators.required, Validators.maxLength(7)]],
      capacidad: [null, [Validators.required, Validators.min(1)]],
      esLaboratorio: [false],
      descripcion: [''],
      activo: [true],
    });
  }

  ngOnInit(): void {
    this.aulaService.getAulas().subscribe(a => this.aulasExistentes = a);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['aulaEditar'] && this.aulaEditar) {
      this.aulaForm.patchValue({
        numeroAula: this.aulaEditar.numeroAula,
        capacidad: this.aulaEditar.capacidad,
        esLaboratorio: this.aulaEditar.esLaboratorio,
        descripcion: this.aulaEditar.descripcion,
        activo: this.aulaEditar.activo,
      });
    } else if (changes['aulaEditar'] && !this.aulaEditar) {
      this.aulaForm.reset({ esLaboratorio: false, activo: true });
    }
  }

  onSubmit(): void {
    if (this.aulaForm.invalid) return;
    this.guardando = false;
    this.mensajeError = '';

    const numeroAula = this.aulaForm.value.numeroAula;
    const otras = this.aulasExistentes.filter(a => a.idAula !== this.aulaEditar?.idAula);
    if (otras.some(a => a.numeroAula.toLowerCase() === numeroAula.trim().toLowerCase())) {
      this.mensajeError = `Ya existe un aula con el número "${numeroAula.trim()}".`;
      return;
    }

    this.guardando = true;

    if (this.aulaEditar) {
      const aulaActualizada: Aula = { ...this.aulaEditar, ...this.aulaForm.value };
      this.aulaService.updateAula(aulaActualizada).subscribe({
        next: (res) => {
          if (!res.blnError) {
            this.mensajeExito = true;
            setTimeout(() => {
              this.mensajeExito = false;
              this.aulaActualizada.emit();
            }, 2000);
          } else {
            this.mensajeError = res.strMensajeRespuesta;
          }
          this.guardando = false;
        },
        error: () => {
          this.mensajeError = 'Error de conexión al actualizar el aula. Intente nuevamente.';
          this.guardando = false;
        }
      });
    } else {
      this.aulaService.createAula(this.aulaForm.value).subscribe({
        next: (res) => {
          if (!res.blnError) {
            this.mensajeExito = true;
            setTimeout(() => {
              this.mensajeExito = false;
              this.aulaForm.reset({ esLaboratorio: false, activo: true });
              this.aulaCreada.emit();
            }, 2000);
          } else {
            this.mensajeError = res.strMensajeRespuesta;
          }
          this.guardando = false;
        },
        error: () => {
          this.mensajeError = 'Error de conexión al crear el aula. Intente nuevamente.';
          this.guardando = false;
        }
      });
    }
  }

  get numeroAula() { return this.aulaForm.get('numeroAula'); }
  get capacidad() { return this.aulaForm.get('capacidad'); }
}
