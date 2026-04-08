import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfertaAcademica, DiaHorario } from '../../models/oferta-academica.model';
import { Curso } from '../../../cursos/models/curso.model';
import { Profesor } from '../../../profesores/models/profesores.model';
import { Aula } from '../../../aulas/models/aula.model';
import { Periodo } from '../../../periodos/models/periodos.model';

@Component({
  selector: 'app-oferta-academica-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oferta-academica-detail.component.html',
  styleUrls: ['./oferta-academica-detail.component.scss'],
})
export class OfertaAcademicaDetailComponent {
  @Input() oferta!: OfertaAcademica;
  @Input() curso: Curso | null = null;
  @Input() profesor: Profesor | null = null;
  @Input() aula: Aula | null = null;
  @Input() periodo: Periodo | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<OfertaAcademica>();

  private diasAbrev: Record<string, string> = {
    'Lunes': 'Lun', 'Martes': 'Mar', 'Miércoles': 'Mié',
    'Jueves': 'Jue', 'Viernes': 'Vie', 'Sábado': 'Sáb', 'Domingo': 'Dom'
  };

  getNombreProfesor(): string {
    if (!this.profesor) return '—';
    return `${this.profesor.nombre} ${this.profesor.apellidoPaterno} ${this.profesor.apellidoMaterno}`.trim();
  }

  getInicialesCurso(): string {
    if (!this.curso) return '??';
    const partes = this.curso.nombre.trim().split(' ');
    return ((partes[0]?.charAt(0) ?? '') + (partes[1]?.charAt(0) ?? '')).toUpperCase();
  }

  getPorcentajeOcupacion(): number {
    if (!this.oferta || this.oferta.cupoMaximo === 0) return 0;
    return Math.round((this.oferta.matriculados / this.oferta.cupoMaximo) * 100);
  }

  getClaseProgreso(): string {
    const p = this.getPorcentajeOcupacion();
    if (p >= 85) return 'high';
    if (p >= 50) return 'mid';
    return 'low';
  }

  getCuposDisponibles(): number {
    if (!this.oferta) return 0;
    return Math.max(0, this.oferta.cupoMaximo - this.oferta.matriculados);
  }

  formatPrecio(precio: number): string {
    return '₡' + precio.toLocaleString('es-CR');
  }

  formatFecha(fecha: string | Date): string {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-CR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  formatHorarios(diasHorarios: DiaHorario[]): string[] {
    const groups = new Map<string, { dias: string[]; horaInicio: string; horaFin: string }>();
    for (const dh of diasHorarios) {
      const key = `${dh.horaInicio}|${dh.horaFin}`;
      if (!groups.has(key)) {
        groups.set(key, { dias: [], horaInicio: dh.horaInicio, horaFin: dh.horaFin });
      }
      groups.get(key)!.dias.push(this.diasAbrev[dh.dia] || dh.dia);
    }
    return Array.from(groups.values()).map(g =>
      `${g.dias.join(' · ')} ${g.horaInicio} – ${g.horaFin}`
    );
  }
}
