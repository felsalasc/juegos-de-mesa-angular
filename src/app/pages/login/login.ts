import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';

import { Usuario } from '../../models/usuario';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginForm: FormGroup;

  mensaje = '';
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuariosService: UsuariosService
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.loginForm.get(campo);

    return !!control &&
      control.invalid &&
      control.touched;
  }

  ingresar(): void {
    this.mensaje = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.mensaje = 'Debes completar correctamente el formulario.';
      return;
    }

    const datos = this.loginForm.getRawValue();

    const email = String(datos.email)
      .trim()
      .toLowerCase();

    const password = String(datos.password);

    this.cargando = true;

    this.usuariosService
      .obtenerUsuarioPorEmail(email)
      .subscribe({
        next: (usuarios: Usuario[]) => {
          if (usuarios.length === 0) {
            this.mensaje = 'Correo o contraseña incorrectos.';
            this.cargando = false;
            return;
          }

          const usuario = usuarios[0];

          if (usuario.password !== password) {
            this.mensaje = 'Correo o contraseña incorrectos.';
            this.cargando = false;
            return;
          }

          if (!usuario.activo) {
            this.mensaje = 'El usuario se encuentra inactivo.';
            this.cargando = false;
            return;
          }

          localStorage.setItem(
            'usuarioActivo',
            JSON.stringify(usuario)
          );

          this.cargando = false;

          if (usuario.rol === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/inicio']);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al iniciar sesión:', error);

          this.mensaje = 'No fue posible conectar con la API.';
          this.cargando = false;
        }
      });
  }

  limpiarFormulario(): void {
    this.loginForm.reset({
      email: '',
      password: ''
    });

    this.mensaje = '';
    this.cargando = false;

    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();
  }
}