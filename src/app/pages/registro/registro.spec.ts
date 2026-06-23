import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Registro } from './registro';

describe('Registro Component', () => {
  let component: Registro;
  let fixture: ComponentFixture<Registro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registro],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Registro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe invalidar el formulario cuando está vacío', () => {
    // Arrange + Act + Assert
    expect(component.registroForm.valid).toBeFalsy();
  });

  it('debe invalidar el correo si no tiene formato válido', () => {
    // Arrange
    const email = component.registroForm.controls['email'];

    // Act
    email.setValue('correo-malo');

    // Assert
    expect(email.valid).toBeFalsy();
    expect(email.hasError('email')).toBeTruthy();
  });

  it('debe invalidar la contraseña si no contiene número', () => {
    // Arrange
    const password = component.registroForm.controls['password'];

    // Act
    password.setValue('ClaveSinNumero');

    // Assert
    expect(password.valid).toBeFalsy();
    expect(password.hasError('sinNumero')).toBeTruthy();
  });

  it('debe invalidar el formulario si las contraseñas no coinciden', () => {
    // Arrange
    component.registroForm.controls['password'].setValue('Clave123');
    component.registroForm.controls['repetirPassword'].setValue('Clave456');

    // Act
    component.registroForm.updateValueAndValidity();

    // Assert
    expect(
      component.registroForm.hasError('passwordsNoCoinciden')
    ).toBeTruthy();
  });

  it('debe limpiar el formulario al ejecutar limpiarFormulario', () => {
    // Arrange
    component.registroForm.patchValue({
      nombreCompleto: 'Felipe Salas',
      usuario: 'felsalas',
      email: 'felipe@gmail.com',
      password: 'Clave123',
      repetirPassword: 'Clave123',
      fechaNacimiento: '2000-01-01',
      direccion: 'La Serena'
    });

    // Act
    component.limpiarFormulario();

    // Assert
    expect(component.registroForm.controls['nombreCompleto'].value).toBe('');
    expect(component.registroForm.controls['usuario'].value).toBe('');
    expect(component.registroForm.controls['email'].value).toBe('');
    expect(component.registroForm.controls['password'].value).toBe('');
    expect(component.registroForm.controls['repetirPassword'].value).toBe('');
    expect(component.registroForm.controls['fechaNacimiento'].value).toBe('');
    expect(component.registroForm.controls['direccion'].value).toBe('');
  });
});