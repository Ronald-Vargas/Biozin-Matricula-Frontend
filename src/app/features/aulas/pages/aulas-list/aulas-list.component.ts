import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Aula } from '../../models/aula.model';
import { AulaService } from '../../services/aula.service';
import { AulaFormComponent } from '../aula-form/aula-form.component';

@Component({
  selector: 'app-aulas-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AulaFormComponent],
  templateUrl: './aulas-list.component.html',
  styleUrls: ['./aulas-list.component.scss'],
})
export class AulasListComponent implements OnInit {

  aulas$!: Observable<Aula[]>;
  mostrarFormulario = false;
  aulaSeleccionada: Aula | null = null;

  constructor(private aulaService: AulaService) {}

  ngOnInit(): void {
    this.aulas$ = this.aulaService.getAulas();
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.aulaSeleccionada = null;
    }
  }

  editarAula(aula: Aula): void {
    this.aulaSeleccionada = aula;
    this.mostrarFormulario = true;
  }

  eliminarAula(id: number): void {
    if (confirm('¿Desea eliminar esta aula?')) {
      this.aulaService.deleteAula(id).subscribe();
    }
  }

  onAulaCreada(): void {
    this.mostrarFormulario = false;
    this.aulaSeleccionada = null;
  }

  onAulaActualizada(): void {
    this.mostrarFormulario = false;
    this.aulaSeleccionada = null;
  }
}
