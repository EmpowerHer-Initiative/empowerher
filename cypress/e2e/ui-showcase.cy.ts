describe("UI showcase page", () => {
  it("should load without errors", () => {
    cy.visit("/ui");
    cy.get("body").should("be.visible");
    cy.get("nav").should("not.exist");
  });
});
