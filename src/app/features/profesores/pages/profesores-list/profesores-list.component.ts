import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Profesor } from '../../models/profesores.model';


@Component({
  selector: 'app-profesores-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profesores-list.html',
  styleUrls: ['./profesores-list.scss'],
})
export class ProfesoresListComponent implements OnInit {

  profesores: Profesor[] = [];
  profesoresFiltrados: Profesor[] = [];
  terminoBusqueda: string = '';
  filtroActivo: string = 'todos';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // TODO: Reemplazar con tu ProfesorService
    this.profesores = [
      {
        id: 1, cedula: '1-0123-0456',
        nombre: 'Carlos', apellidoPaterno: 'Ramírez', apellidoMaterno: 'López',
        fechaNacimiento: '1985-03-20', genero: 'M', nacionalidad: 'Costarricense',
        emailPersonal: 'carlos.ramirez@gmail.com', telefono: '8812-3456',
        titulo: 'Máster en Ciencias de la Computación', especialidad: 'Ingeniería de Software',
        cursosAsignados: 3,
        provincia: 'San José', canton: 'Central', distrito: 'Catedral',
        direccionExacta: 'Barrio Escalante, 100m sur',
        codigoProfesor: 'PROF-001', emailInstitucional: 'carlos.ramirez@universidad.ac.cr',
        fechaIngreso: '2020-02-15', estadoProfesor: 'activo', contrasena: '********',
      },
      {
        id: 2, cedula: '2-0345-0678',
        nombre: 'María', apellidoPaterno: 'Fernández', apellidoMaterno: 'Mora',
        fechaNacimiento: '1980-08-12', genero: 'F', nacionalidad: 'Costarricense',
        emailPersonal: 'maria.fernandez@gmail.com', telefono: '8834-5678',
        titulo: 'Doctorado en Matemática Aplicada', especialidad: 'Matemáticas',
        cursosAsignados: 4,
        provincia: 'Heredia', canton: 'Central', distrito: 'Heredia',
        direccionExacta: 'Frente a la UNA',
        codigoProfesor: 'PROF-002', emailInstitucional: 'maria.fernandez@universidad.ac.cr',
        fechaIngreso: '2018-08-01', estadoProfesor: 'activo', contrasena: '********',
      },
      {
        id: 3, cedula: '3-0456-0789',
        nombre: 'José', apellidoPaterno: 'Vargas', apellidoMaterno: 'Solano',
        fechaNacimiento: '1990-01-05', genero: 'M', nacionalidad: 'Costarricense',
        emailPersonal: 'jose.vargas@gmail.com', telefono: '8856-7890',
        titulo: 'MBA en Dirección de Empresas', especialidad: 'Administración',
        cursosAsignados: 2,
        provincia: 'San José', canton: 'Escazú', distrito: 'San Rafael',
        direccionExacta: '',
        codigoProfesor: 'PROF-003', emailInstitucional: 'jose.vargas@universidad.ac.cr',
        fechaIngreso: '2019-03-10', estadoProfesor: 'activo', contrasena: '********',
      },
      {
        id: 4, cedula: '4-0567-0890',
        nombre: 'Ana', apellidoPaterno: 'Jiménez', apellidoMaterno: 'Castro',
        fechaNacimiento: '1992-06-18', genero: 'F', nacionalidad: 'Costarricense',
        emailPersonal: 'ana.jimenez@gmail.com', telefono: '8878-9012',
        titulo: 'Licenciatura en Física', especialidad: 'Física',
        cursosAsignados: 0,
        provincia: 'Cartago', canton: 'Central', distrito: 'Oriental',
        direccionExacta: '',
        codigoProfesor: 'PROF-004', emailInstitucional: 'ana.jimenez@universidad.ac.cr',
        fechaIngreso: '2021-07-20', estadoProfesor: 'inactivo', contrasena: '********',
      },
    ];
    this.profesoresFiltrados = [...this.profesores];
  }

  buscar(): void {
    this.aplicarFiltros();
  }

  filtrar(estado: string): void {
    this.filtroActivo = estado;
    this.aplicarFiltros();
  }

  private aplicarFiltros(): void {
    let resultado = [...this.profesores];

    if (this.filtroActivo !== 'todos') {
      resultado = resultado.filter(p => p.estadoProfesor === this.filtroActivo);
    }

    if (this.terminoBusqueda.trim()) {
      const t = this.terminoBusqueda.toLowerCase();
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(t) ||
        p.apellidoPaterno.toLowerCase().includes(t) ||
        (p.apellidoMaterno || '').toLowerCase().includes(t) ||
        p.codigoProfesor.toLowerCase().includes(t) ||
        p.emailInstitucional.toLowerCase().includes(t) ||
        p.cedula.includes(t) ||
        p.especialidad.toLowerCase().includes(t)
      );
    }

    this.profesoresFiltrados = resultado;
  }

  getEstadoClass(estado: string): string {
    const map: Record<string, string> = {
      activo: 'badge-success',
      inactivo: 'badge-danger',
    };
    return map[estado] || 'badge-warning';
  }

  getIniciales(prof: Profesor): string {
    return (prof.nombre.charAt(0) + prof.apellidoPaterno.charAt(0)).toUpperCase();
  }

  getNombreCompleto(prof: Profesor): string {
    return `${prof.nombre} ${prof.apellidoPaterno} ${prof.apellidoMaterno || ''}`.trim();
  }

  verDetalle(prof: Profesor): void {
    this.router.navigate([prof.id], { relativeTo: this.route });
  }

  editarProfesor(prof: Profesor): void {
    this.router.navigate(['editar', prof.id], { relativeTo: this.route });
  }

  eliminarProfesor(prof: Profesor): void {
    if (confirm(`¿Está seguro de eliminar a ${this.getNombreCompleto(prof)}?`)) {
      this.profesores = this.profesores.filter(p => p.id !== prof.id);
      this.aplicarFiltros();
    }
  }

  nuevoProfesor(): void {
    this.router.navigate(['nuevo'], { relativeTo: this.route });
  }
}