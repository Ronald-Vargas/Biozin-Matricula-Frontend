import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AsignacionService } from '../../../asignaciones/services/asignacion.service';
import { PdfGeneratorService } from '../../../cursos/services/pdf-generator.service';
import { Carrera } from '../../models/carrera.model';
import { CarreraService } from '../../services/carrera.service';
import { CarreraFormComponent } from '../carrera-form/carreras-form.component';


@Component({
  selector: 'app-carreras-list',
  standalone: true,
  imports: [CarreraFormComponent, CommonModule, FormsModule],
  templateUrl: './carreras-list.html',
  styleUrls: ['./carreras-list.scss']
})

export class CarrerasListComponent implements OnInit, OnDestroy {
  @ViewChild('formularioCarreraAnchor') formularioCarreraAnchor?: ElementRef<HTMLElement>;

  carreras: Carrera[] = [];
  mostrarFormulario = false;
  carreraEditandoId: number | null = null;
  filtroNombre = '';
  filtroEstado = 'activo';
  private sub!: Subscription;

  constructor(
    private carreraService: CarreraService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sub = this.carreraService.getCarreras().subscribe(data => {
      this.carreras = data;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get carrerasFiltradas(): Carrera[] {
    return this.carreras.filter(c => {
      const term = this.filtroNombre.toLowerCase();
      const matchNombre = !term || c.nombre.toLowerCase().includes(term) || c.codigo.toLowerCase().includes(term);
      const matchEstado =
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'activo' && c.estado === true) ||
        (this.filtroEstado === 'inactivo' && c.estado === false);
      return matchNombre && matchEstado;
    });
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroEstado = 'activo';
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.carreraEditandoId = null;
    }
  }

  verDetalles(id: number): void {
    this.router.navigate(['/carreras', id]);
  }

  toggleEstado(id: number): void {
    this.carreraService.toggleEstado(id);
  }

  onCarreraCreada(): void {
    this.mostrarFormulario = false;
    this.carreraEditandoId = null;
  }

  editarCarrera(id: number): void {
    this.carreraEditandoId = id;
    this.mostrarFormulario = true;
    this.cdr.detectChanges();
    this.scrollAlFormulario();
  }

  private scrollAlFormulario(): void {
    requestAnimationFrame(() => {
      const elemento = this.formularioCarreraAnchor?.nativeElement;
      if (!elemento) return;

      const posicion = elemento.getBoundingClientRect().top + window.scrollY - 16;
      const scrollParent = this.obtenerContenedorScroll(elemento);

      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });

      window.scrollTo({
        top: Math.max(posicion, 0),
        behavior: 'smooth',
      });

      document.documentElement.scrollTo({
        top: Math.max(posicion, 0),
        behavior: 'smooth',
      });

      document.body.scrollTo({
        top: Math.max(posicion, 0),
        behavior: 'smooth',
      });

      if (scrollParent) {
        const parentRect = scrollParent.getBoundingClientRect();
        const targetRect = elemento.getBoundingClientRect();
        scrollParent.scrollTo({
          top: scrollParent.scrollTop + targetRect.top - parentRect.top - 16,
          behavior: 'smooth',
        });
      }
    });
  }

  private obtenerContenedorScroll(elemento: HTMLElement): HTMLElement | null {
    let actual = elemento.parentElement;

    while (actual) {
      const estilo = getComputedStyle(actual);
      const puedeScrollear = /(auto|scroll|overlay)/.test(`${estilo.overflowY}${estilo.overflow}`);

      if (puedeScrollear && actual.scrollHeight > actual.clientHeight) {
        return actual;
      }

      actual = actual.parentElement;
    }

    return null;
  }


    getToggleButtonConfig(estado: boolean): { icon: string; label: string; tooltip: string } {
    return estado
      ? { icon: '🗑️' , label: 'Desactivar', tooltip: 'Desactivar' }
      : { icon: '✅', label: 'Activar', tooltip: 'Activar' };
  }


}
