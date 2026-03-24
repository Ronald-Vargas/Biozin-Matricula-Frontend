import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CursoHistorial {
  codigo: string;
  nombre: string;
  creditos: number;
  nota: number | null;
  estado: 'aprobado' | 'reprobado' | 'en_curso';
}

interface SemestreHistorial {
  label: string;
  periodo: string;
  cursos: CursoHistorial[];
  promedio: number | null;
}

@Component({
  selector: 'app-portal-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portal-historial.html',
  styleUrls: ['./portal-historial.scss'],
})
export class PortalHistorialComponent {

  semestres: SemestreHistorial[] = [
    {
      label: 'Semestre 5',
      periodo: '2026-1 (En curso)',
      promedio: null,
      cursos: [
        { codigo: 'CS-301', nombre: 'Programación Orientada a Objetos', creditos: 4, nota: null, estado: 'en_curso' },
        { codigo: 'CS-315', nombre: 'Bases de Datos I', creditos: 4, nota: null, estado: 'en_curso' },
        { codigo: 'MAT-201', nombre: 'Cálculo Diferencial', creditos: 3, nota: null, estado: 'en_curso' },
        { codigo: 'CS-320', nombre: 'Estructuras de Datos', creditos: 4, nota: null, estado: 'en_curso' },
      ],
    },
    {
      label: 'Semestre 4',
      periodo: '2025-2',
      promedio: 88.5,
      cursos: [
        { codigo: 'CS-210', nombre: 'Programación I', creditos: 4, nota: 92, estado: 'aprobado' },
        { codigo: 'CS-225', nombre: 'Lógica Matemática', creditos: 3, nota: 85, estado: 'aprobado' },
        { codigo: 'MAT-150', nombre: 'Álgebra Lineal', creditos: 3, nota: 88, estado: 'aprobado' },
        { codigo: 'CS-230', nombre: 'Sistemas Operativos', creditos: 4, nota: 89, estado: 'aprobado' },
      ],
    },
    {
      label: 'Semestre 3',
      periodo: '2025-1',
      promedio: 84.0,
      cursos: [
        { codigo: 'CS-150', nombre: 'Fundamentos de Programación', creditos: 4, nota: 90, estado: 'aprobado' },
        { codigo: 'CS-160', nombre: 'Introducción a Redes', creditos: 3, nota: 78, estado: 'aprobado' },
        { codigo: 'MAT-110', nombre: 'Cálculo I', creditos: 3, nota: 75, estado: 'aprobado' },
        { codigo: 'HUM-101', nombre: 'Comunicación Técnica', creditos: 2, nota: 93, estado: 'aprobado' },
      ],
    },
    {
      label: 'Semestre 2',
      periodo: '2024-2',
      promedio: 82.3,
      cursos: [
        { codigo: 'CS-101', nombre: 'Introducción a la Informática', creditos: 3, nota: 87, estado: 'aprobado' },
        { codigo: 'MAT-100', nombre: 'Matemática General', creditos: 3, nota: 79, estado: 'aprobado' },
        { codigo: 'HUM-100', nombre: 'Español para Ingeniería', creditos: 2, nota: 85, estado: 'aprobado' },
        { codigo: 'CS-110', nombre: 'Electrónica Digital', creditos: 3, nota: 78, estado: 'aprobado' },
      ],
    },
    {
      label: 'Semestre 1',
      periodo: '2024-1',
      promedio: 86.0,
      cursos: [
        { codigo: 'GEN-101', nombre: 'Orientación Universitaria', creditos: 1, nota: 90, estado: 'aprobado' },
        { codigo: 'MAT-050', nombre: 'Precálculo', creditos: 3, nota: 84, estado: 'aprobado' },
        { codigo: 'CS-050', nombre: 'Lógica de Programación', creditos: 3, nota: 88, estado: 'aprobado' },
        { codigo: 'HUM-050', nombre: 'Inglés Técnico I', creditos: 2, nota: 82, estado: 'aprobado' },
      ],
    },
  ];

  get promedioGeneral(): number {
    const semestresConNota = this.semestres.filter((s) => s.promedio !== null);
    if (semestresConNota.length === 0) return 0;
    const suma = semestresConNota.reduce((acc, s) => acc + (s.promedio ?? 0), 0);
    return Math.round((suma / semestresConNota.length) * 10) / 10;
  }

  get totalCreditosAprobados(): number {
    return this.semestres
      .flatMap((s) => s.cursos)
      .filter((c) => c.estado === 'aprobado')
      .reduce((acc, c) => acc + c.creditos, 0);
  }

  get totalCursosAprobados(): number {
    return this.semestres.flatMap((s) => s.cursos).filter((c) => c.estado === 'aprobado').length;
  }

  getNotaClass(curso: CursoHistorial): string {
    if (curso.estado === 'en_curso') return 'nota-en-curso';
    if (!curso.nota) return '';
    if (curso.nota >= 80) return 'nota-alta';
    if (curso.nota >= 70) return 'nota-media';
    return 'nota-baja';
  }

  getEstadoLabel(estado: string): string {
    if (estado === 'aprobado') return 'Aprobado';
    if (estado === 'reprobado') return 'Reprobado';
    return 'En curso';
  }
}
