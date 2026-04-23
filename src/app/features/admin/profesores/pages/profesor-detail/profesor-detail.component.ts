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
    reenviandoCredenciales = false;
    mensajeReenvio = '';
    errorReenvio = '';
  
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


  reenviarCredenciales(): void {
    if (!this.profesor || this.reenviandoCredenciales) return;
    this.reenviandoCredenciales = true;
    this.mensajeReenvio = '';
    this.errorReenvio = '';
    this.profesorService.reenviarCredenciales(this.profesor.idProfesor).subscribe({
      next: res => {
        this.reenviandoCredenciales = false;
        if (res.blnError) this.errorReenvio = res.strMensajeRespuesta;
        else this.mensajeReenvio = 'Credenciales reenviadas correctamente.';
      },
      error: () => {
        this.reenviandoCredenciales = false;
        this.errorReenvio = 'Error de conexión al reenviar credenciales.';
      }
    });
  }

  getEstadoClass(estado: boolean): string {
    return estado ? 'badge-active' : 'badge-inactive';
  }
  }








