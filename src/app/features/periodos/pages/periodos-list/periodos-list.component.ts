import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Periodo } from "../../models/periodos.model";


@Component({
  selector: 'app-periodos-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './periodos-list.html',
  styleUrls: ['./periodos-list.scss'],
})

export class PeriodosListComponent implements OnInit {

  periodos: Periodo[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // TODO: Reemplazar con tu PeriodoService
    this.periodos = [
      {
        id: 1, periodo: 'I Semestre 2026', fechaInicio: '10 feb 2026',
        fechaFin: '28 jun 2026', fechaMatricula: '1 feb 2026', MatriculaCierre: '28 feb 2026',
        estado: 'Abierto', 
        
      },
      {
        id: 2, periodo: 'II Semestre 2026', fechaInicio: '14 jul 2026',
        fechaFin: '29 nov 2026', fechaMatricula: '1 jul 2026', MatriculaCierre: '14 jul 2026',
        estado: 'Cerrado', 
   
      },
      {
        id: 3, periodo: 'I Semestre 2025', fechaInicio: '10 feb 2025',
        fechaFin: '28 jun 2025', fechaMatricula: '1 feb 2025', MatriculaCierre: '15 feb 2025',
        estado: 'Cerrado', 
    
      },
      
    ];
    
  }



  getEstadoClass(estado: string): string {
    const map: Record<string, string> = {
      Abierto: 'badge-success',
      Cerrado: 'badge-danger',
    };
    return map[estado] || '';
  }



  verDetalle(per: Periodo): void {
      this.router.navigate([per.id], { relativeTo: this.route });
    }
  

  editarPeriodo(est: Periodo): void {
    this.router.navigate(['editar', est.id], { relativeTo: this.route });
  }

  eliminarPeriodo(per: Periodo): void {
    if (confirm(`¿Está seguro de eliminar el periodo ${per.periodo}?`)) {
      this.periodos = this.periodos.filter(e => e.id !== per.id);
    }
  }

  nuevoPeriodo(): void {
    this.router.navigate(['nuevo'], { relativeTo: this.route });
  }
}