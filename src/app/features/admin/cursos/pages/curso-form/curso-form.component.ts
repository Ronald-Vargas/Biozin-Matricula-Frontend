import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

function noSoloEspacios(control: AbstractControl): ValidationErrors | null {
  if (typeof control.value === 'string' && control.value.trim().length === 0 && control.value.length > 0) {
    return { soloEspacios: true };
  }
  return null;
}
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
  mensajeError = '';
  modoEdicion = false;
  idCurso: number | null = null;
  cursosDisponibles: Curso[] = [];
  requisitoComboAbierto = false;
  busquedaRequisito = '';

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.cursoForm = this.fb.group({
      codigo: ['', [Validators.required, noSoloEspacios, Validators.minLength(3), Validators.maxLength(10)]],
      nombre: ['', [Validators.required, noSoloEspacios, Validators.minLength(5), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, noSoloEspacios]],
      creditos: ['', [Validators.required, Validators.min(1), Validators.max(15)]],
      horasDuracion: ['', [Validators.required, Validators.min(1), Validators.max(200)]],
      precio: ['', [Validators.required, Validators.min(0)]],
      tieneLaboratorio: [false],
      precioLaboratorio: [''],
      idCursoRequisito: [null],
      esVirtual: [false]
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
            idCursoRequisito: curso.idCursoRequisito ?? null,
            esVirtual: curso.esVirtual ?? false
          });
        }
      });
    }
  }

  onSubmit(): void {
    this.mensajeError = '';
    if (this.cursoForm.valid) {
      const val = this.cursoForm.value;
      if (this.cursosDisponibles.some(c => c.codigo.toLowerCase() === val.codigo.trim().toLowerCase())) {
        this.mensajeError = `Ya existe un curso con el código "${val.codigo.trim()}".`;
        return;
      }
      if (this.cursosDisponibles.some(c => c.nombre.toLowerCase() === val.nombre.trim().toLowerCase())) {
        this.mensajeError = `Ya existe un curso con el nombre "${val.nombre.trim()}".`;
        return;
      }
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
            } else {
              this.mensajeError = res.strMensajeRespuesta || 'No se pudo actualizar el curso. Verifique que el código y nombre no estén duplicados.';
            }
          },
          error: (err) => { this.mensajeError = err?.error?.strMensajeRespuesta || err?.error?.message || 'Error al actualizar el curso. Intente nuevamente.'; }
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
            } else {
              this.mensajeError = res.strMensajeRespuesta || 'No se pudo crear el curso. Verifique que el código y nombre no estén duplicados.';
            }
          },
          error: (err) => { this.mensajeError = err?.error?.strMensajeRespuesta || err?.error?.message || 'Error al crear el curso. Intente nuevamente.'; }
        });
      }
    }
  }

  get cursoRequisitoSeleccionadoTexto(): string {
    const idSeleccionado = Number(this.idCursoRequisito?.value);
    const curso = this.cursosDisponibles.find(c => c.idCurso === idSeleccionado);
    return curso ? `${curso.codigo} - ${curso.nombre}` : 'Buscar curso requisito...';
  }

  get cursosRequisitoFiltrados(): Curso[] {
    const filtrados = this.cursosDisponibles.filter(curso =>
      this.coincideBusqueda(`${curso.codigo} ${curso.nombre} ${curso.descripcion ?? ''}`, this.busquedaRequisito)
    );

    const idSeleccionado = Number(this.idCursoRequisito?.value);
    if (!idSeleccionado || filtrados.some(curso => curso.idCurso === idSeleccionado)) return filtrados;

    const seleccionado = this.cursosDisponibles.find(curso => curso.idCurso === idSeleccionado);
    return seleccionado ? [seleccionado, ...filtrados] : filtrados;
  }

  toggleRequisitoCombo(): void {
    this.requisitoComboAbierto = !this.requisitoComboAbierto;
  }

  cerrarComboRequisito(): void {
    this.requisitoComboAbierto = false;
  }

  seleccionarCursoRequisito(curso: Curso | null): void {
    this.idCursoRequisito?.setValue(curso?.idCurso ?? null);
    this.idCursoRequisito?.markAsDirty();
    this.idCursoRequisito?.markAsTouched();
    this.busquedaRequisito = '';
    this.requisitoComboAbierto = false;
  }

  cursoRequisitoDetalleTexto(curso: Curso): string {
    const modalidad = curso.esVirtual ? 'Virtual' : 'Presencial';
    return `${curso.codigo} | ${modalidad} | ${curso.horasDuracion} h`;
  }

  actualizarBusquedaRequisito(event: Event): void {
    this.busquedaRequisito = (event.target as HTMLInputElement).value;
  }

  private coincideBusqueda(texto: string, busqueda: string): boolean {
    const filtro = this.normalizar(busqueda);
    if (!filtro) return true;

    const textoNormalizado = this.normalizar(texto);
    return filtro.split(/\s+/).every(parte => textoNormalizado.includes(parte));
  }

  private normalizar(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
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
  get esVirtual() { return this.cursoForm.get('esVirtual'); }
}
