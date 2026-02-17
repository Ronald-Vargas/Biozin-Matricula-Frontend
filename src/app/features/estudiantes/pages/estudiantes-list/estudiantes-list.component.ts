import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Estudiante } from '../../models/estudiantes.model';


@Component({
  selector: 'app-estudiantes-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './estudiantes-list.html',
  styleUrls: ['./estudiantes-list.scss'],
})
export class EstudiantesListComponent implements OnInit {

  estudiantes: Estudiante[] = [];
  estudiantesFiltrados: Estudiante[] = [];
  terminoBusqueda: string = '';
  filtroActivo: string = 'todos';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // TODO: Reemplazar con tu EstudianteService
    this.estudiantes = [
      {
        id: 1, codigoEstudiante: 'EST-2024-0001', cedula: '1-1234-5678',
        nombre: 'Juan Carlos', apellidoPaterno: 'Pérez', apellidoMaterno: 'Rodríguez',
        fechaNacimiento: '2000-05-15', genero: 'M', nacionalidad: 'Costarricense',
        emailInstitucional: 'juan.perez@universidad.ac.cr', emailPersonal: 'juan.perez@gmail.com',
        telefonoMovil: '8888-1234', telefonoEmergencia: '7777-5678',
        nombreContactoEmergencia: 'María Pérez (Madre)',
        provincia: 'San José', canton: 'Central', distrito: 'Catedral',
        direccionExacta: 'Del parque central 200m norte',
        idCarrera: 1, carreraCodigo: 'ING-SIS', carreraNombre: 'Ingeniería en Sistemas',
        fechaIngreso: '2024-02-10', semestreActual: 5, estadoEstudiante: 'activo',
        tipoBeca: '25%', condicionSocioeconomica: 'Media', trabaja: false,
        colegioProcedencia: 'Liceo de Costa Rica', tipoColegio: 'Publico', anioGraduacionColegio: 2023,
        discapacidad: false, necesitaAsistencia: false,
        creditosAprobados: 80, creditosTotales: 180,
      },
      {
        id: 2, codigoEstudiante: 'EST-2024-0002', cedula: '2-3456-7890',
        nombre: 'María Fernanda', apellidoPaterno: 'González', apellidoMaterno: 'López',
        fechaNacimiento: '2001-03-22', genero: 'F', nacionalidad: 'Costarricense',
        emailInstitucional: 'maria.gonzalez@universidad.ac.cr', emailPersonal: 'maria.gon@gmail.com',
        telefonoMovil: '8877-2345', telefonoEmergencia: '7766-3456',
        nombreContactoEmergencia: 'Carlos González (Padre)',
        provincia: 'Heredia', canton: 'Central', distrito: 'Heredia',
        direccionExacta: 'Frente al mall',
        idCarrera: 1, carreraCodigo: 'ING-SIS', carreraNombre: 'Ingeniería en Sistemas',
        fechaIngreso: '2024-02-10', semestreActual: 3, estadoEstudiante: 'activo',
        tipoBeca: 'Ninguna', condicionSocioeconomica: 'Alta', trabaja: false,
        colegioProcedencia: 'Saint Francis', tipoColegio: 'Privado', anioGraduacionColegio: 2023,
        discapacidad: false, necesitaAsistencia: false,
        creditosAprobados: 48, creditosTotales: 180, 
      },
      {
        id: 3, codigoEstudiante: 'EST-2024-0003', cedula: '3-4567-8901',
        nombre: 'Carlos Alberto', apellidoPaterno: 'Ramírez', apellidoMaterno: 'Mora',
        fechaNacimiento: '1999-11-08', genero: 'M', nacionalidad: 'Costarricense',
        emailInstitucional: 'carlos.ramirez@universidad.ac.cr', emailPersonal: 'carlos.rm@gmail.com',
        telefonoMovil: '8866-3456',
        provincia: 'Alajuela', canton: 'Central', distrito: 'Alajuela',
        idCarrera: 2, carreraCodigo: 'ING-IND', carreraNombre: 'Ingeniería Industrial',
        fechaIngreso: '2023-07-15', semestreActual: 7, estadoEstudiante: 'activo',
        tipoBeca: '50%', condicionSocioeconomica: 'Baja', trabaja: true,
        colegioProcedencia: 'CTP de Alajuela', tipoColegio: 'Publico', anioGraduacionColegio: 2022,
        discapacidad: false, necesitaAsistencia: false,
        observaciones: 'Estudiante trabajador, horario nocturno',
        creditosAprobados: 112, creditosTotales: 175,
      },
      {
        id: 4, codigoEstudiante: 'EST-2023-0045', cedula: '4-5678-9012',
        nombre: 'Ana Patricia', apellidoPaterno: 'Vargas', apellidoMaterno: 'Castro',
        fechaNacimiento: '1998-07-20', genero: 'F', nacionalidad: 'Costarricense',
        emailInstitucional: 'ana.vargas@universidad.ac.cr', emailPersonal: 'ana.vc@gmail.com',
        telefonoMovil: '8855-4567',
        provincia: 'San José', canton: 'Escazú', distrito: 'San Rafael',
        idCarrera: 3, carreraCodigo: 'ADM-EMP', carreraNombre: 'Administración de Empresas',
        fechaIngreso: '2022-02-10', semestreActual: 8, estadoEstudiante: 'graduado',
        tipoBeca: 'Ninguna', condicionSocioeconomica: 'Alta', trabaja: false,
        discapacidad: false, necesitaAsistencia: false,
        creditosAprobados: 140, creditosTotales: 140,
      },
      {
        id: 5, codigoEstudiante: 'EST-2024-0005', cedula: '5-6789-0123',
        nombre: 'Roberto José', apellidoPaterno: 'Hernández', apellidoMaterno: 'Silva',
        fechaNacimiento: '2002-01-10', genero: 'M', nacionalidad: 'Costarricense',
        emailInstitucional: 'roberto.hernandez@universidad.ac.cr', emailPersonal: 'roberto.hs@gmail.com',
        telefonoMovil: '8844-5678',
        provincia: 'Cartago', canton: 'Central', distrito: 'Oriental',
        idCarrera: 1, carreraCodigo: 'ING-SIS', carreraNombre: 'Ingeniería en Sistemas',
        fechaIngreso: '2024-07-15', semestreActual: 2, estadoEstudiante: 'activo',
        tipoBeca: 'Ninguna', trabaja: false,
        discapacidad: false, necesitaAsistencia: false,
        creditosAprobados: 24, creditosTotales: 180, 
      },
      {
        id: 6, codigoEstudiante: 'EST-2022-0123', cedula: '6-7890-1234',
        nombre: 'Laura Beatriz', apellidoPaterno: 'Sánchez', apellidoMaterno: 'Mora',
        fechaNacimiento: '2000-09-05', genero: 'F', nacionalidad: 'Costarricense',
        emailInstitucional: 'laura.sanchez@universidad.ac.cr', emailPersonal: 'laura.sm@gmail.com',
        telefonoMovil: '8833-6789',
        provincia: 'Limón', canton: 'Central', distrito: 'Limón',
        idCarrera: 2, carreraCodigo: 'ING-IND', carreraNombre: 'Ingeniería Industrial',
        fechaIngreso: '2022-02-10', semestreActual: 4, estadoEstudiante: 'retirado',
        tipoBeca: 'Ninguna', trabaja: true,
        discapacidad: false, necesitaAsistencia: false,
        creditosAprobados: 45, creditosTotales: 175,
      },
    ];
    this.estudiantesFiltrados = [...this.estudiantes];
  }

  buscar(): void {
    this.aplicarFiltros();
  }

  filtrar(estado: string): void {
    this.filtroActivo = estado;
    this.aplicarFiltros();
  }

  private aplicarFiltros(): void {
    let resultado = [...this.estudiantes];

    if (this.filtroActivo !== 'todos') {
      resultado = resultado.filter(e => e.estadoEstudiante === this.filtroActivo);
    }

    if (this.terminoBusqueda.trim()) {
      const t = this.terminoBusqueda.toLowerCase();
      resultado = resultado.filter(e =>
        e.nombre.toLowerCase().includes(t) ||
        e.apellidoPaterno.toLowerCase().includes(t) ||
        (e.apellidoMaterno || '').toLowerCase().includes(t) ||
        e.codigoEstudiante.toLowerCase().includes(t) ||
        e.emailInstitucional.toLowerCase().includes(t) ||
        e.cedula.includes(t)
      );
    }

    this.estudiantesFiltrados = resultado;
  }

  getProgreso(est: Estudiante): number {
    return Math.round((est.creditosAprobados / est.creditosTotales) * 100);
  }

  getEstadoClass(estado: string): string {
    const map: Record<string, string> = {
      activo: 'badge-success',
      graduado: 'badge-primary',
      retirado: 'badge-warning',
      inactivo: 'badge-danger',
    };
    return map[estado] || '';
  }

  getIniciales(est: Estudiante): string {
    return (est.nombre.charAt(0) + est.apellidoPaterno.charAt(0)).toUpperCase();
  }

  getNombreCompleto(est: Estudiante): string {
    return `${est.nombre} ${est.apellidoPaterno} ${est.apellidoMaterno || ''}`.trim();
  }

  verDetalle(est: Estudiante): void {
    this.router.navigate([est.id], { relativeTo: this.route });
  }

  editarEstudiante(est: Estudiante): void {
    this.router.navigate(['editar', est.id], { relativeTo: this.route });
  }

  eliminarEstudiante(est: Estudiante): void {
    if (confirm(`¿Está seguro de eliminar a ${this.getNombreCompleto(est)}?`)) {
      this.estudiantes = this.estudiantes.filter(e => e.id !== est.id);
      this.aplicarFiltros();
    }
  }

  nuevoEstudiante(): void {
    this.router.navigate(['nuevo'], { relativeTo: this.route });
  }
}