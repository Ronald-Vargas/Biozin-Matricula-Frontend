import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  EstudiantePerfil,
  PeriodoOfertas,
  SemestreHistorial,
  Pago,
  Respuesta,
  MatricularBulkRequest,
} from '../models/portal.models';


@Injectable({ providedIn: 'root' })
export class PortalService {

  private apiUrl = `${environment.apiUrl}/PortalEstudiante`;

  constructor(private http: HttpClient) {}

  getPerfil(): Observable<Respuesta<EstudiantePerfil>> {
    return this.http.get<Respuesta<EstudiantePerfil>>(`${this.apiUrl}/Perfil`);
  }

  getOfertas(): Observable<Respuesta<PeriodoOfertas>> {
    return this.http.get<Respuesta<PeriodoOfertas>>(`${this.apiUrl}/Matricular/Ofertas`);
  }

  matricular(idOferta: number): Observable<Respuesta<number>> {
    return this.http.post<Respuesta<number>>(`${this.apiUrl}/Matricular`, { idOferta });
  }

  matricularBulk(solicitud: MatricularBulkRequest): Observable<Respuesta<boolean>> {
    return this.http.post<Respuesta<boolean>>(`${this.apiUrl}/MatricularBulk`, solicitud);
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
