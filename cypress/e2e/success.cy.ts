describe("Success page", () => {
  it("should show failure state when no checkout_id param", () => {
    cy.visit("/success");
    cy.contains("Payment unsuccessful").should("be.visible");
    cy.contains("No checkout session found").should("be.visible");
  });

  it("should show Try again button", () => {
    cy.visit("/success");
    cy.contains("a", "Try again").should("have.attr", "href", "/#pricing");
  });

  it("should show failure state for invalid checkout_id", () => {
    cy.visit("/success?checkout_id=invalid_id_123");
    cy.contains(/unsuccessful|failed|error/i).should("be.visible");
  });
});
