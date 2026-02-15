// src/app/core/services/carrera.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Carrera, CreateCarreraDto } from '../models/carrera.model';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {
  private carreras: Carrera[] = [];
  private carrerasSubject = new BehaviorSubject<Carrera[]>([]);
  public carreras$ = this.carrerasSubject.asObservable();

  constructor() {
    this.cargarDatosEjemplo();
  }

  // Obtener todas las carreras
  getCarreras(): Observable<Carrera[]> {
    return this.carreras$;
  }

  // Obtener carrera por ID
  getCarreraById(id: number): Carrera | undefined {
    return this.carreras.find(c => c.id === id);
  }

  // Crear nueva carrera
  createCarrera(dto: CreateCarreraDto): Carrera {
    const nuevaCarrera: Carrera = {
      id: Date.now(),
      ...dto,
      estado: 'activa',
      fechaCreacion: new Date()
    };

    this.carreras.push(nuevaCarrera);
    this.carrerasSubject.next([...this.carreras]);
    return nuevaCarrera;
  }

  // Actualizar carrera
  updateCarrera(id: number, dto: Partial<Carrera>): Carrera | undefined {
    const index = this.carreras.findIndex(c => c.id === id);
    if (index !== -1) {
      this.carreras[index] = { ...this.carreras[index], ...dto };
      this.carrerasSubject.next([...this.carreras]);
      return this.carreras[index];
    }
    return undefined;
  }

  // Eliminar carrera
  deleteCarrera(id: number): boolean {
    const index = this.carreras.findIndex(c => c.id === id);
    if (index !== -1) {
      this.carreras.splice(index, 1);
      this.carrerasSubject.next([...this.carreras]);
      return true;
    }
    return false;
  }

  // Cambiar estado de carrera
  toggleEstado(id: number): void {
    const carrera = this.carreras.find(c => c.id === id);
    if (carrera) {
      carrera.estado = carrera.estado === 'activa' ? 'inactiva' : 'activa';
      this.carrerasSubject.next([...this.carreras]);
    }
  }

  // Obtener carreras activas
  getCarrerasActivas(): Carrera[] {
    return this.carreras.filter(c => c.estado === 'activa');
  }

  private cargarDatosEjemplo(): void {
    this.carreras = [
      {
        id: 1,
        codigo: 'ING-SIS',
        nombre: 'Ingeniería en Sistemas',
        descripcion: 'Formación profesional en desarrollo de software, bases de datos y sistemas de información.',
        duracionSemestres: 10,
        creditosTotales: 180,
        estado: 'activa',
        fechaCreacion: new Date('2024-01-15')
      },
      {
        id: 2,
        codigo: 'ING-IND',
        nombre: 'Ingeniería Industrial',
        descripcion: 'Formación en optimización de procesos, gestión de operaciones y mejora continua.',
        duracionSemestres: 10,
        creditosTotales: 175,
        estado: 'activa',
        fechaCreacion: new Date('2024-01-15')
      },
      {
        id: 3,
        codigo: 'ADM-EMP',
        nombre: 'Administración de Empresas',
        descripcion: 'Formación en gestión empresarial, finanzas, marketing y recursos humanos.',
        duracionSemestres: 8,
        creditosTotales: 140,
        estado: 'activa',
        fechaCreacion: new Date('2024-02-01')
      }
    ];
    this.carrerasSubject.next([...this.carreras]);
  }
}
