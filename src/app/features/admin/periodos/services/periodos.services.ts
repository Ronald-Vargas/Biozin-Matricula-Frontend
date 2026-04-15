import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Periodo, CreatePeriodoDto, Respuesta } from '../models/periodos.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})


export class PeriodoService { 
  

  private apiUrl = `${environment.apiUrl}/Periodo`;
  private periodosSubject = new BehaviorSubject<Periodo[]>([]);
  public periodos$ = this.periodosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarPeriodos();
  }



  private cargarPeriodos(): void {
    this.http.get<Respuesta<Periodo[]>>(`${this.apiUrl}/Listar`)
      .subscribe({
        next: res => {
          if (!res.blnError) {
            this.periodosSubject.next(res.valorRetorno || []);
          }
        },
        error: () => {
          this.periodosSubject.next([]);
        }
      });
  }


  getPeriodos(): Observable<Periodo[]> {
    return this.periodos$;
  }


  getPeriodoById(id: number): Observable<Periodo | undefined> {
    return this.http.post<Respuesta<Periodo[]>>(`${this.apiUrl}/Obtener`, { idPeriodo: id })
      .pipe(map(res => (res.blnError || !res.valorRetorno?.length) ? undefined : res.valorRetorno.find(c => c.idPeriodo === id)));
  }

  createPeriodo(dto: CreatePeriodoDto): Observable<Respuesta<number>> {
    return this.http.post<Respuesta<number>>(`${this.apiUrl}/Insertar`, dto)
      .pipe(tap(() => this.cargarPeriodos()));
  }

  updatePeriodo(periodo: Periodo): Observable<Respuesta<number>> {
    return this.http.put<Respuesta<number>>(`${this.apiUrl}/Modificar`, periodo)
      .pipe(tap(() => this.cargarPeriodos()));
  }

  toggleEstado(id: number): void {
    const periodos = this.periodosSubject.getValue();
    const periodo = periodos.find(c => c.idPeriodo === id);
    if (periodo) {
      const updated = { ...periodo, estadoMatricula: !periodo.estadoMatricula };
      this.updatePeriodo(updated).subscribe({
        error: () => {
          this.cargarPeriodos();
        }
      });
    }
  }

  getPeriodosActivos():  Observable<Periodo[]> {
    return this.periodos$.pipe(map(periodos => periodos.filter(p => p.estadoMatricula)));
  }

}