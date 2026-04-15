import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Administrador, CreateAdministradorDto, Respuesta } from '../model/administrados.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdministradorService {

  private apiUrl = `${environment.apiUrl}/Administrador`;
  private administradoresSubject = new BehaviorSubject<Administrador[]>([]);
  public administradores$ = this.administradoresSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarAdministradores();
  }

  cargarAdministradores(): void {
    this.http.get<Respuesta<Administrador[]>>(`${this.apiUrl}/Listar`)
      .subscribe({
        next: res => {
          if (!res.blnError) {
            this.administradoresSubject.next(res.valorRetorno || []);
          }
        },
        error: () => {
          this.administradoresSubject.next([]);
        }
      });
  }

  insertar(admin: CreateAdministradorDto): Observable<Respuesta<number>> {
    return this.http.post<Respuesta<number>>(`${this.apiUrl}/Insertar`, admin)
      .pipe(tap(() => this.cargarAdministradores()));
  }

  modificar(admin: Administrador): Observable<Respuesta<number>> {
    return this.http.put<Respuesta<number>>(`${this.apiUrl}/Modificar`, admin)
      .pipe(tap(() => this.cargarAdministradores()));
  }

  eliminar(id: number): Observable<Respuesta<number>> {
    return this.http.delete<Respuesta<number>>(`${this.apiUrl}/Eliminar/${id}`)
      .pipe(tap(() => this.cargarAdministradores()));
  }

  toggleEstado(id: number): void {
    const admins = this.administradoresSubject.getValue();
    const admin = admins.find(a => a.idAdministrador === id);
    if (admin) {
      const updated = { ...admin, activo: !admin.activo };
      this.modificar(updated).subscribe({
        error: () => {
          this.cargarAdministradores();
        }
      });
    }
  }
}
