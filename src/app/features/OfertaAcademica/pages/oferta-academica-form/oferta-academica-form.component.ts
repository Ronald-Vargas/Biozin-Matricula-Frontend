import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfertaAcademicaService } from '../../services/oferta-academica.service';
import { ProfesorService } from '../../../profesores/services/profesores.services';
import { Profesor } from '../../../profesores/models/profesores.model';
import { PeriodoService } from '../../../periodos/services/periodos.services';
import { Periodo } from '../../../periodos/models/periodos.model';
import { CursoService } from '../../../cursos/services/curso.service';
import { Curso } from '../../../cursos/models/curso.model';
import { AulaService } from '../../../aulas/services/aula.service';
import { Aula } from '../../../aulas/models/aula.model';

@Component({
  selector: 'app-oferta-academica-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './oferta-academica-form.component.html',
  styleUrls: ['./oferta-academica-form.component.scss'],
})
export class OfertaAcademicaFormComponent implements OnInit {

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() ofertaCreada = new EventEmitter<void>();

  oferta = {
    periodoId: '',
    periodoNombre: '',
    cursoId: '',
    cursoNombre: '',
    cursoCodigo: '',
    profesorId: '',
    profesorNombre: '',
    aulaId: '',
    aula: '',
    cupoMaximo: null as number | null,
  };

  diasOptions = [
    { nombre: 'Lunes',     abrev: 'Lun', seleccionado: false, horaInicio: '', horaFin: '' },
    { nombre: 'Martes',    abrev: 'Mar', seleccionado: false, horaInicio: '', horaFin: '' },
    { nombre: 'Miércoles', abrev: 'Mié', seleccionado: false, horaInicio: '', horaFin: '' },
    { nombre: 'Jueves',    abrev: 'Jue', seleccionado: false, horaInicio: '', horaFin: '' },
    { nombre: 'Viernes',   abrev: 'Vie', seleccionado: false, horaInicio: '', horaFin: '' },
    { nombre: 'Sábado',    abrev: 'Sáb', seleccionado: false, horaInicio: '', horaFin: '' },
  ];

  cursos: Curso[] = [];
  profesores: Profesor[] = [];
  periodos: Periodo[] = [];
  aulas: Aula[] = [];
  aulasFiltradas: Aula[] = [];

  constructor(
    private profesorService: ProfesorService,
    private periodoService: PeriodoService,
    private cursoService: CursoService,
    private ofertaService: OfertaAcademicaService,
    private aulaService: AulaService
  ) {}

  ngOnInit(): void {
    this.cursoService.getCursos().subscribe(cursos => this.cursos = cursos);
    this.profesorService.getProfesores().subscribe(profesores => this.profesores = profesores);
    this.periodoService.getPeriodos().subscribe(periodos => this.periodos = periodos);
    this.aulaService.getAulas().subscribe(aulas => {
      this.aulas = aulas.filter(a => a.activo);
    });
  }

  onPeriodoChange(): void {
    const periodo = this.periodos.find((p) => String(p.idPeriodo) === this.oferta.periodoId);
    this.oferta.periodoNombre = periodo ? periodo.nombre : '';
  }

  onCursoChange(): void {
    const curso = this.cursos.find((c) => String(c.idCurso) === this.oferta.cursoId);
    this.oferta.cursoNombre = curso ? curso.nombre : '';
    this.oferta.cursoCodigo = curso ? curso.codigo : '';
    // Filtrar aulas según si el curso tiene laboratorio
    if (curso) {
      this.aulasFiltradas = this.aulas.filter(a => a.esLaboratorio === curso.tieneLaboratorio);
    } else {
      this.aulasFiltradas = [];
    }
    // Resetear aula seleccionada al cambiar curso
    this.oferta.aulaId = '';
    this.oferta.aula = '';
    this.oferta.cupoMaximo = null;
  }

  onAulaChange(): void {
    const aula = this.aulas.find(a => String(a.idAula) === this.oferta.aulaId);
    if (aula) {
      this.oferta.aula = aula.numeroAula;
      this.oferta.cupoMaximo = aula.capacidad;
    } else {
      this.oferta.aula = '';
      this.oferta.cupoMaximo = null;
    }
  }

  onProfesorChange(): void {
    const profesor = this.profesores.find((p) => String(p.idProfesor) === this.oferta.profesorId);
    this.oferta.profesorNombre = profesor ? `${profesor.nombre} ${profesor.apellidoPaterno} ${profesor.apellidoMaterno}` : '';
  }

  guardar(): void {
    const seleccionados = this.diasOptions.filter(d => d.seleccionado);

    if (
      !this.oferta.periodoId ||
      !this.oferta.cursoId ||
      !this.oferta.profesorId ||
      !this.oferta.aula ||
      !this.oferta.cupoMaximo ||
      seleccionados.length === 0 ||
      seleccionados.some(d => !d.horaInicio || !d.horaFin)
    ) {
      return;
    }

    const diasHorarios = seleccionados.map(d => ({
      dia: d.nombre,
      horaInicio: d.horaInicio,
      horaFin: d.horaFin,
    }));

    const dias = seleccionados.map(d => d.abrev).join(' - ');
    const horario = seleccionados.map(d => `${d.horaInicio}-${d.horaFin}`).join(', ');

    this.ofertaService.crear({ ...this.oferta, cupoMaximo: this.oferta.cupoMaximo!, dias, horario, diasHorarios });
    this.ofertaCreada.emit();
    this.cerrar();
    this.limpiar();
  }

  cerrar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  limpiar(): void {
    this.oferta = {
      periodoId: '',
      periodoNombre: '',
      cursoId: '',
      cursoNombre: '',
      cursoCodigo: '',
      profesorId: '',
      profesorNombre: '',
      aulaId: '',
      aula: '',
      cupoMaximo: 35,
    };
    this.aulasFiltradas = [];
    this.diasOptions.forEach(d => {
      d.seleccionado = false;
      d.horaInicio = '';
      d.horaFin = '';
    });
  }
}
