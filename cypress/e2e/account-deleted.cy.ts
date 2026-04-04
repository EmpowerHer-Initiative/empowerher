describe("Account deleted page", () => {
  beforeEach(() => {
    cy.visit("/account-deleted");
  });

  it("should load with deletion message", () => {
    cy.contains("Your account has been deleted").should("be.visible");
  });

  it("should have a back to home link that navigates to /", () => {
    cy.contains("a", "Back to home").should("have.attr", "href", "/");
    cy.contains("a", "Back to home").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });

  it("should have a create new account link to /signup", () => {
    cy.contains("a", "Create a new account").should("have.attr", "href", "/signup");
  });
});
