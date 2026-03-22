export interface Aula {
  idAula: number;
  numeroAula: string;
  capacidad: number;
  esLaboratorio: boolean;
  descripcion: string;
  activo: boolean;
}

export interface CreateAulaDto {
  numeroAula: string;
  capacidad: number;
  esLaboratorio: boolean;
  descripcion: string;
  activo: boolean;
}

export interface Respuesta<T> {
  valorRetorno: T;
  strMensajeRespuesta: string;
  blnError: boolean;
  strTituloRespuesta: string;
}
