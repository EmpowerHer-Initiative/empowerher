describe("Signup page", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit("/signup");
  });

  it("should render signup form with all fields", () => {
    cy.contains("Sign up").should("exist");
    cy.get('input[placeholder="John Doe"]').should("exist");
    cy.get('input[placeholder="example@example.com"]').should("exist");
    cy.get('input[type="password"][placeholder="********"]').should(
      "have.length.at.least",
      2
    );
    cy.get('button[type="submit"]').should("contain.text", "Sign up");
    cy.contains("a", "Login").should("exist");
  });

  it("should show validation errors for empty form submission", () => {
    cy.get('button[type="submit"]').click();
    cy.get('input[aria-invalid="true"]').should("exist");
  });

  it("should show password mismatch error when passwords differ", () => {
    cy.get('input[placeholder="John Doe"]').type("Test User");
    cy.get('input[placeholder="example@example.com"]').type("test@example.com");
    cy.get('input[type="password"][placeholder="********"]')
      .first()
      .type("validpass1");
    cy.get('input[type="password"][placeholder="********"]')
      .last()
      .type("different1");
    cy.get('button[type="submit"]').click();
    cy.get('[data-slot="field-error"]').should("exist");
  });

  it("should show validation error for short password", () => {
    cy.get('input[placeholder="John Doe"]').type("Test User");
    cy.get('input[placeholder="example@example.com"]').type("test@example.com");
    cy.get('input[type="password"][placeholder="********"]')
      .first()
      .type("short");
    cy.get('input[type="password"][placeholder="********"]')
      .last()
      .type("short");
    cy.get('button[type="submit"]').click();
    cy.get('[data-slot="field-error"]').should("exist");
  });

  it("should have Login link pointing to /login", () => {
    cy.contains("a", "Login").should("have.attr", "href", "/login");
  });

  it("should preserve callbackUrl and productId in login link", () => {
    cy.visit("/signup?callbackUrl=/settings&productId=abc123");
    cy.contains("a", "Login")
      .should("have.attr", "href")
      .and("include", "callbackUrl")
      .and("include", "productId");
  });
});
