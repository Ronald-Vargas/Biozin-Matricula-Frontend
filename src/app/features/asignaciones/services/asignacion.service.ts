import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Asignacion, CreateAsignacionDto, Respuesta } from '../models/asignacion.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {

  private apiUrl = `${environment.apiUrl}/Asignacion`;
  private asignacionesSubject = new BehaviorSubject<Asignacion[]>([]);
  public asignaciones$ = this.asignacionesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarAsignaciones();
  }

  

  private cargarAsignaciones(): void {
    this.http.get<Respuesta<Asignacion[]>>(`${this.apiUrl}/Listar`)
      .subscribe(res => {
        if (!res.blnError) {
          this.asignacionesSubject.next(res.valorRetorno || []);
        }
      });
  }

  getAsignaciones(): Observable<Asignacion[]> {
    return this.asignaciones$;
  }

  getAsignacionesByCarrera(idCarrera: number): Observable<Asignacion[]> {
    return this.http.post<Respuesta<Asignacion[]>>(`${this.apiUrl}/ObtenerPorCarrera`, { idCarrera })
      .pipe(map(res => (!res.blnError && res.valorRetorno) ? res.valorRetorno : []));
  }

  createAsignacion(dto: CreateAsignacionDto): Observable<Respuesta<number>> {
    return this.http.post<Respuesta<number>>(`${this.apiUrl}/Insertar`, dto)
      .pipe(tap(() => this.cargarAsignaciones()));
  }

  createMultipleAsignaciones(idCarrera: number, asignaciones: CreateAsignacionDto[]): Observable<Respuesta<number>> {
    return this.http.post<Respuesta<number>>(`${this.apiUrl}/InsertarMultiple`, { idCarrera, asignaciones })
      .pipe(tap(() => this.cargarAsignaciones()));
  }

  updateAsignacion(asignacion: Asignacion): Observable<Respuesta<number>> {
    return this.http.put<Respuesta<number>>(`${this.apiUrl}/Modificar`, asignacion)
      .pipe(tap(() => this.cargarAsignaciones()));
  }

  deleteAsignacion(idAsignacion: number): Observable<Respuesta<number>> {
    return this.http.put<Respuesta<number>>(`${this.apiUrl}/Eliminar`, { idAsignacion })
      .pipe(tap(() => this.cargarAsignaciones()));
  }

  deleteAsignacionesByCarrera(idCarrera: number): Observable<Respuesta<number>> {
    return this.http.put<Respuesta<number>>(`${this.apiUrl}/EliminarPorCarrera`, { idCarrera })
      .pipe(tap(() => this.cargarAsignaciones()));
  }
}
