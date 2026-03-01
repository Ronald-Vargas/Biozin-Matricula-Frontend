import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  
  constructor(
    private fb: FormBuilder,
    private profesorService: ProfesorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.profesorForm = this.fb.group({
      cedula: ['', Validators.required],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: [''],
      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      nacionalidad: [''],
      emailPersonal: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      titulo: ['', Validators.required],
      especialidad: ['', Validators.required],
      provincia: [''],
      canton: [''],
      distrito: [''],
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










  cancelar(): void {
    this.router.navigate(['/profesores']);
  }




  
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
        estado: 'Activo',
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
