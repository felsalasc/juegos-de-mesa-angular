import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Compra } from '../models/compra';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  private readonly apiUrl = 'http://localhost:3001/compras';

  constructor(
    private http: HttpClient
  ) {}

  obtenerCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.apiUrl);
  }

  obtenerComprasPorUsuario(
    usuarioEmail: string
  ): Observable<Compra[]> {
    return this.http.get<Compra[]>(
      `${this.apiUrl}?usuarioEmail=${encodeURIComponent(usuarioEmail)}`
    );
  }

  obtenerCompraPorId(
    id: number
  ): Observable<Compra> {
    return this.http.get<Compra>(
      `${this.apiUrl}/${id}`
    );
  }

  crearCompra(
    compra: Compra
  ): Observable<Compra> {
    return this.http.post<Compra>(
      this.apiUrl,
      compra
    );
  }

  actualizarCompra(
    id: number,
    compra: Compra
  ): Observable<Compra> {
    return this.http.put<Compra>(
      `${this.apiUrl}/${id}`,
      compra
    );
  }

  eliminarCompra(
    id: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}