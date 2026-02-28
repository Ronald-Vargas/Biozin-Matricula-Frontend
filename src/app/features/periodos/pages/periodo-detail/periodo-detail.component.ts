import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Periodo } from '../../models/periodos.model';
import { PeriodoService } from '../../services/periodos.services';


@Component({
  selector: 'app-periodo-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './periodo-detail.html',
  styleUrl: './periodo-detail.scss'
})
  
export class PeriodoDetailComponent implements OnInit {

  periodo?: Periodo;
  cargando = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private periodoService: PeriodoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.periodoService.getPeriodoById(id).subscribe({
      next: (periodo) => {
        this.periodo = periodo;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener periodo:', err);
        this.cargando = false;
        this.error = true;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/periodos']);
  }
}