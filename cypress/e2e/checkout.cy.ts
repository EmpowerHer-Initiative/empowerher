describe("Checkout page", () => {
  it("should redirect to / when no productId is provided", () => {
    cy.visit("/checkout");
    cy.url({ timeout: 10000 }).should("eq", Cypress.config().baseUrl + "/");
  });

  it("should show spinner when productId is present", () => {
    cy.visit("/checkout?productId=test-product");
    cy.contains("Redirecting to checkout").should("exist");
  });
});
