import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { Periodo } from "../../models/periodos.model";
import { PeriodoService } from "../../services/periodos.services";
import { Observable, Subscription } from "rxjs";
import { PeriodoFormComponent } from "../periodo-form/periodo-form.component";


@Component({
  selector: 'app-periodos-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PeriodoFormComponent],
  templateUrl: './periodos-list.html',
  styleUrls: ['./periodos-list.scss'],
})

export class PeriodosListComponent implements OnInit {

  periodos: Periodo[] = [];
  filtroNombre = '';
  filtroEstado = 'todos';
  mostrarFormulario = false;
  periodoEditarSeleccionado: Periodo | null = null;

  private sub?: Subscription;


  constructor(
    private periodoService: PeriodoService,
    ) {}


  ngOnInit(): void {
    this.sub = this.periodoService.getPeriodos().subscribe(periodos => {
      this.periodos = periodos;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }



  get periodosFiltrados(): Periodo[] {
        return this.periodos.filter(c => {
          const term = this.filtroNombre.toLowerCase();
          const matchNombre = !term || c.nombre.toLowerCase().includes(term);
          const matchEstado =
            this.filtroEstado === 'todos' ||
            (this.filtroEstado === 'activo' && c.estadoMatricula === true) ||
            (this.filtroEstado === 'inactivo' && c.estadoMatricula === false);
          return matchNombre && matchEstado;
        });
      }
  

  filtrar(estado: string): void {
    this.filtroEstado = estado;
  }




  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.periodoEditarSeleccionado = null;
    }
  }

  editarPeriodo(id: number): void {
    this.periodoEditarSeleccionado = this.periodos.find(p => p.idPeriodo === id) ?? null;
    this.mostrarFormulario = true;
  }

  onPeriodoGuardado(): void {
    this.mostrarFormulario = false;
    this.periodoEditarSeleccionado = null;
  }


  toggleEstado(idPeriodo: number): void {
    this.periodoService.toggleEstado(idPeriodo);
  }

   getEstadoClass(estado: boolean): string {
    return estado ? 'badge-active' : 'badge-inactive';
  }

   getToggleButtonConfig(estado: boolean): { icon: string; tooltip: string } {
    return estado
      ? { icon: '🗑️', tooltip: 'Desactivar' }
      : { icon: '✅', tooltip: 'Activar' };
  }

}