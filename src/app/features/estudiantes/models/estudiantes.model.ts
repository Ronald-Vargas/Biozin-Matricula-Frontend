export interface Estudiante {
  id: number;
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  carreraId: number;
  carreraCodigo: string;
  carreraNombre: string;
  semestre: number;
  creditosAprobados: number;
  creditosTotales: number;
  promedio: number;
  estado: 'activo' | 'graduado' | 'retirado' | 'inactivo';
}

export interface CarreraOption {
  id: number;
  codigo: string;
  nombre: string;
  creditos: number;
}