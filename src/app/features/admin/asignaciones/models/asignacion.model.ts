
export interface Asignacion {
  idAsignacion: number;
  idCarrera: number;
  idCurso: number;
  semestre: number;
  prerequisitos?: number[];
}

export interface CreateAsignacionDto {
  idCarrera: number;
  idCurso: number;
  semestre: number;
}

export interface Respuesta<T> {
  valorRetorno: T;
  strMensajeRespuesta: string;
  blnError: boolean;
  strTituloRespuesta: string;
}










export interface MallaCurricular {
  carrera: string;
  semestres: SemestreInfo[];
  creditosTotales: number;
}

export interface SemestreInfo {
  numero: number;
  cursos: CursoMalla[];
  creditosSemestre: number;
}

export interface CursoMalla {
  codigo: string;
  nombre: string;
  creditos: number;
  esObligatorio?: boolean;
  prerequisitos?: string[];
}