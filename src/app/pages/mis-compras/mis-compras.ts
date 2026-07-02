import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mis-compras',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-compras.html',
  styleUrl: './mis-compras.css'
})
export class MisCompras implements OnInit {
  compras: any[] = [];
  usuarioActivo: any = null;

  ngOnInit(): void {
    this.usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo') || 'null');
    this.cargarCompras();
  }

  cargarCompras(): void {
    const comprasGuardadas = JSON.parse(localStorage.getItem('compras') || '[]');

    if (this.usuarioActivo?.email) {
      this.compras = comprasGuardadas.filter(
        (compra: any) => compra.usuario === this.usuarioActivo.email
      );
    } else {
      this.compras = comprasGuardadas;
    }
  }

  limpiarHistorial(): void {
    const comprasGuardadas = JSON.parse(localStorage.getItem('compras') || '[]');

    if (this.usuarioActivo?.email) {
      const comprasOtrosUsuarios = comprasGuardadas.filter(
        (compra: any) => compra.usuario !== this.usuarioActivo.email
      );

      localStorage.setItem('compras', JSON.stringify(comprasOtrosUsuarios));
    } else {
      localStorage.removeItem('compras');
    }

    this.compras = [];
  }
}