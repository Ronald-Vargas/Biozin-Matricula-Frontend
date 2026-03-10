import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Profesor } from '../../models/profesores.model';
import { CommonModule } from '@angular/common';
import { ProfesorService } from '../../services/profesores.services';

@Component({
  selector: 'app-profesor-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profesor-detail.html',
  styleUrl: './profesor-detail.scss',
})
export class ProfesorDetailComponent implements OnInit {

    profesor?: Profesor;
    cargando = true;
    error = false;
  
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private profesorService: ProfesorService
    ) {}
  
    ngOnInit(): void {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.profesorService.getProfesorById(id).subscribe({
        next: (profesor) => {
          this.profesor = profesor;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al obtener profesor:', err);
          this.cargando = false;
          this.error = true;
        }
      });
    }
  
    volver(): void {
      this.router.navigate(['/profesores']);
    }

    editarProfesor(): void {
      if (this.profesor) {
        this.router.navigate(['/profesores/editar', this.profesor.idProfesor]);
      }
    }


    getIniciales(): string {
    if (!this.profesor) return '';
    return (this.profesor.nombre.charAt(0) + this.profesor.apellidoPaterno.charAt(0)).toUpperCase();
  }

  getNombreCompleto(): string {
    if (!this.profesor) return '';
    const p = this.profesor;
    return `${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno || ''}`.trim();
  }


  getEstadoClass(): string {
    if (!this.profesor) return '';
    switch (this.profesor.estado) {
      case true:  return 'badge-success';
      case false: return 'badge-warning';
      default:    return 'badge-primary';
    }
  }









  }
