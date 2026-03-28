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
      .subscribe(res => {
        if (!res.blnError) {
          this.administradoresSubject.next(res.valorRetorno || []);
        }
      });
  }

  insertar(admin: CreateAdministradorDto): Observable<Respuesta<number>> {
    return this.http.post<Respuesta<number>>(`${this.apiUrl}/Insertar`, admin)
      .pipe(tap(() => this.cargarAdministradores()));
  }

  eliminar(id: number): Observable<Respuesta<number>> {
    return this.http.delete<Respuesta<number>>(`${this.apiUrl}/Eliminar/${id}`)
      .pipe(tap(() => this.cargarAdministradores()));
  }
}
