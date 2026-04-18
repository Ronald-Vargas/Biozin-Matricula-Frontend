import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Curso, CreateCursoDto, Respuesta } from '../models/curso.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CursoService { 
  
  private apiUrl = `${environment.apiUrl}/Curso`;
  private cursosSubject = new BehaviorSubject<Curso[]>([]);
  public cursos$ = this.cursosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarCursos();
  }



  private cargarCursos(): void {
    this.http.get<Respuesta<Curso[]>>(`${this.apiUrl}/Listar`)
      .subscribe({
        next: res => {
          if (!res.blnError) {
            this.cursosSubject.next(res.valorRetorno || []);
          }
        },
        error: () => {
          this.cursosSubject.next([]);
        }
      });
  }


  getCursos(): Observable<Curso[]> {
    return this.cursos$;
  }


  getCursoById(id: number): Observable<Curso | undefined> {
    return this.http.post<Respuesta<Curso[]>>(`${this.apiUrl}/Obtener`, { idCurso: id })
      .pipe(map(res => (res.blnError || !res.valorRetorno?.length) ? undefined : res.valorRetorno.find(c => c.idCurso === id)));
  }

  createCurso(dto: CreateCursoDto): Observable<Respuesta<number>> {
    return this.http.post<Respuesta<number>>(`${this.apiUrl}/Insertar`, dto)
      .pipe(tap(() => this.cargarCursos()));
  }

  updateCurso(curso: Curso): Observable<Respuesta<number>> {
    return this.http.put<Respuesta<number>>(`${this.apiUrl}/Modificar`, curso)
      .pipe(tap(() => this.cargarCursos()));
  }



  toggleEstado(id: number): Observable<Respuesta<number>> {
    const curso = this.cursosSubject.getValue().find(c => c.idCurso === id);
    const updated = { ...curso!, estado: !curso!.estado };
    return this.updateCurso(updated);
  }

  getCursosActivos(): Observable<Curso[]> {
    return this.cursos$.pipe(map(cursos => cursos.filter(c => c.estado === true)));
  }
}
