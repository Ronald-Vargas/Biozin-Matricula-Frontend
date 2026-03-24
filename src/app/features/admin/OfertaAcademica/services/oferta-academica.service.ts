import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { OfertaAcademica, CreateOfertaDto, UpdateOfertaDto, Respuesta } from '../models/oferta-academica.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OfertaAcademicaService {

  private apiUrl = `${environment.apiUrl}/OfertaAcademica`;
  private ofertasSubject = new BehaviorSubject<OfertaAcademica[]>([]);
  public ofertas$ = this.ofertasSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarOfertas();
  }

  private cargarOfertas(): void {
    this.http.get<Respuesta<OfertaAcademica[]>>(`${this.apiUrl}/Listar`)
      .subscribe(res => {
        if (!res.blnError) {
          this.ofertasSubject.next(res.valorRetorno || []);
        }
      });
  }

  getAll(): Observable<OfertaAcademica[]> {
    return this.ofertas$;
  }

  getById(id: number): Observable<Respuesta<OfertaAcademica>> {
    return this.http.get<Respuesta<OfertaAcademica>>(`${this.apiUrl}/ObtenerPorId/${id}`);
  }

  crear(dto: CreateOfertaDto): Observable<Respuesta<number>> {
    return this.http.post<Respuesta<number>>(`${this.apiUrl}/Insertar`, dto)
      .pipe(tap(() => this.cargarOfertas()));
  }

  updateOferta(oferta: OfertaAcademica): Observable<Respuesta<number>> {
      return this.http.put<Respuesta<number>>(`${this.apiUrl}/Modificar`, oferta)
        .pipe(tap(() => this.cargarOfertas()));
    }


  eliminar(id: number): Observable<Respuesta<boolean>> {
    return this.http.delete<Respuesta<boolean>>(`${this.apiUrl}/Eliminar/${id}`)
      .pipe(tap(() => this.cargarOfertas()));
  }

  toggleEstado(id: number): void {
    const ofertas = this.ofertasSubject.getValue();
    const oferta = ofertas.find(c => c.idOferta === id);
    if (oferta) {
      const updated = { ...oferta, estado: !oferta.estado };
      this.updateOferta(updated).subscribe();
    }
  }

}

