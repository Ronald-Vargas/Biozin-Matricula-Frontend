import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignacionService } from '../../../asignaciones/services/asignacion.service';
import { Carrera } from '../../models/carrera.model';
import { CarreraService } from '../../services/carrera.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carreras-detail',
  imports: [CommonModule],
  templateUrl: './carreras-detail.html',
  styleUrl: './carreras-detail.scss',
})
export class CarrerasDetailComponent implements OnInit {
  carrera?: Carrera;
  cargando = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carreraService: CarreraService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carreraService.getCarreraById(id).subscribe({
      next: (carrera) => {
        this.carrera = carrera;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener carrera:', err);
        this.cargando = false;
        this.error = true;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/carreras']);
  }
}