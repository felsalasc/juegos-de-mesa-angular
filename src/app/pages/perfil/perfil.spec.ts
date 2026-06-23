import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Perfil } from './perfil';

describe('Perfil', () => {
  let component: Perfil;
  let fixture: ComponentFixture<Perfil>;

  beforeEach(async () => {
    localStorage.setItem('usuarioActivo', JSON.stringify({
      nombre: 'Felipe',
      email: 'fasc86@gmail.com',
      rol: 'cliente'
    }));

    await TestBed.configureTestingModule({
      imports: [Perfil],
      providers: [
        provideRouter([
          { path: 'login', component: Perfil }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Perfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });
});