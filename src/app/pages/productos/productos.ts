import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements OnInit {

  private platformId = inject(PLATFORM_ID);

  juegos: any[] = [];

  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) return;

    this.cargarProductos();

  }

  cargarProductos(): void {

    const productos = JSON.parse(localStorage.getItem('productosAdmin') || '[]');

    this.juegos = productos;

  }

  agregarAlCarrito(juego: any): void {

    if (!isPlatformBrowser(this.platformId)) return;

    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    const existente = carrito.find((item: any) => item.id === juego.id);

    if (existente) {
      existente.cantidad++;
    } else {
      carrito.push({
        ...juego,
        cantidad: 1
      });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));

    alert(`${juego.nombre} agregado al carrito.`);

  }

}