export interface Asignacion {
  id: number;
  idCarrera: number;
  idCurso: number;
  semestre: number;
  prerequisitos?: number[]; // IDs de cursos prerequisitos
}

export interface CreateAsignacionDto {
  idCarrera: number;
  idCurso: number;
  semestre: number;
  prerequisitos?: number[];
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
  prerequisitos?: string[];
}



export interface CursoPreforma {
  codigo: string;
  nombre: string;
  creditos: number;
  costoPorCredito: number;
  costo: number;
}