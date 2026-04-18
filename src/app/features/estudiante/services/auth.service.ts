import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminPerfil, AuthRespuesta, CambiarContrasenaTemporariaRequest, EstudiantePerfil, LoginRequest, ProfesorPerfil, Respuesta } from '../models/portal.models';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';
  private readonly PERFIL_KEY = 'auth_perfil';
  private readonly ROLE_KEY = 'auth_role';
  private readonly ADMIN_PERFIL_KEY = 'auth_admin_perfil';
  private readonly PROFESOR_PERFIL_KEY = 'auth_profesor_perfil';

  private apiUrl = `${environment.apiUrl}/Auth/Login`;

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<Respuesta<AuthRespuesta>> {
    return this.http.post<Respuesta<AuthRespuesta>>(this.apiUrl, request).pipe(
      tap(res => {
        if (!res.blnError && res.valorRetorno) {
          const data = res.valorRetorno;
          localStorage.setItem(this.TOKEN_KEY, data.token);
          const role = data.role === 'Administrador' ? 'admin' : data.role === 'Profesor' ? 'profesor' : 'estudiante';
          localStorage.setItem(this.ROLE_KEY, role);

          if (data.role === 'Administrador') {
            const adminPerfil: AdminPerfil = {
              idAdministrador: data.id,
              nombreCompleto: data.nombre,
              emailInstitucional: data.email,
            };
            localStorage.setItem(this.ADMIN_PERFIL_KEY, JSON.stringify(adminPerfil));
          } else if (data.role === 'Profesor') {
            const profesorPerfil: ProfesorPerfil = {
              idProfesor: data.id,
              nombreCompleto: data.nombre,
              emailInstitucional: data.email,
            };
            localStorage.setItem(this.PROFESOR_PERFIL_KEY, JSON.stringify(profesorPerfil));
          }
        }
      })
    );
  }

  // Mantiene compatibilidad con portal-inicio que refresca el perfil desde la API
  setSession(token: string, perfil: EstudiantePerfil): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.PERFIL_KEY, JSON.stringify(perfil));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.PERFIL_KEY);
    localStorage.removeItem(this.ADMIN_PERFIL_KEY);
    localStorage.removeItem(this.PROFESOR_PERFIL_KEY);
    localStorage.removeItem(this.ROLE_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getPerfil(): EstudiantePerfil | null {
    const raw = localStorage.getItem(this.PERFIL_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  getAdminPerfil(): AdminPerfil | null {
    const raw = localStorage.getItem(this.ADMIN_PERFIL_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  getProfesorPerfil(): ProfesorPerfil | null {
    const raw = localStorage.getItem(this.PROFESOR_PERFIL_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  getRole(): 'admin' | 'estudiante' | 'profesor' | null {
    return localStorage.getItem(this.ROLE_KEY) as 'admin' | 'estudiante' | 'profesor' | null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  cambiarContrasenaTemporaria(request: CambiarContrasenaTemporariaRequest): Observable<Respuesta<null>> {
    return this.http.post<Respuesta<null>>(`${environment.apiUrl}/Auth/CambiarContrasenaTemporaria`, request);
  }

  solicitarRecuperacion(email: string): Observable<Respuesta<null>> {
    return this.http.post<Respuesta<null>>(`${environment.apiUrl}/Auth/SolicitarRecuperacion`, { email });
  }
}
