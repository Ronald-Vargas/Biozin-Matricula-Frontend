import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Welcome Banner -->
    <div class="welcome-banner">
      <h1>¡Bienvenido al Sistema de Matrículas! 👋</h1>
      <p>Gestiona estudiantes, carreras, cursos y matrículas desde un solo lugar</p>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card" *ngFor="let stat of stats">
        <div class="stat-header">
          <div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
          <span class="stat-icon">{{ stat.icon }}</span>
        </div>
        <div class="stat-change">{{ stat.change }}</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <div class="action-card" *ngFor="let action of quickActions">
        <div class="action-icon">{{ action.icon }}</div>
        <div class="action-title">{{ action.title }}</div>
        <div class="action-desc">{{ action.desc }}</div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .welcome-banner {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: white;
      padding: 3rem;
      border-radius: 16px;
      margin-bottom: 2rem;
      box-shadow: 0 10px 40px rgba(6, 182, 212, 0.3);
    }
    .welcome-banner h1 { font-size: 2.2rem; margin-bottom: 0.5rem; font-weight: 800; }
    .welcome-banner p { font-size: 1.1rem; opacity: 0.9; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      border: 2px solid #e2e8f0;
      transition: all 0.3s ease;
    }
    .stat-card:hover { border-color: #06b6d4; transform: translateY(-4px); }
    .stat-header { display: flex; justify-content: space-between; align-items: start; }
    .stat-icon { font-size: 2.5rem; }
    .stat-value { font-size: 2.5rem; font-weight: 800; color: #06b6d4; }
    .stat-label { color: #64748b; font-size: 0.9rem; margin-top: 0.25rem; }
    .stat-change { font-size: 0.85rem; color: #10b981; margin-top: 0.75rem; }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }
    .action-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      border: 2px solid #e2e8f0;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .action-card:hover {
      border-color: #06b6d4;
      transform: translateY(-4px);
      box-shadow: 0 10px 30px rgba(6, 182, 212, 0.15);
    }
    .action-icon { font-size: 3rem; margin-bottom: 1rem; }
    .action-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; color: #0f172a; }
    .action-desc { font-size: 0.85rem; color: #64748b; }

    @media (max-width: 768px) {
      .welcome-banner { padding: 2rem; }
      .welcome-banner h1 { font-size: 1.6rem; }
    }
  `],
})
export class DashboardPageComponent {
  stats = [
    { value: '1,247', label: 'Estudiantes Activos', icon: '👨‍🎓', change: '↑ 12% vs semestre anterior' },
    { value: '24', label: 'Carreras Disponibles', icon: '📚', change: '↑ 2 nuevas carreras' },
    { value: '186', label: 'Cursos Activos', icon: '📖', change: '↑ 8% más cursos' },
    { value: '3,891', label: 'Matrículas Registradas', icon: '📝', change: '↑ 15% este período' },
  ];

  quickActions = [
    { icon: '👨‍🎓', title: 'Nuevo Estudiante', desc: 'Registrar un nuevo estudiante' },
    { icon: '📚', title: 'Nueva Carrera', desc: 'Crear una nueva carrera' },
    { icon: '📖', title: 'Nuevo Curso', desc: 'Agregar un curso al catálogo' },
    { icon: '📝', title: 'Nueva Matrícula', desc: 'Matricular a un estudiante' },
  ];
}