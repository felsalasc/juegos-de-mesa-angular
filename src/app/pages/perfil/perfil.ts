import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {
  private platformId = inject(PLATFORM_ID);

  perfilForm: FormGroup;
  mensaje = '';
  usuarioActivo: any = null;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      telefono: ['', [Validators.required, Validators.minLength(8)]],
      rol: ['Cliente']
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo') || 'null');

    if (!this.usuarioActivo) {
      this.router.navigate(['/login']);
      return;
    }

    this.perfilForm.patchValue({
      nombre: this.usuarioActivo.nombre || '',
      email: this.usuarioActivo.email || '',
      direccion: this.usuarioActivo.direccion || '',
      telefono: this.usuarioActivo.telefono || '',
      rol: this.usuarioActivo.rol || 'Cliente'
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.perfilForm.get(campo);
    return !!control && control.invalid && control.touched;
  }

  guardarCambios(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      this.mensaje = 'Debes completar correctamente el formulario.';
      return;
    }

    const datosActualizados = {
      ...this.usuarioActivo,
      ...this.perfilForm.value
    };

    localStorage.setItem('usuarioActivo', JSON.stringify(datosActualizados));

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

    const usuariosActualizados = usuarios.map((usuario: any) =>
      usuario.email === this.usuarioActivo.email
        ? datosActualizados
        : usuario
    );

    localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));

    this.usuarioActivo = datosActualizados;
    this.mensaje = 'Perfil actualizado correctamente.';
  }
}