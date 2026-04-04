describe("Session flow", () => {
  const email = "alisamadi0583@gmail.com";
  const password = "rezaali83@";

  beforeEach(() => {
    // Clear cookies before each test to start fresh
    cy.clearCookies();
  });

  it("should show the login page when not authenticated", () => {
    cy.visit("/login");
    cy.url().should("include", "/login");
    cy.get('button[type="submit"]').should("contain.text", "Login");
  });

  it("should redirect unauthenticated users from protected routes to login", () => {
    cy.visit("/settings");
    cy.url().should("include", "/login");
  });

  it("should log in with valid credentials", () => {
    cy.visit("/login");
    cy.get('input[placeholder="example@example.com"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Should redirect to home after login
    cy.url({ timeout: 10000 }).should("eq", Cypress.config().baseUrl + "/");
  });

  it("should redirect authenticated users away from login page", () => {
    // Log in first
    cy.visit("/login");
    cy.get('input[placeholder="example@example.com"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should("eq", Cypress.config().baseUrl + "/");

    // Try visiting login again — should redirect away
    cy.visit("/login");
    cy.url({ timeout: 10000 }).should("not.include", "/login");
  });

  it("should access settings when authenticated", () => {
    cy.visit("/login");
    cy.get('input[placeholder="example@example.com"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should("eq", Cypress.config().baseUrl + "/");

    cy.visit("/settings");
    cy.url({ timeout: 10000 }).should("include", "/settings");
  });

  it("should log out and redirect to login", () => {
    // Log in
    cy.visit("/login");
    cy.get('input[placeholder="example@example.com"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should("eq", Cypress.config().baseUrl + "/");

    // Go to settings and log out
    cy.visit("/settings");
    cy.contains("button", "Logout").click();
    cy.url({ timeout: 10000 }).should("include", "/login");
  });

  it("should show login validation errors for invalid input", () => {
    cy.visit("/login");

    // Submit empty form
    cy.get('button[type="submit"]').click();
    cy.get('input[aria-invalid="true"]').should("exist");

    // Enter invalid email
    cy.get('input[placeholder="example@example.com"]').type("not-an-email");
    cy.get('input[type="password"]').type("short");
    cy.get('button[type="submit"]').click();
    cy.get('[data-slot="field-error"]').should("exist");
  });
});
