import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

function noSoloEspacios(control: AbstractControl): ValidationErrors | null {
  if (typeof control.value === 'string' && control.value.trim().length === 0 && control.value.length > 0) {
    return { soloEspacios: true };
  }
  return null;
}
import { ProfesorService } from '../../services/profesores.services';
import { Profesor } from '../../models/profesores.model';

@Component({
  selector: 'app-profesor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profesor-form.html',
  styleUrl: './profesor-form.scss',
})
export class ProfesorFormComponent implements OnInit {

  profesorForm: FormGroup;
  esEdicion = false;
  tituloPage = 'Nuevo Profesor';
  mensajeExito = false;
  profesorActual?: Profesor;
  readonly hoy = new Date().toISOString().split('T')[0];

  
  constructor(
    private fb: FormBuilder,
    private profesorService: ProfesorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.profesorForm = this.fb.group({
      cedula: ['', [Validators.required, noSoloEspacios, Validators.maxLength(11)]],
      nombre: ['', [Validators.required, noSoloEspacios, Validators.minLength(2), Validators.maxLength(50)]],
      apellidoPaterno: ['', [Validators.required, noSoloEspacios, Validators.maxLength(30)]],
      apellidoMaterno: ['', [Validators.maxLength(30)]],
      fechaNacimiento: ['', Validators.required],
      genero: ['', [Validators.required, Validators.maxLength(9)]],
      nacionalidad: ['', [Validators.maxLength(50)]],
      emailPersonal: ['', [Validators.required, Validators.email, Validators.maxLength(70)]],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      titulo: ['', [Validators.required, Validators.maxLength(60)]],
      especialidad: ['', [Validators.required, Validators.maxLength(60)]],
      provincia: ['', [Validators.maxLength(10)]],
      canton: ['', [Validators.maxLength(40)]],
      distrito: ['', [Validators.maxLength(40)]],
      direccion: [''],
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.esEdicion = true;
      this.tituloPage = 'Editar Profesor';
      this.profesorService.getProfesorById(id).subscribe(profesor => {
        if (profesor) {
          this.profesorActual = profesor;
          this.profesorForm.patchValue({
            cedula: profesor.cedula,
            nombre: profesor.nombre,
            apellidoPaterno: profesor.apellidoPaterno,
            apellidoMaterno: profesor.apellidoMaterno,
            fechaNacimiento: profesor.fechaNacimiento ? new Date(profesor.fechaNacimiento).toISOString().split('T')[0] : '',
            genero: profesor.genero,
            estado: profesor.estado,
            nacionalidad: profesor.nacionalidad,
            emailPersonal: profesor.emailPersonal,
            telefono: profesor.telefono,
            titulo: profesor.titulo,
            especialidad: profesor.especialidad,
            provincia: profesor.provincia,
            canton: profesor.canton,
            distrito: profesor.distrito,
            direccion: profesor.direccion,
          });
        }
      });
    }
  }










  soloLetras(event: KeyboardEvent): boolean {
    return !/\d/.test(event.key);
  }

  cancelar(): void {
    this.router.navigate(['/profesores']);
  }

  get cedula() { return this.profesorForm.get('cedula'); }
  get nombre() { return this.profesorForm.get('nombre'); }
  get apellidoPaterno() { return this.profesorForm.get('apellidoPaterno'); }
  get apellidoMaterno() { return this.profesorForm.get('apellidoMaterno'); }
  get fechaNacimiento() { return this.profesorForm.get('fechaNacimiento'); }
  get genero() { return this.profesorForm.get('genero'); }
  get nacionalidad() { return this.profesorForm.get('nacionalidad'); }
  get emailPersonal() { return this.profesorForm.get('emailPersonal'); }
  get telefono() { return this.profesorForm.get('telefono'); }
  get titulo() { return this.profesorForm.get('titulo'); }
  get especialidad() { return this.profesorForm.get('especialidad'); }
  get provincia() { return this.profesorForm.get('provincia'); }
  get canton() { return this.profesorForm.get('canton'); }
  get distrito() { return this.profesorForm.get('distrito'); }




  
  onSubmit(): void {
    if (!this.profesorForm.valid) return;

    if (this.esEdicion && this.profesorActual) {
      const updated: Profesor = { ...this.profesorActual, ...this.profesorForm.value };
      this.profesorService.updateProfesor(updated).subscribe({
        next: (res) => {
          if (!res.blnError) {
            this.mensajeExito = true;
            setTimeout(() => {
              this.mensajeExito = false;
              this.router.navigate(['/profesores']);
            }, 2000);
          }
        },
        error: (err) => console.error('Error al actualizar profesor:', err)
      });
    } else {
      const dto: import('../../models/profesores.model').CreateProfesorDto = {
        ...this.profesorForm.value,
        cursosAsignados: 0,
        estado: true,
      };
      this.profesorService.createProfesor(dto).subscribe({
        next: (res) => {
          if (!res.blnError) {
            this.mensajeExito = true;
            setTimeout(() => {
              this.mensajeExito = false;
              this.profesorForm.reset();
              this.router.navigate(['/profesores']);
            }, 2000);
          }
        },
        error: (err) => console.error('Error al crear profesor:', err)
      });
    }
  }
}
