export interface PerfilProfesor {
  idProfesor: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  emailInstitucional: string;
  titulo?: string;
  especialidad?: string;
  cursosAsignados: number;
}

export interface OfertaProfesor {
  idOferta: number;
  codigoCurso: string;
  nombreCurso: string;
  creditos: number;
  nombrePeriodo: string;
  nombreAula?: string;
  horario?: string;
  cupoMaximo: number;
  matriculados: number;
  estado: boolean;
}

export interface EstudianteEnCurso {
  idMatricula: number;
  idEstudiante: number;
  carnet: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  emailInstitucional: string;
  nota?: number;
  estado: string;
  creditosAprobados?: number;
  creditosTotales?: number;
}

export interface AsignarNotaRequest {
  idMatricula: number;
  nota: number;
}
