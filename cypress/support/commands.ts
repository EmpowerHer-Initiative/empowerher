/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      adminLogin(): Chainable<void>;
    }
  }
}

const DEFAULT_EMAIL = "alisamadi0583@gmail.com";
const DEFAULT_PASSWORD = "rezaali83@";

Cypress.Commands.add("login", (email = DEFAULT_EMAIL, password = DEFAULT_PASSWORD) => {
  cy.visit("/login");
  cy.get('input[placeholder="example@example.com"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url({ timeout: 10000 }).should("eq", Cypress.config().baseUrl + "/");
});

Cypress.Commands.add("adminLogin", () => {
  cy.login(DEFAULT_EMAIL, DEFAULT_PASSWORD);
});

export {};
