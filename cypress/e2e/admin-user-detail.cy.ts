describe("Admin User Detail", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.adminLogin();
  });

  it("should load user detail page from users list", () => {
    cy.visit("/admin/users");
    cy.get("table tbody tr").first().click();
    cy.url({ timeout: 10000 }).should("match", /\/admin\/users\/.+/);
  });

  it("should show user name and email", () => {
    cy.visit("/admin/users");
    cy.get("table tbody tr").first().click();
    cy.url({ timeout: 10000 }).should("match", /\/admin\/users\/.+/);

    cy.get("img[alt]").should("exist"); // avatar
    cy.get("body").then(($body) => {
      // Verify some user info is displayed
      expect($body.text()).to.match(/@/); // email contains @
    });
  });

  it("should have a back button", () => {
    cy.visit("/admin/users");
    cy.get("table tbody tr").first().click();
    cy.url({ timeout: 10000 }).should("match", /\/admin\/users\/.+/);

    cy.contains("Users").should("be.visible");
  });

  it("should show Profile tab as active by default", () => {
    cy.visit("/admin/users");
    cy.get("table tbody tr").first().click();
    cy.url({ timeout: 10000 }).should("match", /\/admin\/users\/.+/);

    cy.contains('[role="tab"]', "Profile").should("have.attr", "data-state", "active");
  });

  it("should switch to Payments tab", () => {
    cy.visit("/admin/users");
    cy.get("table tbody tr").first().click();
    cy.url({ timeout: 10000 }).should("match", /\/admin\/users\/.+/);

    cy.contains('[role="tab"]', "Payments").click();
    cy.contains('[role="tab"]', "Payments").should("have.attr", "data-state", "active");
  });

  it("should show content in Payments tab", () => {
    cy.visit("/admin/users");
    cy.get("table tbody tr").first().click();
    cy.url({ timeout: 10000 }).should("match", /\/admin\/users\/.+/);

    cy.contains('[role="tab"]', "Payments").click();
    cy.get('[role="tabpanel"]').should("be.visible");
  });
});
