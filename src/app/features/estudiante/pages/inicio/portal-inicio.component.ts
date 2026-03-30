import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortalService } from '../../services/portal.service';
import { AuthService } from '../../services/auth.service';
import { EstudiantePerfil } from '../../models/portal.models';

interface AccionRapida {
  icon: string;
  title: string;
  description: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-portal-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './portal-inicio.html',
  styleUrls: ['./portal-inicio.scss'],
})
export class PortalInicioComponent implements OnInit {

  currentDate = '';
  cargando = true;
  estudiante: EstudiantePerfil | null = null;

  accionesRapidas: AccionRapida[] = [
    {
      icon: '📝',
      title: 'Matricular Cursos',
      description: 'Añade nuevas materias al período actual',
      route: '/portal/matricular',
      color: '#06b6d4',
    },
    {
      icon: '💳',
      title: 'Realizar Pago',
      description: 'Consulta y cancela tus cuotas pendientes',
      route: '/portal/pagos',
      color: '#10b981',
    },
    {
      icon: '📊',
      title: 'Ver Historial',
      description: 'Revisa tu historial académico completo',
      route: '/portal/historial',
      color: '#f59e0b',
    },
  ];

  get iniciales(): string {
    const parts = (this.estudiante?.nombreCompleto || '').split(' ');
    return (parts[0]?.charAt(0) || '') + (parts[1]?.charAt(0) || '');
  }

  get primerNombre(): string {
    return this.estudiante?.nombreCompleto?.split(' ')[0] || '';
  }

  get progresoCreditos(): number {
    if (!this.estudiante) return 0;
    return Math.round((this.estudiante.creditosAprobados / this.estudiante.creditosTotales) * 100);
  }

  constructor(private portalService: PortalService, private authService: AuthService) {}

  ngOnInit(): void {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    this.currentDate = new Date().toLocaleDateString('es-CR', options);

    // Use cached perfil first, then refresh from API
    this.estudiante = this.authService.getPerfil();
    this.cargando = false;

    this.portalService.getPerfil().subscribe({
      next: (res) => {
        if (!res.blnError && res.valorRetorno) {
          this.estudiante = res.valorRetorno;
          this.authService.setSession(this.authService.getToken()!, res.valorRetorno);
        }
      },
    });
  }
}
