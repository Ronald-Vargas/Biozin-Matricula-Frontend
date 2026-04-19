import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortalService } from '../../services/portal.service';
import { MallaCurricular, CursoMalla, SemestreMalla } from '../../models/portal.models';

@Component({
  selector: 'app-portal-malla',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './portal-malla.html',
  styleUrls: ['./portal-malla.scss'],
})
export class PortalMallaComponent implements OnInit {
  cargando = true;
  error = '';
  malla: MallaCurricular | null = null;

  constructor(private portalService: PortalService) {}

  ngOnInit(): void {
    this.portalService.getMalla().subscribe({
      next: (res) => {
        this.cargando = false;
        if (res.blnError) {
          this.error = res.strMensajeRespuesta;
        } else {
          this.malla = res.valorRetorno;
        }
      },
      error: () => {
        this.cargando = false;
        this.error = 'No se pudo cargar la malla curricular.';
      },
    });
  }

  get progreso(): number {
    if (!this.malla?.totalCreditos) return 0;
    return Math.round((this.malla.creditosAprobados / this.malla.totalCreditos) * 100);
  }

  estadoLabel(estado: CursoMalla['estado']): string {
    const map: Record<string, string> = {
      aprobado: 'Aprobado',
      en_curso: 'En Curso',
      disponible: 'Disponible',
      pendiente: 'Pendiente',
    };
    return map[estado] ?? estado;
  }

  estadoClass(estado: CursoMalla['estado']): string {
    return `estado-${estado}`;
  }

  notaClass(nota: number | null | undefined): string {
    if (nota == null) return '';
    return nota >= 70 ? 'nota-aprobada' : 'nota-reprobada';
  }

  cursosPorEstado(semestre: SemestreMalla, estado: string): number {
    return semestre.cursos.filter(c => c.estado === estado).length;
  }
}
