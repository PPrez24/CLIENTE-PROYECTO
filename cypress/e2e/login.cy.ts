/**
 * Prueba E2E para Login Component
 * Integrante 1: Angel (ACTIVA)
 * Escenarios cubiertos:
 * - Login exitoso con credenciales válidas
 * - Login fallido con credenciales incorrectas
 * - Validación de campos vacíos
 * - Validación de formato de email
 * - Navegación después de login exitoso
 */

describe('Login Component E2E Tests', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    cy.clearLocalStorage();
    cy.visit('/auth/login');
  });

  it('debería mostrar el formulario de login correctamente', () => {
    cy.get('h2').should('contain', 'Iniciar sesión');
    cy.get('input[formControlName="emailPrefix"]').should('be.visible');
    cy.get('input[formControlName="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('debería validar campos requeridos al intentar enviar formulario vacío', () => {
    // Hacer que los campos sean tocados para mostrar errores
    cy.get('input[formControlName="emailPrefix"]').focus().blur();
    cy.get('input[formControlName="password"]').focus().blur();

    // Verificar que aparezcan mensajes de error
    cy.contains('El email es requerido').should('be.visible');
    cy.contains('La contraseña es requerida').should('be.visible');

    // Verificar que el botón esté deshabilitado
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('debería validar formato de email (solo alfanumérico, punto, guión bajo)', () => {
    // Probar con caracteres inválidos
    cy.get('input[formControlName="emailPrefix"]').type('usuario@invalido').blur();
    cy.get('input[formControlName="password"]').type('password123');

    // Verificar mensaje de error de formato
    cy.contains('Formato de email inválido').should('be.visible');

    // El botón debe estar deshabilitado
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('debería validar longitud mínima de contraseña (6 caracteres)', () => {
    cy.get('input[formControlName="emailPrefix"]').type('usuario123');
    cy.get('input[formControlName="password"]').type('12345').blur(); // Solo 5 caracteres

    // Verificar mensaje de error
    cy.contains('Mínimo 6 caracteres').should('be.visible');

    // El botón debe estar deshabilitado
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('debería alternar visibilidad de contraseña al hacer click en el ícono', () => {
    cy.get('input[formControlName="password"]').should('have.attr', 'type', 'password');

    // Hacer click en toggle
    cy.get('.toggle-password').click();

    // Verificar que ahora es texto visible
    cy.get('input[formControlName="password"]').should('have.attr', 'type', 'text');

    // Hacer click de nuevo para ocultar
    cy.get('.toggle-password').click();
    cy.get('input[formControlName="password"]').should('have.attr', 'type', 'password');
  });

  it('debería mostrar error al intentar login con credenciales incorrectas', () => {
    // Llenar con credenciales inválidas
    cy.get('input[formControlName="emailPrefix"]').type('usuario.invalido');
    cy.get('input[formControlName="password"]').type('Password123');

    // Enviar formulario
    cy.get('button[type="submit"]').click();

    // Esperar mensaje de error (asumiendo que Firebase rechaza credenciales)
    // Nota: Este test puede fallar si no hay conexión a Firebase o si las credenciales son válidas
    cy.get('.error', { timeout: 5000 }).should('be.visible');
  });

  it('debería navegar al dashboard después de login exitoso', () => {
    // Cargar credenciales de usuario de prueba desde fixture
    cy.fixture('users').then((users) => {
      const testUser = users.testUser;

      // Llenar formulario con credenciales válidas
      cy.get('input[formControlName="emailPrefix"]').type(testUser.emailPrefix);
      cy.get('input[formControlName="password"]').type(testUser.password);

      // Enviar formulario
      cy.get('button[type="submit"]').click();

      // Verificar navegación al dashboard
      // Nota: Este test requiere que el usuario exista en Firebase
      cy.url({ timeout: 10000 }).should('include', '/app/dashboard');

      // Verificar que se muestre el dashboard
      cy.contains('Dashboard', { timeout: 5000 }).should('be.visible');
    });
  });

  it('debería usar el comando personalizado cy.login()', () => {
    // Probar el custom command creado en commands.ts
    cy.fixture('users').then((users) => {
      const testUser = users.testUser;

      // Usar el comando personalizado
      cy.login(testUser.emailPrefix, testUser.password);

      // Verificar navegación exitosa
      cy.url({ timeout: 10000 }).should('include', '/app/dashboard');
    });
  });

  it('debería mostrar loading spinner durante el proceso de login', () => {
    cy.fixture('users').then((users) => {
      const testUser = users.testUser;

      cy.get('input[formControlName="emailPrefix"]').type(testUser.emailPrefix);
      cy.get('input[formControlName="password"]').type(testUser.password);

      // Interceptar la solicitud de Firebase para controlar el timing
      cy.intercept('POST', '**/identitytoolkit.googleapis.com/**').as('loginRequest');

      // Enviar formulario
      cy.get('button[type="submit"]').click();

      // Verificar que el botón muestre "Cargando..." o esté deshabilitado
      cy.get('button[type="submit"]').should('be.disabled');

      // Esperar a que la solicitud se complete
      cy.wait('@loginRequest');
    });
  });

  it('debería deshabilitar el botón submit cuando el formulario es inválido', () => {
    // Formulario vacío
    cy.get('button[type="submit"]').should('be.disabled');

    // Solo email
    cy.get('input[formControlName="emailPrefix"]').type('usuario');
    cy.get('button[type="submit"]').should('be.disabled');

    // Email + password válidos
    cy.get('input[formControlName="password"]').type('password123');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('debería limpiar mensajes de error al corregir campos', () => {
    // Tocar campo para mostrar error
    cy.get('input[formControlName="emailPrefix"]').focus().blur();
    cy.contains('El email es requerido').should('be.visible');

    // Llenar el campo
    cy.get('input[formControlName="emailPrefix"]').type('usuario123');

    // El mensaje de error debe desaparecer
    cy.contains('El email es requerido').should('not.exist');
  });
});
