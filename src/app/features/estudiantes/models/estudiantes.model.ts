export interface Estudiante {
  idEstudiante: number;

  // Información personal
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
  estadoEstudiante: boolean;
  tipoBeca: string;
  condicionSocioeconomica?: string;
  trabaja: boolean;
  carnet: number;

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


export interface CreateEstudianteDto {

  // Información personal
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
  estadoEstudiante: boolean;
  tipoBeca: string;
  condicionSocioeconomica?: string;
  trabaja: boolean;

  // Colegio
  colegioProcedencia?: string;
  tipoColegio?: string;
  anioGraduacionColegio?: number;

  // Observaciones
  observaciones?: string;
}






export interface CarreraOption {
  id: number;
  codigo: string;
  nombre: string;
  creditos: number;
}





export interface Respuesta<T> {
  valorRetorno: T;
  strMensajeRespuesta: string;
  blnError: boolean;
  strTituloRespuesta: string;
}