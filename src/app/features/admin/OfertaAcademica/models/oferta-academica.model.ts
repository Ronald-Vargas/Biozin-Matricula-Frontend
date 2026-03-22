export interface DiaHorario {
  dia: string;
  horaInicio: string;
  horaFin: string;
}

export interface OfertaAcademica {
  idOferta: number;
  idPeriodo: number;
  idCurso: number;
  idProfesor: number;
  idAula: number;
  cupoMaximo: number;
  matriculados: number;
  precio: number;
  estado: 'Activo' | 'Inactivo' | 'Lleno';
  fechaCreacion: string;
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
