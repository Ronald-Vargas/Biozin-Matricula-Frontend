export interface Curso {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  creditos: number;
  estado: 'activo' | 'inactivo';
  fechaCreacion: Date;
}

export interface CreateCursoDto {
  codigo: string;
  nombre: string;
  descripcion: string;
  creditos: number;
}
