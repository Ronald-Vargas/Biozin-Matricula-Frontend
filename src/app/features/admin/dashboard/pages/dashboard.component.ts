import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService, ActividadReciente, DistribucionCarrera } from '../services/dashboard.service';

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

interface ActivityItem {
  icon: string;
  description: string;
  time: string;
  type: 'success' | 'info' | 'warning';
}

const TIPO_TYPE: Record<string, 'success' | 'info' | 'warning'> = {
  matricula:  'success',
  pago:       'success',
  estudiante: 'info',
  curso:      'info',
  carrera:    'warning',
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  currentDate: string = '';
  recentActivities: ActivityItem[] = [];
  distribucion: DistribucionCarrera[] = [];

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

    this.dashboardService.getDistribucion().subscribe(d => this.distribucion = d);

    this.dashboardService.getActividadReciente().subscribe(actividades => {
      this.recentActivities = actividades.map(a => ({
        icon: a.icono,
        description: a.descripcion,
        time: this.tiempoRelativo(a.fecha),
        type: TIPO_TYPE[a.tipo] ?? 'info',
      }));
    });
  }

  private tiempoRelativo(fechaStr: string): string {
    const diff = Date.now() - new Date(fechaStr).getTime();
    const min  = Math.floor(diff / 60000);
    if (min < 1)   return 'Justo ahora';
    if (min < 60)  return `Hace ${min} min`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24)  return `Hace ${hrs} h`;
    const dias = Math.floor(hrs / 24);
    if (dias < 7)  return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    return new Date(fechaStr).toLocaleDateString('es-CR');
  }
}
