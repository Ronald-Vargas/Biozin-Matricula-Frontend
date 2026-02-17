import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profesor-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profesor-form.html',
  styleUrl: './profesor-form.scss',
})
export class ProfesorFormComponent implements OnInit {

  esEdicion: boolean = false;
  profesorId: number | null = null;
  titulo: string = '📝 Nuevo Profesor';

  form = {
    // ── Información Personal ──
    cedula: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    genero: '',
    nacionalidad: '',

    // ── Contacto ──
    emailPersonal: '',
    telefono: '',

    // ── Académico ──
    titulo: '',
    especialidad: '',

    // ── Dirección ──
    provincia: '',
    canton: '',
    distrito: '',
    direccionExacta: '',

    // ── Campos automáticos (solo lectura en edición) ──
    codigoProfesor: '',
    emailInstitucional: '',
    contrasena: '',
    fechaIngreso: '',
    estadoProfesor: 'activo',
    cursosAsignados: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.profesorId = +id;
      this.titulo = '✏️ Editar Profesor';
      this.cargarProfesor(this.profesorId);
    }
  }

  cargarProfesor(id: number): void {
    // TODO: Reemplazar con tu ProfesorService.getById(id)
    this.form = {
      cedula: '1-0123-0456',
      nombre: 'Carlos',
      apellidoPaterno: 'Ramírez',
      apellidoMaterno: 'López',
      fechaNacimiento: '1985-03-20',
      genero: 'M',
      nacionalidad: 'Costarricense',
      emailPersonal: 'carlos.ramirez@gmail.com',
      telefono: '8812-3456',
      titulo: 'Máster en Ciencias de la Computación',
      especialidad: 'Ingeniería de Software',
      provincia: 'San José',
      canton: 'Central',
      distrito: 'Catedral',
      direccionExacta: 'Barrio Escalante, 100m sur de la iglesia',
      codigoProfesor: 'PROF-001',
      emailInstitucional: 'carlos.ramirez@universidad.ac.cr',
      contrasena: '',
      fechaIngreso: '2020-02-15',
      estadoProfesor: 'activo',
      cursosAsignados: 3,
    };
  }

  guardar(): void {
    if (!this.form.cedula || !this.form.nombre || !this.form.apellidoPaterno || !this.form.titulo || !this.form.especialidad) {
      alert('⚠️ Por favor complete los campos obligatorios');
      return;
    }

    if (!this.esEdicion) {
      // Generar campos automáticos
      this.form.codigoProfesor = this.generarCodigo();
      this.form.emailInstitucional = this.generarEmailInstitucional();
      this.form.contrasena = this.generarContrasena();
      this.form.fechaIngreso = new Date().toISOString().split('T')[0];
      this.form.estadoProfesor = 'activo';
      this.form.cursosAsignados = 0;
    }

    if (this.esEdicion) {
      console.log('Actualizar profesor:', this.profesorId, this.form);
      alert('✅ Profesor actualizado exitosamente');
    } else {
      console.log('Crear profesor:', this.form);
      alert('✅ Profesor creado exitosamente');
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
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `PROF-${random}`;
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