import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario';

/**
 * Valida que los campos password y confirmarPassword coincidan.
 */
const passwordsCoincidenValidator: ValidatorFn = (
  form: AbstractControl
): ValidationErrors | null => {
  const password = form.get('password')?.value;
  const confirmarPassword = form.get('confirmarPassword')?.value;

  if (!password || !confirmarPassword) {
    return null;
  }

  return password === confirmarPassword
    ? null
    : { passwordsNoCoinciden: true };
};

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  registroForm: FormGroup;

  mensaje = '';
  error = '';
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService
  ) {
    this.registroForm = this.fb.group(
      {
        nombre: [
          '',
          [
            Validators.required,
            Validators.minLength(3)
          ]
        ],
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
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/
            )
          ]
        ],
        confirmarPassword: [
          '',
          Validators.required
        ]
      },
      {
        validators: passwordsCoincidenValidator
      }
    );
  }

  registrar(): void {
    this.mensaje = '';
    this.error = '';

    this.registroForm.updateValueAndValidity();

    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();

      if (this.registroForm.hasError('passwordsNoCoinciden')) {
        this.error = 'Las contraseñas no coinciden.';
      } else {
        this.error = 'Debes completar correctamente el formulario.';
      }

      return;
    }

    const datos = this.registroForm.getRawValue();

    const email = String(datos.email)
      .trim()
      .toLowerCase();

    this.guardando = true;

    this.usuariosService.obtenerUsuarioPorEmail(email).subscribe({
      next: (usuarios: Usuario[]) => {
        if (usuarios.length > 0) {
          this.error = 'El correo electrónico ya está registrado.';
          this.guardando = false;
          return;
        }

        const nuevoUsuario: Usuario = {
          nombre: String(datos.nombre).trim(),
          email,
          password: String(datos.password),
          rol: 'cliente',
          activo: true
        };

        this.crearUsuario(nuevoUsuario);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al validar correo:', error);
        this.error = 'No fue posible validar el correo.';
        this.guardando = false;
      }
    });
  }

  private crearUsuario(usuario: Usuario): void {
    this.usuariosService.crearUsuario(usuario).subscribe({
      next: (usuarioCreado: Usuario) => {
        console.log('Usuario creado mediante API:', usuarioCreado);

        this.limpiarFormulario();
        this.mensaje = 'Usuario registrado correctamente.';
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al registrar usuario:', error);
        this.error = 'No fue posible registrar el usuario.';
        this.guardando = false;
      }
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.registroForm.get(campo);

    return !!control && control.invalid && control.touched;
  }

  contrasenasNoCoinciden(): boolean {
    const confirmarPassword =
      this.registroForm.get('confirmarPassword');

    return (
      this.registroForm.hasError('passwordsNoCoinciden') &&
      !!confirmarPassword?.touched
    );
  }

  limpiarFormulario(): void {
    this.registroForm.reset({
      nombre: '',
      email: '',
      password: '',
      confirmarPassword: ''
    });

    this.mensaje = '';
    this.error = '';
    this.guardando = false;

    this.registroForm.markAsPristine();
    this.registroForm.markAsUntouched();
    this.registroForm.updateValueAndValidity();
  }
}