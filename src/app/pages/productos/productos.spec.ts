import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Productos } from './productos';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../models/producto';

describe('Productos', () => {
  let component: Productos;
  let fixture: ComponentFixture<Productos>;

  let productosServiceMock: {
    obtenerProductos: ReturnType<typeof vi.fn>;
  };

  const productosMock = [
    {
      id: 1,
      nombre: 'Memoria Diaguita',
      descripcion: 'Juego de memoria inspirado en la cultura diaguita.',
      precio: 14990,
      stock: 10,
      imagen: 'assets/img/memoria-diaguita.jpg'
    },
    {
      id: 2,
      nombre: 'Ruta Changa',
      descripcion: 'Juego de aventura inspirado en la cultura changa.',
      precio: 18990,
      stock: 5,
      imagen: 'assets/img/ruta-changa.jpg'
    }
  ] as Producto[];

  beforeEach(async () => {
    productosServiceMock = {
      obtenerProductos: vi.fn().mockReturnValue(
        of(productosMock)
      )
    };

    await TestBed.configureTestingModule({
      imports: [Productos],
      providers: [
        provideRouter([]),
        {
          provide: ProductosService,
          useValue: productosServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Productos);
    component = fixture.componentInstance;

    localStorage.clear();

    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('debe crear el componente productos', () => {
    expect(component).toBeTruthy();
  });

  it('debe iniciar con arreglo de juegos definido', () => {
    expect(component.juegos).toBeDefined();
    expect(Array.isArray(component.juegos)).toBeTruthy();
  });

  it('debe cargar los productos desde el servicio', () => {
    expect(
      productosServiceMock.obtenerProductos
    ).toHaveBeenCalled();

    expect(component.juegos.length).toBe(2);

    expect(component.juegos).toEqual(
      productosMock
    );

    expect(component.cargando).toBeFalsy();
    expect(component.error).toBe('');
  });

  it('debe mostrar un error cuando no se pueden cargar los productos', () => {
    // Arrange
    productosServiceMock.obtenerProductos.mockReturnValue(
      throwError(() => ({
        status: 500,
        statusText: 'Error del servidor'
      }))
    );

    // Act
    component.cargarProductos();

    // Assert
    expect(component.juegos).toEqual([]);

    expect(component.error).toBe(
      'No se pudieron cargar los productos.'
    );

    expect(component.cargando).toBeFalsy();
  });

  it('debe agregar un producto al carrito', () => {
    // Arrange
    const producto = productosMock[0];

    // Act
    component.agregarAlCarrito(producto);

    const carrito = JSON.parse(
      localStorage.getItem('carrito') || '[]'
    );

    // Assert
    expect(carrito.length).toBe(1);
    expect(carrito[0].id).toBe(producto.id);
    expect(carrito[0].cantidad).toBe(1);

    expect(component.mensaje).toContain(
      producto.nombre
    );

    expect(component.error).toBe('');
  });

  it('debe aumentar la cantidad si el producto ya existe en el carrito', () => {
    // Arrange
    const producto = productosMock[0];

    component.agregarAlCarrito(producto);

    // Act
    component.agregarAlCarrito(producto);

    const carrito = JSON.parse(
      localStorage.getItem('carrito') || '[]'
    );

    // Assert
    expect(carrito.length).toBe(1);
    expect(carrito[0].cantidad).toBe(2);
  });

  it('no debe agregar productos sin stock al carrito', () => {
    // Arrange
    const productoSinStock = {
      ...productosMock[0],
      stock: 0
    };

    // Act
    component.agregarAlCarrito(productoSinStock);

    const carrito = JSON.parse(
      localStorage.getItem('carrito') || '[]'
    );

    // Assert
    expect(carrito.length).toBe(0);

    expect(component.error).toBe(
      'El producto seleccionado no tiene stock.'
    );

    expect(component.mensaje).toBe('');
  });
});