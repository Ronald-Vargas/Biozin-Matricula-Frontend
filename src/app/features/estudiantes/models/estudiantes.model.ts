export interface Estudiante {
  id: number;

  // Información personal
  codigoEstudiante: string;
  cedula: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  fechaNacimiento: string;
  genero: string;
  nacionalidad?: string;
  discapacidad: boolean;
  tipoDiscapacidad?: string;
  necesitaAsistencia: boolean;

  // Contacto
  emailInstitucional: string;
  emailPersonal: string;
  telefonoMovil: string;
  telefonoEmergencia?: string;
  nombreContactoEmergencia?: string;

  // Dirección
  provincia?: string;
  canton?: string;
  distrito?: string;
  direccionExacta?: string;

  // Académico
  idCarrera: number;
  carreraCodigo: string;
  carreraNombre: string;
  fechaIngreso: string;
  semestreActual: number;
  estadoEstudiante: string;
  tipoBeca: string;
  condicionSocioeconomica?: string;
  trabaja: boolean;

  // Colegio
  colegioProcedencia?: string;
  tipoColegio?: string;
  anioGraduacionColegio?: number;

  // Observaciones
  observaciones?: string;

  // Calculados / display
  creditosAprobados: number;
  creditosTotales: number;
}


export interface CarreraOption {
  id: number;
  codigo: string;
  nombre: string;
  creditos: number;
}