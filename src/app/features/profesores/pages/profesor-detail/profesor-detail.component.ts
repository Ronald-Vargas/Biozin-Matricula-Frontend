import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Profesor } from '../../models/profesores.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profesor-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profesor-detail.html',
  styleUrl: './profesor-detail.scss',
})
export class ProfesorDetailComponent implements OnInit {

  profesor: Profesor | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.profesor = this.getDatosMock(id);
  }

  getIniciales(): string {
    if (!this.profesor) return '';
    return (this.profesor.nombre.charAt(0) + this.profesor.apellidoPaterno.charAt(0)).toUpperCase();
  }

  getNombreCompleto(): string {
    if (!this.profesor) return '';
    const p = this.profesor;
    return `${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno || ''}`.trim();
  }

  getEstadoClass(): string {
    if (!this.profesor) return '';
    switch (this.profesor.estadoProfesor) {
      case 'activo': return 'badge-success';
      case 'inactivo': return 'badge-danger';
      default: return 'badge-warning';
    }
  }



  editarProfesor(): void {
    if (this.profesor) {
      this.router.navigate(['../editar', this.profesor.id], { relativeTo: this.route });
    }
  }

  volver(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  private getDatosMock(id: number): Profesor | null {
    const datos: Profesor[] = [
      {
        id: 1,
        cedula: '1-0123-0456',
        nombre: 'Carlos',
        apellidoPaterno: 'Ramírez',
        apellidoMaterno: 'López',
        fechaNacimiento: '1985-03-20',
        genero: 'M',
        nacionalidad: 'Costarricense',
        emailPersonal: 'carlos.ramirez@gmail.com',
        telefono: '8812-3456',
        titulo: 'Máster en Ciencias de la Computación',
        especialidad: 'Ingeniería de Software',
        cursosAsignados: 3,
        provincia: 'San José',
        canton: 'Central',
        distrito: 'Catedral',
        direccionExacta: 'Barrio Escalante, 100m sur',
        codigoProfesor: 'PROF-001',
        emailInstitucional: 'carlos.ramirez@universidad.ac.cr',
        fechaIngreso: '2020-02-15',
        estadoProfesor: 'activo',
        contrasena: '********',
      },
      {
        id: 2,
        cedula: '2-0345-0678',
        nombre: 'María',
        apellidoPaterno: 'Fernández',
        apellidoMaterno: 'Mora',
        fechaNacimiento: '1980-08-12',
        genero: 'F',
        nacionalidad: 'Costarricense',
        emailPersonal: 'maria.fernandez@gmail.com',
        telefono: '8834-5678',
        titulo: 'Doctorado en Matemática Aplicada',
        especialidad: 'Matemáticas',
        cursosAsignados: 4,
        provincia: 'Heredia',
        canton: 'Central',
        distrito: 'Heredia',
        direccionExacta: 'Frente a la UNA',
        codigoProfesor: 'PROF-002',
        emailInstitucional: 'maria.fernandez@universidad.ac.cr',
        fechaIngreso: '2018,08-01',
        estadoProfesor: 'activo',
                contrasena: '********',

      },
      {
        id: 3,
        cedula: '3-0456-0789',
        nombre: 'José',
        apellidoPaterno: 'Vargas',
        apellidoMaterno: 'Solano',
        fechaNacimiento: '1990-01-05',
        genero: 'M',
        nacionalidad: 'Costarricense',
        emailPersonal: 'jose.vargas@gmail.com',
        telefono: '8856-7890',
        titulo: 'MBA en Dirección de Empresas',
        especialidad: 'Administración',
        cursosAsignados: 2,
        provincia: 'San José',
        canton: 'Escazú',
        distrito: 'San Rafael',
        direccionExacta: '',
        codigoProfesor: 'PROF-003',
        emailInstitucional: 'jose.vargas@universidad.ac.cr',
        fechaIngreso: '2019-03-10',
                contrasena: '********',

        estadoProfesor: 'activo',
      },

    ];
    return datos.find(e => e.id === id) || null;
  }
}