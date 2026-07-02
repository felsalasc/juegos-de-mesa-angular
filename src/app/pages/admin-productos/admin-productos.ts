import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-productos.html',
  styleUrl: './admin-productos.css'
})
export class AdminProductos implements OnInit {
  productoForm: FormGroup;
  productos: any[] = [];
  editandoId: number | null = null;
  mensaje = '';

  constructor(private fb: FormBuilder) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      categoria: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      precio: ['', [Validators.required, Validators.min(1000)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      imagen: ['🎲', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    const productosGuardados = JSON.parse(localStorage.getItem('productosAdmin') || '[]');

    if (productosGuardados.length > 0) {
      this.productos = productosGuardados;
      return;
    }

    this.productos = [
      {
        id: 1,
        nombre: 'Memoria Diaguita',
        categoria: 'Cultura Diaguita',
        descripcion: 'Juego de memoria basado en símbolos y cerámicas diaguitas.',
        precio: 12990,
        stock: 10,
        imagen: '🏺'
      },
      {
        id: 2,
        nombre: 'Ruta Changa',
        categoria: 'Cultura Changa',
        descripcion: 'Juego de estrategia sobre navegación, pesca y vida costera.',
        precio: 14990,
        stock: 8,
        imagen: '🌊'
      },
      {
        id: 3,
        nombre: 'Aventura Atacameña',
        categoria: 'Cultura Atacameña',
        descripcion: 'Juego educativo sobre pueblos andinos, comercio y territorio.',
        precio: 16990,
        stock: 6,
        imagen: '⛰️'
      }
    ];

    this.guardarProductos();
  }

  guardar(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      this.mensaje = 'Debes completar correctamente el formulario.';
      return;
    }

    const datos = this.productoForm.value;

    if (this.editandoId) {
      this.productos = this.productos.map(producto =>
        producto.id === this.editandoId
          ? { ...producto, ...datos, precio: Number(datos.precio), stock: Number(datos.stock) }
          : producto
      );

      this.mensaje = 'Producto actualizado correctamente.';
    } else {
      const nuevoProducto = {
        id: Date.now(),
        ...datos,
        precio: Number(datos.precio),
        stock: Number(datos.stock)
      };

      this.productos.push(nuevoProducto);
      this.mensaje = 'Producto creado correctamente.';
    }

    this.guardarProductos();
    this.limpiarFormulario();
  }

  editar(producto: any): void {
    this.editandoId = producto.id;
    this.productoForm.patchValue(producto);
    this.mensaje = 'Editando producto seleccionado.';
  }

  eliminar(id: number): void {
    this.productos = this.productos.filter(producto => producto.id !== id);
    this.guardarProductos();
    this.mensaje = 'Producto eliminado correctamente.';
  }

  limpiarFormulario(): void {
    this.editandoId = null;
    this.productoForm.reset({
      nombre: '',
      categoria: '',
      descripcion: '',
      precio: '',
      stock: '',
      imagen: '🎲'
    });
  }

  guardarProductos(): void {
    localStorage.setItem('productosAdmin', JSON.stringify(this.productos));
  }

  campoInvalido(campo: string): boolean {
    const control = this.productoForm.get(campo);
    return !!control && control.invalid && control.touched;
  }
}