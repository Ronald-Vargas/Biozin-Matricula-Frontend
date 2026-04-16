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

  // Modo recuperación: el usuario olvidó su contraseña y usa un código enviado al correo
  modoRecuperacion = false;
  codigoEnviado = false;
  enviandoCodigo = false;

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

    this.modoRecuperacion = this.route.snapshot.queryParamMap.get('modo') === 'recuperacion';
  }

  toggleTempPassword(): void { this.showTempPassword = !this.showTempPassword; }
  toggleNewPassword(): void { this.showNewPassword = !this.showNewPassword; }
  toggleConfirmPassword(): void { this.showConfirmPassword = !this.showConfirmPassword; }

  onEnviarCodigo(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.enviandoCodigo = true;

    this.authService.solicitarRecuperacion(this.email).subscribe({
      next: (res) => {
        this.enviandoCodigo = false;
        if (res.blnError) {
          this.errorMessage = res.strMensajeRespuesta || 'No se pudo enviar el código.';
        } else {
          this.codigoEnviado = true;
          this.successMessage = 'Se envió un código de 6 dígitos a tu correo. Expira en 15 minutos.';
        }
      },
      error: () => {
        this.enviandoCodigo = false;
        this.errorMessage = 'Error al enviar el código. Intenta de nuevo.';
      },
    });
  }

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
          this.errorMessage = res.strMensajeRespuesta || 'Código o contraseña incorrectos.';
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
