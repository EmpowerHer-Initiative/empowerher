describe("Admin Products", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.adminLogin();
  });

  it("should load products page with heading", () => {
    cy.visit("/admin/products");
    cy.url({ timeout: 10000 }).should("include", "/admin/products");

    cy.get("h1").should("contain.text", "Products");
  });

  it("should render DataTable", () => {
    cy.visit("/admin/products");

    cy.get("table").should("exist");
  });
});
