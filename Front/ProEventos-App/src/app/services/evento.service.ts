import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';
import { take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class EventoService {
  baseUrl = 'https://localhost:7235/api/eventos';
  [key: string]: any;
  constructor(private http: HttpClient) {}

  getEvento(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseUrl)
    .pipe(take(1));
  }
  getEventosByTema(tema: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/${tema}/tema`)
    .pipe(take(1));
  }
  getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/${id}`)
    .pipe(take(1));
  }

  public post(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.baseUrl, evento)
    .pipe(take(1));
  }
  public put(evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/${evento.id}`, evento)
    .pipe(take(1));
  }
  public deleteEvento(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`)
    .pipe(take(1));
  }
}