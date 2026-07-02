import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.css'
})
export class AdminUsuarios implements OnInit {
  usuarioForm: FormGroup;
  usuarios: any[] = [];
  editandoEmail: string | null = null;
  mensaje = '';

  constructor(private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      rol: ['', Validators.required],
      estado: ['Activo', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios') || '[]');
    this.usuarios = usuariosGuardados;
  }

  guardar(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      this.mensaje = 'Debes completar correctamente el formulario.';
      return;
    }

    const datos = this.usuarioForm.value;

    if (this.editandoEmail) {
      this.usuarios = this.usuarios.map(usuario =>
        usuario.email === this.editandoEmail
          ? { ...usuario, ...datos }
          : usuario
      );

      this.mensaje = 'Usuario actualizado correctamente.';
    } else {
      const existe = this.usuarios.some(usuario => usuario.email === datos.email);

      if (existe) {
        this.mensaje = 'Ya existe un usuario con ese correo.';
        return;
      }

      this.usuarios.push({
        ...datos,
        password: 'Usuario123'
      });

      this.mensaje = 'Usuario creado correctamente.';
    }

    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
    this.limpiarFormulario();
  }

  editar(usuario: any): void {
    this.editandoEmail = usuario.email;
    this.usuarioForm.patchValue({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol || 'Cliente',
      estado: usuario.estado || 'Activo'
    });
    this.mensaje = 'Editando usuario seleccionado.';
  }

  eliminar(email: string): void {
    this.usuarios = this.usuarios.filter(usuario => usuario.email !== email);
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
    this.mensaje = 'Usuario eliminado correctamente.';
  }

  limpiarFormulario(): void {
    this.editandoEmail = null;
    this.usuarioForm.reset({
      nombre: '',
      email: '',
      rol: '',
      estado: 'Activo'
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.usuarioForm.get(campo);
    return !!control && control.invalid && control.touched;
  }
}