import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {

  usuario: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {

    const usuarioGuardado = localStorage.getItem('usuarioActivo');

    if (!usuarioGuardado) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuario = JSON.parse(usuarioGuardado);
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuarioActivo');
    this.router.navigate(['/login']);
  }
}