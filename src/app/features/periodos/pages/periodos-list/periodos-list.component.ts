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
  }

  verDetalles(id: number): void {
    this.router.navigate(['/periodos', id]);
  }

  eliminarPeriodo(idPeriodo: number): void {
    if (confirm('¿Está seguro de eliminar este periodo?')) {
      this.periodoService.deletePeriodo(idPeriodo).subscribe();
    }
  }
  editarPeriodo(per: Periodo): void {
    this.router.navigate(['editar', per.idPeriodo], { relativeTo: this.route });
  }


  toggleEstado(idPeriodo: number): void {
    this.periodoService.toggleEstado(idPeriodo);
  }

  onPeriodoCreado(): void {
    this.mostrarFormulario = false;
  }


}