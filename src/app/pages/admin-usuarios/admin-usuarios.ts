import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import { Usuario } from '../../models/usuario';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.css'
})
export class AdminUsuarios implements OnInit {

  usuarioForm: FormGroup;
  usuarios: Usuario[] = [];

  editandoId: number | null = null;
  usuarioEditando: Usuario | null = null;

  mensaje = '';
  error = '';
  cargando = false;
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private cdr: ChangeDetectorRef
  ) {
    this.usuarioForm = this.fb.group({
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
      rol: [
        '',
        Validators.required
      ],
      estado: [
        'Activo',
        Validators.required
      ]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.error = '';

    this.usuariosService
      .obtenerUsuarios()
      .pipe(
        finalize(() => {
          this.cargando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (usuarios: Usuario[]) => {
          this.usuarios = [...usuarios];
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al cargar usuarios:', error);

          this.usuarios = [];
          this.error = 'No se pudieron cargar los usuarios desde la API.';
          this.cdr.detectChanges();
        }
      });
  }

  guardar(): void {
    this.mensaje = '';
    this.error = '';

    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      this.error = 'Debes completar correctamente el formulario.';
      return;
    }

    const datos = this.usuarioForm.getRawValue();

    const email = String(datos.email)
      .trim()
      .toLowerCase();

    if (this.editandoId !== null) {
      this.actualizarUsuario(email);
    } else {
      this.validarYCrearUsuario(email);
    }
  }

  private validarYCrearUsuario(email: string): void {
    this.guardando = true;

    this.usuariosService.obtenerUsuarioPorEmail(email).subscribe({
      next: (usuariosExistentes: Usuario[]) => {
        if (usuariosExistentes.length > 0) {
          this.error = 'Ya existe un usuario con ese correo.';
          this.guardando = false;
          this.cdr.detectChanges();
          return;
        }

        const datos = this.usuarioForm.getRawValue();

        const nuevoUsuario: Usuario = {
          nombre: String(datos.nombre).trim(),
          email,
          password: 'Usuario123!',
          rol: this.normalizarRol(datos.rol),
          activo: datos.estado === 'Activo'
        };

        this.crearUsuario(nuevoUsuario);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al validar correo:', error);

        this.error = 'No fue posible validar el correo electrónico.';
        this.guardando = false;
        this.cdr.detectChanges();
      }
    });
  }

  private crearUsuario(usuario: Usuario): void {
    this.usuariosService.crearUsuario(usuario).subscribe({
      next: (usuarioCreado: Usuario) => {
        this.usuarios = [
          ...this.usuarios,
          usuarioCreado
        ];

        this.limpiarFormulario();
        this.mensaje = 'Usuario creado correctamente.';
        this.guardando = false;

        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al crear usuario:', error);

        this.error = 'No se pudo crear el usuario.';
        this.guardando = false;
        this.cdr.detectChanges();
      }
    });
  }

  private actualizarUsuario(email: string): void {
    if (
      this.editandoId === null ||
      this.usuarioEditando === null
    ) {
      this.error = 'No se pudo identificar el usuario seleccionado.';
      return;
    }

    const usuarioConMismoEmail = this.usuarios.find(
      (usuario: Usuario) =>
        usuario.email.toLowerCase() === email &&
        usuario.id !== this.editandoId
    );

    if (usuarioConMismoEmail) {
      this.error = 'Ya existe otro usuario con ese correo.';
      return;
    }

    const datos = this.usuarioForm.getRawValue();

    const usuarioActualizado: Usuario = {
      ...this.usuarioEditando,
      id: this.editandoId,
      nombre: String(datos.nombre).trim(),
      email,
      rol: this.normalizarRol(datos.rol),
      activo: datos.estado === 'Activo'
    };

    this.guardando = true;

    this.usuariosService
      .actualizarUsuario(
        this.editandoId,
        usuarioActualizado
      )
      .subscribe({
        next: (respuesta: Usuario) => {
          this.usuarios = this.usuarios.map(
            (usuario: Usuario) =>
              usuario.id === this.editandoId
                ? respuesta
                : usuario
          );

          this.limpiarFormulario();
          this.mensaje = 'Usuario actualizado correctamente.';
          this.guardando = false;

          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al actualizar usuario:', error);

          this.error = 'No se pudo actualizar el usuario.';
          this.guardando = false;
          this.cdr.detectChanges();
        }
      });
  }

  editar(usuario: Usuario): void {
    if (usuario.id === undefined) {
      this.error = 'El usuario no tiene un identificador válido.';
      return;
    }

    this.editandoId = usuario.id;
    this.usuarioEditando = { ...usuario };

    this.usuarioForm.patchValue({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: this.mostrarRol(usuario.rol),
      estado: usuario.activo ? 'Activo' : 'Inactivo'
    });

    this.mensaje = 'Editando usuario seleccionado.';
    this.error = '';

    this.cdr.detectChanges();
  }

  eliminar(id: number | undefined): void {
    if (id === undefined) {
      this.error = 'No se pudo identificar el usuario.';
      return;
    }

    const confirmar = confirm(
      '¿Estás seguro de que deseas eliminar este usuario?'
    );

    if (!confirmar) {
      return;
    }

    this.mensaje = '';
    this.error = '';

    this.usuariosService.eliminarUsuario(id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(
          (usuario: Usuario) => usuario.id !== id
        );

        if (this.editandoId === id) {
          this.limpiarFormulario();
        }

        this.mensaje = 'Usuario eliminado correctamente.';
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al eliminar usuario:', error);

        this.error = 'No se pudo eliminar el usuario.';
        this.cdr.detectChanges();
      }
    });
  }

  limpiarFormulario(): void {
    this.editandoId = null;
    this.usuarioEditando = null;

    this.usuarioForm.reset({
      nombre: '',
      email: '',
      rol: '',
      estado: 'Activo'
    });

    this.usuarioForm.markAsPristine();
    this.usuarioForm.markAsUntouched();

    this.error = '';
    this.guardando = false;
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
    this.mensaje = '';
  }

  campoInvalido(campo: string): boolean {
    const control = this.usuarioForm.get(campo);

    return !!control &&
      control.invalid &&
      control.touched;
  }

  private normalizarRol(
    rol: string
  ): 'admin' | 'cliente' {
    return String(rol).toLowerCase() === 'admin'
      ? 'admin'
      : 'cliente';
  }

  mostrarRol(
    rol: 'admin' | 'cliente'
  ): string {
    return rol === 'admin'
      ? 'Admin'
      : 'Cliente';
  }
}