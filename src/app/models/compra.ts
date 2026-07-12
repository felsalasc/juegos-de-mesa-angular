export interface CompraProducto {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
  categoria?: string;
  descripcion?: string;
}

export interface Compra {
  id?: number;
  usuarioId?: number;
  usuarioEmail: string;
  fecha: string;
  productos: CompraProducto[];
  total: number;
  estado: 'Pagada' | 'Pendiente' | 'Cancelada';
}