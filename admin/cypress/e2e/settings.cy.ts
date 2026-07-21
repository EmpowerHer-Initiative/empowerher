describe("Settings page", () => {
  it("should redirect unauthenticated users to /login", () => {
    cy.clearCookies();
    cy.visit("/settings");
    cy.url({ timeout: 10000 }).should("include", "/login");
  });

  describe("authenticated", () => {
    beforeEach(() => {
      cy.login();
      cy.visit("/settings");
    });

    it("should load settings page with h1 Settings", () => {
      cy.get("h1").should("contain.text", "Settings");
    });

    it("should show General section", () => {
      cy.contains("h2", "General").should("exist");
    });

    it("should show Accounts section", () => {
      cy.contains("h2", "Accounts").should("exist");
    });

    it("should show Billing section", () => {
      cy.contains("h2", "Billing").should("exist");
    });

    it("should show Danger section", () => {
      cy.contains("h2", "Danger").should("exist");
    });

    it("should show Logout section", () => {
      cy.contains("h2", "Logout").should("exist");
    });

    it("should log out and redirect to /login", () => {
      cy.contains("button", "Logout").click();
      cy.url({ timeout: 10000 }).should("include", "/login");
    });
  });
});
