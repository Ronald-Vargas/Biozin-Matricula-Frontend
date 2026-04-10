export interface Curso {
  idCurso: number;
  codigo: string;
  creditos: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
  precio: number;
  tieneLaboratorio: boolean;
  precioLaboratorio?: number;
  idCursoRequisito?: number;
  horasDuracion: number;
}

export interface CreateCursoDto {
  codigo: string;
  nombre: string;
  descripcion: string;
  creditos: number;
  precio: number;
  tieneLaboratorio: boolean;
  precioLaboratorio?: number;
  idCursoRequisito?: number;
  horasDuracion: number;
}

export interface Respuesta<T> {
  valorRetorno: T;
  strMensajeRespuesta: string;
  blnError: boolean;
  strTituloRespuesta: string;
}