import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  mensaje = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.loginForm.get(campo);
    return !!control && control.invalid && control.touched;
  }

  ingresar(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.mensaje = 'Debes completar correctamente el formulario.';
      return;
    }

    const { email, password } = this.loginForm.value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

    const usuario = usuarios.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!usuario) {
      this.mensaje = 'Correo o contraseña incorrectos.';
      return;
    }

    localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
    this.router.navigate(['/perfil']);
  }
}