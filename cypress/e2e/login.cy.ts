describe("Login page", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit("/login");
  });

  it("should render login form with all elements", () => {
    cy.contains("Login").should("exist");
    cy.get('input[placeholder="example@example.com"]').should("exist");
    cy.get('input[type="password"][placeholder="********"]').should("exist");
    cy.get('button[type="submit"]').should("contain.text", "Login");
    cy.contains("a", "Forgot password?").should("exist");
    cy.contains("a", "Sign up").should("exist");
  });

  it("should show validation errors for empty form submission", () => {
    cy.get('button[type="submit"]').click();
    cy.get('input[aria-invalid="true"]').should("exist");
  });

  it("should show validation error for invalid email", () => {
    cy.get('input[placeholder="example@example.com"]').type("not-an-email");
    cy.get('input[type="password"]').type("validpass1");
    cy.get('button[type="submit"]').click();
    cy.get('[data-slot="field-error"]').should("exist");
  });

  it("should show validation error for short password", () => {
    cy.get('input[placeholder="example@example.com"]').type("test@example.com");
    cy.get('input[type="password"]').type("short");
    cy.get('button[type="submit"]').click();
    cy.get('[data-slot="field-error"]').should("exist");
  });

  it("should have Forgot password link pointing to /reset-password", () => {
    cy.contains("a", "Forgot password?").should("have.attr", "href", "/reset-password");
  });

  it("should have Sign up link pointing to /signup", () => {
    cy.contains("a", "Sign up").should("have.attr", "href", "/signup");
  });

  it("should preserve callbackUrl in signup link", () => {
    cy.visit("/login?callbackUrl=/settings");
    cy.contains("a", "Sign up").should("have.attr", "href").and("include", "callbackUrl");
  });

  it("should preserve productId in signup link", () => {
    cy.visit("/login?productId=abc123");
    cy.contains("a", "Sign up").should("have.attr", "href").and("include", "productId");
  });

  it("should redirect to / on successful login", () => {
    cy.get('input[placeholder="example@example.com"]').type("alisamadi0583@gmail.com");
    cy.get('input[type="password"]').type("rezaali83@");
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should("eq", Cypress.config().baseUrl + "/");
  });

  it("should show error message on wrong credentials", () => {
    cy.get('input[placeholder="example@example.com"]').type("wrong@example.com");
    cy.get('input[type="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();
    cy.get('[data-slot="field-error"]', { timeout: 10000 }).should("exist");
  });

  it("should redirect logged-in users away from /login", () => {
    cy.login();
    cy.visit("/login");
    cy.url({ timeout: 10000 }).should("not.include", "/login");
  });
});
