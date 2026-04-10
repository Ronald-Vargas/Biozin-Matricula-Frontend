import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CursoService } from '../../services/curso.service';
import { Curso } from '../../models/curso.model';

@Component({
  selector: 'app-curso-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './curso-form.html',
  styleUrl: './curso-form.scss',
})
export class CursoFormComponent implements OnInit {

  @Input() cursoId: number | null = null;
  @Output() cursoCreado = new EventEmitter<void>();

  cursoForm: FormGroup;
  mensajeExito = false;
  modoEdicion = false;
  idCurso: number | null = null;
  cursosDisponibles: Curso[] = [];

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.cursoForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      descripcion: ['', Validators.required],
      creditos: ['', [Validators.required, Validators.min(1), Validators.max(15)]],
      horasDuracion: ['', [Validators.required, Validators.min(1), Validators.max(200)]],
      precio: ['', [Validators.required, Validators.min(0)]],
      tieneLaboratorio: [false],
      precioLaboratorio: [''],
      idCursoRequisito: [null]
    });

    this.cursoForm.get('tieneLaboratorio')!.valueChanges.subscribe((tiene: boolean) => {
      const ctrl = this.cursoForm.get('precioLaboratorio')!;
      if (tiene) {
        ctrl.setValidators([Validators.required, Validators.min(0)]);
      } else {
        ctrl.clearValidators();
        ctrl.setValue('');
      }
      ctrl.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
    const id = this.cursoId ?? (routeId ? +routeId : null);

    this.cursoService.getCursos().subscribe(cursos => {
      this.cursosDisponibles = cursos.filter(c => c.idCurso !== id);
    });

    if (id) {
      this.modoEdicion = true;
      this.idCurso = id;
      this.cursoService.getCursoById(this.idCurso).subscribe(curso => {
        if (curso) {
          this.cursoForm.patchValue({
            codigo: curso.codigo,
            nombre: curso.nombre,
            descripcion: curso.descripcion,
            creditos: curso.creditos,
            horasDuracion: curso.horasDuracion,
            precio: curso.precio,
            tieneLaboratorio: curso.tieneLaboratorio,
            precioLaboratorio: curso.precioLaboratorio ?? '',
            idCursoRequisito: curso.idCursoRequisito ?? null
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.cursoForm.valid) {
      const val = this.cursoForm.value;
      const precioLaboratorio = val.precioLaboratorio || 0;
      const idCursoRequisito = val.idCursoRequisito ? +val.idCursoRequisito : undefined;
      if (this.modoEdicion && this.idCurso !== null) {
        const cursoActualizado = { idCurso: this.idCurso, ...val, precioLaboratorio, idCursoRequisito, estado: true };
        this.cursoService.updateCurso(cursoActualizado).subscribe({
          next: (res) => {
            if (!res.blnError) {
              this.mensajeExito = true;
              setTimeout(() => {
                this.mensajeExito = false;
                if (this.cursoId !== null) {
                  this.cursoCreado.emit();
                } else {
                  this.router.navigate(['/cursos']);
                }
              }, 2000);
            }
          },
          error: (err) => console.error('Error al actualizar curso:', err)
        });
      } else {
        this.cursoService.createCurso({ ...val, precioLaboratorio, idCursoRequisito }).subscribe({
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
  }

  get codigo() { return this.cursoForm.get('codigo'); }
  get nombre() { return this.cursoForm.get('nombre'); }
  get descripcion() { return this.cursoForm.get('descripcion'); }
  get creditos() { return this.cursoForm.get('creditos'); }
  get horasDuracion() { return this.cursoForm.get('horasDuracion'); }
  get precio() { return this.cursoForm.get('precio'); }
  get tieneLaboratorio() { return this.cursoForm.get('tieneLaboratorio'); }
  get precioLaboratorio() { return this.cursoForm.get('precioLaboratorio'); }
  get idCursoRequisito() { return this.cursoForm.get('idCursoRequisito'); }
}
