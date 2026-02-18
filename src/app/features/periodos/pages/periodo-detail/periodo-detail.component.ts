import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-periodo-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './periodo-detail.html',
  styleUrl: './periodo-detail.scss'
})
  
export class PeriodoDetailComponent implements OnInit {

  periodoId: number | null = null;

  periodo: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.periodoId = +id;
      this.cargarPeriodo(this.periodoId);
    }
  }

  cargarPeriodo(id: number): void {
    // 🔥 Aquí luego conectarás tu servicio real
    // Ejemplo temporal:

    if (id === 1) {
      this.periodo = {
        periodo: 'I Semestre 2026',
        fechaInicio: '2026-02-10',
        fechaFin: '2026-06-28',
        fechaMatricula: '2026-02-01',
        MatriculaCierre: '2026-02-28',
        estado: 'Abierto'
      };
    } else {
      this.periodo = null;
    }
  }

  volver(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}