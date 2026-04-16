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
import { CarreraService } from '../../services/carrera.service';
import { Carrera } from '../../models/carrera.model';

@Component({
  selector: 'app-carreras-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './carreras-form.html',
  styleUrl: './carreras-form.scss',
})
export class CarreraFormComponent implements OnInit {

  @Input() carreraId: number | null = null;
  @Output() carreraCreada = new EventEmitter<void>();

  carreraForm: FormGroup;
  mensajeExito = false;
  mensajeError = '';
  modoEdicion = false;
  idCarrera: number | null = null;
  private carrerasExistentes: Carrera[] = [];

  constructor(
    private fb: FormBuilder,
    private carreraService: CarreraService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.carreraForm = this.fb.group({
      codigo: ['', [Validators.required, noSoloEspacios, Validators.minLength(3), Validators.maxLength(10)]],
      nombre: ['', [Validators.required, noSoloEspacios, Validators.minLength(5), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, noSoloEspacios]],
      duracion: ['', [Validators.required, Validators.min(1), Validators.max(15)]]
    });
  }

  ngOnInit(): void {
    this.carreraService.getCarreras().subscribe(c => this.carrerasExistentes = c);

    const routeId = this.route.snapshot.paramMap.get('id');
    const id = this.carreraId ?? (routeId ? +routeId : null);

    if (id) {
      this.modoEdicion = true;
      this.idCarrera = id;
      this.carreraService.getCarreraById(this.idCarrera).subscribe(carrera => {
        if (carrera) {
          this.carreraForm.patchValue({
            codigo: carrera.codigo,
            nombre: carrera.nombre,
            descripcion: carrera.descripcion,
            duracion: carrera.duracion
          });
        }
      });
    }
  }

  onSubmit(): void {
    this.mensajeError = '';
    if (this.carreraForm.valid) {
      const { codigo, nombre } = this.carreraForm.value;
      const otras = this.carrerasExistentes.filter(c => c.idCarrera !== this.idCarrera);
      if (otras.some(c => c.codigo.toLowerCase() === codigo.trim().toLowerCase())) {
        this.mensajeError = `Ya existe una carrera con el código "${codigo.trim()}".`;
        return;
      }
      if (otras.some(c => c.nombre.toLowerCase() === nombre.trim().toLowerCase())) {
        this.mensajeError = `Ya existe una carrera con el nombre "${nombre.trim()}".`;
        return;
      }

      if (this.modoEdicion && this.idCarrera !== null) {
        const carreraActualizada = { idCarrera: this.idCarrera, ...this.carreraForm.value, estado: true };
        this.carreraService.updateCarrera(carreraActualizada).subscribe({
          next: (res) => {
            if (!res.blnError) {
              this.mensajeExito = true;
              setTimeout(() => {
                this.mensajeExito = false;
                if (this.carreraId !== null) {
                  this.carreraCreada.emit();
                } else {
                  this.router.navigate(['/carreras']);
                }
              }, 2000);
            } else {
              this.mensajeError = res.strMensajeRespuesta || 'No se pudo actualizar la carrera. Verifique que el código y nombre no estén duplicados.';
            }
          },
          error: (err) => { this.mensajeError = err?.error?.strMensajeRespuesta || err?.error?.message || 'Error al actualizar la carrera. Intente nuevamente.'; }
        });
      } else {
        this.carreraService.createCarrera(this.carreraForm.value).subscribe({
          next: (res) => {
            if (!res.blnError) {
              this.mensajeExito = true;
              setTimeout(() => {
                this.mensajeExito = false;
                this.carreraForm.reset();
                this.carreraCreada.emit();
              }, 2000);
            } else {
              this.mensajeError = res.strMensajeRespuesta || 'No se pudo crear la carrera. Verifique que el código y nombre no estén duplicados.';
            }
          },
          error: (err) => { this.mensajeError = err?.error?.strMensajeRespuesta || err?.error?.message || 'Error al crear la carrera. Intente nuevamente.'; }
        });
      }
    }
  }

  get codigo() { return this.carreraForm.get('codigo'); }
  get nombre() { return this.carreraForm.get('nombre'); }
  get descripcion() { return this.carreraForm.get('descripcion'); }
  get duracion() { return this.carreraForm.get('duracion'); }
}
