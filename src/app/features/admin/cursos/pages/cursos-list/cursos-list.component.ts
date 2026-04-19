import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Curso } from '../../models/curso.model';
import { CursoService } from '../../services/curso.service';
import { CursoFormComponent } from '../curso-form/curso-form.component';
import { ToastService } from '../../../../../shared/toast/toast.service';


@Component({
  selector: 'app-cursos-list',
  standalone: true,
  imports: [CursoFormComponent, CommonModule, FormsModule],
  templateUrl: './cursos-list.html',
  styleUrls: ['./cursos-list.scss']
})

export class CursosListComponent implements OnInit, OnDestroy {
  @ViewChild('formularioCursoAnchor') formularioCursoAnchor?: ElementRef<HTMLElement>;

  cursos: Curso[] = [];
  mostrarFormulario = false;
  cursoEditandoId: number | null = null;
  filtroNombre = '';
  filtroEstado = 'activo';
  private sub!: Subscription;

  constructor(
    private cursoService: CursoService,
    private router: Router,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sub = this.cursoService.getCursos().subscribe(data => {
      this.cursos = data;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get cursosFiltrados(): Curso[] {
    return this.cursos.filter(c => {
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
      this.cursoEditandoId = null;
    }
  }

  verDetalles(id: number): void {
    this.router.navigate(['/cursos', id]);
  }

  toggleEstado(idCurso: number): void {
    this.cursoService.toggleEstado(idCurso).subscribe(res => {
      if (res.blnError) this.toast.show(res.strMensajeRespuesta);
    });
  }

  onCursoCreado(): void {
    this.mostrarFormulario = false;
    this.cursoEditandoId = null;
  }

  editarCurso(id: number): void {
    this.cursoEditandoId = id;
    this.mostrarFormulario = true;
    this.cdr.detectChanges();
    this.scrollAlFormulario();
  }

  private scrollAlFormulario(): void {
    requestAnimationFrame(() => {
      const elemento = this.formularioCursoAnchor?.nativeElement;
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
