describe("Admin Users", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.adminLogin();
  });

  it("should load users page with heading and table", () => {
    cy.visit("/admin/users");
    cy.url({ timeout: 10000 }).should("include", "/admin/users");

    cy.get("h1").should("contain.text", "Users");
    cy.get("table").should("exist");
  });

  it("should have a search input", () => {
    cy.visit("/admin/users");

    cy.get('input[placeholder*="Search"]').should("exist");
  });

  it("should have pagination controls", () => {
    cy.visit("/admin/users");

    cy.get("table").should("exist");
    cy.get('button[aria-label="Go to next page"]').should("exist");
    cy.get('button[aria-label="Go to previous page"]').should("exist");
  });

  it("should navigate to user detail when clicking a row", () => {
    cy.visit("/admin/users");

    cy.get("table tbody tr").first().click();
    cy.url({ timeout: 10000 }).should("match", /\/admin\/users\/.+/);
  });
});
