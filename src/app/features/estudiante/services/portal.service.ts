import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  EstudiantePerfil,
  OfertaMatricula,
  SemestreHistorial,
  Pago,
  Respuesta,
} from '../models/portal.models';

@Injectable({ providedIn: 'root' })
export class PortalService {

  private apiUrl = `${environment.apiUrl}/PortalEstudiante`;

  constructor(private http: HttpClient) {}

  getPerfil(): Observable<Respuesta<EstudiantePerfil>> {
    return this.http.get<Respuesta<EstudiantePerfil>>(`${this.apiUrl}/Perfil`);
  }

  getOfertas(): Observable<Respuesta<OfertaMatricula[]>> {
    return this.http.get<Respuesta<OfertaMatricula[]>>(`${this.apiUrl}/Matricular/Ofertas`);
  }

  matricular(idOferta: number): Observable<Respuesta<number>> {
    return this.http.post<Respuesta<number>>(`${this.apiUrl}/Matricular`, { idOferta });
  }

  getHistorial(): Observable<Respuesta<SemestreHistorial[]>> {
    return this.http.get<Respuesta<SemestreHistorial[]>>(`${this.apiUrl}/Historial`);
  }

  getPagos(): Observable<Respuesta<Pago[]>> {
    return this.http.get<Respuesta<Pago[]>>(`${this.apiUrl}/Pagos`);
  }

  pagar(idPago: number): Observable<Respuesta<number>> {
    return this.http.post<Respuesta<number>>(`${this.apiUrl}/Pagos/Pagar/${idPago}`, {});
  }
}
