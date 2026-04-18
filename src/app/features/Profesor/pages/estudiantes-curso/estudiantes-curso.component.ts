import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PortalProfesorService } from '../../services/portal-profesor.service';
import { EstudianteEnCurso } from '../../models/profesor-portal.models';

interface EstudianteRow extends EstudianteEnCurso {
  notaEditando: boolean;
  notaTemporal: number | null;
  guardando: boolean;
  mensajeGuardado: string;
}

@Component({
  selector: 'app-estudiantes-curso',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './estudiantes-curso.html',
  styleUrls: ['./estudiantes-curso.scss'],
})
export class EstudiantesCursoComponent implements OnInit {
  cargando = true;
  error = '';
  idOferta = 0;
  estudiantes: EstudianteRow[] = [];

  get nombreCurso(): string {
    return history.state?.nombreCurso || 'Curso';
  }

  constructor(private route: ActivatedRoute, private service: PortalProfesorService) {}

  ngOnInit(): void {
    this.idOferta = Number(this.route.snapshot.paramMap.get('idOferta'));
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.cargando = true;
    this.service.obtenerEstudiantesCurso(this.idOferta).subscribe({
      next: (res) => {
        if (!res.blnError && res.valorRetorno) {
          this.estudiantes = res.valorRetorno.map(e => ({
            ...e,
            notaEditando: false,
            notaTemporal: null,
            guardando: false,
            mensajeGuardado: ''
          }));
        } else {
          this.error = res.strMensajeRespuesta || 'No se pudieron cargar los estudiantes';
        }
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al conectar con el servidor';
        this.cargando = false;
      }
    });
  }

  iniciarEdicion(est: EstudianteRow): void {
    this.estudiantes.forEach(e => { e.notaEditando = false; e.notaTemporal = null; });
    est.notaEditando = true;
    est.notaTemporal = est.nota ?? null;
    est.mensajeGuardado = '';
  }

  cancelarEdicion(est: EstudianteRow): void {
    est.notaEditando = false;
    est.notaTemporal = null;
  }

  guardarNota(est: EstudianteRow): void {
    if (est.notaTemporal === null || est.notaTemporal < 0 || est.notaTemporal > 100) return;
    est.guardando = true;

    this.service.asignarNota({ idMatricula: est.idMatricula, nota: est.notaTemporal }).subscribe({
      next: (res) => {
        if (!res.blnError) {
          est.nota = est.notaTemporal!;
          est.estado = est.nota >= 70 ? 'aprobado' : 'reprobado';
          est.mensajeGuardado = '✓ Nota guardada';
          est.notaEditando = false;
          setTimeout(() => { est.mensajeGuardado = ''; }, 3000);
        } else {
          est.mensajeGuardado = '⚠ ' + (res.strMensajeRespuesta || 'Error al guardar');
        }
        est.guardando = false;
      },
      error: () => {
        est.mensajeGuardado = '⚠ Error al guardar';
        est.guardando = false;
      }
    });
  }

  estadoClass(estado: string): string {
    switch (estado) {
      case 'aprobado': return 'estado-aprobado';
      case 'reprobado': return 'estado-reprobado';
      default: return 'estado-curso';
    }
  }

  estadoLabel(estado: string): string {
    switch (estado) {
      case 'aprobado': return 'Aprobado';
      case 'reprobado': return 'Reprobado';
      default: return 'En Curso';
    }
  }
}
