import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Estudiante } from '../../models/estudiantes.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estudiante-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './estudiante-detail.html',
  styleUrl: './estudiante-detail.scss',
})
export class EstudianteDetailComponent implements OnInit {

  estudiante: Estudiante | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.estudiante = this.getDatosMock(id);
  }

  getProgreso(): number {
    if (!this.estudiante) return 0;
    return Math.round((this.estudiante.creditosAprobados / this.estudiante.creditosTotales) * 100);
  }

  getIniciales(): string {
    if (!this.estudiante) return '';
    return (this.estudiante.nombre.charAt(0) + this.estudiante.apellidoPaterno.charAt(0)).toUpperCase();
  }

  getNombreCompleto(): string {
    if (!this.estudiante) return '';
    const est = this.estudiante;
    return `${est.nombre} ${est.apellidoPaterno} ${est.apellidoMaterno || ''}`.trim();
  }

  getEstadoClass(): string {
    if (!this.estudiante) return '';
    switch (this.estudiante.estadoEstudiante) {
      case 'activo': return 'badge-success';
      case 'inactivo': return 'badge-primary';
      default: return 'badge-warning';
    }
  }

  getEdad(): number {
    if (!this.estudiante?.fechaNacimiento) return 0;
    const hoy = new Date();
    const nac = new Date(this.estudiante.fechaNacimiento);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
  }

  editarEstudiante(): void {
    if (this.estudiante) {
      this.router.navigate(['../editar', this.estudiante.id], { relativeTo: this.route });
    }
  }

  volver(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  private getDatosMock(id: number): Estudiante | null {
    const datos: Estudiante[] = [
      {
        id: 1,
        codigoEstudiante: 'EST-2024-0001',
        cedula: '1-1234-5678',
        nombre: 'Juan Carlos',
        apellidoPaterno: 'Pérez',
        apellidoMaterno: 'Rodríguez',
        fechaNacimiento: '2000-05-15',
        genero: 'M',
        nacionalidad: 'Costarricense',
        emailInstitucional: 'juan.perez@universidad.ac.cr',
        emailPersonal: 'juan.perez@gmail.com',
        telefonoMovil: '8888-1234',
        telefonoEmergencia: '7777-5678',
        nombreContactoEmergencia: 'María Pérez (Madre)',
        provincia: 'San José',
        canton: 'Central',
        distrito: 'Catedral',
        direccionExacta: 'Del parque central 200m norte',
        idCarrera: 1,
        carreraCodigo: 'ING-SIS',
        carreraNombre: 'Ingeniería en Sistemas',
        fechaIngreso: '2024-02-10',
        semestreActual: 5,
        estadoEstudiante: 'activo',
        tipoBeca: '25%',
        condicionSocioeconomica: 'Media',
        trabaja: false,
        colegioProcedencia: 'Liceo de Costa Rica',
        tipoColegio: 'Publico',
        anioGraduacionColegio: 2023,
        discapacidad: false,
        tipoDiscapacidad: '',
        necesitaAsistencia: false,
        observaciones: '',
        creditosAprobados: 80,
        creditosTotales: 180,
      },
      {
        id: 2,
        codigoEstudiante: 'EST-2024-0002',
        cedula: '2-3456-7890',
        nombre: 'María Fernanda',
        apellidoPaterno: 'González',
        apellidoMaterno: 'López',
        fechaNacimiento: '2001-03-22',
        genero: 'F',
        nacionalidad: 'Costarricense',
        emailInstitucional: 'maria.gonzalez@universidad.ac.cr',
        emailPersonal: 'maria.gon@gmail.com',
        telefonoMovil: '8877-2345',
        telefonoEmergencia: '7766-3456',
        nombreContactoEmergencia: 'Carlos González (Padre)',
        provincia: 'Heredia',
        canton: 'Central',
        distrito: 'Heredia',
        direccionExacta: 'Frente al mall',
        idCarrera: 1,
        carreraCodigo: 'ING-SIS',
        carreraNombre: 'Ingeniería en Sistemas',
        fechaIngreso: '2024-02-10',
        semestreActual: 3,
        estadoEstudiante: 'activo',
        tipoBeca: 'Ninguna',
        condicionSocioeconomica: 'Alta',
        trabaja: false,
        colegioProcedencia: 'Saint Francis',
        tipoColegio: 'Privado',
        anioGraduacionColegio: 2023,
        discapacidad: false,
        tipoDiscapacidad: '',
        necesitaAsistencia: false,
        observaciones: '',
        creditosAprobados: 48,
        creditosTotales: 180,
      },
      {
        id: 3,
        codigoEstudiante: 'EST-2024-0003',
        cedula: '3-4567-8901',
        nombre: 'Carlos Alberto',
        apellidoPaterno: 'Ramírez',
        apellidoMaterno: 'Mora',
        fechaNacimiento: '1999-11-08',
        genero: 'M',
        nacionalidad: 'Costarricense',
        emailInstitucional: 'carlos.ramirez@universidad.ac.cr',
        emailPersonal: 'carlos.rm@gmail.com',
        telefonoMovil: '8866-3456',
        telefonoEmergencia: '',
        nombreContactoEmergencia: '',
        provincia: 'Alajuela',
        canton: 'Central',
        distrito: 'Alajuela',
        direccionExacta: '',
        idCarrera: 2,
        carreraCodigo: 'ING-IND',
        carreraNombre: 'Ingeniería Industrial',
        fechaIngreso: '2023-07-15',
        semestreActual: 7,
        estadoEstudiante: 'activo',
        tipoBeca: '50%',
        condicionSocioeconomica: 'Baja',
        trabaja: true,
        colegioProcedencia: 'CTP de Alajuela',
        tipoColegio: 'Publico',
        anioGraduacionColegio: 2022,
        discapacidad: false,
        tipoDiscapacidad: '',
        necesitaAsistencia: false,
        observaciones: 'Estudiante trabajador, horario nocturno',
        creditosAprobados: 112,
        creditosTotales: 175,
      },
    ];
    return datos.find(e => e.id === id) || null;
  }
}