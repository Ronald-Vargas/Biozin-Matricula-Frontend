import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Profesor, CreateProfesorDto, Respuesta } from '../models/profesores.model';
import { environment } from '../../../../environments/environment';

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
      .subscribe({
        next: res => {
          if (!res.blnError) {
            this.profesoresSubject.next(res.valorRetorno || []);
          }
        },
        error: () => {
          this.profesoresSubject.next([]);
        }
      });
  }


  getProfesores(): Observable<Profesor[]> {
    return this.profesores$;
  }


  getProfesorById(id: number): Observable<Profesor | undefined> {
    return this.http.post<Respuesta<Profesor[]>>(`${this.apiUrl}/Obtener`, { idProfesor: id })
      .pipe(map(res => (res.blnError || !res.valorRetorno?.length) ? undefined : res.valorRetorno.find(c => c.idProfesor === id)));
  }

  createProfesor(dto: CreateProfesorDto): Observable<Respuesta<number>> {
    return this.http.post<Respuesta<number>>(`${this.apiUrl}/Insertar`, dto)
      .pipe(tap(() => this.cargarProfesores()));
  }

  updateProfesor(profesor: Profesor): Observable<Respuesta<number>> {
    return this.http.put<Respuesta<number>>(`${this.apiUrl}/Modificar`, profesor)
      .pipe(tap(() => this.cargarProfesores()));
  }

  toggleEstado(id: number): Observable<Respuesta<number>> {
    const profesor = this.profesoresSubject.getValue().find(c => c.idProfesor === id);
    const updated = { ...profesor!, estado: !profesor!.estado };
    return this.updateProfesor(updated);
  }

  getProfesoresActivos(): Observable<Profesor[]> {
    return this.profesores$.pipe(map(profesores => profesores.filter(c => c.estado === true)));
  }

  reenviarCredenciales(idProfesor: number): Observable<Respuesta<object>> {
    return this.http.post<Respuesta<object>>(`${this.apiUrl}/ReenviarCredenciales/${idProfesor}`, {});
  }

}
