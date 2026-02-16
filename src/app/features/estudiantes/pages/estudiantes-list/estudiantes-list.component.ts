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
  styleUrls: ['./estudiantes-list.scss']
})
export class EstudiantesListComponent implements OnInit {

  estudiantes: Estudiante[] = [];
  estudiantesFiltrados: Estudiante[] = [];
  terminoBusqueda: string = '';
  filtroActivo: string = 'todos';

    constructor(
    private router: Router,
    private route: ActivatedRoute   // ← Agregar esto
  ) {}

  ngOnInit(): void {
    // TODO: Reemplazar con tu EstudianteService
    this.estudiantes = [
      {
        id: 1, codigo: 'EST-2024-0001', nombres: 'Juan Carlos', apellidos: 'Pérez Rodríguez',
        email: 'juan.perez@universidad.edu', carreraId: 1, carreraCodigo: 'ING-SIS',
        carreraNombre: 'Ingeniería en Sistemas', semestre: 5, creditosAprobados: 80,
        creditosTotales: 180, promedio: 87.5, estado: 'activo'
      },
      {
        id: 2, codigo: 'EST-2024-0002', nombres: 'María Fernanda', apellidos: 'González López',
        email: 'maria.gonzalez@universidad.edu', carreraId: 1, carreraCodigo: 'ING-SIS',
        carreraNombre: 'Ingeniería en Sistemas', semestre: 3, creditosAprobados: 48,
        creditosTotales: 180, promedio: 92.3, estado: 'activo'
      },
      {
        id: 3, codigo: 'EST-2024-0003', nombres: 'Carlos Alberto', apellidos: 'Ramírez Mora',
        email: 'carlos.ramirez@universidad.edu', carreraId: 2, carreraCodigo: 'ING-IND',
        carreraNombre: 'Ingeniería Industrial', semestre: 7, creditosAprobados: 112,
        creditosTotales: 175, promedio: 85.0, estado: 'activo'
      },
      {
        id: 4, codigo: 'EST-2023-0045', nombres: 'Ana Patricia', apellidos: 'Vargas Castro',
        email: 'ana.vargas@universidad.edu', carreraId: 3, carreraCodigo: 'ADM-EMP',
        carreraNombre: 'Administración de Empresas', semestre: 8, creditosAprobados: 140,
        creditosTotales: 140, promedio: 88.7, estado: 'graduado'
      },
      {
        id: 5, codigo: 'EST-2024-0005', nombres: 'Roberto José', apellidos: 'Hernández Silva',
        email: 'roberto.hernandez@universidad.edu', carreraId: 1, carreraCodigo: 'ING-SIS',
        carreraNombre: 'Ingeniería en Sistemas', semestre: 2, creditosAprobados: 24,
        creditosTotales: 180, promedio: 78.5, estado: 'activo'
      },
      {
        id: 6, codigo: 'EST-2022-0123', nombres: 'Laura Beatriz', apellidos: 'Sánchez Mora',
        email: 'laura.sanchez@universidad.edu', carreraId: 2, carreraCodigo: 'ING-IND',
        carreraNombre: 'Ingeniería Industrial', semestre: 4, creditosAprobados: 45,
        creditosTotales: 175, promedio: 81.2, estado: 'retirado'
      }
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
      resultado = resultado.filter(e => e.estado === this.filtroActivo);
    }

    if (this.terminoBusqueda.trim()) {
      const t = this.terminoBusqueda.toLowerCase();
      resultado = resultado.filter(e =>
        e.nombres.toLowerCase().includes(t) ||
        e.apellidos.toLowerCase().includes(t) ||
        e.codigo.toLowerCase().includes(t) ||
        e.email.toLowerCase().includes(t)
      );
    }

    this.estudiantesFiltrados = resultado;
  }

  getProgreso(est: Estudiante): number {
    return Math.round((est.creditosAprobados / est.creditosTotales) * 100);
  }

  getEstadoClass(estado: string): string {
    const map: Record<string, string> = {
      activo: 'badge-success', graduado: 'badge-primary',
      retirado: 'badge-warning', inactivo: 'badge-danger'
    };
    return map[estado] || '';
  }

  getIniciales(est: Estudiante): string {
    return est.nombres.charAt(0) + est.apellidos.charAt(0);
  }

  verDetalle(est: Estudiante): void {
    this.router.navigate([est.id], { relativeTo: this.route });
  }

  editarEstudiante(est: Estudiante): void {
    this.router.navigate(['editar', est.id], { relativeTo: this.route });
  }

  eliminarEstudiante(est: Estudiante): void {
    if (confirm(`¿Está seguro de eliminar a ${est.nombres} ${est.apellidos}?`)) {
      // TODO: Llamar servicio de eliminación
      this.estudiantes = this.estudiantes.filter(e => e.id !== est.id);
      this.aplicarFiltros();
    }
  }

  nuevoEstudiante(): void {
    this.router.navigate(['nuevo'], { relativeTo: this.route });
  }
}