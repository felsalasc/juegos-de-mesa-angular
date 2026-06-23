import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

function contieneNumero(control: AbstractControl): ValidationErrors | null {
  return /\d/.test(control.value || '') ? null : { sinNumero: true };
}

function contieneMayuscula(control: AbstractControl): ValidationErrors | null {
  return /[A-Z]/.test(control.value || '') ? null : { sinMayuscula: true };
}

function passwordsIguales(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const repetirPassword = control.get('repetirPassword')?.value;

  if (!password || !repetirPassword) return null;

  return password === repetirPassword ? null : { passwordsNoCoinciden: true };
}

function edadMinima13(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const nacimiento = new Date(control.value);
  const hoy = new Date();

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad >= 13 ? null : { menorDe13: true };
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  registroForm: FormGroup;
  mensaje = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.registroForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      usuario: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(18),
        contieneNumero,
        contieneMayuscula
      ]],
      repetirPassword: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required, edadMinima13]],
      direccion: ['']
    }, {
      validators: passwordsIguales
    });
  }

  registrar(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      this.mensaje = 'Debes corregir los errores antes de registrarte.';
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const data = this.registroForm.value;

    const existe = usuarios.some((u: any) => u.email === data.email);

    if (existe) {
      this.mensaje = 'Ya existe una cuenta con este correo.';
      return;
    }

    usuarios.push({
      nombre: data.nombreCompleto,
      usuario: data.usuario,
      email: data.email,
      password: data.password,
      fechaNacimiento: data.fechaNacimiento,
      direccion: data.direccion,
      rol: 'cliente'
    });

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    this.router.navigate(['/login']);
  }

  limpiarFormulario(): void {
    this.registroForm.reset({
      nombreCompleto: '',
      usuario: '',
      email: '',
      password: '',
      repetirPassword: '',
      fechaNacimiento: '',
      direccion: ''
    });

    this.mensaje = '';
  }
}