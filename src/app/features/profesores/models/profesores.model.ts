export interface Profesor {

    id: number;

  // ── Información Personal ──
    cedula: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaNacimiento: string;
    genero: string;
    nacionalidad: string;
   
    // ── Contacto ──
    emailPersonal: string;
    telefono: string;

    // ── Académico ──
    titulo: string;
    especialidad: string;
    cursosAsignados: number;


    // ── Dirección ──
    provincia: string;
    canton: string;
    distrito: string;
    direccionExacta: string;


    // ── Campos automáticos (solo lectura en edición) ──
    codigoProfesor: string;
    emailInstitucional: string;
    contrasena: string;
    fechaIngreso: string;
    estadoProfesor: string;

}
