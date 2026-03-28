
export interface Administrador {
    idAdministrador: number,
    identificacion: string,
    nombreCompleto: string,
    usuario: string,
    correo: string,
    telefono: string,
    Contraseña: string,
    activo: boolean
}


export interface CreateAdministradorDto {
    identificacion: string,
    nombreCompleto: string,
    usuario: string,
    correo: string,
    telefono: string,
    Contraseña: string,
}


export interface Respuesta<T> {
    valorRetorno: T;
    strMensajeRespuesta: string;
    blnError: boolean;
    strTituloRespuesta: string;
}