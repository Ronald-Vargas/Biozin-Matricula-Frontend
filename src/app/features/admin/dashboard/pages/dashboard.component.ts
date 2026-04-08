import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';

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
    { icon: '👨‍🎓', value: '0', label: 'Estudiantes Activos',  change: '', color: '#06b6d4' },
    { icon: '📚',   value: '0', label: 'Carreras Disponibles', change: '', color: '#10b981' },
    { icon: '📖',   value: '0', label: 'Cursos Activos',       change: '', color: '#f59e0b' },
    { icon: '📝',   value: '0', label: 'Matrículas Activas',   change: '', color: '#8b5cf6' }
  ];

  quickActions: QuickAction[] = [
    { icon: '➕', title: 'Nuevo Estudiante',      description: 'Registrar un nuevo estudiante en el sistema', route: '/estudiantes/nuevo' },
    { icon: '➕', title: 'Nuevo Curso',            description: 'Crear un nuevo curso',                        route: '/cursos/nuevo' },
    { icon: '📋', title: 'Nueva Oferta Academica', description: 'Crear una nueva oferta académica',            route: '/oferta-academica' },
    { icon: '🔗', title: 'Asignar a Malla',        description: 'Asignar cursos a carreras universitarias',    route: '/asignaciones' }
  ];

  recentActivities: RecentActivity[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    };
    this.currentDate = new Date().toLocaleDateString('es-CR', options);

    this.dashboardService.getStats().subscribe(data => {
      this.stats[0].value = data.estudiantesActivos.toLocaleString('es-CR');
      this.stats[1].value = data.carrerasActivas.toLocaleString('es-CR');
      this.stats[2].value = data.cursosActivos.toLocaleString('es-CR');
      this.stats[3].value = data.matriculasActivas.toLocaleString('es-CR');
    });
  }
}
