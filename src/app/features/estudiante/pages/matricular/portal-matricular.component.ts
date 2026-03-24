import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CursoOferta {
  idOferta: number;
  codigo: string;
  nombre: string;
  profesor: string;
  aula: string;
  horario: string;
  creditos: number;
  cupoMaximo: number;
  matriculados: number;
  precio: number;
  color: string;
  matriculado: boolean;
}

@Component({
  selector: 'app-portal-matricular',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portal-matricular.html',
  styleUrls: ['./portal-matricular.scss'],
})
export class PortalMatricularComponent {

  filtroBusqueda = '';
  confirmando: CursoOferta | null = null;

  periodo = {
    nombre: 'Período 2026-1',
    fechaInicio: '2026-02-03',
    fechaFin: '2026-06-20',
    fechaCierreMatricula: '2026-02-10',
  };

  oferta: CursoOferta[] = [
    {
      idOferta: 1,
      codigo: 'CS-401',
      nombre: 'Inteligencia Artificial',
      profesor: 'Dr. Carlos Méndez',
      aula: 'Lab. Cómputo 2',
      horario: 'Lun / Mié 08:00 – 10:00',
      creditos: 4,
      cupoMaximo: 30,
      matriculados: 22,
      precio: 85000,
      color: '#06b6d4',
      matriculado: false,
    },
    {
      idOferta: 2,
      codigo: 'CS-410',
      nombre: 'Redes de Computadoras',
      profesor: 'M.Sc. Patricia Arce',
      aula: 'Aula B-202',
      horario: 'Mar / Jue 10:00 – 12:00',
      creditos: 3,
      cupoMaximo: 35,
      matriculados: 35,
      precio: 70000,
      color: '#ef4444',
      matriculado: false,
    },
    {
      idOferta: 3,
      codigo: 'MAT-301',
      nombre: 'Probabilidad y Estadística',
      profesor: 'Dr. Jorge Rojas',
      aula: 'Aula A-103',
      horario: 'Vie 07:00 – 10:00',
      creditos: 3,
      cupoMaximo: 40,
      matriculados: 18,
      precio: 65000,
      color: '#10b981',
      matriculado: false,
    },
    {
      idOferta: 4,
      codigo: 'CS-420',
      nombre: 'Ingeniería de Software',
      profesor: 'Ing. Sofía Brenes',
      aula: 'Lab. Cómputo 4',
      horario: 'Lun / Mié 14:00 – 16:00',
      creditos: 4,
      cupoMaximo: 25,
      matriculados: 20,
      precio: 85000,
      color: '#8b5cf6',
      matriculado: false,
    },
    {
      idOferta: 5,
      codigo: 'HUM-201',
      nombre: 'Ética Profesional',
      profesor: 'M.Sc. Gabriela Mora',
      aula: 'Aula C-101',
      horario: 'Mar 16:00 – 18:00',
      creditos: 2,
      cupoMaximo: 50,
      matriculados: 31,
      precio: 45000,
      color: '#f59e0b',
      matriculado: false,
    },
  ];

  get ofertaFiltrada(): CursoOferta[] {
    const term = this.filtroBusqueda.toLowerCase();
    if (!term) return this.oferta;
    return this.oferta.filter(
      (c) =>
        c.nombre.toLowerCase().includes(term) ||
        c.codigo.toLowerCase().includes(term) ||
        c.profesor.toLowerCase().includes(term)
    );
  }

  get cuposDisponibles(): number {
    return this.oferta.filter((c) => !c.matriculado && this.getCuposRestantes(c) > 0).length;
  }

  getCuposRestantes(curso: CursoOferta): number {
    return curso.cupoMaximo - curso.matriculados;
  }

  getCupoPercent(curso: CursoOferta): number {
    return Math.round((curso.matriculados / curso.cupoMaximo) * 100);
  }

  getCupoClass(curso: CursoOferta): string {
    const pct = this.getCupoPercent(curso);
    if (pct >= 100) return 'cupo-lleno';
    if (pct >= 80) return 'cupo-critico';
    return 'cupo-ok';
  }

  abrirConfirmacion(curso: CursoOferta): void {
    this.confirmando = curso;
  }

  cancelarConfirmacion(): void {
    this.confirmando = null;
  }

  confirmarMatricula(): void {
    if (!this.confirmando) return;
    this.confirmando.matriculado = true;
    this.confirmando.matriculados += 1;
    this.confirmando = null;
  }
}
