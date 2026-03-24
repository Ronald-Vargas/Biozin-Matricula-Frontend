import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MateriaMatriculada {
  codigo: string;
  nombre: string;
  profesor: string;
  aula: string;
  horario: string;
  creditos: number;
  color: string;
}

interface AccionRapida {
  icon: string;
  title: string;
  description: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-portal-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './portal-inicio.html',
  styleUrls: ['./portal-inicio.scss'],
})
export class PortalInicioComponent implements OnInit {

  currentDate = '';

  estudiante = {
    nombre: 'Juan Carlos',
    apellido: 'Pérez Ramírez',
    carrera: 'Ingeniería en Sistemas',
    codigo: 'ING-SIS',
    semestre: 5,
    carnet: 2021001,
    emailInstitucional: 'jcperez@biozin.edu',
    creditosAprobados: 72,
    creditosTotales: 180,
    promedio: 87.5,
  };

  stats = [
    { icon: '📖', value: '4', label: 'Materias Matriculadas', color: '#06b6d4' },
    { icon: '🎯', value: '87.5', label: 'Promedio General', color: '#10b981' },
    { icon: '📊', value: '72 / 180', label: 'Créditos Aprobados', color: '#f59e0b' },
    { icon: '🗓️', value: 'Sem. 5', label: 'Semestre Actual', color: '#8b5cf6' },
  ];

  materiasMatriculadas: MateriaMatriculada[] = [
    {
      codigo: 'CS-301',
      nombre: 'Programación Orientada a Objetos',
      profesor: 'Dr. Roberto Quesada',
      aula: 'Aula A-201',
      horario: 'Lun / Mié 08:00 – 10:00',
      creditos: 4,
      color: '#06b6d4',
    },
    {
      codigo: 'CS-315',
      nombre: 'Bases de Datos I',
      profesor: 'M.Sc. Andrea Solano',
      aula: 'Lab. Cómputo 3',
      horario: 'Mar / Jue 10:00 – 12:00',
      creditos: 4,
      color: '#10b981',
    },
    {
      codigo: 'MAT-201',
      nombre: 'Cálculo Diferencial',
      profesor: 'Dr. Luis Fonseca',
      aula: 'Aula B-105',
      horario: 'Vie 07:00 – 10:00',
      creditos: 3,
      color: '#f59e0b',
    },
    {
      codigo: 'CS-320',
      nombre: 'Estructuras de Datos',
      profesor: 'Ing. María Valverde',
      aula: 'Lab. Cómputo 1',
      horario: 'Lun / Mié 14:00 – 16:00',
      creditos: 4,
      color: '#8b5cf6',
    },
  ];

  accionesRapidas: AccionRapida[] = [
    {
      icon: '📝',
      title: 'Matricular Cursos',
      description: 'Añade nuevas materias al período actual',
      route: '/portal/matricular',
      color: '#06b6d4',
    },
    {
      icon: '💳',
      title: 'Realizar Pago',
      description: 'Consulta y cancela tus cuotas pendientes',
      route: '/portal/pagos',
      color: '#10b981',
    },
    {
      icon: '📊',
      title: 'Ver Historial',
      description: 'Revisa tu historial académico completo',
      route: '/portal/historial',
      color: '#f59e0b',
    },
  ];

  get progresoCreditos(): number {
    return Math.round((this.estudiante.creditosAprobados / this.estudiante.creditosTotales) * 100);
  }

  ngOnInit(): void {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    this.currentDate = new Date().toLocaleDateString('es-CR', options);
  }
}
