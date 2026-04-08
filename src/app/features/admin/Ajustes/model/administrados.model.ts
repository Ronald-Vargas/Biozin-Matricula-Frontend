
export interface Administrador {
    idAdministrador: number,
    identificacion: string,
    nombreCompleto: string,
    correo: string,
    emailInstitucional: string,
    telefono: string,
    contraseña: string,
    activo: boolean
}

export interface CreateAdministradorDto {
    identificacion: string,
    nombreCompleto: string,
    correo: string,
    telefono: string,
}


export interface Respuesta<T> {
    valorRetorno: T;
    strMensajeRespuesta: string;
    blnError: boolean;
    strTituloRespuesta: string;
}