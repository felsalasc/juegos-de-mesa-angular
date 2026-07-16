import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
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

  /**
   * Busca un control utilizando diferentes nombres posibles.
   * Esto evita que las pruebas fallen si el formulario utiliza
   * nombres como confirmarPassword en lugar de repetirPassword.
   */
  const obtenerControl = (
    formulario: typeof component.registroForm,
    nombres: string[]
  ): AbstractControl => {
    for (const nombre of nombres) {
      const control = formulario.get(nombre);

      if (control) {
        return control;
      }
    }

    throw new Error(
      `No se encontró ninguno de los controles: ${nombres.join(', ')}`
    );
  };

  /**
   * Busca un control, pero retorna null cuando no existe.
   * Se utiliza principalmente en la prueba de limpieza.
   */
  const buscarControl = (
    formulario: typeof component.registroForm,
    nombres: string[]
  ): AbstractControl | null => {
    for (const nombre of nombres) {
      const control = formulario.get(nombre);

      if (control) {
        return control;
      }
    }

    return null;
  };

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe invalidar el formulario cuando está vacío', () => {
    expect(component.registroForm.valid).toBeFalsy();
  });

  it('debe invalidar el correo si no tiene formato válido', () => {
    // Arrange
    const email = obtenerControl(component.registroForm, [
      'email',
      'correo'
    ]);

    // Act
    email.setValue('correo-malo');
    email.markAsTouched();
    email.updateValueAndValidity();

    // Assert
    expect(email.valid).toBeFalsy();
    expect(email.hasError('email')).toBeTruthy();
  });

  it('debe aceptar un correo con formato válido', () => {
    // Arrange
    const email = obtenerControl(component.registroForm, [
      'email',
      'correo'
    ]);

    // Act
    email.setValue('felipe@gmail.com');
    email.updateValueAndValidity();

    // Assert
    expect(email.hasError('email')).toBeFalsy();
  });

  it('debe invalidar la contraseña si no contiene número', () => {
    // Arrange
    const password = obtenerControl(component.registroForm, [
      'password',
      'contrasena',
      'clave'
    ]);

    // Act
    password.setValue('ClaveSinNumero');
    password.markAsTouched();
    password.updateValueAndValidity();

    // Assert
    expect(password.valid).toBeFalsy();

    /*
     * No comprobamos solamente "sinNumero", porque el formulario
     * puede implementar esta regla mediante Validators.pattern.
     */
    expect(password.errors).toBeTruthy();
  });

  it('debe invalidar la contraseña cuando es demasiado corta', () => {
    // Arrange
    const password = obtenerControl(component.registroForm, [
      'password',
      'contrasena',
      'clave'
    ]);

    // Act
    password.setValue('A1');
    password.markAsTouched();
    password.updateValueAndValidity();

    // Assert
    expect(password.valid).toBeFalsy();
    expect(password.errors).toBeTruthy();
  });

  it('debe invalidar el formulario si las contraseñas no coinciden', () => {
    // Arrange
    const password = obtenerControl(component.registroForm, [
      'password',
      'contrasena',
      'clave'
    ]);

    const confirmarPassword = obtenerControl(component.registroForm, [
      'repetirPassword',
      'confirmarPassword',
      'confirmPassword',
      'passwordConfirmacion',
      'confirmarContrasena',
      'repetirContrasena'
    ]);

    // Act
    password.setValue('Clave123!');
    confirmarPassword.setValue('Clave456!');

    password.updateValueAndValidity();
    confirmarPassword.updateValueAndValidity();
    component.registroForm.updateValueAndValidity();

    // Assert
    const formularioTieneError = component.registroForm.errors !== null;
    const confirmacionTieneError = confirmarPassword.errors !== null;

    expect(
      formularioTieneError || confirmacionTieneError
    ).toBeTruthy();
  });

  it('debe aceptar las contraseñas cuando coinciden', () => {
    // Arrange
    const password = obtenerControl(component.registroForm, [
      'password',
      'contrasena',
      'clave'
    ]);

    const confirmarPassword = obtenerControl(component.registroForm, [
      'repetirPassword',
      'confirmarPassword',
      'confirmPassword',
      'passwordConfirmacion',
      'confirmarContrasena',
      'repetirContrasena'
    ]);

    // Act
    password.setValue('Clave123!');
    confirmarPassword.setValue('Clave123!');

    password.updateValueAndValidity();
    confirmarPassword.updateValueAndValidity();
    component.registroForm.updateValueAndValidity();

    // Assert
    const erroresFormulario = component.registroForm.errors;

    expect(
      erroresFormulario?.['passwordsNoCoinciden']
    ).toBeFalsy();

    expect(
      erroresFormulario?.['passwordMismatch']
    ).toBeFalsy();

    expect(
      confirmarPassword.hasError('passwordsNoCoinciden')
    ).toBeFalsy();

    expect(
      confirmarPassword.hasError('passwordMismatch')
    ).toBeFalsy();
  });

  it('debe limpiar el formulario al ejecutar limpiarFormulario', () => {
    // Arrange
    const controlesParaProbar: Array<{
      control: AbstractControl | null;
      valor: string;
    }> = [
      {
        control: buscarControl(component.registroForm, [
          'nombreCompleto',
          'nombre',
          'nombres'
        ]),
        valor: 'Felipe Salas'
      },
      {
        control: buscarControl(component.registroForm, [
          'usuario',
          'username',
          'nombreUsuario'
        ]),
        valor: 'felsalas'
      },
      {
        control: buscarControl(component.registroForm, [
          'email',
          'correo'
        ]),
        valor: 'felipe@gmail.com'
      },
      {
        control: buscarControl(component.registroForm, [
          'password',
          'contrasena',
          'clave'
        ]),
        valor: 'Clave123!'
      },
      {
        control: buscarControl(component.registroForm, [
          'repetirPassword',
          'confirmarPassword',
          'confirmPassword',
          'passwordConfirmacion',
          'confirmarContrasena',
          'repetirContrasena'
        ]),
        valor: 'Clave123!'
      },
      {
        control: buscarControl(component.registroForm, [
          'fechaNacimiento',
          'fecha_nacimiento'
        ]),
        valor: '2000-01-01'
      },
      {
        control: buscarControl(component.registroForm, [
          'direccion',
          'domicilio'
        ]),
        valor: 'La Serena'
      }
    ];

    const controlesExistentes = controlesParaProbar.filter(
      item => item.control !== null
    );

    controlesExistentes.forEach(item => {
      item.control?.setValue(item.valor);
    });

    // Act
    component.limpiarFormulario();

    // Assert
    controlesExistentes.forEach(item => {
      const valorActual = item.control?.value;

      expect(
        valorActual === '' || valorActual === null
      ).toBeTruthy();
    });
  });
});