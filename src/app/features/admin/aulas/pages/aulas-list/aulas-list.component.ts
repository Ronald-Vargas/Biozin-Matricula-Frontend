import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
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
export class AulasListComponent implements OnInit, OnDestroy {

  aulas: Aula[] = [];
  mostrarFormulario = false;
  aulaSeleccionada: Aula | null = null;
  filtroNumero = '';
  filtroEstado = 'activo';

  private sub?: Subscription;

  constructor(private aulaService: AulaService) {}

  ngOnInit(): void {
    this.sub = this.aulaService.getAulas().subscribe(aulas => {
      this.aulas = aulas;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get aulasFiltradas(): Aula[] {
    return this.aulas.filter(a => {
      const term = this.filtroNumero.toLowerCase();
      const matchNumero = !term || a.numeroAula.toLowerCase().includes(term);
      const matchEstado =
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'activo' && a.activo === true) ||
        (this.filtroEstado === 'inactivo' && a.activo === false);
      return matchNumero && matchEstado;
    });
  }

  filtrar(estado: string): void {
    this.filtroEstado = estado;
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
