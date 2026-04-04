describe("Admin Media", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.adminLogin();
  });

  it("should load media page with heading", () => {
    cy.visit("/admin/media");
    cy.url({ timeout: 10000 }).should("include", "/admin/media");

    cy.get("h1").should("contain.text", "Media");
  });

  it("should show upload drop zone", () => {
    cy.visit("/admin/media");

    cy.contains("Drag & drop, click to select, or paste an image").should("be.visible");
  });

  it("should have a search form", () => {
    cy.visit("/admin/media");

    cy.get('input[type="search"], input[placeholder*="Search"], input[name="search"]').should("exist");
    cy.contains("button", "Search").should("exist");
    cy.contains("button", "Clear").should("exist");
  });

  it("should render browse section", () => {
    cy.visit("/admin/media");

    cy.contains("Browse").should("be.visible");
  });
});
