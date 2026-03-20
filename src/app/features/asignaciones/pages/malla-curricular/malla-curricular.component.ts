
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Carrera } from '../../../carreras/models/carrera.model';
import { CarreraService } from '../../../carreras/services/carrera.service';
import { MallaCurricular } from '../../models/asignacion.model';
import { AsignacionService } from '../../services/asignacion.service';

@Component({
  selector: 'app-malla-curricular',
  templateUrl: './malla-curricular.component.html',
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

  onCarreraSeleccionada(event: any): void {
    const id = Number(event.target.value);
    if (id) {
      this.mallaCurricular = this.asignacionService.getMallaCurricular(id);
    } else {
      this.mallaCurricular = undefined;
    }
  }
}
