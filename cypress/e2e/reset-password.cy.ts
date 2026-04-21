describe("Reset password page", () => {
  describe("without token (email form)", () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.visit("/reset-password");
    });

    it("should show email form with correct title and description", () => {
      cy.contains("Reset Password").should("exist");
      cy.get('input[placeholder="example@example.com"]').should("exist");
      cy.get('button[type="submit"]').should("contain.text", "Reset Password");
    });

    it("should validate empty email", () => {
      cy.get('button[type="submit"]').click();
      cy.get('input[aria-invalid="true"]').should("exist");
    });

    it("should have Login link", () => {
      cy.contains("a", "Login").should("exist");
    });
  });

  describe("with token (password form)", () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.visit("/reset-password?token=test-token");
    });

    it("should show password form when token param is present", () => {
      cy.contains("Reset Password").should("exist");
      cy.contains("Enter your new password below").should("exist");
      cy.get('input[type="password"][placeholder="********"]').should(
        "have.length.at.least",
        2
      );
    });

    it("should show correct description text", () => {
      cy.contains("Enter your new password below").should("exist");
    });

    it("should validate password mismatch", () => {
      cy.get('input[type="password"][placeholder="********"]')
        .first()
        .type("validpass1");
      cy.get('input[type="password"][placeholder="********"]')
        .last()
        .type("different1");
      cy.get('button[type="submit"]').click();
      cy.get('[data-slot="field-error"]').should("exist");
    });

    it("should validate short password", () => {
      cy.get('input[type="password"][placeholder="********"]')
        .first()
        .type("short");
      cy.get('input[type="password"][placeholder="********"]')
        .last()
        .type("short");
      cy.get('button[type="submit"]').click();
      cy.get('[data-slot="field-error"]').should("exist");
    });
  });
});
