import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { CreateEstudianteDto, Estudiante, Respuesta } from '../models/estudiantes.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})


export class EstudianteService {
  

  private apiUrl = `${environment.apiUrl}/Estudiante`;
  private estudiantesSubject = new BehaviorSubject<Estudiante[]>([]);
  public estudiantes$ = this.estudiantesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarEstudiantes();
  }



  private cargarEstudiantes(): void {
  this.http.get<Respuesta<Estudiante[]>>(`${this.apiUrl}/Listar`)  
    .subscribe(res => {
      if (!res.blnError) {
        this.estudiantesSubject.next(res.valorRetorno || []);
      }
    });
}

  getEstudiantes(): Observable<Estudiante[]> {
    return this.estudiantes$;
  }


  getEstudianteById(id: number): Observable<Estudiante | undefined> {
    return this.http.post<Respuesta<Estudiante[]>>(`${this.apiUrl}/Obtener`, { idProfesor: id })
          .pipe(map(res => (res.blnError || !res.valorRetorno?.length) ? undefined : res.valorRetorno.find(c => c.idEstudiante === id)));
  }

  createEstudiante(dto: CreateEstudianteDto): Observable<Respuesta<number>> {
    return this.http.post<Respuesta<number>>(`${this.apiUrl}/Insertar`, dto)
      .pipe(tap(() => this.cargarEstudiantes()));
  }

  updateEstudiante(estudiante: Estudiante): Observable<Respuesta<number>> {
    return this.http.put<Respuesta<number>>(`${this.apiUrl}/Modificar`, estudiante)
      .pipe(tap(() => this.cargarEstudiantes()));
  }

  toggleEstado(id: number): void {
    const estudiantes = this.estudiantesSubject.getValue();
    const estudiante = estudiantes.find(c => c.idEstudiante === id);
    if (estudiante) {
      const updated = { ...estudiante, estadoEstudiante: !estudiante.estadoEstudiante };
      this.updateEstudiante(updated).subscribe();
    }
  }

  getEstudiantesActivos(): Estudiante[] {
    return this.estudiantesSubject.getValue().filter(c => c.estadoEstudiante === true);
  }
}