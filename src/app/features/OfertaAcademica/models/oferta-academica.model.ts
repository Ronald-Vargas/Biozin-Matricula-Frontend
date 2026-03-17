export interface OfertaAcademica {
  id: string;
  codigo: string;
  periodoId: string;
  periodoNombre: string;
  cursoId: string;
  cursoNombre: string;
  cursoCodigo: string;
  profesorId: string;
  profesorNombre: string;
  horario: string;
  dias: string;
  aula: string;
  cupoMaximo: number;
  matriculados: number;
  estado: 'activo' | 'inactivo' | 'lleno';
}