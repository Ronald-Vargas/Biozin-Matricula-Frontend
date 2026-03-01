import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Curso, CreateCursoDto, Respuesta } from '../models/curso.model';
import { environment } from '../../../environments/environment';

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
    .subscribe(res => {
      if (!res.blnError) {
        this.cursosSubject.next(res.valorRetorno || []);
      }
    });
}


  getCursos(): Observable<Curso[]> {
    return this.cursos$;
  }


  getCursoById(id: number): Observable<Curso | undefined> {
    return this.http.post<Respuesta<Curso[]>>(`${this.apiUrl}/Obtener`, { idCurso: id })
      .pipe(map(res => (res.blnError || !res.valorRetorno?.length) ? undefined : res.valorRetorno[0]));
  }

  createCurso(dto: CreateCursoDto): Observable<Respuesta<number>> {
    return this.http.post<Respuesta<number>>(`${this.apiUrl}/Insertar`, dto)
      .pipe(tap(() => this.cargarCursos()));
  }

  updateCurso(curso: Curso): Observable<Respuesta<number>> {
    return this.http.put<Respuesta<number>>(`${this.apiUrl}/Modificar`, curso)
      .pipe(tap(() => this.cargarCursos()));
  }


  toggleEstado(id: number): void {
    const cursos = this.cursosSubject.getValue();
    const curso = cursos.find(c => c.idCurso === id);
    if (curso) {
      const updated = { ...curso, estado: !curso.estado };
      this.updateCurso(updated).subscribe();
    }
  }

  getCursosActivos(): Curso[] {
    return this.cursosSubject.getValue().filter(c => c.estado === true);
  }
}