import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CreateEstudianteDto, Estudiante } from '../../models/estudiantes.model';
import { EstudianteService } from '../../services/estudiantes.services';
import { Carrera } from '../../../carreras/models/carrera.model';
import { CarreraService } from '../../../carreras/services/carrera.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-estudiante-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './estudiante-form.html',
  styleUrl: './estudiante-form.scss',
})
export class EstudianteFormComponent implements OnInit, OnDestroy {

  esEdicion: boolean = false;
  estudianteId: number | null = null;
  titulo: string = '📝 Nuevo Estudiante';

  estudianteOriginal?: Estudiante;

  form = {
    // ── Información Personal ──
    cedula: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    genero: '',
    nacionalidad: '',
    discapacidad: false,
    tipoDiscapacidad: '',
    necesitaAsistencia: false,

    // ── Contacto ──
    emailPersonal: '',
    telefonoMovil: '',
    telefonoEmergencia: '',
    nombreContactoEmergencia: '',

    // ── Académico ──
    idCarrera: 0,
    condicionSocioeconomica: '',
    tipoBeca: 'Ninguna',
    trabaja: false,

    // ── Colegio de Procedencia ──
    colegioProcedencia: '',
    tipoColegio: '',
    anioGraduacionColegio: null as number | null,

    // ── Dirección ──
    provincia: '',
    canton: '',
    distrito: '',
    direccionExacta: '',

    // ── Observaciones ──
    observaciones: '',

    // ── Campos automáticos (solo lectura en edición) ──
    carnet: 0,
    emailInstitucional: '',
    semestreActual: 1,
    fechaIngreso: '',
    estadoEstudiante: true,
  };

  carreras: Carrera[] = [];
  private subCarreras?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private estudianteService: EstudianteService,
    private carreraService: CarreraService,
  ) {}

  ngOnInit(): void {
    this.subCarreras = this.carreraService.getCarrerasActivas().subscribe(c => {
      this.carreras = c;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.estudianteId = +id;
      this.titulo = '✏️ Editar Estudiante';
      this.cargarEstudiante(this.estudianteId);
    }
  }

  ngOnDestroy(): void {
    this.subCarreras?.unsubscribe();
  }

  cargarEstudiante(id: number): void {
    this.estudianteService.getEstudianteById(id).subscribe(est => {
      if (!est) return;
      this.estudianteOriginal = est;
      this.form = {
        cedula: est.cedula,
        nombre: est.nombre,
        apellidoPaterno: est.apellidoPaterno,
        apellidoMaterno: est.apellidoMaterno ?? '',
        fechaNacimiento: est.fechaNacimiento ? est.fechaNacimiento.split('T')[0] : '',
        genero: est.genero,
        nacionalidad: est.nacionalidad ?? '',
        discapacidad: est.discapacidad,
        tipoDiscapacidad: est.tipoDiscapacidad ?? '',
        necesitaAsistencia: est.necesitaAsistencia,
        emailPersonal: est.emailPersonal,
        telefonoMovil: est.telefonoMovil,
        telefonoEmergencia: est.telefonoEmergencia ?? '',
        nombreContactoEmergencia: est.nombreContactoEmergencia ?? '',
        idCarrera: est.idCarrera,
        condicionSocioeconomica: est.condicionSocioeconomica ?? '',
        tipoBeca: est.tipoBeca,
        trabaja: est.trabaja,
        colegioProcedencia: est.colegioProcedencia ?? '',
        tipoColegio: est.tipoColegio ?? '',
        anioGraduacionColegio: est.anioGraduacionColegio ?? null,
        provincia: est.provincia ?? '',
        canton: est.canton ?? '',
        distrito: est.distrito ?? '',
        direccionExacta: est.direccionExacta ?? '',
        observaciones: est.observaciones ?? '',
        carnet: est.carnet,
        emailInstitucional: est.emailInstitucional,
        semestreActual: est.semestreActual,
        fechaIngreso: est.fechaIngreso ? est.fechaIngreso.split('T')[0] : '',
        estadoEstudiante: est.estadoEstudiante,
      };
    });
  }

  guardar(): void {
    if (!this.form.cedula || !this.form.nombre || !this.form.apellidoPaterno || !this.form.idCarrera) {
      alert('⚠️ Por favor complete los campos obligatorios');
      return;
    }

    const carreraSeleccionada = this.carreras.find(c => c.idCarrera === this.form.idCarrera);
    if (!carreraSeleccionada) {
      alert('⚠️ Por favor seleccione una carrera válida');
      return;
    }

    if (this.esEdicion && this.estudianteOriginal) {
      const updated: Estudiante = {
        ...this.estudianteOriginal,
        cedula: this.form.cedula,
        nombre: this.form.nombre,
        apellidoPaterno: this.form.apellidoPaterno,
        apellidoMaterno: this.form.apellidoMaterno || undefined,
        fechaNacimiento: this.form.fechaNacimiento,
        genero: this.form.genero,
        nacionalidad: this.form.nacionalidad || undefined,
        discapacidad: this.form.discapacidad,
        tipoDiscapacidad: this.form.tipoDiscapacidad || undefined,
        necesitaAsistencia: this.form.necesitaAsistencia,
        emailPersonal: this.form.emailPersonal,
        telefonoMovil: this.form.telefonoMovil,
        telefonoEmergencia: this.form.telefonoEmergencia || undefined,
        nombreContactoEmergencia: this.form.nombreContactoEmergencia || undefined,
        idCarrera: carreraSeleccionada.idCarrera,
        condicionSocioeconomica: this.form.condicionSocioeconomica || undefined,
        tipoBeca: this.form.tipoBeca,
        trabaja: this.form.trabaja,
        colegioProcedencia: this.form.colegioProcedencia || undefined,
        tipoColegio: this.form.tipoColegio || undefined,
        anioGraduacionColegio: this.form.anioGraduacionColegio || undefined,
        provincia: this.form.provincia || undefined,
        canton: this.form.canton || undefined,
        distrito: this.form.distrito || undefined,
        direccionExacta: this.form.direccionExacta || undefined,
        observaciones: this.form.observaciones || undefined,
      };

      this.estudianteService.updateEstudiante(updated).subscribe(res => {
        if (!res.blnError) {
          alert('✅ Estudiante actualizado exitosamente');
          this.cancelar();
        } else {
          alert('❌ ' + res.strMensajeRespuesta);
        }
      });
    } else {
      const dto: CreateEstudianteDto = {
        cedula: this.form.cedula,
        nombre: this.form.nombre,
        apellidoPaterno: this.form.apellidoPaterno,
        apellidoMaterno: this.form.apellidoMaterno || undefined,
        fechaNacimiento: this.form.fechaNacimiento,
        genero: this.form.genero,
        nacionalidad: this.form.nacionalidad || undefined,
        discapacidad: this.form.discapacidad,
        tipoDiscapacidad: this.form.tipoDiscapacidad || undefined,
        necesitaAsistencia: this.form.necesitaAsistencia,
        emailPersonal: this.form.emailPersonal,
        telefonoMovil: this.form.telefonoMovil,
        telefonoEmergencia: this.form.telefonoEmergencia || undefined,
        nombreContactoEmergencia: this.form.nombreContactoEmergencia || undefined,
        idCarrera: carreraSeleccionada.idCarrera,
        estadoEstudiante: this.form.estadoEstudiante,
        tipoBeca: this.form.tipoBeca,
        condicionSocioeconomica: this.form.condicionSocioeconomica || undefined,
        trabaja: this.form.trabaja,
        colegioProcedencia: this.form.colegioProcedencia || undefined,
        tipoColegio: this.form.tipoColegio || undefined,
        anioGraduacionColegio: this.form.anioGraduacionColegio || undefined,
        provincia: this.form.provincia || undefined,
        canton: this.form.canton || undefined,
        distrito: this.form.distrito || undefined,
        direccionExacta: this.form.direccionExacta || undefined,
        observaciones: this.form.observaciones || undefined,
      };

      this.estudianteService.createEstudiante(dto).subscribe(res => {
        if (!res.blnError) {
          alert('✅ Estudiante creado exitosamente');
          this.cancelar();
        } else {
          alert('❌ ' + res.strMensajeRespuesta);
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/estudiantes']);
  }
}
