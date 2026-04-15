import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Aula, CreateAulaDto, Respuesta } from '../models/aula.model';
import { environment } from '../../../../environments/environment';

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
      .subscribe({
        next: res => {
          if (!res.blnError) {
            this.aulasSubject.next(res.valorRetorno || []);
          }
        },
        error: () => {
          this.aulasSubject.next([]);
        }
      });
  }

  getAulas(): Observable<Aula[]> {
    return this.aulas$;
  }

  getAulasActivas(): Observable<Aula[]> {
    return this.aulas$.pipe(map(aulas => aulas.filter(a => a.activo)));
  }

  createAula(dto: CreateAulaDto): Observable<Respuesta<number>> {
    return this.http.post<Respuesta<number>>(`${this.apiUrl}/Insertar`, dto)
      .pipe(tap(() => this.cargarAulas()));
  }

  updateAula(aula: Aula): Observable<Respuesta<number>> {
    return this.http.put<Respuesta<number>>(`${this.apiUrl}/Modificar`, aula)
      .pipe(tap(() => this.cargarAulas()));
  }

  
  toggleEstado(id: number): void {
    const aulas = this.aulasSubject.getValue();
    const aula = aulas.find(c => c.idAula === id);
    if (aula) {
      const updated = { ...aula, activo: !aula.activo };
      this.updateAula(updated).subscribe({
        error: () => {
          this.cargarAulas();
        }
      });
    }
  }
}

