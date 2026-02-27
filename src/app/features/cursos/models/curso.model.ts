export interface Curso {
  idCurso: number;
  codigo: string;
  creditos: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export interface CreateCursoDto {
  codigo: string;
  nombre: string;
  descripcion: string;
  creditos: number;
}

export interface Respuesta<T> {
  valorRetorno: T;
  strMensajeRespuesta: string;
  blnError: boolean;
  strTituloRespuesta: string;
}