import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Compra, CompraProducto } from '../../models/compra';
import { ComprasService } from '../../services/compras.service';


@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito implements OnInit {

  carrito: Array<CompraProducto & { id?: number }> = [];
  total = 0;

  procesandoCompra = false;
  mensaje = '';
  error = '';

  constructor(
    private router: Router,
    private comprasService: ComprasService
  ) {}

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito(): void {
    this.carrito = JSON.parse(
      localStorage.getItem('carrito') || '[]'
    );

    this.calcularTotal();
  }

  calcularTotal(): void {
    this.total = this.carrito.reduce(
      (sum: number, item: CompraProducto) =>
        sum + item.precio * item.cantidad,
      0
    );
  }

  aumentarCantidad(item: CompraProducto): void {
    item.cantidad += 1;
    this.guardarCarrito();
  }

  disminuirCantidad(item: CompraProducto): void {
    if (item.cantidad > 1) {
      item.cantidad -= 1;
    } else {
      this.eliminarProducto(item.productoId);
      return;
    }

    this.guardarCarrito();
  }

eliminarProducto(productoId: number | undefined): void {
  if (productoId === undefined) {
    this.error = 'No se pudo identificar el producto.';
    return;
  }

  this.carrito = this.carrito.filter(
    (item: CompraProducto & { id?: number }) =>
      (item.productoId ?? item.id) !== productoId
  );

  this.guardarCarrito();
}

  vaciarCarrito(): void {
    this.carrito = [];
    this.guardarCarrito();

    this.mensaje = 'Carrito vaciado correctamente.';
    this.error = '';
  }

  guardarCarrito(): void {
    localStorage.setItem(
      'carrito',
      JSON.stringify(this.carrito)
    );

    this.calcularTotal();
  }

  finalizarCompra(): void {
    this.mensaje = '';
    this.error = '';

    if (this.carrito.length === 0) {
      this.error = 'El carrito está vacío.';
      return;
    }

    const usuarioActivo = JSON.parse(
      localStorage.getItem('usuarioActivo') || 'null'
    );

    if (!usuarioActivo?.email) {
      this.error = 'Debes iniciar sesión para finalizar la compra.';
      return;
    }

      const productosCompra: CompraProducto[] = this.carrito.map(
      (item: any) => ({
        productoId: item.productoId ?? item.id,
        nombre: item.nombre,
        precio: Number(item.precio),
        cantidad: Number(item.cantidad),
        imagen: item.imagen,
        categoria: item.categoria,
        descripcion: item.descripcion
      })
    );

    const compra: Compra = {
      usuarioId: usuarioActivo.id,
      usuarioEmail: usuarioActivo.email,
      fecha: new Date().toISOString(),
      productos: productosCompra,
      total: this.total,
      estado: 'Pagada'
    };

    this.procesandoCompra = true;

    this.comprasService.crearCompra(compra).subscribe({
      next: (compraCreada: Compra) => {
        console.log('Compra registrada en la API:', compraCreada);

        localStorage.removeItem('carrito');

        this.carrito = [];
        this.total = 0;
        this.procesandoCompra = false;

        this.router.navigate(['/mis-compras']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al registrar la compra:', error);

        this.error = 'No fue posible registrar la compra.';
        this.procesandoCompra = false;
      }
    });
  }
  get totalUnidades(): number {
  return this.carrito.reduce(
    (total: number, item: CompraProducto) =>
      total + Number(item.cantidad),
    0
  );
}
}