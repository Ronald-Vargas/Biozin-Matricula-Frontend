
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Carrera } from '../../../carreras/models/carrera.model';
import { CarreraService } from '../../../carreras/services/carrera.service';
import { MallaCurricular } from '../../../asignaciones/models/asignacion.model';
import { AsignacionService } from '../../../asignaciones/services/asignacion.service';
import { CommonModule, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-malla-curricular',
  templateUrl: './malla-curricular.component.html',
  imports: [CommonModule, AsyncPipe],
  styleUrls: ['./malla-curricular.component.scss']
})
export class MallaCurricularComponent implements OnInit {
  carreras$!: Observable<Carrera[]>;
  mallaCurricular?: MallaCurricular | null;

  constructor(
    private carreraService: CarreraService,
    private asignacionService: AsignacionService
  ) {}

  ngOnInit(): void {
    this.carreras$ = this.carreraService.getCarreras();
  }

  async onCarreraSeleccionada(event: any): Promise<void> {
  const id = Number(event.target.value);
  if (id) {
  } else {
    this.mallaCurricular = undefined;
  }
}
}
