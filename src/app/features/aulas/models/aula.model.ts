export interface Aula {
  idAula: number;
  numero: string;
  capacidad: number;
  esLaboratorio: boolean;
  descripcion: string;
  estado: boolean;
}

export interface CreateAulaDto {
  numero: string;
  capacidad: number;
  esLaboratorio: boolean;
  descripcion: string;
  estado: boolean;
}

export interface Respuesta<T> {
  valorRetorno: T;
  strMensajeRespuesta: string;
  blnError: boolean;
  strTituloRespuesta: string;
}
