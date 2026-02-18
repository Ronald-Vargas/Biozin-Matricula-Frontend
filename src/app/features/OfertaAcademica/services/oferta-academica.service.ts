import { Injectable } from "@angular/core";
import { OfertaAcademica } from "../models/oferta-academica.model";
import { BehaviorSubject, Observable } from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class OfertaAcademicaService {
  private storageKey = 'ofertaAcademica';
  private ofertasSubject = new BehaviorSubject<OfertaAcademica[]>(this.cargarDatos());

  ofertas$ = this.ofertasSubject.asObservable();

  private cargarDatos(): OfertaAcademica[] {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      return JSON.parse(data);
    }
    const inicial: OfertaAcademica[] = [
      {
        id: '1',
        codigo: 'OFR-001',
        periodoId: '1',
        periodoNombre: 'I Semestre 2026',
        cursoId: '1',
        cursoNombre: 'Programación I',
        cursoCodigo: 'CS-101',
        profesorId: '1',
        profesorNombre: 'Carlos Ramírez López',
        horario: '8:00 - 9:40 am',
        dias: 'Lun - Mié',
        aula: 'A-201',
        cupoMaximo: 35,
        matriculados: 27,
        precio: 85000,
        estado: 'activo',
      },
      {
        id: '2',
        codigo: 'OFR-002',
        periodoId: '1',
        periodoNombre: 'I Semestre 2026',
        cursoId: '2',
        cursoNombre: 'Cálculo I',
        cursoCodigo: 'MAT-201',
        profesorId: '2',
        profesorNombre: 'María Fernández Mora',
        horario: '10:00 - 11:40 am',
        dias: 'Mar - Jue',
        aula: 'B-105',
        cupoMaximo: 35,
        matriculados: 14,
        precio: 85000,
        estado: 'activo',
      },
      {
        id: '3',
        codigo: 'OFR-003',
        periodoId: '1',
        periodoNombre: 'I Semestre 2026',
        cursoId: '3',
        cursoNombre: 'Base de Datos',
        cursoCodigo: 'CS-301',
        profesorId: '1',
        profesorNombre: 'Carlos Ramírez López',
        horario: '1:00 - 4:20 pm',
        dias: 'Viernes',
        aula: 'Lab-3',
        cupoMaximo: 35,
        matriculados: 32,
        precio: 95000,
        estado: 'activo',
      },
      {
        id: '4',
        codigo: 'OFR-004',
        periodoId: '1',
        periodoNombre: 'I Semestre 2026',
        cursoId: '4',
        cursoNombre: 'Administración I',
        cursoCodigo: 'ADM-101',
        profesorId: '3',
        profesorNombre: 'José Vargas Solano',
        horario: '2:00 - 3:40 pm',
        dias: 'Lun - Mié',
        aula: 'C-301',
        cupoMaximo: 35,
        matriculados: 10,
        precio: 75000,
        estado: 'activo',
      },
      {
        id: '5',
        codigo: 'OFR-005',
        periodoId: '2',
        periodoNombre: 'II Semestre 2025',
        cursoId: '1',
        cursoNombre: 'Programación I',
        cursoCodigo: 'CS-101',
        profesorId: '1',
        profesorNombre: 'Carlos Ramírez López',
        horario: '8:00 - 9:40 am',
        dias: 'Lun - Mié',
        aula: 'A-201',
        cupoMaximo: 35,
        matriculados: 35,
        precio: 85000,
        estado: 'lleno',
      },
    ];
    this.guardarDatos(inicial);
    return inicial;
  }

  private guardarDatos(ofertas: OfertaAcademica[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(ofertas));
  }

  getAll(): Observable<OfertaAcademica[]> {
    return this.ofertas$;
  }

  getByPeriodo(periodoId: string): OfertaAcademica[] {
    return this.ofertasSubject.getValue().filter((o) => o.periodoId === periodoId);
  }

  getById(id: string): OfertaAcademica | undefined {
    return this.ofertasSubject.getValue().find((o) => o.id === id);
  }

  crear(oferta: Omit<OfertaAcademica, 'id' | 'codigo' | 'matriculados' | 'estado'>): void {
    const ofertas = this.ofertasSubject.getValue();
    const nuevoId = (Math.max(...ofertas.map((o) => +o.id), 0) + 1).toString();
    const codigo = `OFR-${nuevoId.padStart(3, '0')}`;

    const nueva: OfertaAcademica = {
      ...oferta,
      id: nuevoId,
      codigo,
      matriculados: 0,
      estado: 'activo',
    };

    const actualizados = [...ofertas, nueva];
    this.guardarDatos(actualizados);
    this.ofertasSubject.next(actualizados);
  }

  actualizar(id: string, datos: Partial<OfertaAcademica>): void {
    const ofertas = this.ofertasSubject.getValue();
    const index = ofertas.findIndex((o) => o.id === id);
    if (index !== -1) {
      ofertas[index] = { ...ofertas[index], ...datos };
      // Auto-detectar si está lleno
      if (ofertas[index].matriculados >= ofertas[index].cupoMaximo) {
        ofertas[index].estado = 'lleno';
      }
      this.guardarDatos(ofertas);
      this.ofertasSubject.next([...ofertas]);
    }
  }

  eliminar(id: string): void {
    const ofertas = this.ofertasSubject.getValue().filter((o) => o.id !== id);
    this.guardarDatos(ofertas);
    this.ofertasSubject.next(ofertas);
  }

  toggleEstado(id: string): void {
    const oferta = this.getById(id);
    if (oferta) {
      this.actualizar(id, {
        estado: oferta.estado === 'activo' ? 'inactivo' : 'activo',
      });
    }
  }

  // Helper: obtener períodos únicos de las ofertas existentes
  getPeriodosDisponibles(): { id: string; nombre: string }[] {
    const ofertas = this.ofertasSubject.getValue();
    const map = new Map<string, string>();
    ofertas.forEach((o) => map.set(o.periodoId, o.periodoNombre));
    return Array.from(map, ([id, nombre]) => ({ id, nombre }));
  }
}