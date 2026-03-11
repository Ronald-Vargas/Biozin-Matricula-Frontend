import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ajustes, CreateAjustesDto, Respuesta } from '../model/ajustes.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AjustesService {
  private readonly base = `${environment.apiUrl}/ajustes`;

  constructor(private http: HttpClient) {}

  getAjustes(): Observable<Respuesta<Ajustes>> {
    return this.http.get<Respuesta<Ajustes>>(this.base);
  }

  updateAjustes(dto: CreateAjustesDto): Observable<Respuesta<Ajustes>> {
    return this.http.put<Respuesta<Ajustes>>(this.base, dto);
  }
}
