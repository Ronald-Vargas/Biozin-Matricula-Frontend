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
    // TODO: Reemplazar con tu EstudianteService.getById(id)
    this.estudiante = this.getDatosMock(id);
  }

  getProgreso(): number {
    if (!this.estudiante) return 0;
    return Math.round((this.estudiante.creditosAprobados / this.estudiante.creditosTotales) * 100);
  }

  getIniciales(): string {
    if (!this.estudiante) return '';
    return this.estudiante.nombres.charAt(0) + this.estudiante.apellidos.charAt(0);
  }

  getEstadoClass(): string {
    if (!this.estudiante) return '';
    const map: Record<string, string> = {
      activo: 'badge-success', graduado: 'badge-primary',
      retirado: 'badge-warning', inactivo: 'badge-danger'
    };
    return map[this.estudiante.estado] || '';
  }



  volver(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
 

  private getDatosMock(id: number): Estudiante | null {
    const datos: Estudiante[] = [
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
    return datos.find(e => e.id === id) || null;
  }
}