import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Aula, CreateAulaDto, Respuesta } from '../models/aula.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AulaService {

  private apiUrl = `${environment.apiUrl}/Aula`;
  private aulasSubject = new BehaviorSubject<Aula[]>([]);
  public aulas$ = this.aulasSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarAulas();
  }

  private cargarAulas(): void {
    this.http.get<Respuesta<Aula[]>>(`${this.apiUrl}/Listar`)
      .subscribe(res => {
        if (!res.blnError) {
          this.aulasSubject.next(res.valorRetorno || []);
        }
      });
  }

  getAulas(): Observable<Aula[]> {
    return this.aulas$;
  }

  createAula(dto: CreateAulaDto): Observable<Respuesta<number>> {
    return this.http.post<Respuesta<number>>(`${this.apiUrl}/Insertar`, dto)
      .pipe(tap(() => this.cargarAulas()));
  }

  updateAula(aula: Aula): Observable<Respuesta<number>> {
    return this.http.put<Respuesta<number>>(`${this.apiUrl}/Modificar`, aula)
      .pipe(tap(() => this.cargarAulas()));
  }

  deleteAula(id: number): Observable<Respuesta<boolean>> {
    return this.http.delete<Respuesta<boolean>>(`${this.apiUrl}/Eliminar/${id}`)
      .pipe(tap(() => this.cargarAulas()));
  }
}
