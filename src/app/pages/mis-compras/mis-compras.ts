import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, forkJoin, of } from 'rxjs';

import { Compra } from '../../models/compra';
import { ComprasService } from '../../services/compras.service';

@Component({
  selector: 'app-mis-compras',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './mis-compras.html',
  styleUrl: './mis-compras.css'
})
export class MisCompras implements OnInit {

  compras: Compra[] = [];
  usuarioActivo: any = null;

  cargando = false;
  mensaje = '';
  error = '';

  constructor(
    private comprasService: ComprasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuarioActivo = JSON.parse(
      localStorage.getItem('usuarioActivo') || 'null'
    );

    this.cargarCompras();
  }

  cargarCompras(): void {
    this.cargando = true;
    this.mensaje = '';
    this.error = '';

    if (!this.usuarioActivo?.email) {
      this.error = 'Debes iniciar sesión para consultar tus compras.';
      this.cargando = false;
      this.cdr.detectChanges();
      return;
    }

    const email = String(this.usuarioActivo.email)
      .trim()
      .toLowerCase();

    this.comprasService
      .obtenerComprasPorUsuario(email)
      .pipe(
        finalize(() => {
          this.cargando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (compras: Compra[]) => {
          this.compras = [...compras];
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al cargar compras:', error);

          this.compras = [];
          this.error = 'No fue posible cargar las compras.';
          this.cdr.detectChanges();
        }
      });
  }

  limpiarHistorial(): void {
    if (this.compras.length === 0) {
      return;
    }

    const confirmar = confirm(
      '¿Deseas eliminar todo tu historial de compras?'
    );

    if (!confirmar) {
      return;
    }

    const solicitudes = this.compras
      .filter((compra: Compra) => compra.id !== undefined)
      .map((compra: Compra) =>
        compra.id !== undefined
          ? this.comprasService.eliminarCompra(compra.id)
          : of(undefined)
      );

    if (solicitudes.length === 0) {
      this.compras = [];
      return;
    }

    this.cargando = true;
    this.mensaje = '';
    this.error = '';

    forkJoin(solicitudes)
      .pipe(
        finalize(() => {
          this.cargando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.compras = [];
          this.mensaje = 'Historial eliminado correctamente.';
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al eliminar historial:', error);

          this.error = 'No fue posible eliminar todo el historial.';
          this.cdr.detectChanges();
        }
      });
  }
}