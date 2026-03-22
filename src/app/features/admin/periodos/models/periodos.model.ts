export interface Periodo {
  idPeriodo: number;
  nombre: string;
  fechaInicio: Date;
  fechaFin: Date;
  fechaMatriculaInicio: Date;
  fechaMatriculaFin: Date;
  estadoMatricula: boolean;
}

export interface CreatePeriodoDto {
  nombre: string;
  fechaInicio: Date;
  fechaFin: Date;
  fechaMatriculaInicio: Date;
  fechaMatriculaFin: Date;
}

export interface Respuesta<T> {
  valorRetorno: T;
  strMensajeRespuesta: string;
  blnError: boolean;
  strTituloRespuesta: string;
}