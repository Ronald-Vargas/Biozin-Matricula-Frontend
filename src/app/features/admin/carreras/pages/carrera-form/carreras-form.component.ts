import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarreraService } from '../../services/carrera.service';

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
  modoEdicion = false;
  idCarrera: number | null = null;

  constructor(
    private fb: FormBuilder,
    private carreraService: CarreraService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.carreraForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      descripcion: ['', Validators.required],
      duracion: ['', [Validators.required, Validators.min(1), Validators.max(15)]]
    });
  }

  ngOnInit(): void {
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
    if (this.carreraForm.valid) {
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
            }
          },
          error: (err) => console.error('Error al actualizar carrera:', err)
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
            }
          },
          error: (err) => console.error('Error al crear carrera:', err)
        });
      }
    }
  }

  get codigo() { return this.carreraForm.get('codigo'); }
  get nombre() { return this.carreraForm.get('nombre'); }
  get descripcion() { return this.carreraForm.get('descripcion'); }
  get duracion() { return this.carreraForm.get('duracion'); }
}
