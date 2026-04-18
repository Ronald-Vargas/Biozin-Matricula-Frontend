import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AsignarNotaRequest, EstudianteEnCurso, OfertaProfesor, PerfilProfesor } from '../models/profesor-portal.models';
import { Respuesta } from '../../estudiante/models/portal.models';

@Injectable({ providedIn: 'root' })
export class PortalProfesorService {
  private readonly base = `${environment.apiUrl}/PortalProfesor`;

  constructor(private http: HttpClient) {}

  obtenerPerfil(): Observable<Respuesta<PerfilProfesor>> {
    return this.http.get<Respuesta<PerfilProfesor>>(`${this.base}/Perfil`);
  }

  obtenerMisCursos(): Observable<Respuesta<OfertaProfesor[]>> {
    return this.http.get<Respuesta<OfertaProfesor[]>>(`${this.base}/MisCursos`);
  }

  obtenerEstudiantesCurso(idOferta: number): Observable<Respuesta<EstudianteEnCurso[]>> {
    return this.http.get<Respuesta<EstudianteEnCurso[]>>(`${this.base}/Cursos/${idOferta}/Estudiantes`);
  }

  asignarNota(solicitud: AsignarNotaRequest): Observable<Respuesta<boolean>> {
    return this.http.put<Respuesta<boolean>>(`${this.base}/AsignarNota`, solicitud);
  }
}
