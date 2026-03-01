import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Profesor, CreateProfesorDto, Respuesta } from '../models/profesores.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})


export class ProfesorService { 
  

  private apiUrl = `${environment.apiUrl}/Profesor`;
  private profesoresSubject = new BehaviorSubject<Profesor[]>([]);
  public profesores$ = this.profesoresSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarProfesores();
  }



  private cargarProfesores(): void {
  this.http.get<Respuesta<Profesor[]>>(`${this.apiUrl}/Listar`)  
    .subscribe(res => {
      if (!res.blnError) {
        this.profesoresSubject.next(res.valorRetorno || []);
      }
    });
}


  getProfesores(): Observable<Profesor[]> {
    return this.profesores$;
  }


  getProfesorById(id: number): Observable<Profesor | undefined> {
    return this.http.post<Respuesta<Profesor[]>>(`${this.apiUrl}/Obtener`, { idProfesor: id, estado: '' })
      .pipe(map(res => (res.blnError || !res.valorRetorno?.length) ? undefined : res.valorRetorno[0]));
  }

  createProfesor(dto: CreateProfesorDto): Observable<Respuesta<number>> {
    return this.http.post<Respuesta<number>>(`${this.apiUrl}/Insertar`, dto)
      .pipe(tap(() => this.cargarProfesores()));
  }

  updateProfesor(profesor: Profesor): Observable<Respuesta<number>> {
    return this.http.put<Respuesta<number>>(`${this.apiUrl}/Modificar`, profesor)
      .pipe(tap(() => this.cargarProfesores()));
  }

  toggleEstado(id: number): void {
    const profesores = this.profesoresSubject.getValue();
    const profesor = profesores.find(c => c.idProfesor === id);
    if (profesor) {
      const updated = { ...profesor, estado: profesor.estado === 'Activo' ? 'Inactivo' : 'Activo' };
      this.updateProfesor(updated).subscribe();
    }
  }

  getProfesoresActivos(): Profesor[] {
    return this.profesoresSubject.getValue().filter(c => c.estado === "activo");
  }
}