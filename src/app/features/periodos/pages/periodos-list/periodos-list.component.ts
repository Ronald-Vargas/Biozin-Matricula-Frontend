import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Periodo } from "../../models/periodos.model";
import { PeriodoService } from "../../services/periodos.services";
import { Observable } from "rxjs";
import { PeriodoFormComponent } from "../periodo-form/periodo-form.component";


@Component({
  selector: 'app-periodos-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PeriodoFormComponent],
  templateUrl: './periodos-list.html',
  styleUrls: ['./periodos-list.scss'],
})

export class PeriodosListComponent implements OnInit {

  periodos$!: Observable<Periodo[]>;
  mostrarFormulario = false;
  periodoSeleccionado: Periodo | null = null;

  constructor(
    private periodoService: PeriodoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.periodos$ = this.periodoService.getPeriodos();
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.periodoSeleccionado = null;
    }
  }

  verDetalles(id: number): void {
    this.router.navigate(['/periodos', id]);
  }

  editarPeriodo(per: Periodo): void {
    this.periodoSeleccionado = per;
    this.mostrarFormulario = true;
  }


  toggleEstado(idPeriodo: number): void {
    this.periodoService.toggleEstado(idPeriodo);
  }

  onPeriodoCreado(): void {
    this.mostrarFormulario = false;
    this.periodoSeleccionado = null;
  }

  onPeriodoActualizado(): void {
    this.mostrarFormulario = false;
    this.periodoSeleccionado = null;
  }


}