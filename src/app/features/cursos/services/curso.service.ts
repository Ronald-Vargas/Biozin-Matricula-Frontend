// src/app/core/services/curso.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Curso, CreateCursoDto } from '../models/curso.model';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private cursos: Curso[] = [];
  private cursosSubject = new BehaviorSubject<Curso[]>([]);
  public cursos$ = this.cursosSubject.asObservable();

  constructor() {
    this.cargarDatosEjemplo();
  }

  getCursos(): Observable<Curso[]> {
    return this.cursos$;
  }

  getCursoById(id: number): Curso | undefined {
    return this.cursos.find(c => c.id === id);
  }

  createCurso(dto: CreateCursoDto): Curso {
    const nuevoCurso: Curso = {
      id: Date.now(),
      ...dto,
      estado: 'activo',
      fechaCreacion: new Date()
    };

    this.cursos.push(nuevoCurso);
    this.cursosSubject.next([...this.cursos]);
    return nuevoCurso;
  }

  updateCurso(id: number, dto: Partial<Curso>): Curso | undefined {
    const index = this.cursos.findIndex(c => c.id === id);
    if (index !== -1) {
      this.cursos[index] = { ...this.cursos[index], ...dto };
      this.cursosSubject.next([...this.cursos]);
      return this.cursos[index];
    }
    return undefined;
  }

  deleteCurso(id: number): boolean {
    const index = this.cursos.findIndex(c => c.id === id);
    if (index !== -1) {
      this.cursos.splice(index, 1);
      this.cursosSubject.next([...this.cursos]);
      return true;
    }
    return false;
  }

  getCursosActivos(): Curso[] {
    return this.cursos.filter(c => c.estado === 'activo');
  }

  private cargarDatosEjemplo(): void {
    this.cursos = [
      {
        id: 101,
        codigo: 'MAT-101',
        nombre: 'Cálculo I',
        descripcion: 'Fundamentos de cálculo diferencial e integral, límites y continuidad.',
        creditos: 4,
        estado: 'activo',
        fechaCreacion: new Date('2024-01-10')
      },
      {
        id: 102,
        codigo: 'PRG-101',
        nombre: 'Programación I',
        descripcion: 'Introducción a la programación con Python, estructuras de datos básicas.',
        creditos: 4,
        estado: 'activo',
        fechaCreacion: new Date('2024-01-10')
      },
      {
        id: 103,
        codigo: 'FIS-101',
        nombre: 'Física I',
        descripcion: 'Mecánica clásica, cinemática y dinámica.',
        creditos: 4,
        estado: 'activo',
        fechaCreacion: new Date('2024-01-10')
      },
      {
        id: 104,
        codigo: 'MAT-102',
        nombre: 'Cálculo II',
        descripcion: 'Cálculo integral, series y sucesiones.',
        creditos: 4,
        estado: 'activo',
        fechaCreacion: new Date('2024-01-10')
      },
      {
        id: 105,
        codigo: 'PRG-102',
        nombre: 'Programación II',
        descripcion: 'Programación orientada a objetos, estructuras de datos avanzadas.',
        creditos: 4,
        estado: 'activo',
        fechaCreacion: new Date('2024-01-10')
      },
      {
        id: 106,
        codigo: 'BD-201',
        nombre: 'Bases de Datos',
        descripcion: 'Diseño y administración de bases de datos relacionales, SQL.',
        creditos: 3,
        estado: 'activo',
        fechaCreacion: new Date('2024-01-10')
      },
      {
        id: 107,
        codigo: 'WEB-201',
        nombre: 'Desarrollo Web',
        descripcion: 'HTML, CSS, JavaScript, frameworks modernos.',
        creditos: 4,
        estado: 'activo',
        fechaCreacion: new Date('2024-01-10')
      },
      {
        id: 108,
        codigo: 'ALG-201',
        nombre: 'Algoritmos y Complejidad',
        descripcion: 'Análisis de algoritmos, estructuras de datos, complejidad computacional.',
        creditos: 4,
        estado: 'activo',
        fechaCreacion: new Date('2024-01-10')
      },
      {
        id: 109,
        codigo: 'ING-301',
        nombre: 'Ingeniería de Software',
        descripcion: 'Metodologías de desarrollo, patrones de diseño, testing.',
        creditos: 3,
        estado: 'activo',
        fechaCreacion: new Date('2024-01-10')
      },
      {
        id: 110,
        codigo: 'RED-301',
        nombre: 'Redes de Computadoras',
        descripcion: 'Protocolos de red, TCP/IP, seguridad en redes.',
        creditos: 3,
        estado: 'activo',
        fechaCreacion: new Date('2024-01-10')
      }
    ];
    this.cursosSubject.next([...this.cursos]);
  }
}
