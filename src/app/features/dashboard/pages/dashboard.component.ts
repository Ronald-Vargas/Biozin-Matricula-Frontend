import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface StatCard {
  icon: string;
  value: string;
  label: string;
  change: string;
  color: string;
}

interface QuickAction {
  icon: string;
  title: string;
  description: string;
  route: string;
}

interface RecentActivity {
  icon: string;
  description: string;
  time: string;
  type: 'success' | 'info' | 'warning';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {

  currentDate: string = '';

  stats: StatCard[] = [
    {
      icon: '👨‍🎓',
      value: '1,234',
      label: 'Estudiantes Activos',
      change: '↑ 12% vs mes anterior',
      color: '#06b6d4'
    },
    {
      icon: '📚',
      value: '15',
      label: 'Carreras Disponibles',
      change: '3 nuevas este año',
      color: '#10b981'
    },
    {
      icon: '📖',
      value: '342',
      label: 'Cursos Activos',
      change: '↑ 8% vs semestre anterior',
      color: '#f59e0b'
    },
    {
      icon: '📝',
      value: '856',
      label: 'Matrículas Activas',
      change: 'Período 2026-1',
      color: '#8b5cf6'
    }
  ];

  quickActions: QuickAction[] = [
    {
      icon: '➕',
      title: 'Nuevo Estudiante',
      description: 'Registrar un nuevo estudiante en el sistema',
      route: '/estudiantes/nuevo'
    },
    {
      icon: '📋',
      title: 'Nueva Matrícula',
      description: 'Matricular estudiante en cursos del período',
      route: '/matriculas/nueva'
    },
    {
      icon: '📊',
      title: 'Ver Reportes',
      description: 'Estadísticas y análisis del sistema',
      route: '/reportes'
    },
    {
      icon: '🔗',
      title: 'Gestionar Malla',
      description: 'Asignar cursos a carreras universitarias',
      route: '/asignaciones'
    }
  ];

  recentActivities: RecentActivity[] = [
    {
      icon: '✅',
      description: 'Juan Pérez se matriculó en Programación II',
      time: 'Hace 5 min',
      type: 'success'
    },
    {
      icon: '📝',
      description: 'Nueva carrera "Ciencia de Datos" creada',
      time: 'Hace 30 min',
      type: 'info'
    },
    {
      icon: '⚠️',
      description: 'María González tiene créditos pendientes',
      time: 'Hace 1 hora',
      type: 'warning'
    },
    {
      icon: '✅',
      description: 'Carlos Ramírez completó el semestre 7',
      time: 'Hace 2 horas',
      type: 'success'
    },
    {
      icon: '📝',
      description: 'Se asignó "Cálculo III" a Ing. en Sistemas',
      time: 'Hace 3 horas',
      type: 'info'
    }
  ];

  topStudents = [
    { name: 'María F. González', career: 'ING-SIS', average: 92.3, semester: 3 },
    { name: 'Ana P. Vargas', career: 'ADM-EMP', average: 88.7, semester: 8 },
    { name: 'Juan C. Pérez', career: 'ING-SIS', average: 87.5, semester: 5 },
    { name: 'Carlos A. Ramírez', career: 'ING-IND', average: 85.0, semester: 7 },
  ];

  ngOnInit(): void {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    this.currentDate = new Date().toLocaleDateString('es-CR', options);
  }
}