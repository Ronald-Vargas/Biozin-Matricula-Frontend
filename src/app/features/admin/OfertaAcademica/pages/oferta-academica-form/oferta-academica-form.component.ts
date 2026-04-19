import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { combineLatest } from 'rxjs';
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
export class OfertaAcademicaFormComponent implements OnInit, OnChanges {

  @Input() visible = false;
  @Input() ofertaEditar: OfertaAcademica | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() ofertaCreada = new EventEmitter<void>();

  modoEdicion = false;

  oferta = {
    idPeriodo: 0,
    idCurso: 0,
    idProfesor: 0,
    idAula: 0 as number | null,
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

  busquedaPeriodo = '';
  busquedaCurso = '';
  busquedaProfesor = '';
  busquedaAula = '';

  cursoSeleccionado: Curso | null = null;
  errorHorario = '';
  errorServidor = '';
  errorHoras = '';
  errorFormulario = '';
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
    combineLatest([
      this.cursoService.getCursosActivos(),
      this.profesorService.getProfesoresActivos(),
      this.periodoService.getPeriodosActivos(),
      this.aulaService.getAulasActivas(),
      this.ofertaService.getAll(),
    ]).subscribe(([cursos, profesores, periodos, aulas, ofertas]) => {
      this.cursos = cursos;
      this.profesores = profesores;
      this.periodos = periodos;
      this.aulas = aulas;
      this.todasLasOfertas = ofertas;
      if (this.ofertaEditar) this.precargarDatos(this.ofertaEditar);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true) {
      this.limpiarBusquedas();
      if (this.ofertaEditar) {
        this.modoEdicion = true;
        this.precargarDatos(this.ofertaEditar);
      } else {
        this.modoEdicion = false;
        this.limpiar();
      }
    }
  }

  private precargarDatos(o: OfertaAcademica): void {
    this.oferta = {
      idPeriodo: o.idPeriodo,
      idCurso: o.idCurso,
      idProfesor: o.idProfesor,
      idAula: o.idAula,
      cupoMaximo: o.cupoMaximo,
    };

    // Curso y aulas filtradas
    this.cursoSeleccionado = this.cursos.find(c => c.idCurso === o.idCurso) || null;
    if (this.cursoSeleccionado && !this.cursoSeleccionado.esVirtual) {
      this.aulasFiltradas = this.aulas.filter(a => a.esLaboratorio === this.cursoSeleccionado!.tieneLaboratorio);
    }

    // Días y horarios
    this.diasOptions.forEach(d => {
      const dh = o.diasHorarios.find(h => h.dia === d.nombre);
      d.seleccionado = !!dh;
      d.horaInicio = dh?.horaInicio ?? '';
      d.horaFin = dh?.horaFin ?? '';
    });
  }

  private hayTraslape(ini1: string, fin1: string, ini2: string, fin2: string): boolean {
    return ini1 < fin2 && fin1 > ini2;
  }

  private verificarConflictos(): string[] {
    const errores: string[] = [];
    const seleccionados = this.diasOptions.filter(d => d.seleccionado);
    const idAula = Number(this.oferta.idAula);
    const idProfesor = Number(this.oferta.idProfesor);
    const idOfertaActual = this.ofertaEditar?.idOferta ?? 0;
    const ofertasActivas = this.todasLasOfertas.filter(o => o.estado && o.idOferta !== idOfertaActual);

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

  private calcularHorasTotales(): number {
    return this.diasOptions
      .filter(d => d.seleccionado && d.horaInicio && d.horaFin && d.horaFin > d.horaInicio)
      .reduce((total, d) => {
        const [hIni, mIni] = d.horaInicio.split(':').map(Number);
        const [hFin, mFin] = d.horaFin.split(':').map(Number);
        return total + (hFin * 60 + mFin - hIni * 60 - mIni) / 60;
      }, 0);
  }

  get horasAsignadas(): number {
    return Math.round(this.calcularHorasTotales() * 10) / 10;
  }

  get horasCurso(): number {
    return this.cursoSeleccionado?.horasDuracion ?? 0;
  }

  get cursoEsVirtual(): boolean {
    return this.cursoSeleccionado?.esVirtual === true;
  }

  get periodosFiltrados(): Periodo[] {
    const filtrados = this.periodos.filter(periodo =>
      this.coincideBusqueda(this.periodoTexto(periodo), this.busquedaPeriodo)
    );

    return this.incluirSeleccionado(filtrados, this.periodos, this.oferta.idPeriodo, periodo => periodo.idPeriodo);
  }

  get cursosFiltrados(): Curso[] {
    const filtrados = this.cursos.filter(curso =>
      this.coincideBusqueda(`${this.cursoTexto(curso)} ${curso.descripcion ?? ''}`, this.busquedaCurso)
    );

    return this.incluirSeleccionado(filtrados, this.cursos, this.oferta.idCurso, curso => curso.idCurso);
  }

  get profesoresFiltrados(): Profesor[] {
    const filtrados = this.profesores.filter(profesor =>
      this.coincideBusqueda(this.profesorBusquedaTexto(profesor), this.busquedaProfesor)
    );

    return this.incluirSeleccionado(filtrados, this.profesores, this.oferta.idProfesor, profesor => profesor.idProfesor);
  }

  get aulasFiltradasPorBusqueda(): Aula[] {
    const filtradas = this.aulasFiltradas.filter(aula =>
      this.coincideBusqueda(this.aulaTexto(aula), this.busquedaAula)
    );

    return this.incluirSeleccionado(filtradas, this.aulasFiltradas, this.oferta.idAula, aula => aula.idAula);
  }

  periodoTexto(periodo: Periodo): string {
    return periodo.nombre;
  }

  cursoTexto(curso: Curso): string {
    return `${curso.codigo} - ${curso.nombre}`;
  }

  profesorTexto(profesor: Profesor): string {
    return [profesor.nombre, profesor.apellidoPaterno, profesor.apellidoMaterno]
      .filter(Boolean)
      .join(' ');
  }

  aulaTexto(aula: Aula): string {
    return `${aula.numeroAula} - Cap. ${aula.capacidad}${aula.esLaboratorio ? ' (Laboratorio)' : ''}`;
  }

  onHoraInicioChange(dia: { horaInicio: string; horaFin: string }): void {
    if (dia.horaFin && dia.horaFin <= dia.horaInicio) {
      dia.horaFin = '';
    }
    this.errorHorario = '';
    this.errorHoras = '';
    this.conflictos = [];
  }

  onCursoChange(): void {
    const id = Number(this.oferta.idCurso);
    this.cursoSeleccionado = this.cursos.find(c => c.idCurso === id) || null;
    if (this.cursoSeleccionado && !this.cursoSeleccionado.esVirtual) {
      this.aulasFiltradas = this.aulas.filter(a => a.esLaboratorio === this.cursoSeleccionado!.tieneLaboratorio);
    } else {
      this.aulasFiltradas = [];
    }
    this.oferta.idAula = 0;
    this.oferta.cupoMaximo = null;
    this.busquedaAula = '';
  }

  onAulaChange(): void {
    const id = Number(this.oferta.idAula);
    const aula = this.aulas.find(a => a.idAula === id);
    this.oferta.cupoMaximo = aula ? aula.capacidad : null;
  }

  guardar(): void {
    this.errorHorario = '';
    this.errorHoras = '';
    this.errorFormulario = '';
    this.conflictos = [];
    const seleccionados = this.diasOptions.filter(d => d.seleccionado);

    const requiereAula = !this.cursoEsVirtual;
    if (
      !Number(this.oferta.idPeriodo) ||
      !Number(this.oferta.idCurso) ||
      !Number(this.oferta.idProfesor) ||
      (requiereAula && !Number(this.oferta.idAula)) ||
      !this.oferta.cupoMaximo ||
      this.oferta.cupoMaximo < 1 ||
      seleccionados.length === 0 ||
      seleccionados.some(d => !d.horaInicio || !d.horaFin)
    ) {
      this.errorFormulario = requiereAula
        ? 'Por favor complete todos los campos requeridos: período, curso, profesor, aula, cupo y al menos un día con horario.'
        : 'Por favor complete todos los campos requeridos: período, curso, profesor, cupo y al menos un día con horario.';
      return;
    }

    const diasConHorarioInvalido = seleccionados.filter(d => d.horaFin <= d.horaInicio);
    if (diasConHorarioInvalido.length > 0) {
      const nombres = diasConHorarioInvalido.map(d => d.nombre).join(', ');
      this.errorHorario = `La hora de salida debe ser posterior a la hora de entrada en: ${nombres}.`;
      return;
    }

    if (this.cursoSeleccionado?.horasDuracion) {
      const totalHoras = this.calcularHorasTotales();
      if (totalHoras > this.cursoSeleccionado.horasDuracion) {
        this.errorHoras = `Las horas asignadas (${Math.round(totalHoras * 10) / 10} h) superan las horas del curso (${this.cursoSeleccionado.horasDuracion} h).`;
        return;
      }
    }

    this.conflictos = this.verificarConflictos();
    if (this.conflictos.length > 0) return;

    const diasHorarios = seleccionados.map(d => ({
      dia: d.nombre,
      horaInicio: d.horaInicio,
      horaFin: d.horaFin,
    }));

    this.errorServidor = '';

    const idAulaFinal = this.cursoEsVirtual ? null : Number(this.oferta.idAula) || null;

    if (this.modoEdicion && this.ofertaEditar) {
      const dto = {
        ...this.ofertaEditar,
        idPeriodo: Number(this.oferta.idPeriodo),
        idCurso: Number(this.oferta.idCurso),
        idProfesor: Number(this.oferta.idProfesor),
        idAula: idAulaFinal,
        cupoMaximo: this.oferta.cupoMaximo!,
        diasHorarios,
      };
      this.ofertaService.updateOferta(dto).subscribe({
        next: res => {
          if (!res.blnError) {
            this.ofertaCreada.emit();
            this.cerrar();
            this.limpiar();
          } else {
            this.errorServidor = res.strMensajeRespuesta;
          }
        },
        error: () => { this.errorServidor = 'Error de conexión al guardar. Intente nuevamente.'; }
      });
    } else {
      const dto = {
        idPeriodo: Number(this.oferta.idPeriodo),
        idCurso: Number(this.oferta.idCurso),
        idProfesor: Number(this.oferta.idProfesor),
        idAula: idAulaFinal,
        cupoMaximo: this.oferta.cupoMaximo!,
        diasHorarios,
      };
      this.ofertaService.crear(dto).subscribe({
        next: res => {
          if (!res.blnError) {
            this.ofertaCreada.emit();
            this.cerrar();
            this.limpiar();
          } else {
            this.errorServidor = res.strMensajeRespuesta;
          }
        },
        error: () => { this.errorServidor = 'Error de conexión al crear la oferta. Intente nuevamente.'; }
      });
    }
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
    this.errorHoras = '';
    this.errorFormulario = '';
    this.errorServidor = '';
    this.limpiarBusquedas();
    this.diasOptions.forEach(d => {
      d.seleccionado = false;
      d.horaInicio = '';
      d.horaFin = '';
    });
  }

  private profesorBusquedaTexto(profesor: Profesor): string {
    return [
      this.profesorTexto(profesor),
      profesor.cedula,
      profesor.codigo,
      profesor.emailInstitucional,
      profesor.especialidad,
      profesor.titulo,
    ].filter(Boolean).join(' ');
  }

  private coincideBusqueda(texto: string, busqueda: string): boolean {
    const filtro = this.normalizar(busqueda);
    if (!filtro) return true;

    const textoNormalizado = this.normalizar(texto);
    return filtro.split(/\s+/).every(parte => textoNormalizado.includes(parte));
  }

  private normalizar(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private incluirSeleccionado<T>(
    filtrados: T[],
    todos: T[],
    idSeleccionado: number | null,
    obtenerId: (item: T) => number
  ): T[] {
    const id = Number(idSeleccionado);
    if (!id || filtrados.some(item => obtenerId(item) === id)) return filtrados;

    const seleccionado = todos.find(item => obtenerId(item) === id);
    return seleccionado ? [seleccionado, ...filtrados] : filtrados;
  }

  private limpiarBusquedas(): void {
    this.busquedaPeriodo = '';
    this.busquedaCurso = '';
    this.busquedaProfesor = '';
    this.busquedaAula = '';
  }
}
