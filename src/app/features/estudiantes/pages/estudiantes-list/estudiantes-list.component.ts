import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-estudiantes-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section">
      <div class="section-header">
        <h1 class="page-title">Gestión de Estudiantes</h1>
        <button class="btn btn-primary">+ Nuevo Estudiante</button>
      </div>
      <p class="placeholder-text">Módulo de estudiantes — próximamente</p>
    </div>
  `,
  styles: [`
    .section { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .page-title { font-size: 2rem; font-weight: 800; color: #0f172a; }
    .btn { padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.95rem; }
    .btn-primary { background: #06b6d4; color: white; }
    .btn-primary:hover { background: #0891b2; }
    .placeholder-text { color: #64748b; font-size: 1rem; }
  `],
})
export class EstudiantesListComponent {

}
