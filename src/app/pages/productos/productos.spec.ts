import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Productos } from './productos';

describe('Productos', () => {
  let component: Productos;
  let fixture: ComponentFixture<Productos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productos],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Productos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente productos', () => {
    expect(component).toBeTruthy();
  });

  it('debe iniciar con arreglo de juegos definido', () => {
    expect(component.juegos).toBeDefined();
    expect(Array.isArray(component.juegos)).toBeTruthy();
  });
});