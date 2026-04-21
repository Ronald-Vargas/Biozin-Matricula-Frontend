import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortalService } from '../../services/portal.service';
import { EstudiantePerfil, OfertaMatricula } from '../../models/portal.models';

@Component({
  selector: 'app-portal-matricular',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portal-matricular.html',
  styleUrls: ['./portal-matricular.scss'],
})
export class PortalMatricularComponent implements OnInit {

  filtroBusqueda = '';
  cargando = true;
  procesando = false;
  mensajeExito = '';
  mensajeError = '';
  mensajeSinOfertas = '';

  mostrarResumen = false;
  metodoPago: 'tarjeta' | 'transferencia' = 'tarjeta';

  oferta: OfertaMatricula[] = [];
  perfil: EstudiantePerfil | null = null;

  montoMatricula = 100000;
  montoInfraestructura = 15000;

  constructor(private portalService: PortalService) {}

  ngOnInit(): void {
    this.portalService.getPerfil().subscribe({
      next: (res) => {
        if (!res.blnError && res.valorRetorno) {
          this.perfil = res.valorRetorno;
        }
      }
    });

    this.portalService.getOfertas().subscribe({
      next: (res) => {
        this.cargando = false;
        this.mensajeSinOfertas = '';

        if (res.blnError) {
          this.oferta = [];
          this.mensajeSinOfertas = res.strMensajeRespuesta || 'No se encontraron cursos para matricular en este momento.';
          return;
        }

        if (res.valorRetorno) {
          this.montoMatricula = res.valorRetorno.montoMatricula ?? 100000;
          this.montoInfraestructura = res.valorRetorno.montoInfraestructura ?? 15000;
          const ofertas = res.valorRetorno.ofertas ?? [];
          this.oferta = ofertas.map(o => ({
            idOferta: o.idOferta,
            codigoCurso: o.codigo,
            nombreCurso: o.nombre,
            nombreProfesor: o.profesor,
            nombreAula: o.aula,
            horario: o.horario.map(h => `${h.dia} ${h.horaInicio}-${h.horaFin}`).join(', '),
            creditos: o.creditos,
            cupoMaximo: o.cupoMaximo,
            matriculados: o.matriculados,
            precio: o.precio,
            yaMatriculado: o.yaMatriculado ?? false,
            seleccionado: false,
          }));

          if (this.oferta.length === 0) {
            this.mensajeSinOfertas = res.strMensajeRespuesta || 'No se encontraron cursos para matricular en este momento.';
          }
        } else {
          this.oferta = [];
          this.mensajeSinOfertas = res.strMensajeRespuesta || 'No se encontraron cursos para matricular en este momento.';
        }
      },
      error: () => {
        this.cargando = false;
        this.oferta = [];
        this.mensajeSinOfertas = 'No se pudieron cargar los cursos para matricular en este momento.';
      },
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

  get seleccionados(): OfertaMatricula[] {
    return this.oferta.filter(c => c.seleccionado);
  }

  get becaFactor(): number {
    if (!this.perfil?.tipoBeca || this.perfil.tipoBeca === 'Ninguna') return 0;
    const pct = parseFloat(this.perfil.tipoBeca.replace('%', ''));
    return isNaN(pct) ? 0 : pct / 100;
  }

  precioConBeca(precio: number): number {
    return precio * (1 - this.becaFactor);
  }

  get subtotalCursos(): number {
    return this.seleccionados.reduce((acc, c) => acc + this.precioConBeca(c.precio), 0);
  }

  get totalFinal(): number {
    return this.subtotalCursos + this.montoMatricula + this.montoInfraestructura;
  }

  toggleSeleccion(curso: OfertaMatricula): void {
    if (curso.yaMatriculado || this.getCuposRestantes(curso) <= 0) return;
    curso.seleccionado = !curso.seleccionado;
  }

  abrirResumen(): void {
    if (this.seleccionados.length === 0) return;
    this.mensajeError = '';
    this.mostrarResumen = true;
    this.metodoPago = 'tarjeta';
  }

  cerrarResumen(): void {
    this.mostrarResumen = false;
    this.mensajeError = '';
  }

  confirmarMatricula(financiar: boolean): void {
    if (this.procesando) return;
    this.procesando = true;
    this.mensajeError = '';

    this.portalService.matricularBulk({
      idsOferta: this.seleccionados.map(c => c.idOferta),
      financiar,
      metodoPago: this.metodoPago,
    }).subscribe({
      next: (res) => {
        this.procesando = false;
        if (res.blnError) {
          this.mensajeError = res.strMensajeRespuesta || 'Error al procesar la matrícula.';
        } else {
          this.mostrarResumen = false;
          this.seleccionados.forEach(c => {
            c.yaMatriculado = true;
            c.seleccionado = false;
            c.matriculados += 1;
          });
          this.mensajeExito = res.strMensajeRespuesta || 'Matrícula realizada exitosamente.';
          setTimeout(() => { this.mensajeExito = ''; }, 6000);
        }
      },
      error: () => {
        this.procesando = false;
        this.mensajeError = 'Error al procesar la matrícula.';
      },
    });
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
}
