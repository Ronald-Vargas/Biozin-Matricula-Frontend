export interface Ajustes {
    idAjuste: number,
    nombreUniversidad: string,
    sitioWeb: string,
    correoInstitucional: string,
    telefono: string,
    direccion: string,
    privincia: string,
    canton: string,
    distrito: string,
}


export interface CreateAjustesDto {
    nombreUniversidad: string,
    sitioWeb: string,
    correoInstitucional: string,
    telefono: string,
    direccion: string,
    privincia: string,
    canton: string,
    distrito: string,
}


export interface Respuesta<T> {
valorRetorno: T;
  strMensajeRespuesta: string;
  blnError: boolean;
  strTituloRespuesta: string;
}