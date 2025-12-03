// ***********************************************
// This file contains custom Cypress commands
// and overloads existing commands.
//
// For more comprehensive examples:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in with email prefix and password
     * @example cy.login('test.user', 'Password123')
     */
    login(emailPrefix: string, password: string): Chainable<void>;
  }
}

Cypress.Commands.add('login', (emailPrefix: string, password: string) => {
  cy.visit('/auth/login');
  cy.get('input[formControlName="emailPrefix"]').type(emailPrefix);
  cy.get('input[formControlName="password"]').type(password);
  cy.get('button[type="submit"]').click();
});
