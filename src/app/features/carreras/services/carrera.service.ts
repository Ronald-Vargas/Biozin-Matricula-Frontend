import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Carrera, CreateCarreraDto, Respuesta } from '../models/carrera.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CarreraService { 
  
  private apiUrl = `${environment.apiUrl}/Carrera`;
  private carrerasSubject = new BehaviorSubject<Carrera[]>([]);
  public carreras$ = this.carrerasSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarCarreras();
  }



  private cargarCarreras(): void {
  this.http.get<Respuesta<Carrera[]>>(`${this.apiUrl}/Listar`)  
    .subscribe(res => {
      if (!res.blnError) {
        this.carrerasSubject.next(res.valorRetorno || []);
      }
    });
}


  getCarreras(): Observable<Carrera[]> {
    return this.carreras$;
  }


  getCarreraById(id: number): Observable<Carrera | undefined> {
    return this.http.post<Respuesta<Carrera[]>>(`${this.apiUrl}/Obtener`, { idCarrera: id })
      .pipe(map(res => (res.blnError || !res.valorRetorno?.length) ? undefined : res.valorRetorno.find(c => c.idCarrera === id)));
  }

  createCarrera(dto: CreateCarreraDto): Observable<Respuesta<number>> {
    return this.http.post<Respuesta<number>>(`${this.apiUrl}/Insertar`, dto)
      .pipe(tap(() => this.cargarCarreras()));
  }

  updateCarrera(carrera: Carrera): Observable<Respuesta<number>> {
    return this.http.put<Respuesta<number>>(`${this.apiUrl}/Modificar`, carrera)
      .pipe(tap(() => this.cargarCarreras()));
  }


  toggleEstado(id: number): void {
    const carreras = this.carrerasSubject.getValue();
    const carrera = carreras.find(c => c.idCarrera === id);
    if (carrera) {
      const updated = { ...carrera, estado: !carrera.estado };
      this.updateCarrera(updated).subscribe();
    }
  }

  getCarrerasActivas(): Carrera[] {
    return this.carrerasSubject.getValue().filter(c => c.estado === true);
  }
}