import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private readonly apiUrl = 'http://localhost:3001/usuarios';

  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  obtenerUsuarioPorEmail(email: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(
      `${this.apiUrl}?email=${encodeURIComponent(email)}`
    );
  }

  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(
      this.apiUrl,
      usuario
    );
  }

  actualizarUsuario(
    id: number,
    usuario: Usuario
  ): Observable<Usuario> {
    return this.http.put<Usuario>(
      `${this.apiUrl}/${id}`,
      usuario
    );
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}