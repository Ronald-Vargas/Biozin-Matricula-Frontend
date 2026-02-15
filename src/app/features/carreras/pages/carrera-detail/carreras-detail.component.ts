import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignacionService } from '../../../asignaciones/services/asignacion.service';
import { Carrera } from '../../models/carrera.model';
import { CarreraService } from '../../services/carrera.service';

@Component({
  selector: 'app-carreras-detail',
  imports: [],
  templateUrl: './carreras-detail.html',
  styleUrl: './carreras-detail.scss',
})
export class CarrerasDetailComponent implements OnInit {
  carrera?: Carrera;
  cursosAsignados: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carreraService: CarreraService,
    private asignacionService: AsignacionService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carrera = this.carreraService.getCarreraById(id);
    
    if (this.carrera) {
      const asignaciones = this.asignacionService.getAsignacionesByCarrera(id);
      // Aquí podrías cargar los detalles de los cursos asignados
    }
  }

  volver(): void {
    this.router.navigate(['/carreras']);
  }
}