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
    cedula: '',
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    genero: '',
    emailPersonal: '',
    telefono: '',
    telefonoEmergencia: '',
    nombreEmergencia: '',
    carreraId: '',
    modalidad: 'Presencial',
    jornada: 'Diurna',
    tipoBeca: 'Ninguna',
    provincia: '',
    canton: '',
    direccion: ''
  };

  carreras: CarreraOption[] = [
    { id: 1, codigo: 'ING-SIS', nombre: 'Ingeniería en Sistemas', creditos: 180 },
    { id: 2, codigo: 'ING-IND', nombre: 'Ingeniería Industrial', creditos: 175 },
    { id: 3, codigo: 'ADM-EMP', nombre: 'Administración de Empresas', creditos: 140 }
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
    // Ejemplo mock:
    this.form = {
      cedula: '1-1234-5678',
      nombres: 'Juan Carlos',
      apellidoPaterno: 'Pérez',
      apellidoMaterno: 'Rodríguez',
      fechaNacimiento: '2000-05-15',
      genero: 'M',
      emailPersonal: 'juan.perez@universidad.edu',
      telefono: '8888-1234',
      telefonoEmergencia: '7777-5678',
      nombreEmergencia: 'María Pérez (Madre)',
      carreraId: '1',
      modalidad: 'Presencial',
      jornada: 'Diurna',
      tipoBeca: 'Ninguna',
      provincia: 'San José',
      canton: 'Central',
      direccion: 'Del parque central 200m norte'
    };
  }

  guardar(): void {
    if (this.esEdicion) {
      // TODO: Llamar servicio de actualización
      console.log('Actualizar estudiante:', this.estudianteId, this.form);
      alert('✅ Estudiante actualizado exitosamente');
    } else {
      // TODO: Llamar servicio de creación
      console.log('Crear estudiante:', this.form);
      alert('✅ Estudiante creado exitosamente');
    }
    this.router.navigate(['/app/estudiantes']);
  }

  cancelar(): void {
  if (this.esEdicion) {
    this.router.navigate(['../..'], { relativeTo: this.route });
  } else {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
}