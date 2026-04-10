import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfertaAcademicaService } from '../../services/oferta-academica.service';
import { OfertaAcademica } from '../../models/oferta-academica.model';
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
    idPeriodo: 0,
    idCurso: 0,
    idProfesor: 0,
    idAula: 0,
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

  cursoSeleccionado: Curso | null = null;
  errorHorario = '';
  errorServidor = '';
  conflictos: string[] = [];

  private todasLasOfertas: OfertaAcademica[] = [];

  constructor(
    private profesorService: ProfesorService,
    private periodoService: PeriodoService,
    private cursoService: CursoService,
    private ofertaService: OfertaAcademicaService,
    private aulaService: AulaService
  ) {}

  ngOnInit(): void {
    this.cursoService.getCursosActivos().subscribe(cursos => this.cursos = cursos);
    this.profesorService.getProfesoresActivos().subscribe(profesores => this.profesores = profesores);
    this.periodoService.getPeriodosActivos().subscribe(periodos => this.periodos = periodos);
    this.aulaService.getAulasActivas().subscribe(aulas => { this.aulas = aulas; });
    this.ofertaService.getAll().subscribe(ofertas => this.todasLasOfertas = ofertas);
  }

  private hayTraslape(ini1: string, fin1: string, ini2: string, fin2: string): boolean {
    return ini1 < fin2 && fin1 > ini2;
  }

  private verificarConflictos(): string[] {
    const errores: string[] = [];
    const seleccionados = this.diasOptions.filter(d => d.seleccionado);
    const idAula = Number(this.oferta.idAula);
    const idProfesor = Number(this.oferta.idProfesor);
    const ofertasActivas = this.todasLasOfertas.filter(o => o.estado);

    for (const dia of seleccionados) {
      for (const oferta of ofertasActivas) {
        const diasConTraslape = oferta.diasHorarios.filter(dh =>
          dh.dia === dia.nombre &&
          this.hayTraslape(dia.horaInicio, dia.horaFin, dh.horaInicio, dh.horaFin)
        );

        if (diasConTraslape.length === 0) continue;

        const dh = diasConTraslape[0];

        if (idAula && oferta.idAula === idAula) {
          errores.push(`El aula ya está ocupada el ${dia.nombre} de ${dh.horaInicio} a ${dh.horaFin}.`);
        }

        if (idProfesor && oferta.idProfesor === idProfesor) {
          errores.push(`El profesor ya está ocupado el ${dia.nombre} de ${dh.horaInicio} a ${dh.horaFin}.`);
        }
      }
    }

    return [...new Set(errores)];
  }

  onHoraInicioChange(dia: { horaInicio: string; horaFin: string }): void {
    if (dia.horaFin && dia.horaFin <= dia.horaInicio) {
      dia.horaFin = '';
    }
    this.errorHorario = '';
    this.conflictos = [];
  }

  onCursoChange(): void {
    const id = Number(this.oferta.idCurso);
    this.cursoSeleccionado = this.cursos.find(c => c.idCurso === id) || null;
    if (this.cursoSeleccionado) {
      this.aulasFiltradas = this.aulas.filter(a => a.esLaboratorio === this.cursoSeleccionado!.tieneLaboratorio);
    } else {
      this.aulasFiltradas = [];
    }
    this.oferta.idAula = 0;
    this.oferta.cupoMaximo = null;
  }

  onAulaChange(): void {
    const id = Number(this.oferta.idAula);
    const aula = this.aulas.find(a => a.idAula === id);
    this.oferta.cupoMaximo = aula ? aula.capacidad : null;
  }

  guardar(): void {
    this.errorHorario = '';
    this.conflictos = [];
    const seleccionados = this.diasOptions.filter(d => d.seleccionado);

    if (
      !this.oferta.idPeriodo ||
      !this.oferta.idCurso ||
      !this.oferta.idProfesor ||
      !this.oferta.idAula ||
      !this.oferta.cupoMaximo ||
      seleccionados.length === 0 ||
      seleccionados.some(d => !d.horaInicio || !d.horaFin)
    ) {
      return;
    }

    const diasConHorarioInvalido = seleccionados.filter(d => d.horaFin <= d.horaInicio);
    if (diasConHorarioInvalido.length > 0) {
      const nombres = diasConHorarioInvalido.map(d => d.nombre).join(', ');
      this.errorHorario = `La hora de salida debe ser posterior a la hora de entrada en: ${nombres}.`;
      return;
    }

    this.conflictos = this.verificarConflictos();
    if (this.conflictos.length > 0) return;

    const dto = {
      idPeriodo: Number(this.oferta.idPeriodo),
      idCurso: Number(this.oferta.idCurso),
      idProfesor: Number(this.oferta.idProfesor),
      idAula: Number(this.oferta.idAula),
      cupoMaximo: this.oferta.cupoMaximo,
      diasHorarios: seleccionados.map(d => ({
        dia: d.nombre,
        horaInicio: d.horaInicio,
        horaFin: d.horaFin,
      })),
    };

    this.errorServidor = '';
    this.ofertaService.crear(dto).subscribe(res => {
      if (!res.blnError) {
        this.ofertaCreada.emit();
        this.cerrar();
        this.limpiar();
      } else {
        this.errorServidor = res.strMensajeRespuesta;
      }
    });
  }

  cerrar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  limpiar(): void {
    this.oferta = {
      idPeriodo: 0,
      idCurso: 0,
      idProfesor: 0,
      idAula: 0,
      cupoMaximo: null,
    };
    this.cursoSeleccionado = null;
    this.aulasFiltradas = [];
    this.conflictos = [];
    this.errorHorario = '';
    this.errorServidor = '';
    this.diasOptions.forEach(d => {
      d.seleccionado = false;
      d.horaInicio = '';
      d.horaFin = '';
    });
  }
}
