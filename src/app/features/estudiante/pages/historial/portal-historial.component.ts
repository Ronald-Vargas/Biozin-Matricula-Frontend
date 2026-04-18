import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalService } from '../../services/portal.service';
import { CursoHistorial, SemestreHistorial } from '../../models/portal.models';

@Component({
  selector: 'app-portal-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portal-historial.html',
  styleUrls: ['./portal-historial.scss'],
})
export class PortalHistorialComponent implements OnInit {

  cargando = true;
  semestres: SemestreHistorial[] = [];

  constructor(private portalService: PortalService) {}

  ngOnInit(): void {
    this.portalService.getHistorial().subscribe({
      next: (res) => {
        this.cargando = false;
        if (!res.blnError) {
          this.semestres = res.valorRetorno || [];
        }
      },
      error: () => { this.cargando = false; },
    });
  }

  get promedioGeneral(): number {
    const semestresConNota = this.semestres.filter((s) => s.promedio !== null);
    if (semestresConNota.length === 0) return 0;
    const suma = semestresConNota.reduce((acc, s) => acc + (s.promedio ?? 0), 0);
    return Math.round((suma / semestresConNota.length) * 10) / 10;
  }

  get totalCreditosAprobados(): number {
    return this.semestres.reduce((acc, s, i) =>
      acc + s.cursos
        .filter(c => this.getEstadoEfectivo(c, i) === 'aprobado')
        .reduce((sum, c) => sum + c.creditos, 0), 0);
  }

  get totalCursosAprobados(): number {
    return this.semestres.reduce((acc, s, i) =>
      acc + s.cursos.filter(c => this.getEstadoEfectivo(c, i) === 'aprobado').length, 0);
  }



  esPeriodoActual(index: number): boolean {
    return index === 0;
  }

  getEstadoEfectivo(curso: CursoHistorial, semIndex: number): 'aprobado' | 'reprobado' | 'en_curso' {
    if (curso.estado === 'en_curso' && !this.esPeriodoActual(semIndex)) {
      return 'aprobado';
    }
    return curso.estado;
  }

  getEstadoLabel(estado: string): string {
    if (estado === 'aprobado') return 'Aprobado';
    if (estado === 'reprobado') return 'Reprobado';
    return 'En curso';
  }

  getNotaClass(nota: number): string {
    if (nota >= 70) return 'nota-aprobada';
    return 'nota-reprobada';
  }

  getSemestreLabel(label: string): string {
    return label.replace(/Semestre/gi, 'Periodo');
  }
}
