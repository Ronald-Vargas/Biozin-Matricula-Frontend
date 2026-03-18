export interface DiaHorario {
  dia: string;
  horaInicio: string;
  horaFin: string;
}

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
  diasHorarios?: DiaHorario[];
  aula: string;
  cupoMaximo: number;
  matriculados: number;
  estado: 'activo' | 'inactivo' | 'lleno';
}