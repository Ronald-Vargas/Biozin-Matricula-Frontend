export interface EstudiantePerfil {
  idEstudiante: number;
  carnet: string;
  nombreCompleto: string;
  correo: string;
  carrera: string;
  semestre: number;
  creditosAprobados: number;
  creditosTotales: number;
  promedio: number;
}

export interface LoginRequest {
  Email: string;
  Contrasena: string;
}

export interface AuthRespuesta {
  token: string;
  role: string;
  id: number;
  nombre: string;
  email: string;
  carnet?: number;
  idCarrera?: number;
  nombreCarrera?: string;
  semestreActual?: number;
}

export interface AdminPerfil {
  idAdministrador: number;
  nombreCompleto: string;
  emailInstitucional: string;
}

export interface OfertaMatricula {
  idOferta: number;
  codigoCurso: string;
  nombreCurso: string;
  nombreProfesor: string;
  nombreAula: string;
  horario: string;
  creditos: number;
  cupoMaximo: number;
  matriculados: number;
  precio: number;
  yaMatriculado: boolean;
}

export interface CursoHistorial {
  codigoCurso: string;
  nombreCurso: string;
  creditos: number;
  nota: number | null;
  estado: 'aprobado' | 'reprobado' | 'en_curso';
}

export interface SemestreHistorial {
  semestre: number;
  periodo: string;
  cursos: CursoHistorial[];
  promedio: number | null;
}

export interface Pago {
  idPago: number;
  concepto: string;
  monto: number;
  fechaVencimiento: string;
  fechaPago: string | null;
  estado: 'pagado' | 'pendiente' | 'vencido';
  periodo: string;
}

export interface Respuesta<T> {
  valorRetorno: T;
  strMensajeRespuesta: string;
  blnError: boolean;
  strTituloRespuesta: string;
}
