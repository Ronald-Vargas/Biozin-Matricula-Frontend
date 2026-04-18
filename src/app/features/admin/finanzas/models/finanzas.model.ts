export interface ResumenFinanzas {
  idPeriodo: number | null;
  nombrePeriodo: string;
  totalRecaudado: number;
  totalPendiente: number;
  totalVencido: number;
  cantidadPagados: number;
  cantidadPendientes: number;
  cantidadVencidos: number;
  totalMatriculas: number;
}

export interface DetallePago {
  idPago: number;
  concepto: string;
  monto: number;
  estado: string;
  fechaVencimiento: string;
  fechaPago: string | null;
  nombreEstudiante: string;
  carnetEstudiante: string;
  nombrePeriodo: string;
}

export interface Respuesta<T> {
  valorRetorno: T;
  strMensajeRespuesta: string;
  blnError: boolean;
  strTituloRespuesta: string;
}
