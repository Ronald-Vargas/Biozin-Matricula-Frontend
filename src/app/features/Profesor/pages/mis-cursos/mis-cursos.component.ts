import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PortalProfesorService } from '../../services/portal-profesor.service';
import { OfertaProfesor } from '../../models/profesor-portal.models';

@Component({
  selector: 'app-mis-cursos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-cursos.html',
  styleUrls: ['./mis-cursos.scss'],
})
export class MisCursosComponent implements OnInit {
  cargando = true;
  cursos: OfertaProfesor[] = [];
  error = '';

  get cursosActivos(): OfertaProfesor[] {
    return this.cursos.filter(c => c.estado);
  }

  get cursosInactivos(): OfertaProfesor[] {
    return this.cursos.filter(c => !c.estado);
  }

  constructor(private service: PortalProfesorService, private router: Router) {}

  ngOnInit(): void {
    this.service.obtenerMisCursos().subscribe({
      next: (res) => {
        if (!res.blnError && res.valorRetorno) {
          this.cursos = res.valorRetorno;
        } else {
          this.error = res.strMensajeRespuesta || 'No se pudieron cargar los cursos';
        }
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al conectar con el servidor';
        this.cargando = false;
      }
    });
  }

  verEstudiantes(idOferta: number): void {
    this.router.navigate(['/profesor/cursos', idOferta, 'estudiantes']);
  }

  porcentajeLleno(curso: OfertaProfesor): number {
    if (!curso.cupoMaximo) return 0;
    return Math.round((curso.matriculados / curso.cupoMaximo) * 100);
  }
}
