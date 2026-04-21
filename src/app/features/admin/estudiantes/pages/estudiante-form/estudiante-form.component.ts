import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

function noSoloEspacios(control: AbstractControl): ValidationErrors | null {
  if (typeof control.value === 'string' && control.value.trim().length === 0 && control.value.length > 0) {
    return { soloEspacios: true };
  }
  return null;
}
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
  readonly hoy = new Date().toISOString().split('T')[0];

  estudianteOriginal?: Estudiante;
  estudianteForm!: FormGroup;

  carreras: Carrera[] = [];
  carrerasSeleccionadas: number[] = [];
  carreraComboAbierto = false;
  busquedaCarrera = '';
  private estudiantesExistentes: Estudiante[] = [];
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

    this.estudianteService.getEstudiantes().subscribe(e => this.estudiantesExistentes = e);

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
      cedula:             ['', [Validators.required, noSoloEspacios, Validators.maxLength(20)]],
      nombre:             ['', [Validators.required, noSoloEspacios, Validators.maxLength(40)]],
      apellidoPaterno:    ['', [Validators.required, noSoloEspacios, Validators.maxLength(40)]],
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
      condicionSocioeconomica: ['', [Validators.maxLength(30)]],
      tipoBeca:                ['Ninguna'],
      trabaja:                 [false],

      // ── Colegio ──
      colegioProcedencia:    ['', [Validators.maxLength(150)]],
      tipoColegio:           [''],
      anioGraduacionColegio: [null, [Validators.min(1950), Validators.max(2030)]],

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

  get carrerasInvalid(): boolean {
    return this.carrerasSeleccionadas.length === 0;
  }

  get carrerasSeleccionadasTexto(): string {
    if (this.carrerasSeleccionadas.length === 0) {
      return 'Seleccione una o varias carreras';
    }

    if (this.carrerasSeleccionadas.length === 1) {
      const carrera = this.carreras.find(c => c.idCarrera === this.carrerasSeleccionadas[0]);
      return carrera ? `${carrera.codigo} - ${carrera.nombre}` : '1 carrera seleccionada';
    }

    return `${this.carrerasSeleccionadas.length} carreras seleccionadas`;
  }

  get carrerasFiltradas(): Carrera[] {
    const filtradas = this.carreras.filter(carrera =>
      this.coincideBusqueda(`${carrera.codigo} ${carrera.nombre} ${carrera.descripcion ?? ''}`, this.busquedaCarrera)
    );

    const seleccionadas = this.carreras.filter(carrera =>
      this.carrerasSeleccionadas.includes(carrera.idCarrera) && !filtradas.some(item => item.idCarrera === carrera.idCarrera)
    );

    return [...seleccionadas, ...filtradas];
  }

  get carrerasSeleccionadasDetalle(): Carrera[] {
    return this.carreras.filter(carrera => this.carrerasSeleccionadas.includes(carrera.idCarrera));
  }

  f(name: string): AbstractControl {
    return this.estudianteForm.get(name)!;
  }

  isInvalid(name: string): boolean {
    const ctrl = this.f(name);
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  toggleCarrera(idCarrera: number): void {
    const idx = this.carrerasSeleccionadas.indexOf(idCarrera);
    if (idx === -1) {
      this.carrerasSeleccionadas = [...this.carrerasSeleccionadas, idCarrera];
    } else {
      this.carrerasSeleccionadas = this.carrerasSeleccionadas.filter(id => id !== idCarrera);
    }
  }

  toggleCarreraCombo(): void {
    this.carreraComboAbierto = !this.carreraComboAbierto;
  }

  cerrarCarrerasCombo(): void {
    this.carreraComboAbierto = false;
  }

  quitarCarrera(idCarrera: number): void {
    this.carrerasSeleccionadas = this.carrerasSeleccionadas.filter(id => id !== idCarrera);
  }

  estaSeleccionada(idCarrera: number): boolean {
    return this.carrerasSeleccionadas.includes(idCarrera);
  }

  carreraDetalleTexto(carrera: Carrera): string {
    return `${carrera.codigo} | ${carrera.duracion} periodos`;
  }

  actualizarBusquedaCarrera(event: Event): void {
    this.busquedaCarrera = (event.target as HTMLInputElement).value;
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

  cargarEstudiante(id: number): void {
    this.estudianteService.getEstudianteById(id).subscribe(est => {
      if (!est) return;
      this.estudianteOriginal = est;
      this.carrerasSeleccionadas = est.idsCarreras ?? [];
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
    if (this.estudianteForm.invalid) {
      const firstInvalid = document.querySelector<HTMLElement>('.form-panel .ng-invalid');
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (this.carrerasSeleccionadas.length === 0) {
      alert('⚠️ Debe seleccionar al menos una carrera.');
      return;
    }

    const v = this.estudianteForm.value;
    const otros = this.estudiantesExistentes.filter(e => e.idEstudiante !== this.estudianteId);

    if (otros.some(e => e.cedula === v.cedula.trim())) {
      alert('❌ Ya existe un estudiante registrado con esa cédula.');
      return;
    }
    if (v.emailPersonal && otros.some(e => e.emailPersonal?.toLowerCase() === v.emailPersonal.toLowerCase())) {
      alert('❌ El correo personal ya está registrado en otro estudiante.');
      return;
    }
    if (otros.some(e => e.telefonoMovil === v.telefonoMovil.trim())) {
      alert('❌ El número de teléfono ya está registrado en otro estudiante.');
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
        idsCarreras: this.carrerasSeleccionadas,
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

      this.estudianteService.updateEstudiante(updated).subscribe({
        next: res => {
          if (!res.blnError) {
            alert('✅ Estudiante actualizado exitosamente');
            this.cancelar();
          } else {
            alert('❌ ' + res.strMensajeRespuesta);
          }
        },
        error: () => alert('❌ Error de conexión al actualizar el estudiante. Intente nuevamente.')
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
        idsCarreras: this.carrerasSeleccionadas,
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

      this.estudianteService.createEstudiante(dto).subscribe({
        next: res => {
          if (!res.blnError) {
            alert('✅ Estudiante creado exitosamente');
            this.cancelar();
          } else {
            alert('❌ ' + res.strMensajeRespuesta);
          }
        },
        error: () => alert('❌ Error de conexión al crear el estudiante. Intente nuevamente.')
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/estudiantes']);
  }
}
