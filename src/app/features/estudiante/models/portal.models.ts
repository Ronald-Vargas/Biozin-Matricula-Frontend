export interface EstudiantePerfil {
  idEstudiante: number;
  nombre: string;
  apellidoPaterno: string;
  carnet: number;
  idCarrera: number;
  nombreCarrera: string;
  semestreActual?: number | null;
  emailInstitucional: string;
  creditosAprobados?: number;
  creditosEnCurso?: number;
  creditosTotales?: number;
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
  requiereCambioContrasena?: boolean;
}

export interface AdminPerfil {
  idAdministrador: number;
  nombreCompleto: string;
  emailInstitucional: string;
}

export interface HorarioSlot {
  dia: string;
  horaInicio: string;
  horaFin: string;
}

export interface OfertaMatriculaRaw {
  idOferta: number;
  codigo: string;
  nombre: string;
  profesor: string;
  aula: string;
  horario: HorarioSlot[];
  creditos: number;
  cupoMaximo: number;
  matriculados: number;
  precio: number;
  yaMatriculado?: boolean;
}

export interface PeriodoOfertas {
  idPeriodo: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  fechaMatriculaFin: string;
  ofertas: OfertaMatriculaRaw[];
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
  codigo: string;
  nombre: string;
  creditos: number;
  estado: 'aprobado' | 'reprobado' | 'en_curso';
}

export interface SemestreHistorial {
  label: string;
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

export interface CambiarContrasenaTemporariaRequest {
  email: string;
  contrasenaTemporal: string;
  nuevaContrasena: string;
}

export interface Respuesta<T> {
  valorRetorno: T;
  strMensajeRespuesta: string;
  blnError: boolean;
  strTituloRespuesta: string;
}
