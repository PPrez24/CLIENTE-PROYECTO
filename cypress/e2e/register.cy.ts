/**
 * ============================================================
 * PRUEBA E2E PARA REGISTER COMPONENT
 * INTEGRANTE 2: José Eduardo Pérez Valenzuela (ACTIVA)
 * ============================================================
 * 
 * ESCENARIOS CUBIERTOS:
 * - Registro exitoso con credenciales válidas
 * - Validación de formato de email
 * - Validación de passwords que no coinciden
 * - Validación de contraseña débil (sin mayúscula o sin número)
 * - Validación de campos requeridos
 * - Navegación después de registro exitoso
 * 
 * ============================================================
 */

describe('Register Component E2E Tests', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    cy.clearLocalStorage();
    cy.visit('/auth/register');
  });

  it('debería mostrar el formulario de registro correctamente', () => {
    cy.get('h2').should('contain', 'Crear cuenta');
    cy.get('input[formControlName="emailPrefix"]').should('be.visible');
    cy.get('input[formControlName="password"]').should('be.visible');
    cy.get('input[formControlName="confirmPassword"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('debería validar campos requeridos al enviar formulario vacío', () => {
    // Tocar campos para activar validación
    cy.get('input[formControlName="emailPrefix"]').focus().blur();
    cy.get('input[formControlName="password"]').focus().blur();
    cy.get('input[formControlName="confirmPassword"]').focus().blur();

    // Verificar mensajes de error
    cy.contains('El email es requerido').should('be.visible');
    cy.contains('La contraseña es requerida').should('be.visible');
    cy.contains('Confirma tu contraseña').should('be.visible');

    // Botón debe estar deshabilitado
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('debería validar formato de email (solo alfanumérico y caracteres permitidos)', () => {
    // Probar con caracteres inválidos en email
    cy.get('input[formControlName="emailPrefix"]').type('usuario@invalido').blur();
    cy.get('input[formControlName="password"]').type('Password1');
    cy.get('input[formControlName="confirmPassword"]').type('Password1');

    // Verificar mensaje de error
    cy.contains('Formato de email inválido').should('be.visible');

    // Botón deshabilitado
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('debería validar longitud mínima de contraseña (6 caracteres)', () => {
    cy.get('input[formControlName="emailPrefix"]').type('nuevo_usuario');
    cy.get('input[formControlName="password"]').type('Pass1').blur(); // Solo 5 caracteres
    cy.get('input[formControlName="confirmPassword"]').type('Pass1');

    // Verificar mensaje de error
    cy.contains('Mínimo 6 caracteres').should('be.visible');

    // Botón deshabilitado
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('debería validar que la contraseña contenga mayúscula y número', () => {
    cy.get('input[formControlName="emailPrefix"]').type('nuevo_usuario');
    
    // Contraseña sin mayúscula
    cy.get('input[formControlName="password"]').clear().type('password1').blur();
    cy.get('input[formControlName="confirmPassword"]').type('password1');
    cy.contains('Debe incluir al menos 1 mayúscula y 1 número').should('be.visible');

    // Contraseña sin número
    cy.get('input[formControlName="password"]').clear().type('Password').blur();
    cy.get('input[formControlName="confirmPassword"]').clear().type('Password');
    cy.contains('Debe incluir al menos 1 mayúscula y 1 número').should('be.visible');

    // Botón deshabilitado
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('debería detectar cuando las contraseñas no coinciden', () => {
    cy.get('input[formControlName="emailPrefix"]').type('nuevo_usuario');
    cy.get('input[formControlName="password"]').type('Password123');
    cy.get('input[formControlName="confirmPassword"]').type('Password456').blur();

    cy.contains('Las contraseñas no coinciden').should('be.visible');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('debería alternar visibilidad de contraseñas', () => {
    cy.get('input[formControlName="password"]').should('have.attr', 'type', 'password');
    cy.get('.toggle-password').first().click();
    cy.get('input[formControlName="password"]').should('have.attr', 'type', 'text');
    cy.get('.toggle-password').first().click();
    cy.get('input[formControlName="password"]').should('have.attr', 'type', 'password');

    cy.get('input[formControlName="confirmPassword"]').should('have.attr', 'type', 'password');
    cy.get('.toggle-password').last().click();
    cy.get('input[formControlName="confirmPassword"]').should('have.attr', 'type', 'text');
    cy.get('.toggle-password').last().click();
    cy.get('input[formControlName="confirmPassword"]').should('have.attr', 'type', 'password');
  });

  it('debería habilitar botón submit solo cuando el formulario es válido', () => {
    // Formulario vacío - botón deshabilitado
    cy.get('button[type="submit"]').should('be.disabled');

    // Llenar email
    cy.get('input[formControlName="emailPrefix"]').type('nuevo_usuario');
    cy.get('button[type="submit"]').should('be.disabled');

    // Llenar password válida
    cy.get('input[formControlName="password"]').type('Password123');
    cy.get('button[type="submit"]').should('be.disabled');

    // Llenar confirmPassword coincidente
    cy.get('input[formControlName="confirmPassword"]').type('Password123');
    
    // Ahora debe estar habilitado
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('debería mostrar mensaje de error si el email ya existe', () => {
    // Intentar registrar con email que ya existe
    cy.fixture('users').then((users) => {
      const existingUser = users.testUser;

      cy.get('input[formControlName="emailPrefix"]').type(existingUser.emailPrefix);
      cy.get('input[formControlName="password"]').type('Password123');
      cy.get('input[formControlName="confirmPassword"]').type('Password123');

      // Enviar formulario
      cy.get('button[type="submit"]').click();

      // Esperar mensaje de error (Firebase: email already in use)
      cy.get('.error', { timeout: 5000 })
        .should('be.visible')
        .and('contain', 'email-already-in-use');
    });
  });

  it('debería navegar al dashboard después de registro exitoso', () => {
    // Generar email único para evitar conflictos
    const uniqueEmail = `test_${Date.now()}`;

    cy.get('input[formControlName="emailPrefix"]').type(uniqueEmail);
    cy.get('input[formControlName="password"]').type('Password123');
    cy.get('input[formControlName="confirmPassword"]').type('Password123');

    // Enviar formulario
    cy.get('button[type="submit"]').click();

    // Verificar navegación al dashboard
    cy.url({ timeout: 10000 }).should('include', '/app/dashboard');

    // Verificar que se muestre el dashboard
    cy.contains('Dashboard', { timeout: 5000 }).should('be.visible');
  });

  it('debería mostrar loading spinner durante el proceso de registro', () => {
    const uniqueEmail = `test_${Date.now()}`;

    cy.get('input[formControlName="emailPrefix"]').type(uniqueEmail);
    cy.get('input[formControlName="password"]').type('Password123');
    cy.get('input[formControlName="confirmPassword"]').type('Password123');

    // Interceptar solicitud de Firebase
    cy.intercept('POST', '**/identitytoolkit.googleapis.com/**').as('registerRequest');

    // Enviar formulario
    cy.get('button[type="submit"]').click();

    // Botón debe estar deshabilitado durante loading
    cy.get('button[type="submit"]').should('be.disabled');

    // Esperar respuesta
    cy.wait('@registerRequest');
  });

  it('debería limpiar mensajes de error al corregir campos', () => {
    // Tocar campo para mostrar error
    cy.get('input[formControlName="emailPrefix"]').focus().blur();
    cy.contains('El email es requerido').should('be.visible');

    // Llenar el campo
    cy.get('input[formControlName="emailPrefix"]').type('nuevo_usuario');

    // Mensaje debe desaparecer
    cy.contains('El email es requerido').should('not.exist');
  });

  it('debería validar que confirmPassword muestre error solo después de ser tocado', () => {
    // Llenar password pero no confirmPassword
    cy.get('input[formControlName="password"]').type('Password123');
    
    // No debe mostrar error aún
    cy.contains('Confirma tu contraseña').should('not.exist');

    // Hacer focus y blur en confirmPassword (tocar el campo)
    cy.get('input[formControlName="confirmPassword"]').focus().blur();

    // Ahora sí debe mostrar error
    cy.contains('Confirma tu contraseña').should('be.visible');
  });
});
