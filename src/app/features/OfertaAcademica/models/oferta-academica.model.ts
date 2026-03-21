export interface DiaHorario {
  dia: string;
  horaInicio: string;
  horaFin: string;
}

export interface OfertaAcademica {
  idOferta: number;
  codigo: string;
  idPeriodo: number;
  periodoNombre: string;
  idCurso: number;
  cursoNombre: string;
  cursoCodigo: string;
  idProfesor: number;
  profesorNombre: string;
  idAula: number;
  aula: string;
  cupoMaximo: number;
  matriculados: number;
  estado: 'activo' | 'inactivo' | 'lleno';
  diasHorarios: DiaHorario[];
}

export interface CreateOfertaDto {
  idPeriodo: number;
  idCurso: number;
  idProfesor: number;
  idAula: number;
  cupoMaximo: number;
  diasHorarios: DiaHorario[];
}

export interface UpdateOfertaDto extends CreateOfertaDto {
  idOferta: number;
  estado: string;
}

export interface Respuesta<T> {
  valorRetorno: T;
  strMensajeRespuesta: string;
  blnError: boolean;
  strTituloRespuesta: string;
}
