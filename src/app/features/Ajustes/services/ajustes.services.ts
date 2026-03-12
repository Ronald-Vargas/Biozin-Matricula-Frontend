import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Ajustes, Respuesta } from '../model/ajustes.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AjustesService {

  private apiUrl = `${environment.apiUrl}/Ajustes`;
  private AjustesSubject = new BehaviorSubject<Ajustes[]>([]);
  public ajustes$ = this.AjustesSubject.asObservable();


   constructor(private http: HttpClient) {
    this.cargarAjustes();
  }



  private cargarAjustes(): void {
    this.http.get<Respuesta<Ajustes[]>>(`${this.apiUrl}/Listar`)
      .subscribe(res => {
        if (!res.blnError) {
          this.AjustesSubject.next(res.valorRetorno || []);
        }
      });
  }

  cargasAjustes(): Observable<Respuesta<Ajustes>> {
    return this.http.get<Respuesta<Ajustes>>(`${this.apiUrl}/Obtener`);
  }

  updateAjustes(ajuste: Ajustes): Observable<Respuesta<number>> {
    return this.http.put<Respuesta<number>>(`${this.apiUrl}/Modificar`, ajuste)
      .pipe(tap(() => this.cargarAjustes()));
  }
}

