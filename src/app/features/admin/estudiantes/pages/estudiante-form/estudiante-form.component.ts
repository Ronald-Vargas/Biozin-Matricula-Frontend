import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateEstudianteDto, Estudiante } from '../../models/estudiantes.model';
import { EstudianteService } from '../../services/estudiantes.services';
import { Carrera } from '../../../carreras/models/carrera.model';
import { CarreraService } from '../../../carreras/services/carrera.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-estudiante-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './estudiante-form.html',
  styleUrl: './estudiante-form.scss',
})
export class EstudianteFormComponent implements OnInit, OnDestroy {

  esEdicion: boolean = false;
  estudianteId: number | null = null;
  titulo: string = '📝 Nuevo Estudiante';

  estudianteOriginal?: Estudiante;
  estudianteForm!: FormGroup;

  carreras: Carrera[] = [];
  private subCarreras?: Subscription;
  private subDiscapacidad?: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private estudianteService: EstudianteService,
    private carreraService: CarreraService,
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.subCarreras = this.carreraService.getCarrerasActivas().subscribe(c => {
      this.carreras = c;
    });

    // Cuando discapacidad cambia, limpiar campos dependientes
    this.subDiscapacidad = this.estudianteForm.get('discapacidad')!.valueChanges.subscribe(val => {
      if (!val) {
        this.estudianteForm.get('tipoDiscapacidad')!.setValue('');
        this.estudianteForm.get('necesitaAsistencia')!.setValue(false);
      }
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
    this.subDiscapacidad?.unsubscribe();
  }

  private buildForm(): void {
    this.estudianteForm = this.fb.group({
      // ── Información Personal ──
      cedula:             ['', [Validators.required, Validators.maxLength(20)]],
      nombre:             ['', [Validators.required, Validators.maxLength(40)]],
      apellidoPaterno:    ['', [Validators.required, Validators.maxLength(40)]],
      apellidoMaterno:    ['', [Validators.maxLength(40)]],
      fechaNacimiento:    ['', [Validators.required]],
      genero:             ['', [Validators.maxLength(15)]],
      nacionalidad:       ['', [Validators.maxLength(50)]],
      discapacidad:       [false],
      tipoDiscapacidad:   ['', [Validators.maxLength(100)]],
      necesitaAsistencia: [false],

      // ── Contacto ──
      emailPersonal:            ['', [Validators.maxLength(100), Validators.email]],
      telefonoMovil:            ['', [Validators.required, Validators.maxLength(20)]],
      telefonoEmergencia:       ['', [Validators.maxLength(20)]],
      nombreContactoEmergencia: ['', [Validators.maxLength(100)]],

      // ── Académico ──
      idCarrera:               [0, [Validators.required, Validators.min(1)]],
      condicionSocioeconomica: ['', [Validators.maxLength(30)]],
      tipoBeca:                ['Ninguna', [Validators.maxLength(20)]],
      trabaja:                 [false],

      // ── Colegio ──
      colegioProcedencia:    ['', [Validators.maxLength(150)]],
      tipoColegio:           [''],
      anioGraduacionColegio: [null],

      // ── Dirección ──
      provincia:       ['', [Validators.maxLength(50)]],
      canton:          ['', [Validators.maxLength(50)]],
      distrito:        ['', [Validators.maxLength(50)]],
      direccionExacta: [''],

      // ── Observaciones ──
      observaciones: [''],

      // ── Campos del sistema (solo lectura) ──
      carnet:             [0],
      emailInstitucional: [''],
      semestreActual:     [1],
      fechaIngreso:       [''],
      estadoEstudiante:   [true],
    });
  }

  get discapacidad(): boolean {
    return this.estudianteForm.get('discapacidad')!.value;
  }

  f(name: string): AbstractControl {
    return this.estudianteForm.get(name)!;
  }

  isInvalid(name: string): boolean {
    const ctrl = this.f(name);
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  cargarEstudiante(id: number): void {
    this.estudianteService.getEstudianteById(id).subscribe(est => {
      if (!est) return;
      this.estudianteOriginal = est;
      this.estudianteForm.patchValue({
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
      });
    });
  }

  guardar(): void {
    this.estudianteForm.markAllAsTouched();
    if (this.estudianteForm.invalid) return;

    const v = this.estudianteForm.value;

    const carreraSeleccionada = this.carreras.find(c => c.idCarrera === v.idCarrera);
    if (!carreraSeleccionada) {
      alert('⚠️ Por favor seleccione una carrera válida');
      return;
    }

    if (this.esEdicion && this.estudianteOriginal) {
      const updated: Estudiante = {
        ...this.estudianteOriginal,
        cedula: v.cedula,
        nombre: v.nombre,
        apellidoPaterno: v.apellidoPaterno,
        apellidoMaterno: v.apellidoMaterno || undefined,
        fechaNacimiento: v.fechaNacimiento,
        genero: v.genero,
        nacionalidad: v.nacionalidad || undefined,
        discapacidad: v.discapacidad,
        tipoDiscapacidad: v.tipoDiscapacidad || undefined,
        necesitaAsistencia: v.necesitaAsistencia,
        emailPersonal: v.emailPersonal,
        telefonoMovil: v.telefonoMovil,
        telefonoEmergencia: v.telefonoEmergencia || undefined,
        nombreContactoEmergencia: v.nombreContactoEmergencia || undefined,
        idCarrera: carreraSeleccionada.idCarrera,
        condicionSocioeconomica: v.condicionSocioeconomica || undefined,
        tipoBeca: v.tipoBeca,
        trabaja: v.trabaja,
        colegioProcedencia: v.colegioProcedencia || undefined,
        tipoColegio: v.tipoColegio || undefined,
        anioGraduacionColegio: v.anioGraduacionColegio || undefined,
        provincia: v.provincia || undefined,
        canton: v.canton || undefined,
        distrito: v.distrito || undefined,
        direccionExacta: v.direccionExacta || undefined,
        observaciones: v.observaciones || undefined,
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
        cedula: v.cedula,
        nombre: v.nombre,
        apellidoPaterno: v.apellidoPaterno,
        apellidoMaterno: v.apellidoMaterno || undefined,
        fechaNacimiento: v.fechaNacimiento,
        genero: v.genero,
        nacionalidad: v.nacionalidad || undefined,
        discapacidad: v.discapacidad,
        tipoDiscapacidad: v.tipoDiscapacidad || undefined,
        necesitaAsistencia: v.necesitaAsistencia,
        emailPersonal: v.emailPersonal,
        telefonoMovil: v.telefonoMovil,
        telefonoEmergencia: v.telefonoEmergencia || undefined,
        nombreContactoEmergencia: v.nombreContactoEmergencia || undefined,
        idCarrera: carreraSeleccionada.idCarrera,
        estadoEstudiante: v.estadoEstudiante,
        tipoBeca: v.tipoBeca,
        condicionSocioeconomica: v.condicionSocioeconomica || undefined,
        trabaja: v.trabaja,
        colegioProcedencia: v.colegioProcedencia || undefined,
        tipoColegio: v.tipoColegio || undefined,
        anioGraduacionColegio: v.anioGraduacionColegio || undefined,
        provincia: v.provincia || undefined,
        canton: v.canton || undefined,
        distrito: v.distrito || undefined,
        direccionExacta: v.direccionExacta || undefined,
        observaciones: v.observaciones || undefined,
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
