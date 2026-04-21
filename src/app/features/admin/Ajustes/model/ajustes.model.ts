export interface Ajustes {
    idAjuste: number,
    nombreUniversidad: string,
    sitioWeb: string,
    correoInstitucional: string,
    telefono: string,
    direccion: string,
    provincia: string,
    canton: string,
    distrito: string,
    montoMatricula?: number | null,
    montoInfraestructura?: number | null,
}


export interface CreateAjustesDto {
    nombreUniversidad: string,
    sitioWeb: string,
    correoInstitucional: string,
    telefono: string,
    direccion: string,
    provincia: string,
    canton: string,
    distrito: string,
    montoMatricula?: number | null,
    montoInfraestructura?: number | null,
}


export interface Respuesta<T> {
valorRetorno: T;
  strMensajeRespuesta: string;
  blnError: boolean;
  strTituloRespuesta: string;
}
