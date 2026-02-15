export interface Carrera {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  duracionSemestres: number;
  creditosTotales?: number;
  estado: 'activa' | 'inactiva';
  fechaCreacion: Date;
}

export interface CreateCarreraDto {
  codigo: string;
  nombre: string;
  descripcion: string;
  duracionSemestres: number;
}
