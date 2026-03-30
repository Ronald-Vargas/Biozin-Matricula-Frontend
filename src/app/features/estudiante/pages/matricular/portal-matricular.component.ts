import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortalService } from '../../services/portal.service';
import { OfertaMatricula } from '../../models/portal.models';

@Component({
  selector: 'app-portal-matricular',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portal-matricular.html',
  styleUrls: ['./portal-matricular.scss'],
})
export class PortalMatricularComponent implements OnInit {

  filtroBusqueda = '';
  confirmando: OfertaMatricula | null = null;
  cargando = true;
  matriculando = false;
  mensajeExito = '';
  mensajeError = '';

  oferta: OfertaMatricula[] = [];

  constructor(private portalService: PortalService) {}

  ngOnInit(): void {
    this.portalService.getOfertas().subscribe({
      next: (res) => {
        this.cargando = false;
        if (!res.blnError) {
          this.oferta = res.valorRetorno || [];
        }
      },
      error: () => { this.cargando = false; },
    });
  }

  get ofertaFiltrada(): OfertaMatricula[] {
    const term = this.filtroBusqueda.toLowerCase();
    if (!term) return this.oferta;
    return this.oferta.filter(
      (c) =>
        c.nombreCurso.toLowerCase().includes(term) ||
        c.codigoCurso.toLowerCase().includes(term) ||
        c.nombreProfesor.toLowerCase().includes(term)
    );
  }

  get cuposDisponibles(): number {
    return this.oferta.filter((c) => !c.yaMatriculado && this.getCuposRestantes(c) > 0).length;
  }

  getCuposRestantes(curso: OfertaMatricula): number {
    return curso.cupoMaximo - curso.matriculados;
  }

  getCupoPercent(curso: OfertaMatricula): number {
    return Math.round((curso.matriculados / curso.cupoMaximo) * 100);
  }

  getCupoClass(curso: OfertaMatricula): string {
    const pct = this.getCupoPercent(curso);
    if (pct >= 100) return 'cupo-lleno';
    if (pct >= 80) return 'cupo-critico';
    return 'cupo-ok';
  }

  abrirConfirmacion(curso: OfertaMatricula): void {
    this.confirmando = curso;
    this.mensajeError = '';
  }

  cancelarConfirmacion(): void {
    this.confirmando = null;
  }

  confirmarMatricula(): void {
    if (!this.confirmando) return;
    this.matriculando = true;
    const idOferta = this.confirmando.idOferta;

    this.portalService.matricular(idOferta).subscribe({
      next: (res) => {
        this.matriculando = false;
        if (res.blnError) {
          this.mensajeError = res.strMensajeRespuesta || 'Error al matricular.';
        } else {
          const curso = this.oferta.find(c => c.idOferta === idOferta);
          if (curso) {
            curso.yaMatriculado = true;
            curso.matriculados += 1;
          }
          this.mensajeExito = `Matriculado exitosamente en ${this.confirmando?.nombreCurso}.`;
          this.confirmando = null;
          setTimeout(() => { this.mensajeExito = ''; }, 4000);
        }
      },
      error: () => {
        this.matriculando = false;
        this.mensajeError = 'Error al procesar la matrícula.';
      },
    });
  }
}
