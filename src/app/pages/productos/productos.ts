import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import { Producto } from '../../models/producto';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements OnInit {

  juegos: Producto[] = [];
  cargando = false;
  error = '';
  mensaje = '';

  constructor(
    private productosService: ProductosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.error = '';

    this.productosService
      .obtenerProductos()
      .pipe(
        finalize(() => {
          this.cargando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (productos: Producto[]) => {
          console.log('Productos recibidos en catálogo:', productos);

          this.juegos = [...productos];
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al cargar productos:', error);

          this.juegos = [];
          this.error = 'No se pudieron cargar los productos.';
          this.cdr.detectChanges();
        }
      });
  }

  agregarAlCarrito(juego: Producto): void {
    if (juego.stock <= 0) {
      this.error = 'El producto seleccionado no tiene stock.';
      this.mensaje = '';
      return;
    }

    const carrito: Array<Producto & { cantidad: number }> = JSON.parse(
      localStorage.getItem('carrito') || '[]'
    );

    const productoExistente = carrito.find(
      producto => producto.id === juego.id
    );

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      carrito.push({
        ...juego,
        cantidad: 1
      });
    }

    localStorage.setItem(
      'carrito',
      JSON.stringify(carrito)
    );

    this.mensaje = `${juego.nombre} fue agregado al carrito.`;
    this.error = '';
    this.cdr.detectChanges();
  }
}