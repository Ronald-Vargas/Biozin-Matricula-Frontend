import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../features/estudiante/services/auth.service';

@Component({
  selector: 'app-change-temp-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-temp-password.html',
  styleUrl: './change-temp-password.scss',
})
export class ChangeTempPasswordComponent implements OnInit {

  email = '';
  contrasenaTemporal = '';
  nuevaContrasena = '';
  confirmarContrasena = '';

  showTempPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const raw = this.route.snapshot.queryParamMap.get('email') ?? '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.email = emailRegex.test(raw) ? raw : '';
    if (!this.email) {
      this.errorMessage = 'Enlace inválido. Por favor inicie sesión nuevamente.';
    }
  }

  toggleTempPassword(): void { this.showTempPassword = !this.showTempPassword; }
  toggleNewPassword(): void { this.showNewPassword = !this.showNewPassword; }
  toggleConfirmPassword(): void { this.showConfirmPassword = !this.showConfirmPassword; }

  onCambiarContrasena(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.contrasenaTemporal || !this.nuevaContrasena || !this.confirmarContrasena) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.errorMessage = 'La nueva contraseña y la confirmación no coinciden.';
      return;
    }

    this.isLoading = true;

    this.authService.cambiarContrasenaTemporaria({
      email: this.email,
      contrasenaTemporal: this.contrasenaTemporal,
      nuevaContrasena: this.nuevaContrasena,
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.blnError) {
          this.errorMessage = res.strMensajeRespuesta || 'Contraseña actual incorrecta o error al cambiar la contraseña.';
        } else {
          this.successMessage = 'Contraseña actualizada correctamente. Redirigiendo...';
          setTimeout(() => this.router.navigate(['/']), 2000);
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Ocurrió un error al cambiar la contraseña.';
      },
    });
  }

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }
}
