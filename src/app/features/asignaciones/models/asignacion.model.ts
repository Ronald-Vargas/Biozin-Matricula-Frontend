
export interface Asignacion {
  id: number;
  idCarrera: number;
  idCurso: number;
  semestre: number;
  esObligatorio: boolean;
  prerequisitos?: number[]; // IDs de cursos prerequisitos
}

export interface CreateAsignacionDto {
  idCarrera: number;
  idCurso: number;
  semestre: number;
  esObligatorio: boolean;
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
  esObligatorio: boolean;
  prerequisitos?: string[];
}

export interface PreformaMatricula {
  estudiante: {
    codigo: string;
    nombre: string;
    carrera: string;
  };
  periodo: string;
  cursos: CursoPreforma[];
  subtotal: number;
  descuentos: number;
  total: number;
}

export interface CursoPreforma {
  codigo: string;
  nombre: string;
  creditos: number;
  costoPorCredito: number;
  costo: number;
}
