import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CarreraOption } from '../../models/estudiantes.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estudiante-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './estudiante-form.html',
  styleUrl: './estudiante-form.scss',
})
export class EstudianteFormComponent implements OnInit {

  esEdicion: boolean = false;
  estudianteId: number | null = null;
  titulo: string = '📝 Nuevo Estudiante';

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
    idCarrera: '',
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
    codigoEstudiante: '',
    emailInstitucional: '',
    contrasena: '',
    semestreActual: 1,
    fechaIngreso: '',
    estadoEstudiante: 'activo',
  };

  carreras: CarreraOption[] = [
    { id: 1, codigo: 'ING-SIS', nombre: 'Ingeniería en Sistemas', creditos: 180 },
    { id: 2, codigo: 'ING-IND', nombre: 'Ingeniería Industrial', creditos: 175 },
    { id: 3, codigo: 'ADM-EMP', nombre: 'Administración de Empresas', creditos: 140 },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.estudianteId = +id;
      this.titulo = '✏️ Editar Estudiante';
      this.cargarEstudiante(this.estudianteId);
    }
  }

  cargarEstudiante(id: number): void {
    // TODO: Reemplazar con tu EstudianteService.getById(id)
    this.form = {
      cedula: '1-1234-5678',
      nombre: 'Juan Carlos',
      apellidoPaterno: 'Pérez',
      apellidoMaterno: 'Rodríguez',
      fechaNacimiento: '2000-05-15',
      genero: 'M',
      nacionalidad: 'Costarricense',
      discapacidad: false,
      tipoDiscapacidad: '',
      necesitaAsistencia: false,
      emailPersonal: 'juan.perez@gmail.com',
      telefonoMovil: '8888-1234',
      telefonoEmergencia: '7777-5678',
      nombreContactoEmergencia: 'María Pérez (Madre)',
      idCarrera: '1',
      condicionSocioeconomica: 'Media',
      tipoBeca: 'Ninguna',
      trabaja: false,
      colegioProcedencia: 'Liceo de Costa Rica',
      tipoColegio: 'Publico',
      anioGraduacionColegio: 2024,
      provincia: 'San José',
      canton: 'Central',
      distrito: 'Catedral',
      direccionExacta: 'Del parque central 200m norte',
      observaciones: '',
      codigoEstudiante: 'EST-2025-1234',
      emailInstitucional: 'juan.perez@universidad.ac.cr',
      contrasena: '',
      semestreActual: 3,
      fechaIngreso: '2025-02-10',
      estadoEstudiante: 'activo',
    };
  }

  guardar(): void {
    if (!this.form.cedula || !this.form.nombre || !this.form.apellidoPaterno || !this.form.idCarrera) {
      alert('⚠️ Por favor complete los campos obligatorios');
      return;
    }

    if (!this.esEdicion) {
      // Generar campos automáticos
      this.form.codigoEstudiante = this.generarCodigo();
      this.form.emailInstitucional = this.generarEmailInstitucional();
      this.form.contrasena = this.generarContrasena();
      this.form.semestreActual = 1;
      this.form.fechaIngreso = new Date().toISOString().split('T')[0];
      this.form.estadoEstudiante = 'activo';
    }

    if (this.esEdicion) {
      // TODO: Llamar servicio de actualización
      console.log('Actualizar estudiante:', this.estudianteId, this.form);
      alert('✅ Estudiante actualizado exitosamente');
    } else {
      // TODO: Llamar servicio de creación
      console.log('Crear estudiante:', this.form);
      alert('✅ Estudiante creado exitosamente');
    }

    this.cancelar();
  }

  cancelar(): void {
    if (this.esEdicion) {
      this.router.navigate(['../..'], { relativeTo: this.route });
    } else {
      this.router.navigate(['..'], { relativeTo: this.route });
    }
  }

  // ── Generadores automáticos ──

  private generarCodigo(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `EST-${year}-${random}`;
  }

  private generarEmailInstitucional(): string {
    const nombre = this.form.nombre.split(' ')[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const apellido = this.form.apellidoPaterno.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return `${nombre}.${apellido}@universidad.ac.cr`;
  }

  private generarContrasena(): string {
    const apellido = this.form.apellidoPaterno.substring(0, 3).toLowerCase();
    const cedula = this.form.cedula.replace(/-/g, '').slice(-4);
    return `${apellido}${cedula}`;
  }
}