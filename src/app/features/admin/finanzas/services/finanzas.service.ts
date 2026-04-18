import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DetallePago, Respuesta, ResumenFinanzas } from '../models/finanzas.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FinanzasService {

  private apiUrl = `${environment.apiUrl}/Finanzas`;

  constructor(private http: HttpClient) {}

  getResumenPeriodoActual(): Observable<ResumenFinanzas | null> {
    return this.http.get<Respuesta<ResumenFinanzas>>(`${this.apiUrl}/ResumenPeriodoActual`).pipe(
      map(res => res.blnError ? null : res.valorRetorno)
    );
  }

  getResumenPorPeriodo(idPeriodo: number): Observable<ResumenFinanzas | null> {
    return this.http.get<Respuesta<ResumenFinanzas>>(`${this.apiUrl}/ResumenPorPeriodo/${idPeriodo}`).pipe(
      map(res => res.blnError ? null : res.valorRetorno)
    );
  }

  getDetallesPorPeriodo(idPeriodo: number): Observable<DetallePago[]> {
    return this.http.get<Respuesta<DetallePago[]>>(`${this.apiUrl}/DetallesPorPeriodo/${idPeriodo}`).pipe(
      map(res => res.blnError ? [] : (res.valorRetorno ?? []))
    );
  }

  getResumenTodosPeriodos(): Observable<ResumenFinanzas[]> {
    return this.http.get<Respuesta<ResumenFinanzas[]>>(`${this.apiUrl}/ResumenTodosPeriodos`).pipe(
      map(res => res.blnError ? [] : (res.valorRetorno ?? []))
    );
  }
}
