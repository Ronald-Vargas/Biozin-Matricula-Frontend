export interface Profesor {
  idProfesor: number;
  cedula: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: Date;
  genero: string;
  nacionalidad: string;
  emailPersonal: string;
  telefono: string;
  titulo: string;
  especialidad: string;
  cursosAsignados: number;
  provincia: string;
  canton: string;
  distrito: string;
  direccion: string;
  codigo: string;
  emailInstitucional: string;
  fechaIngreso: Date;
  estado: boolean;

}

export interface CreateProfesorDto {
  cedula: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: Date;
  genero: string;
  nacionalidad: string;
  emailPersonal: string;
  telefono: string;
  titulo: string;
  especialidad: string;
  cursosAsignados: number;
  provincia: string;
  canton: string;
  distrito: string;
  direccion: string;
  estado: boolean;
}

export interface Respuesta<T> {
  valorRetorno: T;
  strMensajeRespuesta: string;
  blnError: boolean;
  strTituloRespuesta: string;
}