import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './recuperar.html',
  styleUrl: './recuperar.css'
})
export class Recuperar {
  recuperarForm: FormGroup;
  mensaje = '';
  tipoMensaje: 'ok' | 'error' = 'error';

  constructor(private fb: FormBuilder) {
    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  recuperar(): void {
    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      this.mensaje = 'Debes ingresar un correo válido.';
      this.tipoMensaje = 'error';
      return;
    }

    const email = this.recuperarForm.value.email;
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

    const existe = usuarios.some((u: any) => u.email === email);

    if (!existe) {
      this.mensaje = 'No existe una cuenta asociada a ese correo.';
      this.tipoMensaje = 'error';
      return;
    }

    this.mensaje = 'Se ha enviado un correo de recuperación.';
    this.tipoMensaje = 'ok';
  }
}