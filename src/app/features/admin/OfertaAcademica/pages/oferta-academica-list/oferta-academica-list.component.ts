import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfertaAcademicaService } from '../../services/oferta-academica.service';
import { DiaHorario, OfertaAcademica } from '../../models/oferta-academica.model';
import { OfertaAcademicaFormComponent } from '../oferta-academica-form/oferta-academica-form.component';
import { CursoService } from '../../../cursos/services/curso.service';
import { ProfesorService } from '../../../profesores/services/profesores.services';
import { AulaService } from '../../../aulas/services/aula.service';
import { Curso } from '../../../cursos/models/curso.model';
import { Profesor } from '../../../profesores/models/profesores.model';
import { Aula } from '../../../aulas/models/aula.model';

@Component({
  selector: 'app-oferta-academica-list',
  standalone: true,
  imports: [CommonModule, FormsModule, OfertaAcademicaFormComponent],
  templateUrl: './oferta-academica-list.component.html',
  styleUrls: ['./oferta-academica-list.component.scss'],
})
export class OfertaAcademicaListComponent implements OnInit {

  ofertas: OfertaAcademica[] = [];
  ofertasFiltradas: OfertaAcademica[] = [];
  busqueda = '';
  mostrarModal = false;

  private cursos: Curso[] = [];
  private profesores: Profesor[] = [];
  private aulas: Aula[] = [];

  private diasAbrev: Record<string, string> = {
    'Lunes': 'Lun', 'Martes': 'Mar', 'Miércoles': 'Mié',
    'Jueves': 'Jue', 'Viernes': 'Vie', 'Sábado': 'Sáb', 'Domingo': 'Dom'
  };

  constructor(
    private ofertaService: OfertaAcademicaService,
    private cursoService: CursoService,
    private profesorService: ProfesorService,
    private aulaService: AulaService,
  ) {}

  ngOnInit(): void {
    this.cursoService.getCursos().subscribe(c => this.cursos = c);
    this.profesorService.getProfesores().subscribe(p => this.profesores = p);
    this.aulaService.getAulas().subscribe(a => this.aulas = a);

    this.ofertaService.getAll().subscribe((ofertas) => {
      this.ofertas = ofertas;
      this.filtrar();
    });
  }

  getNombreCurso(idCurso: number): string {
    return this.cursos.find(c => c.idCurso === idCurso)?.nombre ?? '';
  }

  getCodigoCurso(idCurso: number): string {
    return this.cursos.find(c => c.idCurso === idCurso)?.codigo ?? '';
  }

  getNombreProfesor(idProfesor: number): string {
    const p = this.profesores.find(p => p.idProfesor === idProfesor);
    if (!p) return '';
    return `${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno}`.trim();
  }

  getNombreAula(idAula: number): string {
    return this.aulas.find(a => a.idAula === idAula)?.numeroAula ?? '';
  }

  filtrar(): void {
    let resultado = this.ofertas;

    if (this.busqueda.trim()) {
      const termino = this.busqueda.toLowerCase();
      resultado = resultado.filter(o =>
        this.getNombreCurso(o.idCurso).toLowerCase().includes(termino) ||
        this.getCodigoCurso(o.idCurso).toLowerCase().includes(termino) ||
        this.getNombreProfesor(o.idProfesor).toLowerCase().includes(termino) ||
        this.getNombreAula(o.idAula).toLowerCase().includes(termino)
      );
    }

    this.ofertasFiltradas = resultado;
  }

  getPorcentajeOcupacion(oferta: OfertaAcademica): number {
    if (oferta.cupoMaximo === 0) return 0;
    return Math.round((oferta.matriculados / oferta.cupoMaximo) * 100);
  }

  getClaseProgreso(oferta: OfertaAcademica): string {
    const porcentaje = this.getPorcentajeOcupacion(oferta);
    if (porcentaje >= 85) return 'high';
    if (porcentaje >= 50) return 'mid';
    return 'low';
  }

  getCuposDisponibles(oferta: OfertaAcademica): number {
    return Math.max(0, oferta.cupoMaximo - oferta.matriculados);
  }

  formatDiasHorarios(diasHorarios: DiaHorario[]): string[] {
    const groups = new Map<string, { dias: string[], horaInicio: string, horaFin: string }>();
    for (const dh of diasHorarios) {
      const key = `${dh.horaInicio}|${dh.horaFin}`;
      if (!groups.has(key)) {
        groups.set(key, { dias: [], horaInicio: dh.horaInicio, horaFin: dh.horaFin });
      }
      groups.get(key)!.dias.push(this.diasAbrev[dh.dia] || dh.dia);
    }
    return Array.from(groups.values()).map(g =>
      `${g.dias.join(' - ')} ${g.horaInicio} - ${g.horaFin}`
    );
  }

  formatPrecio(precio: number): string {
    return '₡' + precio.toLocaleString('es-CR');
  }

  toggleEstado(idOferta: number): void {
    this.ofertaService.toggleEstado(idOferta);
  }

   getToggleButtonConfig(estado: boolean): { label: string; tooltip: string } {
    return estado
      ? { label: 'Desactivar', tooltip: 'Desactivar' }
      : { label: 'Activar', tooltip: 'Activar' };
  }




  eliminar(oferta: OfertaAcademica): void {
    const nombre = this.getNombreCurso(oferta.idCurso);
    if (confirm(`¿Eliminar la oferta de "${nombre}"?`)) {
      this.ofertaService.eliminar(oferta.idOferta).subscribe();
    }
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  onOfertaCreada(): void {
    this.filtrar();
  }
}
