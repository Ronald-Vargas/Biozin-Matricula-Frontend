import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfertaAcademicaService } from '../../services/oferta-academica.service';

@Component({
  selector: 'app-oferta-academica-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './oferta-academica-form.component.html',
  styleUrls: ['./oferta-academica-form.component.scss'],
})
export class OfertaAcademicaFormComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() ofertaCreada = new EventEmitter<void>();

  oferta = {
    periodoId: '',
    periodoNombre: '',
    cursoId: '',
    cursoNombre: '',
    cursoCodigo: '',
    profesorId: '',
    profesorNombre: '',
    horario: '',
    dias: '',
    aula: '',
    cupoMaximo: 35,
  };

  // Estos datos vendrían de sus respectivos servicios
  // Por ahora usamos datos de ejemplo
  periodos = [
    { id: '1', nombre: 'I Semestre 2026' },
    { id: '2', nombre: 'II Semestre 2025' },
  ];

  cursos = [
    { id: '1', nombre: 'Programación I', codigo: 'CS-101' },
    { id: '2', nombre: 'Cálculo I', codigo: 'MAT-201' },
    { id: '3', nombre: 'Base de Datos', codigo: 'CS-301' },
    { id: '4', nombre: 'Administración I', codigo: 'ADM-101' },
    { id: '5', nombre: 'Programación II', codigo: 'CS-201' },
    { id: '6', nombre: 'Estructuras de Datos', codigo: 'CS-202' },
    { id: '7', nombre: 'Física I', codigo: 'FIS-101' },
  ];

  profesores = [
    { id: '1', nombre: 'Carlos Ramírez López' },
    { id: '2', nombre: 'María Fernández Mora' },
    { id: '3', nombre: 'José Vargas Solano' },
    { id: '4', nombre: 'Ana Jiménez Castro' },
  ];

  diasOptions = [
    'Lun - Mié',
    'Mar - Jue',
    'Lun - Mié - Vie',
    'Mar - Jue - Sáb',
    'Viernes',
    'Sábado',
  ];

  constructor(private ofertaService: OfertaAcademicaService) {}

  ngOnInit(): void {}

  onPeriodoChange(): void {
    const periodo = this.periodos.find((p) => p.id === this.oferta.periodoId);
    this.oferta.periodoNombre = periodo ? periodo.nombre : '';
  }

  onCursoChange(): void {
    const curso = this.cursos.find((c) => c.id === this.oferta.cursoId);
    this.oferta.cursoNombre = curso ? curso.nombre : '';
    this.oferta.cursoCodigo = curso ? curso.codigo : '';
  }

  onProfesorChange(): void {
    const profesor = this.profesores.find((p) => p.id === this.oferta.profesorId);
    this.oferta.profesorNombre = profesor ? profesor.nombre : '';
  }

  guardar(): void {
    if (
      !this.oferta.periodoId ||
      !this.oferta.cursoId ||
      !this.oferta.profesorId ||
      !this.oferta.horario ||
      !this.oferta.aula
    ) {
      return;
    }

    this.ofertaService.crear(this.oferta);
    this.ofertaCreada.emit();
    this.cerrar();
    this.limpiar();
  }

  cerrar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  limpiar(): void {
    this.oferta = {
      periodoId: '',
      periodoNombre: '',
      cursoId: '',
      cursoNombre: '',
      cursoCodigo: '',
      profesorId: '',
      profesorNombre: '',
      horario: '',
      dias: '',
      aula: '',
      cupoMaximo: 35,
    };
  }
}