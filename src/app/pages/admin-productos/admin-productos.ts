import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import { Producto } from '../../models/producto';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-productos.html',
  styleUrl: './admin-productos.css'
})
export class AdminProductos implements OnInit {

  productoForm: FormGroup;
  productos: Producto[] = [];

  editandoId: number | null = null;

  mensaje = '';
  error = '';
  cargando = false;

constructor(
  private fb: FormBuilder,
  private productosService: ProductosService,
  private cdr: ChangeDetectorRef
) {
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
  this.cargando = true;
  this.error = '';

  this.productosService.obtenerProductos()
    .pipe(
      finalize(() => {
        this.cargando = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: (productos: Producto[]) => {
        console.log('Productos recibidos desde la API:', productos);

        this.productos = productos;
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        console.error('Error al cargar productos:', error);

        this.productos = [];
        this.error = 'No se pudieron cargar los productos desde la API.';
        this.cdr.detectChanges();
      }
    });
}

  guardar(): void {
    this.mensaje = '';
    this.error = '';

    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      this.error = 'Debes completar correctamente el formulario.';
      return;
    }

    const datos = this.productoForm.getRawValue();

    const producto: Producto = {
      nombre: String(datos.nombre).trim(),
      categoria: String(datos.categoria).trim(),
      descripcion: String(datos.descripcion).trim(),
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      imagen: String(datos.imagen).trim()
    };

    if (this.editandoId !== null) {
      this.actualizarProducto(this.editandoId, producto);
    } else {
      this.crearProducto(producto);
    }
  }

  crearProducto(producto: Producto): void {
    this.productosService.crearProducto(producto).subscribe({
      next: () => {
        this.mensaje = 'Producto creado correctamente.';
        this.limpiarFormulario();
        this.cargarProductos();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al crear producto:', error);
        this.error = 'No se pudo crear el producto.';
      }
    });
  }

  actualizarProducto(id: number, producto: Producto): void {
    const productoActualizado: Producto = {
      ...producto,
      id
    };

    this.productosService
      .actualizarProducto(id, productoActualizado)
      .subscribe({
        next: () => {
          this.mensaje = 'Producto actualizado correctamente.';
          this.limpiarFormulario();
          this.cargarProductos();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al actualizar producto:', error);
          this.error = 'No se pudo actualizar el producto.';
        }
      });
  }

  editar(producto: Producto): void {
    if (producto.id === undefined) {
      this.error = 'El producto no tiene un ID válido.';
      return;
    }

    this.editandoId = producto.id;

    this.productoForm.patchValue({
      nombre: producto.nombre,
      categoria: producto.categoria,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      imagen: producto.imagen
    });

    this.mensaje = 'Editando producto seleccionado.';
    this.error = '';
  }

  eliminar(id: number | undefined): void {
    if (id === undefined) {
      this.error = 'No se pudo identificar el producto.';
      return;
    }

    const confirmar = confirm(
      '¿Estás seguro de que deseas eliminar este producto?'
    );

    if (!confirmar) {
      return;
    }

    this.mensaje = '';
    this.error = '';

    this.productosService.eliminarProducto(id).subscribe({
      next: () => {
        this.mensaje = 'Producto eliminado correctamente.';

        if (this.editandoId === id) {
          this.limpiarFormulario();
        }

        this.cargarProductos();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al eliminar producto:', error);
        this.error = 'No se pudo eliminar el producto.';
      }
    });
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

    this.productoForm.markAsPristine();
    this.productoForm.markAsUntouched();
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
    this.mensaje = '';
    this.error = '';
  }

  campoInvalido(campo: string): boolean {
    const control = this.productoForm.get(campo);

    return !!control && control.invalid && control.touched;
  }
}