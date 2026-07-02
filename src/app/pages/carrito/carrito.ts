import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito implements OnInit {
  carrito: any[] = [];
  total = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito(): void {
    this.carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.total = this.carrito.reduce((sum: number, item: any) => {
      return sum + item.precio * item.cantidad;
    }, 0);
  }

  aumentarCantidad(item: any): void {
    item.cantidad += 1;
    this.guardarCarrito();
  }

  disminuirCantidad(item: any): void {
    if (item.cantidad > 1) {
      item.cantidad -= 1;
    } else {
      this.eliminarProducto(item.id);
      return;
    }

    this.guardarCarrito();
  }

  eliminarProducto(id: number): void {
    this.carrito = this.carrito.filter((item: any) => item.id !== id);
    this.guardarCarrito();
  }

  vaciarCarrito(): void {
    this.carrito = [];
    this.guardarCarrito();
  }

  guardarCarrito(): void {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    this.calcularTotal();
  }

  finalizarCompra(): void {
    if (this.carrito.length === 0) {
      return;
    }

    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo') || 'null');

    const compra = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString('es-CL'),
      usuario: usuarioActivo?.email || 'invitado',
      productos: this.carrito,
      total: this.total,
      estado: 'Pagado'
    };

    const compras = JSON.parse(localStorage.getItem('compras') || '[]');
    compras.push(compra);

    localStorage.setItem('compras', JSON.stringify(compras));
    localStorage.removeItem('carrito');

    this.carrito = [];
    this.total = 0;

    this.router.navigate(['/mis-compras']);
  }
}