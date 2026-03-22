export interface Carrera {
  idCarrera: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  duracion: number;
  estado: boolean;
}

export interface CreateCarreraDto {
  codigo: string;
  nombre: string;
  descripcion: string;
  duracion: number;
}

export interface Respuesta<T> {
  valorRetorno: T;
  strMensajeRespuesta: string;
  blnError: boolean;
  strTituloRespuesta: string;
}