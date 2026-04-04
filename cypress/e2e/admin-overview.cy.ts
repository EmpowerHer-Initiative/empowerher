describe("Admin Overview", () => {
  beforeEach(() => {
    cy.clearCookies();
  });

  it("should redirect unauthenticated users to /", () => {
    cy.visit("/admin");
    cy.url({ timeout: 10000 }).should("eq", Cypress.config().baseUrl + "/");
  });

  it("should allow admin to access overview page", () => {
    cy.adminLogin();
    cy.visit("/admin");
    cy.url({ timeout: 10000 }).should("include", "/admin");
  });

  it("should render stat cards", () => {
    cy.adminLogin();
    cy.visit("/admin");

    cy.contains("Monthly Recurring Revenue").should("be.visible");
    cy.contains("Revenue This Month").should("be.visible");
    cy.contains("Active Subscriptions").should("be.visible");
    cy.contains("Total Users").should("be.visible");
  });

  it("should show breakdown section", () => {
    cy.adminLogin();
    cy.visit("/admin");

    cy.contains("Breakdown").should("be.visible");
  });

  it("should show Recent Orders section with DataTable", () => {
    cy.adminLogin();
    cy.visit("/admin");

    cy.contains("Recent Orders").should("be.visible");
    cy.get("table").should("exist");
  });

  it("should show admin navbar with correct links", () => {
    cy.adminLogin();
    cy.visit("/admin");

    cy.contains("a", "Overview").should("be.visible");
    cy.contains("a", "Users").should("be.visible");
    cy.contains("a", "Products").should("be.visible");
    cy.contains("a", "Media").should("be.visible");
  });
});
