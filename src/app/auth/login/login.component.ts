import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../features/estudiante/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {

  email = '';
  password = '';
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  emailErrorForTempPassword = '';

  constructor(private router: Router, private authService: AuthService) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onCambiarContrasenaTemporaria(): void {
    this.emailErrorForTempPassword = '';
    if (!this.email || !this.email.trim()) {
      this.emailErrorForTempPassword = 'Ingrese su correo antes de cambiar la contraseña temporal.';
      return;
    }
    this.router.navigate(['/cambiar-contrasena-temporal'], {
      queryParams: { email: this.email.trim() },
    });
  }

  onLogin(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ Email: this.email, Contrasena: this.password }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.blnError) {
          this.errorMessage = res.strMensajeRespuesta || 'Usuario o contraseña incorrectos.';
        } else {
          const role = res.valorRetorno?.role;
          this.router.navigate(role === 'Administrador' ? ['/dashboard'] : ['/portal/inicio']);
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Usuario o contraseña incorrectos.';
      },
    });
  }
}
