import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortalProfesorService } from '../../services/portal-profesor.service';
import { AuthService } from '../../../estudiante/services/auth.service';
import { PerfilProfesor } from '../../models/profesor-portal.models';

@Component({
  selector: 'app-profesor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profesor-dashboard.html',
  styleUrls: ['./profesor-dashboard.scss'],
})
export class ProfesorDashboardComponent implements OnInit {
  currentDate = '';
  cargando = true;
  perfil: PerfilProfesor | null = null;

  get iniciales(): string {
    const n = this.perfil?.nombre?.charAt(0) || '';
    const a = this.perfil?.apellidoPaterno?.charAt(0) || '';
    return n + a;
  }

  get nombreCompleto(): string {
    if (!this.perfil) return '';
    return `${this.perfil.nombre} ${this.perfil.apellidoPaterno}`.trim();
  }

  constructor(
    private service: PortalProfesorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const opts: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    this.currentDate = new Date().toLocaleDateString('es-CR', opts);

    this.service.obtenerPerfil().subscribe({
      next: (res) => {
        if (!res.blnError && res.valorRetorno) {
          this.perfil = res.valorRetorno;
        }
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }
}
