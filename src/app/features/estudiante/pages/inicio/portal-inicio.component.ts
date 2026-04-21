import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortalService } from '../../services/portal.service';
import { AuthService } from '../../services/auth.service';
import { CarreraResumenPortal, EstudiantePerfil } from '../../models/portal.models';

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
  cargandoCreditos = false;
  estudiante: EstudiantePerfil | null = null;

  carreras: CarreraResumenPortal[] = [];
  carreraSeleccionada: CarreraResumenPortal | null = null;
  creditosAprobadosCarrera = 0;
  creditosTotalesCarrera = 0;

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
    {
      icon: '🗺️',
      title: 'Malla Curricular',
      description: 'Consulta los cursos pendientes de tu carrera',
      route: '/portal/malla',
      color: '#8b5cf6',
    },
  ];

  get iniciales(): string {
    const nombre = this.estudiante?.nombre?.charAt(0) || '';
    const apellido = this.estudiante?.apellidoPaterno?.charAt(0) || '';
    return nombre + apellido;
  }

  get primerNombre(): string {
    return this.estudiante?.nombre || '';
  }

  get progresoCreditos(): number {
    if (!this.creditosAprobadosCarrera || !this.creditosTotalesCarrera) return 0;
    return Math.round((this.creditosAprobadosCarrera / this.creditosTotalesCarrera) * 100);
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

    this.estudiante = this.authService.getPerfil();
    this.carreras = this.estudiante?.carreras ?? [];
    this.cargando = false;

    if (this.carreras.length > 0) {
      this.seleccionarCarrera(this.carreras[0]);
    }

    this.portalService.getPerfil().subscribe({
      next: (res) => {
        if (!res.blnError && res.valorRetorno) {
          this.estudiante = res.valorRetorno;
          this.authService.setSession(this.authService.getToken()!, res.valorRetorno);
          this.carreras = this.estudiante.carreras ?? [];
          if (this.carreras.length > 0 && !this.carreraSeleccionada) {
            this.seleccionarCarrera(this.carreras[0]);
          }
        }
      },
    });
  }

  seleccionarCarrera(carrera: CarreraResumenPortal): void {
    if (this.carreraSeleccionada?.idCarrera === carrera.idCarrera) return;
    this.carreraSeleccionada = carrera;
    this.cargandoCreditos = true;
    this.portalService.getMalla(carrera.idCarrera).subscribe({
      next: (res) => {
        this.cargandoCreditos = false;
        if (!res.blnError && res.valorRetorno) {
          this.creditosAprobadosCarrera = res.valorRetorno.creditosAprobados;
          this.creditosTotalesCarrera = res.valorRetorno.totalCreditos;
        }
      },
      error: () => { this.cargandoCreditos = false; },
    });
  }
}
